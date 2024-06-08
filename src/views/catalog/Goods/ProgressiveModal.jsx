import Button from "components/Button/Buttonv2";
import { useTranslation } from "react-i18next";
import { cloneDeep } from "lodash";
import Modal from "components/ModalV2";

// const useStyles = makeStyles((theme) => ({
//   modal: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   "modal-component": {
//     backgroundColor: "#fff",
//     outline: " none",
//     overflow: " hidden",
//   },
//   "modal-title": {
//     fontFamily: "Inter",
//     fontWeight: "600",
//     fontSize: "18px",
//     lineHeight: "24px",
//     color: "#252c32",
//     letterSpacing: "0em",
//     textAlign: "left",
//     width: "80%",
//   },
// }));

var cycledOnce;

export default function ProgressiveModal({
  open = false,
  onConfirm = () => {},
  onClose = () => {},
  page = 1,
  setPage = () => {},
  formik = {},
  parentProductName,
  loading = false,
  title = "",
  className = "",
  style,
  children,
  disable = false,
  addProgressiveModal,
  ...props
}) {
  const { t } = useTranslation();

  const onNext = () => {
    var nextPage = page + 1;

    if (!cycledOnce) {
      var formData = cloneDeep(formik.values.combinations[page]);
      formData.code = "";
      formData.name = formik.values.combinations[page + 1].name;
      formData.product_property =
        formik.values.combinations[page + 1].product_property;
      formik.setFieldValue(`combinations.${nextPage}`, formData);
    }

    if (!cycledOnce && nextPage === formik.values.combinations.length - 1)
      cycledOnce = true;

    setPage((prev) => prev + 1);
  };

  const onPrevious = () => {
    setPage((prev) => prev - 1);
  };

  const forwardHandler = () => {
    page === formik.values.combinations.length - 1
      ? (function () {
          cycledOnce = undefined;
          onConfirm();
        })()
      : onNext();
  };

  const backwardHandler = () => {
    page === 0 ? onClose() : onPrevious();
  };

  return (
    <Modal open={open} title={title} onClose={onClose} {...props}>
      <div className="modal-component rounded-md relative">
        <span className="absolute right-0 px-4 py-2">{`${page + 1}/${
          formik.values.combinations.length
        }`}</span>
        <div
          className={`bg-white ${className} p-8`}
          style={{ ...style, width: 500 }}
        >
          {title !== null && (
            <div className="flex flex-col justify-center mb-6">
              <p className="modal-title whitespace-nowrap">{title} :</p>
              <p>{`${parentProductName?.ru} ${formik?.values?.combinations[page]?.name}`}</p>
            </div>
          )}
          {children}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outlined"
          size="large"
          color="primary"
          onClick={backwardHandler}
        >
          {page !== 0 ? t("back") : t("cancel")}
        </Button>
        <Button
        variant="contained"
          size="large"
          color="primary"
          onClick={forwardHandler}
          disabled={disable || loading}
        >
          {page !== formik.values.combinations.length - 1
            ? t("next")
            : t("save")}
        </Button>
      </div>
    </Modal>
  );
}
