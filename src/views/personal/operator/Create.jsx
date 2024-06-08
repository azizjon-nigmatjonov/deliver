import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import { Input } from "alisa-ui";
import Breadcrumb from "components/Breadcrumb";
import Button from "components/Button";
import Card from "components/Card";
import Form from "components/Form/Index";
import Header from "components/Header";
import PhoneInput from "components/PhoneInput";
import Select, { customStyles } from "components/Select";
import CustomSkeleton from "components/Skeleton";
import { useFormik } from "formik";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { getBranches, getUserRoles } from "services";
import { getOperator, postOperator, updateOperator } from "services/operator";
import { phoneValidation } from "utils/phoneValidator";
import * as yup from "yup";
import AsyncSelect from "components/Select/Async";

export default function OperatorCreate() {
  const { t } = useTranslation();
  const history = useHistory();
  const params = useParams();

  const [userRoles, setUserRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [userType, setUserType] = useState();
  const [branchlist, setBranchList] = useState([]);

  const initialValues = useMemo(
    () => ({
      name: "",
      password: "",
      phone: "",
      user_role_id: "",
      username: "",
      branch_id: "",
    }),
    [],
  );

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"));
    return yup.object().shape({
      name: defaultSchema,
      password: defaultSchema,
      phone: phoneValidation(),
      user_role_id: defaultSchema,
      username: defaultSchema,
      branch_id: branchlist?.length > 0 && defaultSchema,
    });
  }, [t, branchlist]);

  const onSubmit = (values) => {
    const data = {
      ...values,
      user_role_id: values.user_role_id.value,
      branch_id: values?.branch_id.value,
    };

    setSaveLoading(true);
    const selectedAction = params.id
      ? updateOperator(params.id, data)
      : postOperator(data);
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

  const routes = useMemo(() => {
    return [
      {
        title: t(`${params.id ? formik.values.username : "add"}`),
        link: true,
        route: `/home/catalog/tags`,
      },
      {
        title: params.id ? t("edit") : t("create"),
      },
    ];
  }, [t, params.id, formik.values.username]);

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
    var roles;

    getUserRoles({ limit: 200 })
      .then((res) => {
        roles = res?.user_roles;
        setUserRoles(
          res?.user_roles
            ? res?.user_roles.map((elm) => ({
                label: elm.name,
                value: elm.id,
                userType: elm.user_type_id,
              }))
            : [],
        );
      })
      .then(() => {
        if (params.id) {
          getOperator(params.id)
            .then((res) => {
              var role = roles.find((role) => role.id === res?.user_role_id);
              setUserType(role.user_type_id);
              setValues({
                name: res?.name,
                password: res?.password,
                phone: res?.phone,
                user_role_id: role ? { label: role.name, value: role.id } : "",
                username: res?.username,
                branch_id: {
                  label: res?.branch_name,
                  value: res?.branch_id,
                },
              });
            })
            .finally(() => {
              setIsLoading(false);
            });
        } else {
          setIsLoading(false);
        }
      });
  }, [params.id, setValues]);

  const loadBranches = useCallback((input, cb) => {
    getBranches({ page: 1, limit: 10, search: input })
      .then((response) => {
        let branches = response?.branches?.map((branch) => ({
          label: branch.name,
          value: branch.id,
        }));
        cb(branches);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (userType === "195899b2-bd4d-4c51-a09e-c66b9a6bd22a") {
      getBranches().then((res) =>
        setBranchList(
          res?.branches?.map((item) => ({ label: item.name, value: item.id })),
        ),
      );
    } else {
      setBranchList([]);
    }
  }, [userType]);

  return !isLoading ? (
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
                <div className="input-label">{t("full_name")}</div>
                <div className="mb-4">
                  <Form.Item formik={formik} name="name">
                    <Input
                      size="large"
                      value={values.name}
                      onChange={handleChange}
                      name="name"
                    />
                  </Form.Item>
                </div>

                <div className="input-label">{t("phone.number")}</div>
                <div className="mb-4">
                  <Form.Item formik={formik} name="phone">
                    <PhoneInput value={values.phone} onChange={handleChange} />
                  </Form.Item>
                </div>

                <div className="input-label">{t("login")}</div>
                <div className="mb-4">
                  <Form.Item formik={formik} name="username">
                    <Input
                      size="large"
                      value={values.username}
                      onChange={handleChange}
                      name="username"
                    />
                  </Form.Item>
                </div>

                {!params.id && (
                  <>
                    <div className="input-label">{t("password")}</div>
                    <div className="mb-4">
                      <Form.Item formik={formik} name="password">
                        <Input
                          size="large"
                          value={values.password}
                          onChange={handleChange}
                          name="password"
                        />
                      </Form.Item>
                    </div>
                  </>
                )}

                <div className="input-label">{t("position")}</div>
                <div className="mb-4">
                  <Form.Item formik={formik} name="user_role_id">
                    <Select
                      height={40}
                      options={userRoles}
                      value={values.user_role_id}
                      onChange={(val) => {
                        setFieldValue("user_role_id", val);
                        setUserType(val.userType);
                      }}
                      maxMenuHeight={200}
                    />
                  </Form.Item>
                </div>

                {userType === "195899b2-bd4d-4c51-a09e-c66b9a6bd22a" && (
                  <>
                    <div className="input-label">{t("branches")}</div>
                    <div className="mb-4">
                      <Form.Item formik={formik} name="branch_id">
                        <AsyncSelect
                          id="courier"
                          defaultOptions
                          cacheOptions
                          isSearchable
                          isClearable
                          onChange={(val) => {
                            setFieldValue("branch_id", val);
                          }}
                          value={values.branch_id}
                          loadOptions={loadBranches}
                          placeholder={t("branch")}
                          styles={customStyles({
                            control: (base, state) => ({
                              ...base,
                              minHeight: "2rem",
                              height: "2rem",
                              border: "1px solid #E5E9EB",
                            }),
                            indicatorSeparator: (base, state) => ({
                              ...base,
                              height: "1rem",
                            }),
                            showClearIcons: true,
                          })}
                        />
                      </Form.Item>
                    </div>
                  </>
                )}
              </Card>
            </div>
          </div>
        </div>
        <div className="flex justify-end items-center w-full bg-white p-4 gap-5">
          {headerButtons}
        </div>
      </div>
    </form>
  ) : (
    <CustomSkeleton />
  );
}
