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
import { getBranchesCount } from "../../../../services";
import CustomSkeleton from "components/Skeleton";
import { useDispatch } from "react-redux";
import { showAlert } from "redux/actions/alertActions";
import {
  getApelsinInfoBranchID,
  postApelsinInfo,
  updateApelsinInfo,
} from "services/apelsin";
import AsyncSelect from "components/Select/Async";
import { useCallback } from "react";

export default function ApelsinCreate() {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const params = useParams();
  const [saveLoading, setSaveLoading] = useState(false);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (params.branch_id) {
      getBranchesCount.then((res) => {
        setValues({
          branch_id: res?.branch_id,
          cash_id: res?.cash_id,
          service_id: res?.service_id,
        });
      });
    }
  }, []);

  const fetchData = () => {
    if (params.id) {
      setLoader(true);
      getApelsinInfoBranchID(params.id)
        .then((res) => {
          formik.setValues({
            branch_id: {
              label: res?.branch_name,
              value: res?.branch_id,
            },
            cash_id: res?.cash_id,
            service_id: res?.service_id,
          });
        })
        .finally(() => setLoader(false));
    } else {
      setLoader(false);
    }
  };

  const loadBranches = useCallback((input, cb) => {
    getBranchesCount({ limit: 10, page: 1, search: input })
      .then((res) => {
        let branches = res?.branches.map((branch) => ({
          label: branch.name,
          value: branch.id,
        }));
        cb(branches);
      })
      .catch((error) => console.log(error));
  }, []);

  const initialValues = useMemo(
    () => ({
      service_id: null,
      branch_id: null,
      cash_id: null,
    }),
    [],
  );

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"));
    return yup.object().shape({
      service_id: defaultSchema,
      branch_id: defaultSchema,
      cash_id: defaultSchema,
    });
  }, []);

  const onSubmit = (values) => {
    const data = {
      service_id: values.service_id,
      cash_id: values.cash_id,
      branch_id: values.branch_id.value,
    };

    setSaveLoading(true);
    const selectedAction = params.id
      ? updateApelsinInfo(params.id, data)
      : postApelsinInfo(data);
    selectedAction
      .then((res) => {
        history.goBack();
      })
      .catch(
        (error) =>
          error.status === 409 &&
          dispatch(showAlert(t("already.exist"), "warning")),
      )
      .finally(() => {
        setSaveLoading(false);
      });
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const { values, handleChange, setValues, handleSubmit, setFieldValue } =
    formik;

  const routes = [
    {
      title: 'Apelsin',
      link: true,
      route: `/home/settings/integrations/apelsin`,
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

  if (loader) return <CustomSkeleton />;

  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{ minHeight: "100vh" }}
        className="flex flex-col justify-between"
      >
        <div>
          <Header startAdornment={[<Breadcrumb routes={routes} />]} />

          <div className="m-4">
            <div className="grid grid-cols-2 gap-5">
              <Card title={t("general.information")}>
                <div className="grid grid-cols-4 gap-5 items-baseline">
                  <div className="col-span-2 ">
                    <Form.Item formik={formik} name="branch_id">
                      <div className="input-label">
                        <span style={{ color: "red" }}>*</span> {t("branches")}
                      </div>
                      <div className="select_icon_hide">
                        {/* <AsyncSelect
                          id="branch_id"
                          value={values.branch_id}
                          placeholder={t("branches")}
                          onChange={(val) => {
                            setFieldValue("branch_id", val);
                          }}
                          loadOptions={loadBranches}
                          defaultOptions
                          cacheOptions
                          isSearchable
                        /> */}

                        <AsyncSelect
                          id="branch_id"
                          defaultOptions
                          cacheOptions
                          isSearchable
                          isClearable
                          value={values.branch_id}
                          loadOptions={loadBranches}
                          placeholder={t("branches")}
                          onChange={(val) => setFieldValue("branch_id", val)}
                        />
                      </div>
                    </Form.Item>
                  </div>

                  <div className="col-span-2">
                    <Form.Item formik={formik} name="cash_id">
                      <div className="input-label">
                        <span style={{ color: "red" }}>*</span> {t("id.cash")}
                      </div>
                      <Input
                        size="large"
                        value={values.cash_id}
                        onChange={handleChange}
                        name="cash_id"
                        placeholder={t("id.cash")}
                      />
                    </Form.Item>
                  </div>

                  <div className="col-span-2">
                    <Form.Item formik={formik} name="service_id">
                      <div className="input-label">
                        <span style={{ color: "red" }}>*</span>
                        {t("id.service")}
                      </div>
                      <Input
                        size="large"
                        value={values.service_id}
                        onChange={handleChange}
                        name="service_id"
                        placeholder={t("id.service")}
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
