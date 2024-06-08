import "./style.scss";
import Button from "components/Button";
import { useTranslation } from "react-i18next";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import CloseIcon from "@mui/icons-material/Close";
import { Dialog } from "@mui/material";

const CModal = ({
  open = false,
  close = "Нет",
  confirm,
  onClose,
  onConfirm,
  title,
  footer,
  loading,
  className = "",
  style,
  width = 420,
  children,
  disable = false,
  isWarning = true,
  header = <div></div>,
  closeIcon = false,
  modalOverflow = "hidden",
  ...props
}) => {
  const { t } = useTranslation();

  const buttons = [
    close.length > 2 && (
      <Button
        shape="outlined"
        key="cancel-btn"
        style={{ width: "100%" }}
        size="large"
        color="blue"
        borderColor="bordercolor"
        classNameParent="flex justify-end"
        onClick={onClose}
      >
        {close}
      </Button>
    ),
    <Button
      key="confirm-btn"
      style={{ width: "100%" }}
      size="large"
      color="blue"
      classNameParent="flex justify-end"
      onClick={onConfirm}
      loading={loading}
      disabled={disable}
    >
      {confirm || "Да"}
    </Button>,
  ];

  return (
    <Dialog open={open} onClose={onClose} {...props}>
      <div
        className="modal-component rounded-md"
        style={{ overflow: modalOverflow }}
      >
        <div>{header}</div>
        <div
          className={`bg-white ${className} p-8`}
          style={{ ...style, width }}
        >
          {title !== null && (
            <div className="flex items-center mb-6 justify-between">
              {isWarning && (
                <WarningRoundedIcon
                  fontSize="medium"
                  style={{ color: "#F76659" }}
                  className="mr-4"
                />
              )}
              <p className="modal-title whitespace-pre-wrap">
                {title || t("are.you.sure.want.to.delete")}
              </p>
              {closeIcon && (
                <div onClick={onClose} className="cursor-pointer">
                  <CloseIcon />
                </div>
              )}
            </div>
          )}
          {children}
          {footer !== null && (
            <div
              className={close.length < 2 ? `` : `grid grid-cols-2 gap-2 mt-4`}
            >
              {footer ?? buttons}
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
};

export default CModal;
