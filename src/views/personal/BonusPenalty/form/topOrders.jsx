import React from "react";
import { useTranslation } from "react-i18next";
import Card from "components/Card";
import { FieldArray, FormikProvider } from "formik";
import Form from "components/Form/Index";
import { Input } from "alisa-ui";
import Tag from "components/Tag";
import DeleteIcon from "@mui/icons-material/Delete";
import DatePicker from "components/DatePicker";
import moment from "moment";
import Switch from "components/Switch";
import Button from "components/Button";

// const useStyles = makeStyles((theme) => ({
//   root: {
//     "& > button": {
//       width: "100%",
//       fontSize: "14px",
//       borderColor: "#E5E9EB",
//       backgroundColor: "#fff",
//       color: "#4094f7",
//       padding: "8px 0 8px 0",
//     },
//     "& > *:hover": {
//       borderColor: "#ecf4fe",
//       backgroundColor: "#ecf4fe",
//     },
//     "& > span": {
//       fontSize: "26px",
//     },
//   },
// }));

const TopOrders = ({ formik }) => {
  const { t } = useTranslation();
  const { values, setFieldValue, handleChange } = formik;

  return (
    <Card
      title={t("top_courier_orders_count")}
      className="w-6/12 flex flex-col gap-4"
    >
      <div className="flex w-6/6 gap-5 mb-4 items-center justify-between">
        <div className="w-3/6">
          <Form.Item
            formik={formik}
            name="bonus_penalty_datas.starting_date"
            label={t("date")}
          >
            <DatePicker
              className="w-full"
              hideTimePicker
              value={
                values?.bonus_penalty_datas?.starting_date
                  ? moment(values?.bonus_penalty_datas?.starting_date)
                  : ""
              }
              placeholder={t("enter.date")}
              hideTimeBlock
              onChange={(val) => {
                val !== null
                  ? setFieldValue(
                      "bonus_penalty_datas.starting_date",
                      moment(val).format("YYYY-MM-DD"),
                    )
                  : setFieldValue(
                      "bonus_penalty_datas.starting_date",
                      moment().format("YYYY-MM-DD"),
                    );
              }}
            />
          </Form.Item>
        </div>

        <div className="w-3/6 ">
          <Form.Item formik={formik} name="status" label={t("every_month")}>
            <Switch
              checked={values.bonus_penalty_datas.every_month}
              onChange={(val) =>
                setFieldValue("bonus_penalty_datas.every_month", val)
              }
            />
          </Form.Item>
        </div>
      </div>
      <div className="w-3/6 mb-4">
        <Form.Item
          formik={formik}
          name="bonus_penalty_datas.frequency_days"
          label={t("days_count")}
        >
          <Input
            size="large"
            id="bonus_penalty_datas.frequency_days"
            value={values?.bonus_penalty_datas?.frequency_days}
            onChange={handleChange}
            placeholder={t("Введите дней")}
            type="number"
            disabled={
              values.bonus_penalty_datas.every_month === true ? true : false
            }
          />
        </Form.Item>
      </div>
      <FormikProvider value={formik}>
        <FieldArray name="bonus_penalty_datas.amount_for_top">
          {({ push, remove }) => (
            <>
              {values?.bonus_penalty_datas?.amount_for_top?.map(
                (option, index) => (
                  <div
                    className="flex items-center justify-between pb-2"
                    key={index}
                  >
                    <div className="input-label">{t(`TOP ${index + 1}`)}</div>
                    <div className="w-4/6">
                      <div className="">
                        <Form.FieldArrayItem
                          formik={formik}
                          name="bonus_penalty_datas.amount_for_top"
                          index={index}
                          custom={true}
                          custom_error={
                            formik.errors[
                              "bonus_penalty_datas.amount_for_top"
                            ]?.[index]?.["amount"]
                          }
                        >
                          <Input
                            type="number"
                            id="bonus_penalty_datas.amount_for_top"
                            size="large"
                            name="bonus_penalty_datas.amount_for_top"
                            value={
                              values.bonus_penalty_datas.amount_for_top[index]
                                ?.amount
                            }
                            onChange={(val) => {
                              setFieldValue(
                                `bonus_penalty_datas.amount_for_top[${index}].amount`,
                                val.target.value,
                              );
                            }}
                          />
                        </Form.FieldArrayItem>
                      </div>
                    </div>
                    <Tag
                      color="red"
                      size="large"
                      shape="subtle"
                      className="cursor-pointer pb-2"
                    >
                      <DeleteIcon
                        onClick={() => remove(index)}
                        style={{ color: "red" }}
                      />
                    </Tag>
                  </div>
                ),
              )}
              {/* <div className={styles.root}> */}
                <Button
                  variant="outlined"
                  onClick={() => push({ amount: 0 })}
                >
                  {t("add")}
                </Button>
              {/* </div> */}
            </>
          )}
        </FieldArray>
      </FormikProvider>
    </Card>
  );
};

export default TopOrders;
