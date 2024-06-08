import { useEffect, useState, useCallback } from "react";
import Card from "components/Card";
import Form from "components/Form/Index";
import { useTranslation } from "react-i18next";
import { StyledTabs, StyledTab } from "components/StyledTabs";
import SwipeableViews from "react-swipeable-views";
import TabPanel from "components/Tab/TabPanel";
import { useTheme } from "@mui/material/styles";
import UzIcon from "assets/icons/Ellipse 7.png";
import RuIcon from "assets/icons/Ellipse 8.png";
import EnIcon from "assets/icons/Ellipse 9.png";
import Select from "components/Select";
import AddIcon from "@mui/icons-material/Add";
import Gallery from "components/Gallery/v2";
import Uzbek from "./Uzbek";
import English from "./English";
import Russian from "./Russian";
import { FieldArray } from "formik";
import DeleteIcon from "@mui/icons-material/Delete";
import BaseFields from "../BaseFields";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import {
  SortableContainer,
  SortableElement,
  arrayMove,
  SortableHandle,
} from "react-sortable-hoc";
import AddOptionsModal from "./AddOptions";
import { getAllCategories, getProperties } from "services/v2";
import useGoodsPageData from "utils/useGoodsPageData";
import { useParams } from "react-router-dom";
import AsyncSelect from "components/Select/Async";
import styles from "./styles.module.scss";
import Button from "components/Button/Buttonv2";

export default function Good({ formik, initialValues }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [isOptionModal, setOptionModal] = useState(false);

  const { setValues, values, setFieldValue, isValid, errors, submitCount } =
    formik;

  const [value, setValue] = useState(0);
  const [attribute, setAttribute] = useState([]);
  const [brandsData, setBrandsData] = useState([]);
  const [measurementsData, setMeasurementsData] = useState([]);
  const [tags, setTags] = useState([]);
  const { id } = useParams();

  useGoodsPageData({
    brandsProps: {
      onSuccess: (res) => {
        let brandResponse = res?.brands?.map((brand) => ({
          ...brand,
          label: brand.title.ru,
          value: brand.id,
        }));
        setBrandsData(brandResponse);
        if (id)
          setFieldValue(
            "brand",
            brandResponse?.find((el) => el.id === values?.brand?.id),
          );
      },
    },
    measurementsProps: {
      onSuccess: (res) => {
        let measurementsRes = res?.measurements?.map((measurement) => ({
          ...measurement,
          label: measurement.title.ru,
          value: measurement.id,
        }));
        setMeasurementsData(measurementsRes);
        if (id) {
          setFieldValue(
            "unit",
            measurementsRes?.find((el) => el.id === values?.measurement?.id),
          );
        }
      },
    },
    tagsProps: {
      onSuccess: (res) => {
        let tagsRes = res?.tags?.map((tag) => ({
          label: tag.title.ru,
          value: tag.id,
        }));
        setTags(tagsRes);
      },
    },
  });

  const loadProperties = useCallback((inputValue, callback) => {
    getProperties({ page: 1, limit: 10, search: inputValue })
      .then((res) => {
        let properties = res?.properties?.map((group) => ({
          ...group,
          label: group.title.ru,
          value: group.id,
          variants: group.options,
          options: undefined,
        }));
        callback(properties);
      })
      .catch((err) => console.log(err));
  }, []);

  const loadAllCategories = useCallback((inputValue, callback) => {
    getAllCategories({ limit: 10, search: inputValue })
      .then((res) => {
        let categories = res?.categories?.map((category) => ({
          label: category.title.ru,
          value: category.id,
        }));
        callback(categories);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (values.type?.value === "simple") setFieldValue("property_ids", []);
  }, [values?.type?.value, setFieldValue]);

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues, setValues]);

  // Tabs
  const a11yProps = (index) => {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  };

  const handleTabChange = (event, newValue) => setValue(newValue);

  const handleChangeIndex = (index) => setValue(index);

  const tabLabel = (text, isActive = false) => (
    <span className="px-1">{text}</span>
  );

  const DragHandle = SortableHandle(() => (
    <DragIndicatorIcon className={styles.dragIcon} />
  ));

  const SortableList = SortableContainer((props) => {
    return props.children;
  });

  const onSortEnd = useCallback(
    ({ oldIndex, newIndex }) => {
      var sortedIds = arrayMove(values?.property_ids, oldIndex, newIndex);
      setFieldValue("property_ids", sortedIds);
    },
    [setFieldValue, values?.property_ids],
  );

  const variantOptions = (position) => {
    if (values.type?.value === "variant") {
      let product_variants = values?.product_property?.map((product) => ({
        label: product?.title?.ru,
        value: product.option_id,
      }));
      return product_variants?.[position];
    } else {
      let variants = values?.property_ids[position]?.variants?.map((prop) => ({
        label: prop.title?.ru,
        value: prop.id,
        isFixed: true,
      }));
      return variants;
    }
  };

  const SortableItem = SortableElement(({ value, position, remove }) => {
    return (
      <div className="flex justify-between items-center gap-3 mt-4">
        <div className="flex-1">
          <Form.FieldArrayItem
            formik={formik}
            custom={true}
            custom_error={
              formik.errors?.["property_ids"]?.[position]?.["label"]
            }
          >
            <AsyncSelect
              placeholder={t("name")}
              defaultOptions
              isSearchable
              loadOptions={loadProperties}
              maxMenuHeight={330}
              id={`property_ids[${position}]?.value`}
              value={value}
              onChange={(val) => setFieldValue(`property_ids.${position}`, val)}
              disabled={values.type?.value === "variant"}
            />
          </Form.FieldArrayItem>
        </div>
        <div className="flex-1">
          <Select
            isMulti
            width="100%"
            placeholder={t("discount")}
            dropdownIndicator={false}
            value={variantOptions(position)}
          />
        </div>
        {values.type?.value !== "variant" && (
          <>
            <div className="border rounded-md p-2" title={t("reorder")}>
              <DragHandle />
            </div>
            <div
              className="bg-primary text-white p-2 rounded-md hover:opacity-90 active:scale-90"
              title={t("add.option")}
            >
              <AddIcon
                onClick={() => {
                  setOptionModal(true);
                  setAttribute(value);
                }}
              />
            </div>
            <div
              className="border rounded-md p-2"
              onClick={() => remove(position)}
              title={t("delete")}
            >
              <DeleteIcon color="error" />
            </div>
          </>
        )}
      </div>
    );
  });

  return (
    <>
      <div className="grid grid-cols-2 gap-4 p-4">
        <Card title={t("good")} bodyStyle={{ padding: "0 1rem" }}>
          <StyledTabs
            value={value}
            onChange={handleTabChange}
            centered={false}
            aria-label="full width tabs example"
            TabIndicatorProps={{ children: <span className="w-2" /> }}
            className="border-b"
          >
            <StyledTab
              label={
                <span className="flex justify-around items-center">
                  <img src={RuIcon} alt="uzb logo" width="20" height="20" />{" "}
                  {tabLabel(t("russian"))}
                  {!isValid &&
                  submitCount &&
                  (errors.title_ru || errors.description_ru) ? (
                    <span className="text-red-600 text-lg animate-pulse">
                      !
                    </span>
                  ) : null}
                </span>
              }
              {...a11yProps(0)}
              style={{ width: "150px" }}
            />
            <StyledTab
              label={
                <span className="flex justify-around items-center">
                  <img src={EnIcon} alt="uzb logo" width="20" height="20" />{" "}
                  {tabLabel(t("english"))}
                  {!isValid &&
                    submitCount &&
                    (errors.title_en || errors.description_en) && (
                      <span className="text-red-600 text-lg animate-pulse">
                        !
                      </span>
                    )}
                </span>
              }
              {...a11yProps(1)}
              style={{ width: "150px" }}
            />
            <StyledTab
              label={
                <span className="flex justify-around items-center">
                  <img src={UzIcon} alt="uzb logo" width="20" height="20" />{" "}
                  {tabLabel(t("uzbek"))}
                  {!isValid &&
                    submitCount &&
                    (errors.title_uz || errors.description_uz) && (
                      <span className="text-red-600 text-lg animate-pulse">
                        !
                      </span>
                    )}
                </span>
              }
              {...a11yProps(2)}
              style={{ width: "150px" }}
            />
          </StyledTabs>
          <SwipeableViews
            axis={theme.direction === "rtl" ? "x-reverse" : "x"}
            index={value}
            onChangeIndex={handleChangeIndex}
          >
            <TabPanel value={value} index={0} dir={theme.direction}>
              <BaseFields
                lang={<Russian />}
                formik={formik}
                tags={tags}
                brandsData={brandsData}
                measurementsData={measurementsData}
                loadAllCategories={loadAllCategories}
                // brands={brands}
              />
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}>
              <BaseFields
                lang={<English />}
                formik={formik}
                tags={tags}
                brandsData={brandsData}
                measurementsData={measurementsData}
                loadAllCategories={loadAllCategories}
                // brands={brands}
              />
            </TabPanel>
            <TabPanel value={value} index={2} dir={theme.direction}>
              <BaseFields
                lang={<Uzbek />}
                formik={formik}
                tags={tags}
                brandsData={brandsData}
                measurementsData={measurementsData}
                loadAllCategories={loadAllCategories}
                // brands={brands}
              />
            </TabPanel>
          </SwipeableViews>
        </Card>

        <div>
          <Card title={t("photo")} bodyStyle={{ padding: "1rem" }}>
            <Form.Item formik={formik} name="images">
              <div className="w-full h-full flex items-center">
                <Gallery
                  width={120}
                  height={120}
                  gallery={values.images?.length ? values.images : []}
                  setGallery={(images) => {
                    setFieldValue("images", [...images]);
                  }}
                  maxSizeText="max.size.1mb"
                  extraTitle="600x400"
                  accept="image/jpeg"
                  style={{ flexDirection: "row" }}
                />
              </div>
            </Form.Item>
          </Card>
          {(values?.type?.value === "origin" ||
            values?.type?.value === "modifier") && (
            <Card
              title={t("characteristics")}
              className="mt-4"
              bodyStyle={{ padding: "0 1rem 1rem" }}
            >
              <FieldArray name="property_ids">
                {({ push, remove }) => (
                  <>
                    <SortableList
                      useDragHandle
                      onSortEnd={onSortEnd}
                      key={"sortable-list"}
                    >
                      <div className="mb-4">
                        {/* this div is for dragNdrop */}
                        {values.property_ids?.length > 0 &&
                          values.property_ids?.map((group, index) => (
                            <SortableItem
                              key={`${group?.value}`}
                              index={index}
                              value={group}
                              position={index}
                              remove={remove}
                            />
                          ))}
                      </div>
                    </SortableList>

                    {values.type?.value !== "variant" && (
                      <Button
                        variant="outlined"
                        startIcon={<AddIcon color="primary" />}
                        onClick={() =>
                          push({ label: "", value: "", options: [] })
                        }
                        style={{ display: "flex", marginLeft: "auto", width: '50%' }}
                      >
                        {t("add")}
                      </Button>
                    )}
                  </>
                )}
              </FieldArray>
            </Card>
          )}
        </div>
      </div>
      <AddOptionsModal
        attribute={attribute}
        open={isOptionModal}
        setOptionModal={setOptionModal}
      />
    </>
  );
}
