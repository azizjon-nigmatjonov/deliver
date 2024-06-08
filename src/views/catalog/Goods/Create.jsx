import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Formik } from "formik";
import { getGood, postGood, updateGood } from "services/v2";
import { useParams } from "react-router-dom";
import Header from "components/Header";
import Breadcrumb from "components/Breadcrumb";
import Button from "components/Button";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import { useHistory } from "react-router-dom";
import FullScreenLoader from "components/FullScreenLoader";
import Filters from "components/Filters";
import { StyledTabs, StyledTab } from "components/StyledTabs";
import SwipeableViews from "react-swipeable-views";
import TabPanel from "components/Tab/TabPanel";
import { useTheme } from "@mui/material/styles";
import Good from "./tabs/Good";
import ConnectedGoods from "./tabs/ConnectedGoods";
import formFields from "./api.js";
import genSelectOption from "helpers/genSelectOption";
import { goodsValidationSchema } from "./GoodsUtils";

export default function GoodsCreate() {
  const { t } = useTranslation();
  const history = useHistory();
  const { id } = useParams();
  const theme = useTheme();
  const [initialValues, setInitialValues] = useState(formFields);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState(0);

  const fetchProductData = useCallback(async () => {
    if (id) {
      var res = await getGood(id);

      return {
        ...res,
        brand: res?.brand,
        description_ru: res?.description.ru,
        description_uz: res?.description.uz,
        description_en: res?.description.en,
        in_price: res?.in_price,
        out_price: res?.out_price,
        is_divisible: {
          label: res?.is_divisible ? t("divisible") : t("nondivisible"),
          value: res?.is_divisible,
        },
        currency: genSelectOption(res?.currency),
        title_ru: res?.title.ru,
        title_uz: res?.title.uz,
        title_en: res?.title.en,
        unit: "",
        // unit_short: genSelectOption(unit?.short_name),
        // accuracy: unit?.accuracy,
        unit_short: "",
        accuracy: "",
        tag_ids: res?.tags?.map((tag) => ({
          label: tag.title.ru,
          value: tag.id,
        })),
        category_ids: res?.categories?.map((category) => ({
          label: category.title.ru,
          value: category.id,
        })),
        images: res?.image ? [res?.image, ...res?.gallery] : [...res?.gallery],
        code: res?.code,
        count: res?.count,
        iiko_id: res?.iiko_id,
        jowi_id: res?.jowi_id,
        poster_id: res?.poster_id,
        iiko_group_id: res?.iiko_group_id,
        order: res?.order,
        property_ids: res?.properties.map((property) => ({
          ...property,
          label: property.title.ru,
          value: property.id,
          variants: property.options,
          parent_id: res?.parent_id,
          order: res?.order,
        })),
        type: genSelectOption(res?.type),
        ikpu: res?.ikpu,
        package_code: res?.package_code,
      };
    }
    return null;
  }, [id, t]);

  const saveChanges = useCallback(
    (data) => {
      setBtnDisabled(true);
      if (id) {
        updateGood(id, data)
          .then(() => history.push("/home/catalog/goods"))
          .finally(() => setBtnDisabled(false));
      } else {
        postGood(data)
          .then(() => history.push("/home/catalog/goods"))
          .finally(() => setBtnDisabled(false));
      }
    },
    [history, id],
  );

  const onSubmit = useCallback(
    (values) => {
      var ids = values?.property_ids?.map((group) => group?.value);
      const data = {
        active: values.active,
        count: values.count,
        description: {
          ru: values.description_ru || "",
          uz: values.description_uz || "",
          en: values.description_en || "",
        },
        image: values.images[0],
        gallery: values.images.slice(1, values.images.length),
        in_price: values.in_price,
        out_price: values.out_price,
        is_divisible: values?.is_divisible?.value,
        title: {
          ru: values.title_ru || "",
          uz: values.title_uz || "",
          en: values.title_en || "",
        },
        brand: values?.brand ? values?.brand?.value : null,
        tags: values.tag_ids
          ? values.tag_ids.map((tag_id) => tag_id?.value)
          : null,
        categories: values.category_ids.map((category) => category?.value),
        measurement_id: values?.unit?.value,
        // variant_ids: values?.variant_ids.map((variant_id) => variant_id.id),
        order: values.order,
        iiko_id: values.iiko_id,
        jowi_id: values.jowi_id,
        poster_id: values.poster_id,
        iiko_group_id: values.iiko_group_id,
        property_ids: ids,
        currency: "UZS", // values.currency.value,
        code: values.code,
        favourites: values?.favourites.map((favorite_id) => favorite_id.id),
        type: values.type?.value,
        parent_id: values.parent_id,
        ikpu: String(values.ikpu),
        package_code: String(values.package_code),
      };
      saveChanges(data);
    },
    [saveChanges],
  );

  useEffect(() => {
    setIsLoading(true);
    fetchProductData()
      .then((data) => {
        data && setInitialValues(data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [fetchProductData]);

  const routes = [
    {
      title: <div>{t("goods")}</div>,
      link: true,
      route: `/home/catalog/goods`,
    },
    {
      title: id ? t("edit") : t("create"),
    },
  ];

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

  return (
    <>
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          // validationSchema={goodsValidationSchema}
        >
          {(formik) => (
            <form onSubmit={formik.handleSubmit}>
              <div
                style={{ minHeight: "100vh" }}
                className="flex flex-col justify-between"
              >
                <div>
                  <Header startAdornment={<Breadcrumb routes={routes} />} />
                  <Filters>
                    <StyledTabs
                      value={value}
                      onChange={handleTabChange}
                      centered={false}
                      aria-label="full width tabs example"
                      TabIndicatorProps={{
                        children: <span className="w-2" />,
                      }}
                    >
                      <StyledTab
                        label={tabLabel(t("good"))}
                        {...a11yProps(0)}
                        style={{ width: "75px" }}
                      />
                      <StyledTab
                        label={tabLabel(t("connected_goods"))}
                        {...a11yProps(1)}
                        style={{ width: "175px" }}
                      />
                    </StyledTabs>
                  </Filters>
                  <SwipeableViews
                    axis="x"
                    index={value}
                    onChangeIndex={handleChangeIndex}
                  >
                    <TabPanel value={value} index={0} dir={theme.direction}>
                      <Good
                        formik={formik}
                        // brands={brands}
                        initialValues={initialValues}
                      />
                    </TabPanel>
                    <TabPanel value={value} index={1} dir={theme.direction}>
                      <ConnectedGoods formik={formik} />
                    </TabPanel>
                  </SwipeableViews>
                </div>
                <div className="sticky bottom-0 flex justify-end items-center w-full bg-white p-4 gap-5">
                  <Button
                    icon={CancelIcon}
                    size="large"
                    shape="outlined"
                    color="red"
                    iconClassName="red"
                    borderColor="bordercolor"
                    onClick={() => history.goBack()}
                  >
                    {t("cancel")}
                  </Button>

                  <Button
                    icon={SaveIcon}
                    size="large"
                    type="submit"
                    loading={btnDisabled}
                  >
                    {t(id ? "save" : "create")}
                  </Button>
                </div>
              </div>
            </form>
          )}
        </Formik>
      )}
    </>
  );
}
