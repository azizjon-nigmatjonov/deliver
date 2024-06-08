import Card from "components/Card";
import Form from "components/Form/Index";
import { Input } from "alisa-ui";
import AsyncSelect from "components/Select/Async";
import { useTranslation } from "react-i18next";
import numberToPrice from "helpers/numberToPrice";
import ClientCreateCard from "components/ClientCard/Create";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import FunctionsIcon from "@mui/icons-material/Functions";
import Gallery from "components/Gallery";
import { useParams } from "react-router-dom";
import { getOrdersWithAveragePrice } from "services";
import { useCallback, useEffect, useState } from "react";
import PhoneInput from "components/PhoneInput";
import customerService from "services/customer";

export default function Client({ formik }) {
  const { t } = useTranslation();
  const { values, handleChange, setFieldValue } = formik;
  const params = useParams();
  const [items, setItems] = useState({
    count: null,
    average_sum: null,
    total_sum: null,
  });

  const loadCustomerTypes = useCallback((inputValue, callback) => {
    customerService
      .getTypes({
        limit: 10,
        page: 1,
        search: inputValue,
      })
      .then((res) => {
        let customer_types = res?.customer_types?.map((elm) => ({
          label: elm.name,
          value: elm.id,
        }));
        callback(customer_types);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (params.id) {
      getOrdersWithAveragePrice(params.id).then((res) =>
        setItems({
          count: res?.count,
          average_sum: res?.average_sum,
          total_sum: res?.total_sum,
        }),
      );
    }
  }, [params.id]);

  return (
    <>
      {params.id && (
        <ClientCreateCard
          cards={[
            {
              icon: <FunctionsIcon fontSize="large" />,
              count: numberToPrice(items?.total_sum || 0, "сум"),
              title: t("all.sum.order"),
            },
            {
              icon: <AttachMoneyOutlinedIcon fontSize="large" />,
              count: numberToPrice(items?.average_sum || 0, "сум"),
              title: t("average.check"),
            },
            {
              icon: <ShoppingCartIcon fontSize="large" />,
              count: numberToPrice(items?.count || 0, ""),
              title: t("count.orders"),
            },
            {
              icon: <MoneyOffIcon fontSize="large" />,
              count: numberToPrice(23500, "сум"),
              title: t("LTV"),
            },
          ]}
        />
      )}

      <Card className="m-4 w-2/4">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-3">
            <Form.Item formik={formik} name="image">
              <div className="w-full h-full flex mt-6 items-center flex-col">
                <Gallery
                  rounded
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
            <Form.Item formik={formik} name="full_name" label={t("full_name")}>
              <Input
                size="large"
                id="name"
                value={values.name}
                onChange={handleChange}
              />
            </Form.Item>

            <Form.Item formik={formik} name="phone" label={t("phone.number")}>
              <PhoneInput value={values.phone} onChange={handleChange} />
            </Form.Item>

            <Form.Item
              formik={formik}
              name="customer_type_id"
              label={t("client.type")}
              required
            >
              <AsyncSelect
                id="customer_type_id"
                placeholder={t("select")}
                loadOptions={loadCustomerTypes}
                defaultOptions
                cacheOptions
                isSearchable
                value={values.customer_type_id}
                onChange={(val) => setFieldValue("customer_type_id", val)}
              />
            </Form.Item>
          </div>
        </div>
      </Card>
    </>
  );
}
