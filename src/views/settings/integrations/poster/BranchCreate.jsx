import { useMemo, useState, useCallback, useEffect } from "react";
import Card from "components/Card";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import Form from "components/Form/Index";
import { useFormik } from "formik";
import Header from "components/Header";
import Button from "components/Button";
import { customStyles } from "components/Select";
import Breadcrumb from "components/Breadcrumb";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import { getBranches, getCrmBranches } from "services";
import CustomSkeleton from "components/Skeleton";
import * as yup from "yup";
import AsyncSelect from "components/Select/Async";
import { useSelector } from "react-redux";
import {
  getPosterBranchByID,
  postPosterBranches,
  putPosterBranch,
} from "services/v2/poster";

const BranchCreate = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const shipper_id = useSelector((state) => state.auth.shipper_id);
  const params = useParams();
  const [saveLoading, setSaveLoading] = useState(false);
  const [loader, setLoader] = useState(false);

  const initialValues = useMemo(
    () => ({
      branch_id: "",
      crm_branch_data: "",
    }),
    [],
  );

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"));
    return yup.object().shape({
      branch_id: defaultSchema,
      crm_branch_data: defaultSchema,
    });
  }, [t]);

  const onSubmit = (values) => {
    const data = {
      branch_id: values.branch_id.value,
      crm_branch_data: {
        spot_id: values.crm_branch_data.value,
        spot_name: values.crm_branch_data.label,
      },
      crm_type: "poster",
    };
    params.id
      ? putPosterBranch(data)
          .then((res) => {
            history.goBack();
          })
          .finally(() => {
            setSaveLoading(false);
          })
      : postPosterBranches(data)
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

  const { values, setFieldValue, handleSubmit, setValues } = formik;

  useEffect(() => {
    if (params.id) {
      getPosterBranchByID(params.id).then((res) => {
        setValues({
          branch_id: {
            label: res.branch_name,
            value: res.branch_id,
          },
          crm_branch_data: {
            label: res.crm_branch_data.spot_name,
            value: res.crm_branch_data.spot_id,
          },
        });
        console.log(res);
      });
    }
  }, [params.id, setValues]);

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
      <Button
        icon={SaveIcon}
        size="large"
        type="submit"
        onSubmit={handleSubmit}
        loading={saveLoading}
      >
        {t("save")}
      </Button>
    </>
  );

  const loadBranches = useCallback((input, cb) => {
    getBranches({ page: 1, limit: 100, search: input })
      .then((response) => {
        let branches = response?.branches?.map((branch) => ({
          label: branch.name,
          value: branch.id,
        }));
        cb(branches);
      })
      .catch((error) => console.log(error));
  }, []);

  const loadPosterBranches = useCallback((input, cb) => {
    getCrmBranches(shipper_id, {
      limit: 100,
      page: 1,
      search: input,
      type: "poster",
    })
      .then((response) => {
        let branches = response?.branches?.map((branch) => ({
          label: branch.name,
          value: branch.id,
        }));
        cb(branches);
      })
      .catch((error) => console.log(error));
  }, []);

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
                <div className="grid grid-cols-2 gap-5 items-baseline">
                  <div className="col-span-1">
                    <Form.Item formik={formik} name="branch_id">
                      <div className="input-label">
                        <span style={{ color: "red" }}>*</span> {t("branches")}
                      </div>
                      <AsyncSelect
                        defaultOptions
                        cacheOptions
                        isSearchable
                        isClearable
                        onChange={(val) => setFieldValue("branch_id", val)}
                        value={values.branch_id}
                        loadOptions={loadBranches}
                        placeholder={t("branches")}
                        styles={customStyles({
                          control: (base) => ({
                            ...base,
                            minHeight: "2rem",
                            height: "2rem",
                            border: "1px solid #E5E9EB",
                          }),
                          indicatorSeparator: (base) => ({
                            ...base,
                            height: "1rem",
                          }),
                        })}
                      />
                    </Form.Item>
                  </div>
                  <div className="col-span-1">
                    <Form.Item formik={formik} name="spot_id">
                      <div className="input-label">
                        <span style={{ color: "red" }}>*</span>{" "}
                        {`Poster ${t("branches")}`}
                      </div>
                      <AsyncSelect
                        defaultOptions
                        cacheOptions
                        isSearchable
                        isClearable
                        onChange={(val) =>
                          setFieldValue("crm_branch_data", val)
                        }
                        value={values.crm_branch_data}
                        loadOptions={loadPosterBranches}
                        placeholder={`Poster ${t("branches")}`}
                        styles={customStyles({
                          control: (base) => ({
                            ...base,
                            minHeight: "2rem",
                            height: "2rem",
                            border: "1px solid #E5E9EB",
                          }),
                          indicatorSeparator: (base) => ({
                            ...base,
                            height: "1rem",
                          }),
                        })}
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
};

export default BranchCreate;
