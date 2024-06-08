import Header from "components/Header";
import { useTranslation } from "react-i18next";
import Card from "components/Card";
import Select from "components/Select";
import Input from "components/Input";
import Button from "components/Button/Buttonv2";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { postNotification } from "services/notifications";
import { IconButton } from "@mui/material";
import { ArrowBack as ArrowBackIcon, SendRounded } from "@mui/icons-material";

const CreateNotification = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [disabledBtn, setDisabledBtn] = useState(false);
  const [data, setData] = useState({
    content: "",
    receiver_type: "",
    title: "",
  });

  const receiverTypeOptions = [
    {
      label: t("courier"),
      value: "courier",
    },
    {
      label: t("client"),
      value: "client",
    },
  ];

  // const routes = [
  //   {
  //     title: <div>{t("notification")}</div>,
  //     link: true,
  //     route: `/home/marketing/notification-to-apps`,
  //   },
  //   {
  //     title: t("create"),
  //   },
  // ];

  const onSubmit = () => {
    setDisabledBtn(true);
    postNotification({
      ...data,
      receiver_type: data.receiver_type.value,
    })
      .then(() => history.goBack())
      .catch((err) => console.log(err))
      .finally(() => setDisabledBtn(true));
  };

  return (
    <div className="flex flex-col h-screen">
      <Header
        title={
          <div className="flex items-center gap-3">
            <IconButton onClick={() => history.goBack()}>
              <ArrowBackIcon />
            </IconButton>
            <p>{t("notification_to_apps")}</p>
          </div>
        }
      />
      <div className="flex-1 flex justify-between flex-col">
        <Card style={{ maxWidth: 700 }} className="m-4">
          <div>
            <div className="input-label mb-2">
              <span>{t("receiver.type")}</span>
            </div>
            <Select
              placeholder={t("receiver.type")}
              options={receiverTypeOptions}
              value={data.receiver_type}
              onChange={(val) =>
                setData((prev) => ({
                  ...prev,
                  receiver_type: val,
                }))
              }
            />
          </div>
          <div>
            <div className="input-label mb-2 mt-6">
              <span>{t("name")}</span>
            </div>
            <Input
              placeholder={t("name")}
              value={data.title}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <div className="input-label mb-2 mt-6">
              <span>{t("description")}</span>
            </div>
            <textarea
              rows={6}
              placeholder={t("description")}
              className="w-full border border-lightgray-1 rounded p-4 mb-12"
              value={data.content}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  content: e.target.value,
                }))
              }
            />
          </div>
        </Card>
        <div className="sticky bottom-0 flex justify-end items-center w-full bg-white border-t py-2 px-4 gap-3">
          <Button
            onClick={onSubmit}
            variant="contained"
            size="large"
            endIcon={<SendRounded />}
            disabled={
              !data.title || !data.content || !data.receiver_type || disabledBtn
            }
          >
            {t("send")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateNotification;
