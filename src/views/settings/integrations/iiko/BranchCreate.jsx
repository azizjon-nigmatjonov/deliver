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
import { getCrmBranches, updateBranch } from "../../../../services/branch";
import { getOnePayme } from "services/promotion";
import CustomSkeleton from "components/Skeleton";
import { useSelector } from "react-redux";

export default function BranchCreate() {
  const { t } = useTranslation();
  const shipper_id = useSelector((state) => state.auth.shipper_id);
  const history = useHistory();
  const params = useParams();
  const [saveLoading, setSaveLoading] = useState(false);
  const [items, setItems] = useState();
  const [loader, setLoader] = useState(true);
  const [iikoBranch, setIikoBranch] = useState();

  useEffect(() => {
    getItems();
    fetchData();
    getIikoBranch();
  }, []);

  useEffect(() => {
    if (params.branch_id) {
      getBranchesCount.then((res) => {
        setValues({
          login: res?.login,
          key: res?.key,
          branch_id: res?.branch_id,
          merchant_id: res?.merchant_id,
        });
      });
    }
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

  const getIikoBranch = () => {
    getCrmBranches(shipper_id, { limit: 100, page: 1, type: "iiko" }).then(
      (res) => {
        setIikoBranch(
          res?.branches?.map((item) => ({
            label: item.name,
            value: item.id,
          })),
        );
      },
    );
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
      iiko_id: values.iiko_id.value,
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

  const { values, setFieldValue, setValues, handleSubmit } = formik;

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
                        isSearchable
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
                        <span style={{ color: "red" }}>*</span> {t("Iiko")}
                      </div>
                      <Select
                        height={40}
                        name="iiko_id"
                        options={iikoBranch}
                        value={values.iiko_id}
                        onChange={(val) => setFieldValue("iiko_id", val)}
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
