import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Form from "components/Form/Index";
import { hasValidFields } from "./variationUtils";
import { FieldArray } from "formik";
import Select from "components/Select";
import CreatableSelect from "react-select/creatable";
import AddIcon from "@mui/icons-material/Add";
import { useSelector } from "react-redux";
import AddOptions from "../AddOptions";
import DeleteIcon from "@mui/icons-material/Delete";
import Tag from "components/Tag";
import { getGood } from "services/v2";
import { useParams } from "react-router-dom";
import LoaderComponent from "components/Loader";
import Button from "components/Button/Buttonv2";

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

export default function VariationsList({
  formik,
  // properties,
  // propertyIds,
  setBtnDisabled,
}) {
  const { t } = useTranslation();
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [attribute, setAttribute] = useState({});
  const [addOptionStatus, setAddOptionStatus] = useState(false);
  const [loader, setLoader] = useState(false);

  const { setFieldValue, values } = formik;
  const lang = useSelector((state) => state.lang.current);

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
    if (Array.isArray(data)) {
      var characteristics = data;
      var formFields = characteristics.map((char) => {
        return {
          attribute: { label: char.title?.[lang], value: char?.id },
          options: char.options || [],
          selectedOptions: [],
        };
      });
      setFieldValue("variations", formFields);
    }
  }, [data, setFieldValue]);
  const getData = () => {
    setLoader(true);
    getGood(id)
      .then((res) => setData(res?.properties))
      .finally(() => setLoader(false));
  };
  useEffect(() => {
    getData();
  }, []);

  const selectOptionParser = (value) => {
    let labels = value.map((el) => ({
      label: el?.title?.[lang],
      value: el?.id,
    }));
    return labels;
  };
  return (
    <div className="h-60 overflow-auto">
      {!loader && (
        <FieldArray name="variations">
          {({ push, remove }) => (
            <>
              {values?.variations?.map((variation, index) => (
                <div
                  className="flex items-center w-full gap-2 mb-2"
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

                  <div className="w-10/12">
                    <Form.FieldArrayItem
                      formik={formik}
                      name="variations"
                      index={index}
                    >
                      <CreatableSelect
                        isMulti
                        isClearable
                        options={selectOptionParser(
                          values.variations[index].options,
                        )}
                        formatCreateLabel={(inputText) =>
                          `${t("create")} "${inputText}"`
                        }
                        onChange={(val, actionMeta) => {
                          changeHandler(index, val, actionMeta);
                        }}
                        placeholder={t("options")}
                        className="react-select-input"
                        maxMenuHeight={120}
                      />
                    </Form.FieldArrayItem>
                  </div>
                  <div className="flex">
                    <button
                      onClick={() => {
                        setAddOptionStatus(true);
                        setAttribute({
                          label: values.variations[index].attribute.label,
                          id: values.variations[index].attribute?.value,
                        });
                      }}
                      className="bg-primary text-white py-2 px-4 rounded-md hover:opacity-90 active:scalce-90 mr-2"
                    >
                      <AddIcon />
                    </button>
                    <Tag
                      color="error"
                      lightMode={true}
                      size="large"
                      shape="subtle"
                      className="cursor-pointer"
                      onClick={() => remove(index)}
                    >
                      <DeleteIcon style={{ color: "red " }} />
                    </Tag>
                  </div>
                </div>
              ))}

              <Button
                variant="outlined"
                startIcon={<AddIcon color="primary" />}
                onClick={() => push({ attribute: "", options: [] })}
              >
                {t("add")}
              </Button>
            </>
          )}
        </FieldArray>
      )}
      <LoaderComponent isLoader={loader} />
      <AddOptions
        getData={getData}
        formik={formik}
        attribute={attribute}
        addOptionStatus={addOptionStatus}
        setAddOptionStatus={setAddOptionStatus}
      />
    </div>
  );
}
