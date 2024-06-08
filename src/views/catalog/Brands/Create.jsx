import { useMemo, useState, useEffect } from "react";
import Card from "components/Card";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { Input } from "alisa-ui";
import Form from "components/Form/Index";
import * as yup from "yup";
import { useFormik } from "formik";
import Header from "components/Header";
import Button from "components/Button";
import Breadcrumb from "components/Breadcrumb";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import { getBrand, postBrand, updateBrand } from "services/v2";
import Gallery from "components/Gallery";
import SuperInput from "components/SuperInput";

export default function BrandsCreate() {
  const { t } = useTranslation();
  const history = useHistory();
  const params = useParams();

  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    if (params.id) {
      getBrand(params.id).then((res) => {
        setValues({
          image: res.image,
          title_ru: res.title.ru,
          order_no: res.order_no,
        });
      });
    }
  }, []);

  const initialValues = useMemo(
    () => ({
      image: null,
      title_ru: null,
      order_no: null,
    }),
    [],
  );

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"));
    return yup.object().shape({
      image: defaultSchema,
      title_ru: defaultSchema,
      order_no: defaultSchema,
    });
  }, []);

  const onSubmit = (values) => {
    const data = {
      image: values.image,
      order_no: values.order_no,
      title: {
        ru: values.title_ru,
        uz: values.title_ru,
        en: values.title_ru,
      },
    };

    setSaveLoading(true);
    const selectedAction = params.id
      ? updateBrand(params.id, data)
      : postBrand(data);
    selectedAction
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

  const { values, handleChange, setFieldValue, setValues, handleSubmit } =
    formik;

  const routes = [
    {
      title: t(`brands`),
      link: true,
      route: `/home/catalog/brands`,
    },
    {
      title: params.id ? t("edit") : t("create"),
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

  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{ minHeight: "100vh" }}
        className="flex flex-col justify-between"
      >
        <div>
          <Header startAdornment={<Breadcrumb routes={routes} />} />
          <div className="grid grid-cols-2">
            <Card title={t("general.information")} className="m-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <Form.Item formik={formik} name="image">
                    <div className="w-full h-full flex items-center flex-col">
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
                <div className="col-span-2">
                  <div className="w-full flex justify-between items-baseline">
                    <div className="w-1/4 input-label">{t("brand_name")}</div>
                    <div className="col-span-1">
                      <Form.Item formik={formik} name="title_ru">
                        <Input
                          size="large"
                          value={values.title_ru}
                          onChange={handleChange}
                          name="title_ru"
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div className="w-full flex justify-between items-baseline">
                    <div className="w-1/4 input-label">{t("order.number")}</div>
                    <div className="col-span-1">
                      <Form.Item formik={formik} name="order_no">
                        <SuperInput
                          isValidateNumber
                          value={values.order_no}
                          onChange={handleChange}
                          name="order_no"
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
        <div className="flex justify-end items-center w-full bg-white p-4 gap-5">
          {headerButtons}
        </div>
      </div>
    </form>
  );
}
