import { useState } from "react";
import Gallery from "components/Gallery/v2";
import { Input } from "alisa-ui";
import { useTranslation } from "react-i18next";
import genArticul from "helpers/genArticul";
import { Formik } from "formik";
import Form from "components/Form/Index";
import { postVariants } from "services/v2";
import { useParams } from "react-router-dom";
import ProgressiveModal from "../../ProgressiveModal";
import { useTheme } from "@mui/material/styles";
import SwipeableViews from "react-swipeable-views";
import TabPanel from "components/Tab/TabPanel";
import {
  initials,
  getOptions,
  resetToDefaults,
  applyInvocation,
  // validationSchema,
} from "./variationUtils";
import VariationsList from "./VariationsList";
import Modal from "components/ModalV2";
import { combineOptions, sortCombinedData } from "helpers/combineOptions";
import { useSelector } from "react-redux";
import Button from "components/Button/Buttonv2";

export default function VariationAdder({
  closeModal,
  addModal,
  properties,
  parentProductName,
  getItems,
  parentFormik,
}) {
  const { t } = useTranslation();
  const params = useParams();
  const theme = useTheme();
  const lang = useSelector((state) => state.lang.current);

  const [addProgressiveModal, setAddProgressiveModal] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [addLoading, setAddLoading] = useState(false);
  const [page, setPage] = useState(0);

  const handleProductTitle = (combination) => {
    return parentFormik.values?.type?.value === "origin"
      ? {
          ru: `${parentProductName?.[lang]} ${combination.name}`,
          en: `${parentProductName?.[lang]} ${combination.name}`,
          uz: `${parentProductName?.[lang]} ${combination.name}`,
        }
      : {
          ru: `${combination.name}`,
          en: `${combination.name}`,
          uz: `${combination.name}`,
        };
  };

  const onSubmit = (values, { resetForm }) => {
    setAddLoading(true);

    var propertiesWithSelectedOptions = properties.map((property) => {
      var variation = values.variations.find(
        (variation) => variation.attribute?.value === property.id,
      );
      return {
        ...property,
        options: variation?.selectedOptions?.map((option) => option?.value),
      };
    });

    // const selectedOp = propertiesWithSelectedOptions.map((item) =>
    //   item.options.map((elm) => elm),
    // );

    const productTemp = values.combinations.map((combination) => {
      var [product_property, property_ids] = applyInvocation(
        propertiesWithSelectedOptions,
        combination.name,
      );

      return {
        image: combination.images[0],
        type: "variant",
        title: handleProductTitle(combination),
        product_property: combination.product_property,
        property_ids,
        ...combination,
      };
    });

    const data = {
      parent_id: params.id,
      products: productTemp,
    };
    postVariants(data)
      .then((res) => {
        closeModal();
        getItems();
        resetForm(resetToDefaults(page));
        setPage(0);
      })
      .finally(() => {
        setAddLoading(false);
        setAddProgressiveModal(false);
      });
  };

  const openProgressiveModal = (modalFormik) => {
    closeModal();
    setAddProgressiveModal(true);
    let combinations = sortCombinedData(
      combineOptions(getOptions(modalFormik.values.variations)),
    ).map((combination) => {
      return {
        code: "",
        in_price: "",
        out_price: "",
        images: [],
        name: combination.label,
        product_property: combination.product_properties,
      };
    });

    modalFormik.setFieldValue("combinations", combinations);
  };

  return (
    <Formik
      initialValues={initials}
      onSubmit={onSubmit}
      // validationSchema={validationSchema}
    >
      {(formik) => (
        <>
          <Modal
            open={addModal}
            onClose={() => {
              closeModal();
              formik.resetForm();
            }}
            title={t("create.variation")}
            maxWidth="md"
            fullWidth
          >
            <VariationsList
              formik={formik}
              properties={parentFormik.values.properties}
              propertyIds={parentFormik.values?.property_ids}
              setBtnDisabled={setBtnDisabled}
            />
            <Button
              fullWidth
              size="large"
              color="primary"
              variant="contained"
              onClick={() => openProgressiveModal(formik)}
              disabled={btnDisabled}
            >
              {t("continue")}
            </Button>
          </Modal>

          <ProgressiveModal
            open={addProgressiveModal}
            onConfirm={formik.handleSubmit}
            onClose={() => setAddProgressiveModal(false)}
            page={page}
            setPage={setPage}
            addProgressiveModal={addProgressiveModal}
            formik={formik}
            parentProductName={parentProductName}
            loading={addLoading}
            title={t("add.products")}
          >
            <form onSubmit={formik.handleSubmit}>
              <SwipeableViews
                axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                index={page}
                onChangeIndex={setPage}
              >
                {formik?.values?.combinations?.map((combination, index) => (
                  <TabPanel
                    value={page}
                    index={index}
                    dir={theme.direction}
                    key={index}
                  >
                    <div className="flex flex-col gap-4">
                      <Form.Item
                        formik={formik}
                        fromProgressiveModal
                        name={`combinations[${index}].code`}
                        label={t("vendor_code")}
                      >
                        <Input
                          size="large"
                          id={`combinations.${index}.code`}
                          value={formik.values.combinations[index].code}
                          onChange={formik.handleChange}
                          suffix={
                            <button
                              type="button"
                              onClick={(e) => {
                                var output = genArticul(3);
                                formik.setFieldValue(
                                  `combinations.${index}.code`,
                                  output,
                                );
                              }}
                            >
                              {t("generate")}
                            </button>
                          }
                        />
                      </Form.Item>
                      <Form.Item
                        formik={formik}
                        fromProgressiveModal
                        name={`combinations[${index}].in_price`}
                        label={t("income.price")}
                      >
                        <Input
                          type="number"
                          size="large"
                          id={`combinations.${index}.in_price`}
                          value={formik.values.combinations[index].in_price}
                          onChange={formik.handleChange}
                        />
                      </Form.Item>
                      <Form.Item
                        formik={formik}
                        fromProgressiveModal
                        name={`combinations[${index}].out_price`}
                        label={t("sales.price")}
                      >
                        <Input
                          type="number"
                          size="large"
                          id={`combinations.${index}.out_price`}
                          value={formik.values.combinations[index].out_price}
                          onChange={formik.handleChange}
                        />
                      </Form.Item>
                      <Form.Item
                        formik={formik}
                        fromProgressiveModal
                        name={`combinations[${index}].images`}
                      >
                        <div className="flex items-center gap-2">
                          <Gallery
                            width={120}
                            height={120}
                            gallery={
                              formik.values.combinations[index].images?.length
                                ? formik.values.combinations[index].images
                                : []
                            }
                            setGallery={(images) => {
                              formik.setFieldValue(
                                `combinations.${index}.images`,
                                [...images],
                              );
                            }}
                            style={{ flexDirection: "row" }}
                            // multiple={true}
                          />
                        </div>
                      </Form.Item>
                    </div>
                  </TabPanel>
                ))}
              </SwipeableViews>
            </form>
          </ProgressiveModal>
        </>
      )}
    </Formik>
  );
}
