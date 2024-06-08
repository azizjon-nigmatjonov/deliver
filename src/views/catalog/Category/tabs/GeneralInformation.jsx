import { useState } from "react";
import Card from "components/Card";
import Form from "components/Form/Index";
import { Input } from "alisa-ui";
import { useTranslation } from "react-i18next";
import { StyledTabs, StyledTab } from "components/StyledTabs";
import SwipeableViews from "react-swipeable-views";
import TabPanel from "components/Tab/TabPanel";
import { useTheme } from "@mui/material/styles";
import UzIcon from "assets/icons/Ellipse 7.png";
import RuIcon from "assets/icons/Ellipse 8.png";
import EnIcon from "assets/icons/Ellipse 9.png";
import TextArea from "components/Textarea";
import Gallery from "components/Gallery";
import { getCategories } from "services/v2";
import AsyncSelect from "components/Select/Async";
import { useCallback } from "react";
import Switch from "components/Switch";

export default function GeneralInformation({
  formik,
  values,
  handleChange,
  setFieldValue,
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [value, setValue] = useState(0);
  // Tabs
  const a11yProps = (index) => {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  };

  const loadCateogories = useCallback((input, cb) => {
    getCategories({ page: 1, limit: 10, search: input })
      .then((res) => {
        let categories = res?.categories.map((elm) => ({
          label: elm.title.ru,
          value: elm.id,
        }));
        cb(categories);
      })
      .catch((error) => console.log(error));
  }, []);

  const handleTabChange = (event, newValue) => setValue(newValue);

  const handleChangeIndex = (index) => setValue(index);

  const tabLabel = (text, isActive = false) => (
    <span className="px-1">{text}</span>
  );

  return (
    <div className="grid grid-cols-3">
      <Card
        className="m-4 mr-2 col-span-2"
        title={t("general.settings")}
        bodyStyle={{ padding: "0 1rem" }}
      >
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
            <div className="grid grid-cols-12 gap-8 mb-14">
              <div className="col-span-3">
                <Form.Item formik={formik} name="image">
                  <div className="w-full h-full flex mt-6 items-center flex-col">
                    <Gallery
                      width={120}
                      height={120}
                      gallery={values.image ? [values.image] : []}
                      setGallery={(elm) => setFieldValue("image", elm[0])}
                      multiple={false}
                      accept="image/jpeg"
                    />
                  </div>
                </Form.Item>
              </div>

              <div className="col-span-9 flex flex-col gap-4">
                <div className="w-full flex justify-between items-baseline pt-4">
                  <div className="w-1/4 input-label">
                    <span>{t("name")}</span>
                  </div>
                  <div className="w-3/4">
                    <div>
                      <Form.Item formik={formik} name="title_ru">
                        <Input
                          size="large"
                          id="title_ru"
                          value={values.title_ru}
                          onChange={handleChange}
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>

                <div className="w-full flex justify-between items-baseline">
                  <div className="w-1/4 input-label">
                    <span>{t("description")}</span>
                  </div>
                  <div className="w-3/4">
                    <div>
                      <Form.Item formik={formik} name="description_ru">
                        <TextArea
                          id="description_ru"
                          {...formik.getFieldProps("description_ru")}
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>

                <div className="w-full flex justify-between items-baseline">
                  <div className="w-1/4 input-label">
                    <span>{t("category")}</span>
                  </div>
                  <div className="w-3/4">
                    <div>
                      <Form.Item formik={formik} name="category_id">
                        <AsyncSelect
                          id="category_id"
                          defaultOptions
                          cacheOptions
                          isSearchable
                          isClearable
                          value={values.category_id}
                          loadOptions={loadCateogories}
                          placeholder={t("choose.category")}
                          onChange={(val) => setFieldValue("category_id", val)}
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>
                <div className="w-full flex justify-between items-center pt-4">
                  <div className="w-1/4 input-label">
                    <span>{t("order.number")}</span>
                  </div>
                  <div className="w-3/4">
                    <div>
                      <Form.Item formik={formik} name="order_no">
                        <Input
                          size="large"
                          id="order_no"
                          value={values.order_no}
                          onChange={handleChange}
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>
                <div className="w-full flex justify-between items-baseline">
                  <div className="w-1/4 input-label">
                    <span>{t("status")}</span>
                  </div>
                  <div className="w-3/4">
                    <div>
                      <Switch
                        checked={values.active}
                        onChange={(e) => setFieldValue("active", e)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            <div className="grid grid-cols-12 gap-8 mb-14">
              <div className="col-span-3">
                <Form.Item formik={formik} name="image">
                  <div className="w-full h-full flex mt-6 items-center flex-col">
                    <Gallery
                      width={120}
                      height={120}
                      gallery={values.image ? [values.image] : []}
                      setGallery={(elm) => setFieldValue("image", elm[0])}
                      multiple={false}
                    />
                  </div>
                </Form.Item>
              </div>

              <div className="col-span-9 flex flex-col gap-4">
                <div className="w-full flex justify-between items-baseline pt-4">
                  <div className="w-1/4 input-label">
                    <span>{t("name")}</span>
                  </div>
                  <div className="w-3/4">
                    <div>
                      <Form.Item formik={formik} name="title_en">
                        <Input
                          size="large"
                          id="title_en"
                          value={values.title_en}
                          onChange={handleChange}
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>

                <div className="w-full flex justify-between items-baseline">
                  <div className="w-1/4 input-label">
                    <span>{t("description")}</span>
                  </div>
                  <div className="w-3/4">
                    <div>
                      <Form.Item formik={formik} name="description_en">
                        <TextArea
                          id="description_en"
                          {...formik.getFieldProps("description_en")}
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>

                <div className="w-full flex justify-between items-baseline">
                  <div className="w-1/4 input-label">
                    <span>{t("category")}</span>
                  </div>
                  <div className="w-3/4">
                    <div>
                      <Form.Item formik={formik} name="category_id">
                        <AsyncSelect
                          id="category_id"
                          defaultOptions
                          cacheOptions
                          isSearchable
                          isClearable
                          value={values.category_id}
                          loadOptions={loadCateogories}
                          placeholder={t("choose.category")}
                          onChange={(val) => setFieldValue("category_id", val)}
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>
                <div className="w-full flex justify-between items-center pt-4">
                  <div className="w-1/4 input-label">
                    <span>{t("order.number")}</span>
                  </div>
                  <div className="w-3/4">
                    <div>
                      <Form.Item formik={formik} name="order_no">
                        <Input
                          size="large"
                          id="order_no"
                          value={values.order_no}
                          onChange={handleChange}
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>
                <div className="w-full flex justify-between items-baseline">
                  <div className="w-1/4 input-label">
                    <span>{t("status")}</span>
                  </div>
                  <div className="w-3/4">
                    <div>
                      <Switch
                        checked={values.active}
                        onChange={(e) => setFieldValue("active", e)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>
          <TabPanel value={value} index={2} dir={theme.direction}>
            <div className="grid grid-cols-12 gap-8 mb-14">
              <div className="col-span-3">
                <Form.Item formik={formik} name="image">
                  <div className="w-full h-full flex mt-6 items-center flex-col">
                    <Gallery
                      width={120}
                      height={120}
                      gallery={values.image ? [values.image] : []}
                      setGallery={(elm) => setFieldValue("image", elm[0])}
                      multiple={false}
                    />
                  </div>
                </Form.Item>
              </div>

              <div className="col-span-9 flex flex-col gap-4">
                <div className="w-full flex justify-between items-baseline pt-4">
                  <div className="w-1/4 input-label">
                    <span>{t("name")}</span>
                  </div>
                  <div className="w-3/4">
                    <div>
                      <Form.Item formik={formik} name="title_uz">
                        <Input
                          size="large"
                          id="title_uz"
                          value={values.title_uz}
                          onChange={handleChange}
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>

                <div className="w-full flex justify-between items-baseline">
                  <div className="w-1/4 input-label">
                    <span>{t("description")}</span>
                  </div>
                  <div className="w-3/4">
                    <div>
                      <Form.Item formik={formik} name="description_uz">
                        <TextArea
                          id="description_uz"
                          {...formik.getFieldProps("description_uz")}
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>

                <div className="w-full flex justify-between items-baseline">
                  <div className="w-1/4 input-label">
                    <span>{t("category")}</span>
                  </div>
                  <div className="w-3/4">
                    <div>
                      <Form.Item formik={formik} name="category_id">
                        <AsyncSelect
                          id="category_id"
                          defaultOptions
                          cacheOptions
                          isSearchable
                          isClearable
                          value={values.category_id}
                          loadOptions={loadCateogories}
                          placeholder={t("choose.category")}
                          onChange={(val) => setFieldValue("category_id", val)}
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>

                <div className="w-full flex justify-between items-center pt-4">
                  <div className="w-1/4 input-label">
                    <span>{t("order.number")}</span>
                  </div>
                  <div className="w-3/4">
                    <div>
                      <Form.Item formik={formik} name="order_no">
                        <Input
                          size="large"
                          id="order_no"
                          value={values.order_no}
                          onChange={handleChange}
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>

                <div className="w-full flex justify-between items-baseline">
                  <div className="w-1/4 input-label">
                    <span>{t("status")}</span>
                  </div>
                  <div className="w-3/4">
                    <div>
                      <Switch
                        checked={values.active}
                        onChange={(e) => setFieldValue("active", e)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>
        </SwipeableViews>
      </Card>
    </div>
  );
}
