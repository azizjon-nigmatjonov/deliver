import { useMemo, useState, useEffect } from "react";
import Card from "components/Card";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import Form from "components/Form/Index";
import { AsyncPaginate } from "react-select-async-paginate";
import { useFormik } from "formik";
import Header from "components/Header";
import Button from "components/Button";
import Select from "../../../../components/Select";
import Breadcrumb from "components/Breadcrumb";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import CustomSkeleton from "components/Skeleton";
import { customStyles } from "components/Select";
import { getCrmCombo, getGoods, updateGoodCombo } from "services/v2";

export default function MenuCreate() {
  const { t } = useTranslation();
  const history = useHistory();
  const [saveLoading, setSaveLoading] = useState(false);
  const [loader, setLoader] = useState(true);
  const [iikoMenus, setIikoMenus] = useState();

  const getIikoMenu = () => {
    getCrmCombo({ limit: 100, page: 1, type: "iiko" })
      .then((res) => {
        setIikoMenus(
          res?.combos?.map((item) => ({
            label: item.name,
            value: item.id,
          })),
        );
      })
      .finally(() => setLoader(false));
  };

  const loadOptions = async (search, prevOptions, { page }) => {
    const res = await getGoods({ search, limit: 10, page, type: "combo" });
    const hasMore = +res?.count > prevOptions.length + 10;
    return {
      options: res?.products?.map((elm) => ({
        label: elm.title?.ru,
        value: elm.id,
        elm,
      })),
      hasMore,
      additional: {
        page: page + 1,
      },
    };
  };

  const initialValues = useMemo(() => ({}), []);

  const onSubmit = async (values) => {
    setSaveLoading(true);
    updateGoodCombo(values.product_id.value, { combo_id: values.iiko_id.value })
      .then(() => {
        history.goBack();
      })
      .finally(() => {
        setSaveLoading(false);
      });
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    // validationSchema,
  });

  const { values, setFieldValue, handleSubmit } = formik;

  const routes = [
    {
      title: t(`Iiko combo`),
      link: true,
      route: `/home/settings/integrations/iiko`,
    },
    {
      title: t("create"),
    },
  ];

  const headerButtons = (
    <>
      <Button
        icon={CancelIcon}
        size="large"
        shape="outlined"
        color="red"
        borderColor="bordercolor"
        onClick={() => history.goBack()}
      >
        {t("cancel")}
      </Button>
      <Button icon={SaveIcon} size="large" type="submit" loading={saveLoading}>
        {t("save")}
      </Button>
    </>
  );
  useEffect(() => {
    getIikoMenu();
  }, []);

  if (loader) return <CustomSkeleton />;

  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{ minHeight: "100vh" }}
        className="flex flex-col justify-between"
      >
        <div>
          <Header
            startAdornment={[<Breadcrumb routes={routes} />]}
            endAdornment={headerButtons}
          />

          <div className="m-4">
            <div className="grid grid-cols-2 gap-5">
              <Card title={t("general.information")}>
                <div className="grid grid-cols-4 gap-4 mb-4 items-baseline">
                  <div className="col-span-2">
                    <Form.Item formik={formik} name="product_id">
                      <div className="input-label">
                        <span style={{ color: "red" }}>*</span> {t("products")}
                      </div>
                      <AsyncPaginate
                        value={values.product_id}
                        loadOptions={loadOptions}
                        additional={{ page: 1 }}
                        styles={customStyles({ height: "40px" })}
                        onChange={(val) => {
                          setFieldValue("product_id", val);
                        }}
                        placeholder=""
                      />
                    </Form.Item>
                  </div>

                  <div className="col-span-2">
                    <Form.Item formik={formik} name="key">
                      <div className="input-label">
                        <span style={{ color: "red" }}>*</span> {t("Iiko")}
                      </div>
                      <Select
                        height={40}
                        name="iiko_id"
                        isSearchable
                        options={iikoMenus}
                        value={values.iiko_id}
                        onChange={(val) => setFieldValue("iiko_id", val)}
                        maxMenuHeight={200}
                      />
                    </Form.Item>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
        <div className="flex justify-end items-center w-full bg-white p-4 gap-5">
          {headerButtons}
        </div>
      </div>
    </form>
  );
}
