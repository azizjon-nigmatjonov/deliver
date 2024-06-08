import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import { getRfmSettings, updateRfmSettings } from "services/v2";
import { DashboardCountIcon } from "constants/icons";
import { showAlert } from "redux/actions/alertActions";
import Button from "components/Button";
import Modal from "components/ModalV2";
import Card from "components/Card";
import Input from "components/Input";

const RFMSettings = ({ modal, setModal }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const initialValues = useMemo(
    () => ({
      recency_to: "",
      recency_from: "",
      frequency_from: "",
      frequency_to: "",
      monetary_from: "",
      monetary_to: "",
    }),
    [],
  );

  // const validationSchema = useMemo(() => {
  //   const defaultSchema = yup.mixed().required(t("required.field.error"));
  //   return yup.object().shape({
  //     // recency_to: defaultSchema,
  //     //   type: defaultSchema,
  //   });
  // }, []);

  const onSubmit = (values) => {
    const data = {
      ...values,
    };

    updateRfmSettings(data)
      .then(
        (res) => dispatch(showAlert(t("successfully.saved"), "success")),
        setModal(false),
      )
      .catch((err) => setModal(true));
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
  });

  const { values, handleChange, handleSubmit, setValues } = formik;

  useEffect(() => {
    getRfmSettings().then((res) => {
      setValues({
        recency_to: res?.recency_to,
        recency_from: res?.recency_from,
        frequency_from: res?.frequency_from,
        frequency_to: res?.frequency_to,
        monetary_from: res?.monetary_from,
        monetary_to: res?.monetary_to,
        ltv_lifespan: res?.ltv_lifespan,
      });
    });
  }, [setValues]);

  return (
    <Modal
      open={modal}
      title={
        <div
          className="flex items-center gap-2.5"
          style={{ padding: "8px 0px" }}
        >
          <DashboardCountIcon />
          <div className="text-lg font-bold">RFM</div>
        </div>
      }
      onClose={() => setModal(false)}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit}>
        <Card
          footerStyle={{ textAlign: "end" }}
          footer={<Button type="submit">{t("save")}</Button>}
        >
          <div>
            <div className="mb-8">
              <div>Recency (Дни с последней покупки)</div>
              <div className="grid grid-cols-12 w-full gap-4 items-center mt-2">
                <div className="col-span-1">
                  <div
                    className="rounded-md py-2 px-3 leading-6 text-lg"
                    style={{
                      border: "1px solid #9AA6AC",
                      color: "#9AA6AC",
                      width: "42px",
                    }}
                  >
                    ∞
                  </div>
                </div>
                <div className="col-span-2 text-center"> {t("old")} </div>
                <div className="col-span-2">
                  <Input
                    name="recency_to"
                    onChange={handleChange}
                    value={values.recency_to}
                    type="number"
                  />
                </div>
                <div className="col-span-2 text-center">{t("average.old")}</div>
                <div className="col-span-2">
                  <Input
                    name="recency_from"
                    onChange={handleChange}
                    type="number"
                    value={values.recency_from}
                  />
                </div>

                <div className="col-span-2 text-center"> {t("recent")} </div>
                <div
                  className="col-span-1"
                  style={{ textAlign: "-webkit-right" }}
                >
                  <div
                    className="rounded-md py-2 px-3 leading-6 text-lg"
                    style={{
                      border: "1px solid #9AA6AC",
                      color: "#9AA6AC",
                      width: "34px",
                    }}
                  >
                    1
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-8">
              <div>Frequency (Количество заказов)</div>
              <div className="grid grid-cols-12 w-full gap-4 items-center mt-2">
                <div className="col-span-1">
                  <div
                    className="rounded-md py-2 px-3 leading-6 text-lg"
                    style={{
                      border: "1px solid #9AA6AC",
                      color: "#9AA6AC",
                      width: "36px",
                    }}
                  >
                    0
                  </div>
                </div>
                <div className="col-span-2 text-center">{t("rare.orders")}</div>
                <div className="col-span-2">
                  <Input
                    name="frequency_from"
                    onChange={handleChange}
                    type="number"
                    value={values.frequency_from}
                  />
                </div>
                <div className="col-span-2 text-center">
                  {t("average.orders")}
                </div>
                <div className="col-span-2">
                  <Input
                    name="frequency_to"
                    onChange={handleChange}
                    type="number"
                    value={values.frequency_to}
                  />
                </div>
                <div className="col-span-2 text-center">
                  {t("often.orders")}
                </div>
                <div
                  className="col-span-1"
                  style={{ textAlign: "-webkit-right" }}
                >
                  <div
                    className="rounded-md py-2 px-3 leading-6 text-lg"
                    style={{
                      border: "1px solid #9AA6AC",
                      color: "#9AA6AC",
                      width: "42px",
                    }}
                  >
                    ∞
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-8">
              <div>Monetary (Общая сумма заказов)</div>
              <div className="grid grid-cols-12 w-full gap-4 items-center mt-2">
                <div className="col-span-1">
                  <div
                    className="rounded-md py-2 px-3 leading-6 text-lg"
                    style={{
                      border: "1px solid #9AA6AC",
                      color: "#9AA6AC",
                      width: "36px",
                    }}
                  >
                    0
                  </div>
                </div>
                <div className="col-span-2 text-center"> {t("small.sum")} </div>
                <div className="col-span-2">
                  <Input
                    name="monetary_from"
                    onChange={handleChange}
                    type="number"
                    value={values.monetary_from}
                  />
                </div>
                <div className="col-span-2 text-center">
                  {" "}
                  {t("average.sum")}{" "}
                </div>
                <div className="col-span-2">
                  <Input
                    name="monetary_to"
                    onChange={handleChange}
                    type="number"
                    value={values.monetary_to}
                  />
                </div>
                <div className="col-span-2 text-center"> {t("big.sum")} </div>
                <div
                  className="col-span-1"
                  style={{ textAlign: "-webkit-right" }}
                >
                  <div
                    className="rounded-md py-2 px-3 leading-6 text-lg"
                    style={{
                      border: "1px solid #9AA6AC",
                      color: "#9AA6AC",
                      width: "42px",
                    }}
                  >
                    ∞
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center" style={{ marginTop: "40px" }}>
              <div style={{ width: "294px" }}>
                {t("Продолжительность жизни LTV в месяцах")}{" "}
              </div>
              <Input
                name="ltv_lifespan"
                onChange={handleChange}
                type="number"
                value={values.ltv_lifespan}
                style={{ width: "178px" }}
              />
            </div>
          </div>
        </Card>
      </form>
    </Modal>
  );
};

export default RFMSettings;
