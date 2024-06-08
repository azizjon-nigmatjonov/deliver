import { useMemo, useState, useEffect, useCallback } from "react";
import Card from "components/Card";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { Input } from "alisa-ui";
import Form from "components/Form/Index";
import * as yup from "yup";
import { useFormik } from "formik";
import Header from "components/Header";
import Button from "components/Button";
import Breadcrumb from "components/Breadcrumb";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import { getBranchesCount } from "../../../../services";
import { getOnePayme, postPayme, updatePayme } from "services/promotion";
import CustomSkeleton from "components/Skeleton";
import { useDispatch } from "react-redux";
import { showAlert } from "redux/actions/alertActions";
import Async from "components/Select/Async";

export default function PaymeCreate() {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const params = useParams();
  const [saveLoading, setSaveLoading] = useState(false);
  const [loader, setLoader] = useState(false);

  const initialValues = useMemo(
    () => ({
      login: "Paycom",
      key: "",
      branch_id: { label: "", value: "" },
      merchant_id: "",
    }),
    [],
  );

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"));
    return yup.object().shape({
      branch_id: defaultSchema,
      key: defaultSchema,
      login: defaultSchema,
      merchant_id: defaultSchema,
    });
  }, [t]);

  const onSubmit = (values) => {
    const data = {
      branch_id: values.branch_id?.value,
      key: values.key,
      login: values.login,
      merchant_id: values.merchant_id,
    };

    setSaveLoading(true);
    const selectedAction = params.id
      ? updatePayme(data, params.id)
      : postPayme(data);
    selectedAction
      .then((res) => history.goBack())
      .catch(
        (error) =>
          error.status === 409 &&
          dispatch(showAlert(t("already.exist"), "warning")),
      )
      .finally(() => setSaveLoading(false));
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const { values, handleChange, setValues, setFieldValue, handleSubmit } =
    formik;

  useEffect(() => {
    if (params.id) {
      setLoader(true);
      getOnePayme(params.id)
        .then((res) => {
          setValues({
            login: res?.login,
            key: res?.key,
            branch_id: { label: res?.branch_name, value: res?.branch_id },
            merchant_id: res?.merchant_id,
          });
        })
        .finally(() => setLoader(false));
    }
  }, [params.id, setValues]);

  // useEffect(() => {
  //   if (params.branch_id) {
  //     getBranchesCount.then((res) => {
  //       setValues({
  //         login: res?.login,
  //         key: res?.key,
  //         branch_id: res?.branch_id,
  //         merchant_id: res?.merchant_id,
  //       });
  //     });
  //   }
  // }, [params.branch_id, setValues]);

  const loadBranch = useCallback(
    (inputValue, callback) => {
      getBranchesCount({ page: 1, limit: 10, search: inputValue })
        .then((res) => {
          let branches = res?.branches?.map((elm) => ({
            label: elm?.name,
            value: elm?.id,
            ...elm,
          }));
          if (params.id)
            branches = branches.filter((elm) => elm.value !== params.id);

          callback(branches);
        })
        .catch((err) => console.log(err));
    },
    [params.id],
  );

  const routes = [
    {
      title: t(`Payme`),
      link: true,
      route: `/home/settings/integrations/payme`,
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
                    <Form.Item
                      formik={formik}
                      name="branch_id"
                      label={t("name.branch")}
                      required
                    >
                      <Async
                        isSearchable
                        isClearable
                        defaultOptions
                        loadOptions={loadBranch}
                        name="branch_id"
                        onChange={(val) => setFieldValue("branch_id", val)}
                        value={values.branch_id}
                        height={40}
                      />
                    </Form.Item>
                  </div>
                  <div className="col-span-2">
                    <Form.Item
                      formik={formik}
                      name="key"
                      label={t("key")}
                      required
                    >
                      <Input
                        value={values.key}
                        onChange={handleChange}
                        name="key"
                      />
                    </Form.Item>
                  </div>
                  <div className="col-span-2">
                    <Form.Item formik={formik} name="login" label={t("login")}>
                      <Input
                        value={values.login}
                        onChange={handleChange}
                        name="login"
                        disabled
                      />
                    </Form.Item>
                  </div>
                  <div className="col-span-2">
                    <Form.Item
                      formik={formik}
                      name="merchant_id"
                      label={t("id.merchant")}
                      required
                    >
                      <Input
                        value={values.merchant_id}
                        onChange={handleChange}
                        name="merchant_id"
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
