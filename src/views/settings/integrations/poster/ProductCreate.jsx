import { useMemo, useState, useEffect, useCallback } from "react";
import Card from "components/Card";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import Form from "components/Form/Index";
import * as yup from "yup";
import { useFormik } from "formik";
import Header from "components/Header";
import Button from "components/Button";
import Breadcrumb from "components/Breadcrumb";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import { getBranchesCount } from "services";
import { updateCrmIds } from "services/v2";
import { getGoods } from "services/v2";
import { getOnePayme } from "services/promotion";
import CustomSkeleton from "components/Skeleton";
import Async from "components/Select/Async";
import { getPosterMenu } from "services/v2/poster";

export default function ProductCreate() {
  const { t } = useTranslation();
  const history = useHistory();
  const params = useParams();
  const [saveLoading, setSaveLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [loader, setLoader] = useState(true);
  const [posterMenu, setPosterMenu] = useState();

  const initialValues = useMemo(
    () => ({
      crm_type: "poster",
      ids: [
        {
          crm_product_id: "",
          product_id: "",
        },
      ],
    }),
    [],
  );

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"));
    return yup.object().shape({
      crm_type: defaultSchema,
      ids: defaultSchema,
    });
  }, [t]);

  const onSubmit = (values) => {
    values.ids.splice(-1);
    setSaveLoading(true);
    updateCrmIds(values)
      .then((res) => {
        history.goBack();
      })
      .finally(() => {
        setSaveLoading(false);
      });
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const { values, setFieldValue, setValues, handleSubmit } = formik;

  const fetchData = useCallback(() => {
    if (params.id) {
      setLoader(true);
      getOnePayme(params.id)
        .then((res) => {
          formik.setValues({
            login: res?.login,
            key: res?.key,
            branch_id: res?.branch_id,
          });
        })
        .finally(() => setLoader(false));
    } else {
      setLoader(false);
    }
  }, [formik, params.id]);

  useEffect(() => {
    getItems();
    fetchData();
  }, []);

  useEffect(() => {
    if (params.branch_id) {
      getBranchesCount.then((res) => {
        setValues({
          login: res?.login,
          key: res?.key,
          branch_id: res?.branch_id,
        });
      });
    }
  }, [params.branch_id, setValues]);

  const getItems = (page) => {
    getGoods({ limit: 10, page }).then((res) => {
      setItems(res?.products);
    });
    getPosterMenu({ limit: 10, page: 1, type: "poster" })
      .then((res) => {
        setPosterMenu(res?.products);
      })
      .catch((error) => console.log(error));
  };

  const products = items?.map((elm) => ({
    label: elm?.name,
    value: elm?.id,
  }));
  const menu = posterMenu?.map((elm) => ({
    label: elm?.name,
    value: elm?.id,
  }));

  const loadBranch = useCallback(
    (input, cb) => {
      getGoods({ limit: 10, search: input })
        .then((res) => {
          var products = res?.products?.map((elm) => ({
            ...elm,
            label: `${elm?.title?.ru} (${elm?.out_price}uzs)`,
            value: elm?.id,
          }));
          products = products.filter((elm) => elm.value !== params.id);
          cb(products);
        })
        .catch((err) => console.log(err));
    },
    [params.id],
  );
  const loadMenu = useCallback(
    (input, cb) => {
      getPosterMenu({ limit: 20, search: input, type: "poster" })
        .then((res) => {
          var products = res?.products?.map((elm) => ({
            label: (
              <div>
                <div> {`${elm?.name} (${elm?.price}uzs)`}</div>
                {elm?.type === "modifier" && (
                  <p style={{ color: "#F5FA61" }}>Модификатор</p>
                )}
              </div>
            ),
            value: elm?.id,
            price: elm?.price,
          }));
          products = products.filter((elm) => elm.value !== params.id);
          cb(products);
        })
        .catch((err) => console.log(err));
    },
    [params.id],
  );

  const routes = [
    {
      title: t(`Poster`),
      link: true,
      route: `/home/settings/integrations/poster`,
    },
    {
      title: t("create"),
    },
  ];

  const headerButtons = (
    <>
      {" "}
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

  if (loader) return <CustomSkeleton />;

  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{ minHeight: "100vh" }}
        className="flex flex-col justify-between "
      >
        <div>
          <Header startAdornment={[<Breadcrumb routes={routes} />]} />
          <Card title={t("general.information")} className="m-4">
            <div className="grid grid-cols-2 gap-4 items-baseline">
              <div className="input-label">
                <span style={{ color: "red" }}>*</span>{" "}
                {t("Пожалуйста, выберите продукт")}
              </div>

              <div className="input-label">
                <span style={{ color: "red" }}>*</span>{" "}
                {t("Пожалуйста, выберите Poster Menu")}
              </div>
            </div>
            {values?.ids.map((id, i) => (
              <div
                className="grid grid-cols-4 gap-4 items-baseline mb-4"
                key={i}
              >
                <div className="col-span-2">
                  <Form.Item formik={formik} name="product">
                    <Async
                      isSearchable
                      isClearable
                      cacheOptions
                      height={40}
                      name="product"
                      loadOptions={loadBranch}
                      defaultOptions={true}
                      value={values.product}
                      onChange={(val) => {
                        setFieldValue(`ids[${i}].product_id`, val.value);
                        if (
                          i === values.ids.length - 1 &&
                          values?.ids[i]?.crm_product_id
                        ) {
                          setFieldValue(`ids[${i + 1}]`, {
                            product_id: null,
                          });
                        }
                      }}
                    />
                  </Form.Item>
                </div>

                <div className="col-span-2">
                  <Form.Item formik={formik} name="menu">
                    <Async
                      isSearchable
                      isClearable
                      cacheOptions
                      height={40}
                      loadOptions={loadMenu}
                      defaultOptions={true}
                      value={values.menu}
                      onChange={(val) => {
                        setFieldValue(`ids[${i}].crm_product_id`, val.value);
                        if (
                          i === values.ids.length - 1 &&
                          values?.ids[i]?.product_id
                        ) {
                          setFieldValue(`ids[${i + 1}]`, {
                            crm_product_id: null,
                          });
                        }
                      }}
                    />
                  </Form.Item>
                </div>
              </div>
            ))}
          </Card>
        </div>
        <div className="flex justify-end items-center w-full bg-white p-4 gap-5">
          {headerButtons}
        </div>
      </div>
    </form>
  );
}
