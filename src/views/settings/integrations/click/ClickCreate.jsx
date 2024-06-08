import { useMemo, useState, useEffect } from "react";
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
import { getOneClick, postClick, updateClick } from "services/promotion";
import CustomSkeleton from "components/Skeleton";
import { useRef } from "react";
import Select from "components/Select";

export default function ClickCreate() {
  const { t } = useTranslation();
  const history = useHistory();
  const params = useParams();
  const [saveLoading, setSaveLoading] = useState(false);
  const [items, setItems] = useState();
  const [loader, setLoader] = useState(true);
  const inputRef = useRef();
  useEffect(() => {
    getItems();
    fetchData();
  }, []);
  useEffect(() => {
    if (params.branch_id) {
      getBranchesCount.then((res) => {
        setValues({
          key: res?.key,
          branch_id: res?.branch_id,
          merchant_id: res?.merchant_id,
          service_id: res?.service_id,
          merchant_user_id: res?.merchant_user_id,
          group_chat_id: res?.group_chat_id,
        });
      });
    }
  }, []);

  const fetchData = () => {
    if (params.id) {
      getOneClick(params.id)
        .then((res) => {
          formik.setValues({
            key: res?.key,
            branch_id: { value: res?.branch_id, label: res?.branch_name },
            merchant_id: res?.merchant_id,
            service_id: res?.service_id,
            merchant_user_id: res?.merchant_user_id,
            group_chat_id: res?.group_chat_id,
          });
        })
        .finally(() => setLoader(false));
    } else {
      setLoader(false);
    }
  };

  const getItems = (page) => {
    getBranchesCount({ limit: 10, page }).then((res) => {
      setItems(res?.branches);
    });
  };
  const branches = items?.map((elm) => ({
    label: elm?.name,
    value: elm?.id,
  }));

  const initialValues = useMemo(
    () => ({
      key: null,
      branch_id: null,
      merchant_id: null,
      service_id: null,
      merchant_user_id: null,
      group_chat_id: "",
    }),
    [],
  );

  const NUMBER_REGEX = "/^d+$/";

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"));
    return yup.object().shape({
      branch_id: defaultSchema,
      key: defaultSchema,
      service_id: defaultSchema,
      merchant_user_id: defaultSchema,
      merchant_id: defaultSchema,
    });
  }, []);

  const onSubmit = (values) => {
    const data = {
      branch_id: values?.branch_id?.value,
      key: values.key,
      service_id: parseInt(values.service_id),
      merchant_id: parseInt(values.merchant_id),
      merchant_user_id: parseInt(values.merchant_user_id),
      group_chat_id: values.group_chat_id,
      // ...values,
    };

    setSaveLoading(true);
    const selectedAction = params.id
      ? updateClick(data, params.id)
      : postClick(data);
    selectedAction
      .then((res) => {
        history.goBack();
      })
      .finally(() => {
        setSaveLoading(false);
      });
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const { values, handleChange, setFieldValue, setValues, handleSubmit } =
    formik;

  const routes = [
    {
      title: t(`Click`),
      link: true,
      route: `/home/settings/integrations/click`,
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
            <div className="w-full grid grid-cols-2 gap-5">
              <Card title={t("general.information")}>
                <div className="grid grid-cols-4 gap-5 items-baseline">
                  <div className="col-span-2">
                    <Form.Item formik={formik} name="branch_id">
                      <div className="input-label">
                        <span style={{ color: "red" }}>*</span>{" "}
                        {t("name.branch")}
                      </div>
                      <Select
                        height={40}
                        name="branch_id"
                        options={branches}
                        value={values.branch_id}
                        onChange={(val) => setFieldValue("branch_id", val)}
                        ref={inputRef}
                      />
                    </Form.Item>
                  </div>

                  <div className="col-span-2">
                    <Form.Item formik={formik} name="key">
                      <div className="input-label">
                        <span style={{ color: "red" }}>*</span> {t("key")}
                      </div>
                      <Input
                        size="large"
                        value={values.key}
                        onChange={handleChange}
                        name="key"
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-5 items-baseline">
                  <div className="col-span-2">
                    <Form.Item formik={formik} name="service_id">
                      <div className="input-label">
                        <span style={{ color: "red" }}>*</span>{" "}
                        {t("id.sercice")}
                      </div>
                      <Input
                        size="large"
                        value={values.service_id}
                        onChange={handleChange}
                        name="service_id"
                      />
                    </Form.Item>
                  </div>
                  <div className="col-span-2">
                    <Form.Item formik={formik} name="merchant_id">
                      <div className="input-label">
                        <span style={{ color: "red" }}>*</span>{" "}
                        {t("id.merchant")}
                      </div>
                      <Input
                        size="large"
                        value={values.merchant_id}
                        onChange={handleChange}
                        name="merchant_id"
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-5 items-baseline">
                  <div className="col-span-2">
                    <Form.Item formik={formik} name="merchant_user_id">
                      <div className="input-label">
                        <span style={{ color: "red" }}>*</span>{" "}
                        {t("id.merchant.user")}
                      </div>
                      <Input
                        size="large"
                        value={values.merchant_user_id}
                        onChange={handleChange}
                        name="merchant_user_id"
                      />
                    </Form.Item>
                  </div>
                  <div className="col-span-2">
                    <Form.Item formik={formik} name="group_chat_id">
                      <div className="input-label">
                        <span> </span>
                        {t("id.chat.user")}
                      </div>
                      <Input
                        size="large"
                        value={values.group_chat_id}
                        onChange={handleChange}
                        name="group_chat_id"
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
