import Button from "components/Button";
import cls from "./kitchenCard.module.scss";
import CloseIcon from "@mui/icons-material/Close";
import DoneSharpIcon from "@mui/icons-material/DoneSharp";
import { useTranslation } from "react-i18next";

const ShowButtons = ({ buttonType, setModalInfo, handleOrderAction, elm }) => {
  const { t } = useTranslation();

  const showButtons = () => {
    switch (buttonType) {
      case "new_orders":
        return (
          <div className={cls.orderActions}>
            <Button
              icon={CloseIcon}
              size="large"
              shape="outlined"
              color="red"
              borderColor="bordercolor"
              onClick={() => setModalInfo(true)}
            >
              {t("cancel")}
            </Button>
            <Button
              icon={DoneSharpIcon}
              size="large"
              onClick={() =>
                handleOrderAction({
                  description: "Филиал принял",
                  status_id: process.env.REACT_APP_VENDOR_ACCEPTED_STATUS_ID,
                })
              }
              type="submit"
            >
              Принять
            </Button>
          </div>
        );
      case "work_process":
        return (
          <div className={cls.singleButton}>
            <Button
              icon={DoneSharpIcon}
              shape="outlined"
              borderColor="blue"
              size="large"
              type="submit"
              classNameParent="w-full"
              onClick={() => {
                handleOrderAction({
                  description: "Готово",
                  status_id: process.env.REACT_APP_VENDOR_READY_STATUS_ID,
                });
                // serReadyTimer(getFinishedTime()) ;
              }}
            >
              Готово
            </Button>
          </div>
        );
      case "ready":
        return (
          <div className={cls.singleButton}>
            <Button
              icon={DoneSharpIcon}
              shape="outlined"
              borderColor="blue"
              size="large"
              type="submit"
              classNameParent="w-full"
              onClick={() => {
                handleOrderAction({
                  description: "Завершить",
                  status_id: process.env.REACT_APP_FINISHED_STATUS_ID,
                });
              }}
            >
              Завершить
            </Button>
          </div>
        );
      default:
        return "";
    }
  };
  return buttonType === "ready" && elm.delivery_type === "delivery"
    ? null
    : showButtons();
};

export default ShowButtons;
