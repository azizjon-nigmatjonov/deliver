import { Component, useState, useEffect } from "react";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import Input from "../Input/index";
import RequiredStar from "../RequiredStar";

export default class CustomForm extends Component {
  static Input(props) {
    return <FormInput {...props} />;
  }

  static Item(props) {
    return <FormItem {...props} />;
  }

  static FieldArrayItem(props) {
    return <FieldArrayItem {...props} />;
  }

  render() {
    return <FromWrapper {...this.props} />;
  }
}

const FromWrapper = ({
  initialValues,
  onSubmit,
  layout = "vertical",
  children,
  rules,
}) => {
  const [formRules, setFormRules] = useState(null);

  useEffect(() => {
    let obj = {};
    for (let key in rules) {
      obj[key] = rules[key](Yup);
    }

    setFormRules(obj);
  }, [rules]);

  // const a = {

  //   firstName: Yup.string()
  //     .max(15, 'Must be 15 characters or less')
  //     .required('Required'),

  //   lastName: Yup.string()
  //     .max(20, 'Must be 20 characters or less')
  //     .required('Required'),
  //   email: Yup.string().email('Invalid email address').required('Required'),
  // }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={Yup.object(formRules ?? {})}
      onSubmit={onSubmit}
    >
      {(formik) => children(formik)}
      {/* {(formik) => (
        <form onSubmit={formik.handleSubmit}>{children(formik)}</form>
      )} */}
      {/* <Form>
        {children}
      </Form> */}
    </Formik>
  );
};

const FormInput = ({ type = "text", name = "", label = "", ...args }) => {
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <Input name={name} type={type} {...args} />
      <ErrorMessage name={name} />
    </div>
  );
};

const FormItem = ({
  name = "",
  label = "",
  children,
  formik,
  required,
  fromProgressiveModal = false,
  ...props
}) => {
  return (
    <div {...props}>
      {label && (
        <div className="flex gap-0.5">
          <label className="input-label mb-1" style={{ lineHeight: '24px' }} htmlFor={name}>
            {label}
          </label>
          {required && <RequiredStar />}
        </div>
      )}
      {children}
      {formik.errors[name] && formik.touched[name] && (
        <div
          className="min-h-6 w-full"
          style={{ fontSize: "12px", lineHeight: 1.5715, color: "#ff4d4f" }}
        >
          {formik.errors?.[name]}
        </div>
      )}
      {/* <div // TODO: if in forms there is problem with style due to no error container, look here
        className="min-h-6 w-full"
        style={{ fontSize: "12px", lineHeight: 1.5715, color: "#ff4d4f" }}
      >
        {formik.errors[name] && formik.touched[name] ?
          formik.errors?.[name]
          : <></>}
      </div> */}
    </div>
  );
};

const FieldArrayItem = ({
  name = "",
  label = "",
  children,
  formik,
  index,
  custom = "false",
  custom_error,
  ...args
}) => {
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      {children}
      <div
        className="w-full"
        style={{ fontSize: "14px", color: "#ff4d4f" }}
      >
        {custom
          ? custom_error
          : formik.errors[name] &&
            formik.errors[name][index] &&
            formik.touched[name] &&
            formik.touched[name][index]
            ? formik.errors[name][index]
            : ""}
      </div>
    </div>
  );
};
