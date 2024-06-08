import { useTranslation } from "react-i18next";
import { Input } from "alisa-ui";
import Form from "components/Form/Index";
import TextArea from "components/Textarea";

export default function Uzbek({ formik }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-4">
      <div>
        <Form.Item formik={formik} name="menu_link" label={t("link_to_menu")}>
          <Input
            size="large"
            id="menu_link"
            {...formik.getFieldProps("menu_link.uz")}
          />
        </Form.Item>
      </div>
      <div>
        <Form.Item
          formik={formik}
          name="order_confirmation_text_delivery"
          label={t("order_confirmation_text_delivery")}
        >
          <Input
            size="large"
            id="order_confirmation_text_delivery"
            {...formik.getFieldProps("order_confirmation_text_delivery.uz")}
          />
        </Form.Item>
      </div>
      <div>
        <Form.Item
          formik={formik}
          name="order_confirmation_text_self_pickup"
          label={t("order_confirmation_text_self_pickup")}
        >
          <Input
            size="large"
            id="order_confirmation_text_self_pickup"
            {...formik.getFieldProps("order_confirmation_text_self_pickup.uz")}
          />
        </Form.Item>
      </div>
      <div>
        <Form.Item
          formik={formik}
          name="about_us"
          label={t("about_us")}
          required
        >
          <TextArea id="about_us.uz" {...formik.getFieldProps("about_us.uz")} />
        </Form.Item>
      </div>
    </div>
  );
}
