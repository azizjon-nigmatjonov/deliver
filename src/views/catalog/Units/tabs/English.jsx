import Card from "components/Card";
import { Input } from "alisa-ui";
import Form from "components/Form/Index";
import Select from "components/Select";
import {
  units_eng,
  accuracies,
  mappedReductions as reductions,
} from "../units";
import genSelectOption from "helpers/genSelectOption";
import { useTranslation } from "react-i18next";

export default function English({
  formik,
  values,
  setFieldValue,
  handleChange,
}) {
  const { t } = useTranslation();

  return (
    <div className="m-4">
      <div className="grid grid-cols-2 gap-5">
        <Card title={t("general.information")}>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <div className="input-label">{t("unit")}</div>
              <div className="col-span-2">
                <Form.Item formik={formik} name="unit_en">
                  <Select
                    useZIndex
                    height={40}
                    placeholder={t("enter.unit")}
                    options={genSelectOption(units_eng)}
                    value={values.unit_en}
                    onChange={(val) => {
                      setFieldValue("unit_en", val);
                      // setFieldValue("reduction_en", reductions.get(val.label));
                    }}
                  />
                </Form.Item>
              </div>
            </div>
            <div>
              <div className="input-label">{t("accuracy")}</div>
              <div className="col-span-2">
                <Form.Item formik={formik} name="accuracy">
                  <Select
                    useZIndex
                    height={40}
                    placeholder={t("enter.accuracy")}
                    options={genSelectOption(accuracies)}
                    value={values.accuracy}
                    onChange={(val) => {
                      setFieldValue("accuracy", val);
                    }}
                  />
                </Form.Item>
              </div>
            </div>
            <div>
              <div className="input-label">{t("reduction")}</div>
              <div className="col-span-2">
                <Form.Item formik={formik} name="reduction">
                  <Input
                    size="large"
                    disabled
                    value={values.reduction_ru}
                    onChange={handleChange}
                    name="reduction"
                  />
                </Form.Item>
              </div>
            </div>
            <div>
              <div className="input-label">{t("code")}</div>
              <div className="col-span-2">
                <Form.Item formik={formik} name="code">
                  <Input
                    id="code"
                    height={40}
                    placeholder={t("enter_code")}
                    value={values.code}
                    onChange={handleChange}
                  />
                </Form.Item>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
