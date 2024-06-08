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
import { updateCrmIds, updateGood } from "services/v2";
import { getGoods, getJowiMenus } from "services/v2";
import { getOnePayme } from "services/promotion";
import CustomSkeleton from "components/Skeleton";
import Async from "components/Select/Async";

export default function JowiAddProduct() {
  const { t } = useTranslation();
  const history = useHistory();
  const params = useParams();
  const [saveLoading, setSaveLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [loader, setLoader] = useState(true);
  const [jowiMenu, setJowiMenu] = useState();

  const initialValues = useMemo(
    () => ({
      crm_type: "jowi",
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
    // const data = {
    //   active: values.product.active,
    //   count: values.product.count,
    //   id: values.product.id,
    //   in_price: values.product.in_price,
    //   out_price: values.product.out_price,
    //   is_divisible: values.product.is_divisible,
    //   title: values.product.title,
    //   brand: values.product.brand.id,
    //   tags: values.product?.tags?.map((tag) => tag.id),
    //   categories: values.product?.categories?.map((cat) => cat.id),
    //   measurement_id: values.product.measurement.id,
    //   order: values.product.order,
    //   iiko_id: values.product.iiko_id,
    //   iiko_group_id: values?.product?.iiko_group_id,
    //   currency: "UZS",
    //   code: values.product.code,
    //   // favourites: values.product?.favorites((el) => el.id),
    //   type: values.product.type,
    //   parent_id: values.product.parent_id,
    //   description: values.product.product?.description,
    //   // image: "",
    //   jowi_id: values.menu.value,
    // };
    values.ids.splice(-1);
    setSaveLoading(true);
    // const selectedAction = params.id
    //   ? updateGood(values, params.id)
    //   : updateGood(data.id, data);
    // selectedAction
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

  const fetchData = () => {
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
  };

  const getItems = (page) => {
    getGoods({ limit: 10, page }).then((res) => {
      setItems(res?.products);
    });
    getJowiMenus({ limit: 10, page: 1 })
      .then((res) => {
        setJowiMenu(res?.products);
      })
      .catch((error) => console.log(error));
  };
  const products = items?.map((elm) => ({
    label: elm?.name,
    value: elm?.id,
  }));
  const menu = jowiMenu?.map((elm) => ({
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
      getJowiMenus({ limit: 20, search: input })
        .then((res) => {
          var products = res?.products?.map((elm) => ({
            label: `${elm?.name} (${elm?.price}uzs)`,
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
      title: t(`Jowi`),
      link: true,
      route: `/home/settings/integrations/jowi`,
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
                {t("Пожалуйста, выберите Jowi Menu")}
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
                      options={products}
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
                      options={menu}
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
