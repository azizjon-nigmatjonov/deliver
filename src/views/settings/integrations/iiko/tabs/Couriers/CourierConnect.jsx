import Card from "components/Card";
import Form from "components/Form/Index";
import Header from "components/Header";
import { useFormik } from "formik";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import * as yup from "yup";
import AsyncSelect from "components/Select/Async";
import { getCouriers, updateIikoCourier } from "services";
import { getCrmCouriers } from "services/v2";
import { useDispatch } from "react-redux";
import { showAlert } from "redux/actions/alertActions";
import Button from "components/Button/Buttonv2";
import { ArrowBackRounded } from "@mui/icons-material";

export default function MenuCreate() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [saveLoading, setSaveLoading] = useState(false);

  const initialValues = useMemo(
    () => ({
      courier_id: "",
      iiko_id: "",
    }),
    [],
  );

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field"));
    return yup.object().shape({
      courier_id: defaultSchema,
      iiko_id: defaultSchema,
    });
  }, [t]);

  const onSubmit = async (values) => {
    setSaveLoading(true);

    updateIikoCourier(values.courier_id.value, {
      iiko_id: values.iiko_id.value,
    })
      .then(() => {
        dispatch(showAlert(t("successfully.saved"), "success"));
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

  const { values, setFieldValue, handleSubmit } = formik;

  const loadDeleverCouriers = useCallback((inputValue, callback) => {
    getCouriers({
      search: inputValue,
      limit: 10,
      page: 1,
    })
      .then((res) => {
        let couriers = res?.couriers?.map((elm) => ({
          label: `${elm.first_name} ${elm.last_name}`,
          value: elm.id,
        }));
        callback(couriers);
      })
      .catch((error) => console.log(error));
  }, []);

  const loadIikoCouriers = useCallback((inputValue, callback) => {
    getCrmCouriers({
      search: inputValue,
      crm_type: "iiko",
      limit: 10,
      page: 1,
    })
      .then((res) => {
        let couriers = res?.courier?.map((elm) => ({
          label: elm.display_name || elm.id,
          value: elm.id,
        }));
        callback(couriers);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      style={{ minHeight: "100vh" }}
      className="flex flex-col justify-between"
    >
      <div>
        <Header
          title={
            <div
              className="flex items-center gap-3 font-semibold text-xl"
              style={{ marginRight: 20 }}
            >
              <ArrowBackRounded
                onClick={() => history.goBack()}
                className="cursor-pointer"
              />
              <p>{t("tie.courier")}</p>
            </div>
          }
        />
        <div className="m-4" style={{ maxWidth: 700 }}>
          <Card title={t("couriers")} bodyClass="flex gap-3">
            <div className="flex-1">
              <div className="input-label">Delever</div>
              <Form.Item formik={formik} name="couriers">
                <AsyncSelect
                  id="couriers"
                  placeholder={t("couriers")}
                  defaultOptions
                  cacheOptions
                  isSearchable
                  value={values.courier_id}
                  loadOptions={loadDeleverCouriers}
                  onChange={(val) => setFieldValue("courier_id", val)}
                />
              </Form.Item>
            </div>
            <div className="flex-1">
              <div className="input-label">Iiko</div>
              <Form.Item formik={formik} name="couriers">
                <AsyncSelect
                  id="couriers"
                  placeholder={t("couriers")}
                  defaultOptions
                  cacheOptions
                  isSearchable
                  value={values.iiko_id}
                  loadOptions={loadIikoCouriers}
                  onChange={(val) => setFieldValue("iiko_id", val)}
                />
              </Form.Item>
            </div>
          </Card>
        </div>
      </div>
      <div className="flex justify-end items-center w-full bg-white p-4 gap-5">
        <Button
          variant="outlined"
          color="error"
          onClick={() => history.goBack()}
        >
          {t("cancel")}
        </Button>
        <Button variant="contained" type="submit" disabled={saveLoading}>
          {t("save")}
        </Button>
      </div>
    </form>
  );
}
