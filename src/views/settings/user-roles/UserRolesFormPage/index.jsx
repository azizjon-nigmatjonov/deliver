import { useMemo, useState, useEffect } from "react";
import Card from "components/Card";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";
import Header from "components/Header";
import Button from "components/Button";
import Breadcrumb from "components/Breadcrumb";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import {
  postUserRole,
  postUserRolesPermission,
  updateUserRole,
  usePermissionList,
  useUserRoleById,
  useUserRolesPermissionList,
} from "services";
import TransferList from "./TransferList";
import FullScreenLoader from "components/FullScreenLoader";
import InputV2 from "components/Input/Inputv2";
import Select from "components/Select";
import Form from "components/Form/Index";
import { Grid } from "@mui/material";

const userOptions = [
  {
    label: "Пользователь админ панели",
    value: "2a1efd4a-d527-4cc2-adfa-a7546021f0f6",
  },
  {
    label: "Пользователь филиала",
    value: "195899b2-bd4d-4c51-a09e-c66b9a6bd22a",
  },
];

const initialValues = {
  name: "",
  user_type_id: "",
  permission: [],
};

export default function UserRolesCreate() {
  const { t } = useTranslation();
  const history = useHistory();
  const params = useParams();
  const [saveLoading, setSaveLoading] = useState(false);
  const [left, setLeft] = useState([]);
  const [right, setRight] = useState([]);

  const { isFetching } = usePermissionList({
    params: { limit: 100, page: 1 },
    props: {
      enabled: true,
      onSuccess: (res) => {
        let actions = [];
        for (const permission of res?.permissions) {
          for (const element of permission.actions) {
            actions.push({
              action_name: `${permission?.name}/${element?.name}`,
              action_id: element?.id,
              action_key: element.key,
              permission_id: permission?.id,
              permission_key: permission?.key,
              user_type_id: permission.user_type_id,
            });
          }
        }
        setLeft(actions);
      },
    },
  });

  const { isFetching: userRoleFetching } = useUserRoleById({
    id: params.id,
    props: {
      enabled: params.id ? true : false,
      onSuccess: (res) => {
        const userType = userOptions?.find(
          (el) => el.value === res?.user_type_id,
        );
        setValues({
          name: res?.name,
          user_type_id: {
            label: userType?.label || res?.user_type_id,
            value: userType?.value || res?.user_type_id,
          },
        });
      },
    },
  });

  const { isFetching: smthFetching } = useUserRolesPermissionList({
    id: params.id,
    props: {
      enabled: params.id ? true : false,
      onSuccess: (res) => {
        let actions = [];
        for (const permission of res?.permissions) {
          for (const element of permission.actions) {
            actions.push({
              action_name: `${permission?.name}/${element?.name}`,
              action_id: element?.id,
              action_key: element.key,
              permission_id: permission?.id,
              permission_key: permission?.key,
              user_type_id: permission.user_type_id,
            });
          }
        }
        setRight(actions);
      },
    },
  });

  const computedRight = (arr) => {
    const right = {};
    arr.forEach((item) => {
      if (!right[item.permission_id]) {
        right[item.permission_id] = [];
      }
      right[item.permission_id].push(item.action_id);
    });
    return Object.keys(right).map((key) => {
      return {
        id: key,
        action_ids: right[key],
      };
    });
  };

  useEffect(() => {
    const result = left.filter(
      (item) =>
        !right.some((rightItem) => rightItem.action_id === item.action_id),
    );
    setLeft(result);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [right]);

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"));
    return yup.object().shape({
      name: defaultSchema,
      user_type_id: defaultSchema,
      permission: defaultSchema,
    });
  }, [t]);

  const onSubmit = (values) => {
    setSaveLoading(true);
    const data = {
      name: values.name,
      user_type_id: values.user_type_id.value,
    };

    if (params.id)
      return updateUserRole(params.id, data)
        .then(() => {
          postUserRolesPermission(params.id, {
            permissions: computedRight(right),
          });
          history.goBack();
        })
        .finally(() => setSaveLoading(false));
    postUserRole(data)
      .then((res) => {
        postUserRolesPermission(res?.id, {
          permissions: computedRight(right),
        });
        history.goBack();
      })
      .finally(() => setSaveLoading(false));
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
      title: t(`user-roles`),
      link: true,
      route: `/home/settings/user-roles`,
    },
    {
      title: t("add"),
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
        onClick={handleSubmit}
        disabled={saveLoading}
      >
        {t("add")}
      </Button>
    </>
  );

  if (isFetching || userRoleFetching || smthFetching)
    return <FullScreenLoader />;

  return (
    <div style={{ minHeight: "100vh" }} className="flex flex-col">
      <Header startAdornment={<Breadcrumb routes={routes} />} />
      <div className="p-4 flex-1">
        <Card>
          <Grid container spacing={2} justifyContent="space-between">
            <Grid item xs={5}>
              <Form.Item formik={formik} name="name" label={t("name")}>
                <InputV2
                  fullWidth
                  value={values.name}
                  onChange={handleChange}
                  name="name"
                />
              </Form.Item>
            </Grid>
            <Grid item xs={5}>
              <Form.Item
                formik={formik}
                name="user_type_id"
                label={t("Тип пользователя")}
              >
                <Select
                  options={userOptions}
                  value={values.user_type_id}
                  onChange={(e) => setFieldValue("user_type_id", e)}
                  name="user_type_id"
                />
              </Form.Item>
            </Grid>
          </Grid>
          <TransferList
            left={left}
            right={right}
            setLeft={setLeft}
            setRight={setRight}
            formik={formik}
          />
        </Card>
      </div>
      <div className=" sticky bottom-0 flex justify-end items-center w-full bg-white p-4 gap-5">
        {headerButtons}
      </div>
    </div>
  );
}
