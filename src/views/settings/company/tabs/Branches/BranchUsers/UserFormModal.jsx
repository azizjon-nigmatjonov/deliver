import { useCallback, useEffect, useMemo } from "react";
import { Input } from "alisa-ui";
import Form from "components/Form/Index";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import AsyncSelect from "components/Select/Async";
import {
  getUserRoles,
  postBranchUser,
  updateBranchUser,
  useBranchUserById,
} from "services";
import ReactInputMask from "react-input-mask";
import Modal from "components/ModalV2";
import Button from "components/Button/Buttonv2";
import { useParams } from "react-router-dom/cjs/react-router-dom";

export default function UserFormModal({ open, onClose, onConfirm, userId }) {
  const { t } = useTranslation();
  const { id } = useParams();

  const initialValues = useMemo(
    () => ({
      name: "",
      phone: "",
      user_role_id: "",
    }),
    [],
  );

  const onSubmit = (values) => {
    const data = {
      ...values,
      user_role_id: values?.user_role_id?.value,
      branch_id: id,
    };

    if (userId)
      return updateBranchUser(userId, data).then(() => {
        onConfirm();
        onClose();
      });
    postBranchUser(data).then(() => {
      onConfirm();
      onClose();
    });
  };

  const formik = useFormik({ onSubmit, initialValues });

  const {
    values,
    handleSubmit,
    setFieldValue,
    handleChange,
    resetForm,
    setValues,
  } = formik;

  useEffect(() => {
    if (!userId && open) resetForm();
  }, [userId, open, resetForm]);

  useBranchUserById({
    id: userId,
    props: {
      enabled: Boolean(userId && open),
      onSuccess: (data) =>
        setValues({
          ...data,
          user_role_id: {
            label: data?.user_role_id,
            value: data?.user_role_id,
          },
        }),
    },
  });

  const loadUserRoles = useCallback((inputValue, callback) => {
    getUserRoles({ search: inputValue, page: 1, limit: 10 }).then((res) => {
      let user_roles = res?.user_roles?.map((user_role) => ({
        label: user_role.name,
        value: user_role.id,
      }));

      callback(user_roles);
    });
  }, []);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t(userId ? "edit" : "add.user")}
      contentsx={{
        overflowY: "visible",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
      fullWidth
    >
      <Form.Item formik={formik} name="branch_name" label={t("first.name")}>
        <Input
          className="w-full"
          id="name"
          value={values.name}
          placeholder={t("first.name")}
          onChange={handleChange}
        />
      </Form.Item>
      <Form.Item formik={formik} name="phone" label={t("phone.number")}>
        <ReactInputMask
          id="phone"
          value={values.phone}
          mask="+\9\98999999999"
          disabled={false}
          placeholder={t("phone.number")}
          onChange={handleChange}
          maskChar={null}
        >
          {(inputProps) => <Input {...inputProps} onChange={handleChange} />}
        </ReactInputMask>
      </Form.Item>
      <Form.Item formik={formik} name="user_role_id" label={t("role")}>
        <AsyncSelect
          value={values.user_role_id}
          onChange={(val) => setFieldValue("user_role_id", val)}
          cacheOptions
          isSearchable
          isClearable
          defaultOptions
          loadOptions={loadUserRoles}
          placeholder={t("role")}
        />
      </Form.Item>
      <Button
        size="large"
        variant="contained"
        sx={{ mt: 2 }}
        onClick={handleSubmit}
        disabled={!values.phone || !values.name || !values.user_role_id}
      >
        {t("save")}
      </Button>
    </Modal>
  );
}
