import { useMemo, useState } from "react";
import { v4 as uuidV4 } from "uuid";
import moment from "moment";
import { useFormik } from "formik";
import { Grid, IconButton } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ArrowBack } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import discountService, { useDiscountById } from "services/v2/discounts";
import { useBranchList, useCustomersByPhone } from "services";
import { useNonOriginModifierProducts } from "services/v2";
import { convertSecondsToTime } from "utils/formatTimer";
import { showAlert } from "redux/actions/alertActions";
import Header from "components/Header";
import Button from "components/Button";
import CustomSkeleton from "components/Skeleton";
import SelectBox from "./sections/SelectBox";
import Settings from "./sections/Settings";

export default function DiscountsFormPage() {
  const { t } = useTranslation();
  const history = useHistory();
  const { id } = useParams();
  const { shipper_id } = useSelector((state) => state.auth);

  const [amountForOrder, setAmountForOrder] = useState([
    {
      amount: 0,
      from_price: 1,
      uuid: uuidV4(),
    },
  ]);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [branches, setBranches] = useState([]);
  const [searchBranch, setSearchBranch] = useState("");
  const [products, setProducts] = useState([]);
  const [searchProduct, setSearchProduct] = useState("");
  const [client, setClient] = useState("");
  const [searchClient, setSearchClient] = useState("");

  const { data: branchesData } = useBranchList({
    shipper_id,
    params: { page: 1, limit: 50, search: searchBranch },
    props: { enabled: true },
  });

  const { data: productData } = useNonOriginModifierProducts({
    params: { page: 1, limit: 50, search: searchProduct },
    props: { enabled: true },
  });

  const { data: clientsData } = useCustomersByPhone({
    params: { page: 1, limit: 50, phone: searchClient },
    props: { enabled: true },
  });

  const initialValues = useMemo(
    () => ({
      amount: 0,
      amount_for_order: [
        {
          amount: 0,
          from_price: 1,
        },
      ],
      branch_ids: [],
      can_add_by_hand: true,
      client_order_count: 0,
      customer_id: "",
      discount_for: "product",
      for_all_branches: true,
      for_only_birthday: false,
      from_date: moment().format("YYYY-MM-DD"),
      from_time: "00:01",
      is_active: true,
      is_amount_for_order: false,
      is_automatic_adding: "false",
      is_disposable: false,
      mode: {
        label: t("fixed"),
        value: "fixed",
      },
      name: {
        en: "",
        ru: "",
        uz: "",
      },
      order_source: [],
      order_type: {
        delivery: true,
        self_pickup: true,
      },
      payment_type: [],
      priority: 0,
      product_count: "",
      product_id: "",
      product_ids: [],
      promo_code: "",
      shipper_id: shipper_id,
      status: true,
      to_date: moment().add(1, "M").format("YYYY-MM-DD"),
      to_time: "23:59",
      type: "discount",
      uses_count: 1000,
      with_delivery_price: false,
    }),
    [shipper_id, t],
  );

  const dispatch = useDispatch();
  const languages = ["en", "ru", "uz"];
  // Object to store error messages for each field
  const fieldErrorMessages = {
    name: t("enter_name"),
    order_source: t("select_source"),
    payment_type: t("select_payment_type"),
    branch_ids: t("select.branch"),
    product_ids: t("select.product"),
  };
  // Main validation function
  const validateForm = (values) => {
    for (const field in fieldErrorMessages) {
      if (Array.isArray(values[field]) && !values[field]?.length) {
        if (
          !(field === "product_ids" && values.discount_for !== "product") &&
          !(field === "payment_type" && values.discount_for === "product") &&
          !(field === "branch_ids" && values.for_all_branches)
        ) {
          dispatch(showAlert(fieldErrorMessages[field], "error"));
          return false;
        }
      } else if (
        typeof values[field] === "object" &&
        !Array.isArray(values[field])
      ) {
        const names = languages.map((lang) => values[field][lang]);
        const isValidNames = names.every((link) => !!link);
        if (!isValidNames) {
          dispatch(showAlert(fieldErrorMessages[field], "error"));
          return false;
        }
      } else if (!values[field]) {
        dispatch(showAlert(fieldErrorMessages[field], "error"));
        return false;
      }
    }
    return true;
  };

  const onSubmit = (values) => {
    const data = {
      ...values,
      amount_for_order:
        values.is_amount_for_order &&
        values.discount_for.value !== "product" &&
        amountForOrder?.length > 0
          ? amountForOrder?.map((item) => ({
              from_price: +item.from_price,
              amount: +item.amount,
            }))
          : [],
      branch_ids: branches.map((item) => item.id),
      customer_id: client,
      can_add_by_hand: values.can_add_by_hand,
      discount_for: values.discount_for.value,
      is_amount_for_order: values.is_amount_for_order,
      is_automatic_adding: values.is_automatic_adding === "true",
      mode: values.mode.value,
      order_source: values.order_source?.map((item) => item.value),
      payment_type: values.payment_type?.map((item) => item.value),
      product_id: values.product_id?.value || "",
      product_ids: products?.map((item) => item.id),
    };

    if (!validateForm(data)) return;
    setBtnDisabled(true);
    if (id) return update(data);
    create(data);
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
  });

  const { values, setValues, setFieldValue, handleSubmit } = formik;

  const { isFetching } = useDiscountById({
    shipper_id,
    id,
    props: {
      enabled: id ? true : false,
      onSuccess: (res) => {
        setValues({
          amount: res.amount,
          amount_for_order: res.amount_for_order,
          branch_ids: res.branch_ids,
          can_add_by_hand: res.is_automatic_adding !== "true",
          client_order_count: res.client_order_count,
          discount_for: {
            label: t(res.discount_for),
            value: res.discount_for,
          },
          for_all_branches: res.for_all_branches,
          for_only_birthday: res.for_only_birthday,
          from_date: moment(res.from_date).format("YYYY-MM-DD"),
          from_time: convertSecondsToTime(res.from_time),
          is_active: res.is_active,
          is_amount_for_order: res.is_amount_for_order,
          is_disposable: res.is_disposable,
          is_automatic_adding: String(res.is_automatic_adding),
          mode: {
            label: t(res.mode),
            value: res.mode,
          },
          name: res.name,
          order_source: res.order_source?.map((item) => ({
            label: t(item),
            value: item,
          })),
          order_type: res.order_type,
          payment_type: res.payment_type?.map((item) => ({
            label: t(item),
            value: item,
          })),
          priority: res.priority,
          product_count: res?.product_count || "",
          product_id:
            { label: res?.product_name, value: res?.product_id } || "",
          product_ids: res.product_ids,
          promo_code: res.promo_code,
          status: res.status,
          to_date: moment(res.to_date).format("YYYY-MM-DD"),
          to_time: convertSecondsToTime(res.to_time),
          type: res.type,
          uses_count: res.uses_count,
          with_delivery_price: res.with_delivery_price,
        });
        setBranches(res.branches);
        setProducts(res.products);
        setClient(res.customer_id);
        res.amount_for_order && res.amount_for_order.length > 0
          ? setAmountForOrder(
              res.amount_for_order?.map((item) => ({
                ...item,
                uuid: uuidV4(),
              })),
            )
          : setAmountForOrder([
              {
                amount: res.amount,
                from_price: 1,
                uuid: uuidV4(),
              },
            ]);
      },
    },
  });

  const update = (data) => {
    discountService
      .update(id, data)
      .then(() => {
        dispatch(showAlert(t("succesfully sended"), "success"));
        history.push("/home/settings/discounts");
      })
      .finally(() => setBtnDisabled(false));
  };

  const create = (data) => {
    discountService
      .create(data)
      .then(() => {
        dispatch(showAlert(t("succesfully sended"), "success"));
        history.push("/home/settings/discounts");
      })
      .finally(() => setBtnDisabled(false));
  };

  if (isFetching) {
    return <CustomSkeleton />;
  }
  return (
    <>
      <Header
        startAdornment={
          <div
            className="flex items-center gap-3 font-semibold text-xl"
            style={{ marginRight: 20 }}
          >
            <IconButton
              onClick={() => history.push("/home/settings/discounts")}
            >
              <ArrowBack />
            </IconButton>
            <p>{t("add_surcharge_or_discount")}</p>
          </div>
        }
      />
      <form onSubmit={handleSubmit}>
        <div
          style={{ minHeight: "100vh" }}
          className="flex flex-col justify-between"
        >
          <div className="p-4">
            <Grid container spacing={2}>
              <Grid item xs={7}>
                <Settings
                  formik={formik}
                  amountForOrder={amountForOrder}
                  setAmountForOrder={setAmountForOrder}
                />
              </Grid>
              <Grid item xs={5}>
                <SelectBox
                  state={branches}
                  set={setBranches}
                  searchFn={setSearchBranch}
                  title={t("branches")}
                  data={branchesData?.branches}
                  type="branches"
                  allValue={values.for_all_branches}
                  setAllValue={(val) => setFieldValue("for_all_branches", val)}
                />
                {values.discount_for?.value === "product" && (
                  <SelectBox
                    state={products}
                    set={setProducts}
                    searchFn={setSearchProduct}
                    title={t("products")}
                    data={productData?.products}
                    type="products"
                  />
                )}
                {values.type === "promo_code" && values.is_disposable && (
                  <SelectBox
                    state={client}
                    set={setClient}
                    searchFn={setSearchClient}
                    title={t("clients")}
                    data={clientsData?.customers}
                    type="clients"
                    radioGroup={true}
                  />
                )}
              </Grid>
            </Grid>
          </div>
          <div
            className="sticky bottom-0 flex justify-end items-center w-full bg-white px-4 py-2"
            style={{ zIndex: 10 }}
          >
            <Button size="large" type="submit" loading={btnDisabled}>
              {t("save")}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
