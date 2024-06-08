import { useMemo, useState, useEffect } from "react";
import Card from "components/Card";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import Form from "components/Form/Index";
import { useFormik } from "formik";
import Header from "components/Header";
import Button from "components/Button";
import Select from "../../../../components/Select";
import Breadcrumb from "components/Breadcrumb";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import { getBranchesCount } from "../../../../services";
import { updateBranch } from "../../../../services/branch";
import { getOnePayme } from "services/promotion";
import CustomSkeleton from "components/Skeleton";
import { getIikoTerminal } from "services/v2/Iiko";

export default function TerminalCreate() {
  const { t } = useTranslation();
  const history = useHistory();
  const params = useParams();
  const [saveLoading, setSaveLoading] = useState(false);
  const [items, setItems] = useState();
  const [loader, setLoader] = useState(true);
  const [iikoBranch, setIikoBranch] = useState();

  useEffect(() => {
    getItems();
    fetchData();
  }, []);

  const fetchData = () => {
    if (params.id) {
      setLoader(true);
      getOnePayme(params.id)
        .then((res) => {
          formik.setValues({
            login: res?.login,
            key: res?.key,
            branch_id: res?.branch_id,
            merchant_id: res?.merchant_id,
          });
        })
        .finally(() => setLoader(false));
    } else {
      setLoader(false);
    }
  };

  const getTerminals = (id) => {
    getIikoTerminal(id).then((res) => {
      setIikoBranch(
        res?.terminals
          ? res?.terminals?.map((item) => ({
              label: item.name,
              value: item.id,
            }))
          : [],
      );
      // setIikoBranch(
      //   res?.branches.map((item) => ({
      //     label: item.name,
      //     value: item.id,
      //   })),
      // );
    });
  };

  const getItems = () => {
    getBranchesCount({ limit: 200, page: 1 }).then((res) => {
      setItems(res?.branches);
    });
  };

  const branches = items?.map((elm) => ({
    label: elm?.name,
    value: elm?.id,
    elm,
  }));

  const initialValues = useMemo(
    () => ({
      login: "Paycom",
      key: null,
      branch_id: null,
      merchant_id: null,
    }),
    [],
  );

  // const validationSchema = useMemo(() => {
  //   const defaultSchema = yup.mixed().required(t("required.field.error"));
  //   return yup.object().shape({
  //     branch_id: defaultSchema,
  //     key: defaultSchema,
  //     login: defaultSchema,
  //   });
  // }, []);

  const onSubmit = (values) => {
    const data = {
      ...values.branch_id.elm,
      iiko_terminal_id: values.terminal_id.value,
    };

    delete data.created_at;
    delete data.id;

    setSaveLoading(true);

    updateBranch(data, values.branch_id.value)
      .then(() => {
        history.goBack();
      })
      .finally(() => {
        setSaveLoading(false);
      });
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    // validationSchema,
  });

  const { values, setFieldValue, handleSubmit } = formik;

  useEffect(() => {
    if (values.branch_id) {
      getTerminals(values.branch_id.elm.iiko_id);
    }
  }, [values.branch_id]);

  const routes = [
    {
      title: t(`Iiko`),
      link: true,
      route: `/home/settings/integrations/iiko`,
    },
    {
      title: t("create"),
    },
  ];

  const headerButtons = (
    <>
      {" "}
      <Button
        icon={CancelIcon}
        size="large"
        shape="outlined"
        color="red"
        borderColor="bordercolor"
        onClick={() => history.goBack()}
      >
        {t("cancel")}
      </Button>
      <Button icon={SaveIcon} size="large" type="submit" loading={saveLoading}>
        {t("save")}
      </Button>
    </>
  );

  if (loader) return <CustomSkeleton />;

  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{ minHeight: "100vh" }}
        className="flex flex-col justify-between"
      >
        <div>
          <Header startAdornment={[<Breadcrumb routes={routes} />]} />
          <div className="m-4">
            <div className="grid grid-cols-2 gap-5">
              <Card title={t("general.information")}>
                <div className="grid grid-cols-4 gap-5 items-baseline">
                  <div className="col-span-2">
                    <Form.Item formik={formik} name="branch_id">
                      <div className="input-label">
                        <span style={{ color: "red" }}>*</span> {t("branches")}
                      </div>
                      <Select
                        height={40}
                        name="branch_id"
                        options={branches}
                        value={values.branch_id}
                        onChange={(val) => setFieldValue("branch_id", val)}
                        maxMenuHeight={200}
                      />
                    </Form.Item>
                  </div>

                  <div className="col-span-2">
                    <Form.Item formik={formik} name="key">
                      <div className="input-label">
                        <span style={{ color: "red" }}>*</span> {t("Terminal")}
                      </div>
                      <Select
                        height={40}
                        name="terminal_id"
                        options={iikoBranch}
                        value={values.terminal_id}
                        onChange={(val) => setFieldValue("terminal_id", val)}
                        maxMenuHeight={200}
                      />
                    </Form.Item>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
        <div className="flex justify-end items-center w-full bg-white p-4 gap-5">
          {headerButtons}
        </div>
      </div>
    </form>
  );
}
