import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Form from "components/Form/Index";
import { hasValidFields } from "./variationUtils";
import { FieldArray } from "formik";
import Select from "components/Select";
import CreatableSelect from "react-select/creatable";
import MuiButton from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import genSelectOption from "helpers/genSelectOption";

// const useStyles = makeStyles((theme) => ({
//   root: {
//     "& > *": {
//       width: "100%",
//       border: "1px solid #ddd",
//       color: "#0e73f6",
//       marginBottom: "1rem",
//     },
//     "& > *:hover": {
//       border: "1px solid #0e73f6",
//       background: "#fff",
//     },
//   },
//   icon: {
//     color: "#0e73f6",
//   },
// }));

export default function ComboProductList({
  formik,
  properties,
  propertyIds,
  setBtnDisabled,
}) {
  const { t } = useTranslation();
  const { setFieldValue, values } = formik;

  const changeHandler = (index, newValue, actionMeta) => {
    setFieldValue(`variations.${index}.selectedOptions`, newValue);
  };

  useEffect(() => {
    if (hasValidFields(values.variations)) {
      setBtnDisabled(true);
    } else {
      setBtnDisabled(false);
    }
  }, [values.variations, setBtnDisabled]);

  useEffect(() => {
    if (Array.isArray(propertyIds)) {
      var characteristics = propertyIds;
      var formFields = characteristics.map((char) => {
        return {
          attribute: { label: char.title.ru, value: char.id },
          options: char.options || [],
          selectedOptions: [],
        };
      });
      setFieldValue("variations", formFields);
    }
  }, [propertyIds, setFieldValue]);

  return (
    <div className="h-60 overflow-auto">
      <FieldArray name="variations">
        {({ push }) => (
          <>
            {values.variations.map((variation, index) => {
              return (
                <div
                  className="flex items-baseline w-full gap-2"
                  key={`variation-${index}`}
                >
                  <div className="w-4/12">
                    <Form.FieldArrayItem
                      formik={formik}
                      name="variations"
                      index={index}
                    >
                      <Select
                        disabled
                        height={40}
                        isSearchable
                        isClearable
                        cacheOptions
                        id="product-variants-select"
                        value={values.variations[index].attribute}
                        options={[]}
                        onChange={(val) => {}}
                        placeholder={t("select")}
                        useZIndex
                        maxMenuHeight={120}
                      />
                    </Form.FieldArrayItem>
                  </div>

                  <div className="w-8/12">
                    <Form.FieldArrayItem
                      formik={formik}
                      name="variations"
                      index={index}
                    >
                      <CreatableSelect
                        isMulti
                        isClearable
                        options={genSelectOption(
                          values.variations[index].options,
                        )}
                        formatCreateLabel={(inputText) =>
                          `${t("create")} "${inputText}"`
                        }
                        onChange={(val, actionMeta) =>
                          changeHandler(index, val, actionMeta)
                        }
                        placeholder={t("options")}
                        className="react-select-input"
                        maxMenuHeight={120}
                      />
                    </Form.FieldArrayItem>
                  </div>
                </div>
              );
            })}

              <MuiButton
                variant="outlined"
                startIcon={<AddIcon color="primary" />}
                onClick={() => {
                  push({ attribute: "", options: [] });
                }}
              >
                {t("add")}
              </MuiButton>
          </>
        )}
      </FieldArray>
    </div>
  );
}
