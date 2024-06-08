import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { showAlert } from "redux/actions/alertActions";
import { getTgbot, postTgbot, updateTgbot } from "services/v2/tgbot";
// Components
import Card from "components/Card";
import Input from "components/Input";
import Switch from "components/Switch";
import Button from "components/Button";

export default function Powers() {
  const [botToken, setBotToken] = useState({ before: null, after: null });
  const [isActive, setIsActive] = useState({ before: null, after: null });
  const [botData, setBotData] = useState(null);
  const [isTokenRegistered, setIsTokenRegistered] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { after: tokenAfter } = botToken;
  const { after: statusAfter } = isActive;
  const { shipper_id } = useSelector((state) => state.auth);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const onSubmit = () => {
    if (
      botToken.before !== botToken.after ||
      isActive.before !== isActive.after
    ) {
      const data = {
        ...botData,
        bot_token: botToken.after,
        is_active: isActive.after,
        structure: "multi_bot",
        shipper_id: shipper_id,
      };
      saveChanges(data);
      setBtnDisabled(true);
      setBotToken((prev) => ({ ...prev, before: botToken.after }));
      setIsActive((prev) => ({ ...prev, before: isActive.after }));
      dispatch(showAlert(t("succesfully sended"), "success"));
    } else {
      dispatch(showAlert(t("nothing_changed"), "info"));
    }
    setIsEditing(false);
  };

  useEffect(() => {
    const getSettingsData = async () => {
      try {
        const response = await getTgbot(shipper_id);
        setBotToken({
          before: response.bot_token,
          after: response.bot_token,
        });
        setIsActive({
          before: response.is_active,
          after: response.is_active,
        });
        setBotData({
          access_token: response.access_token,
          url: response.url,
        });
        setIsTokenRegistered(true);
      } catch (error) {
        setBtnDisabled(false);
      }
    };
    getSettingsData();
  }, [shipper_id]);

  const saveChanges = (data) => {
    isTokenRegistered
      ? updateTgbot(shipper_id, data).finally(() => {
          setBtnDisabled(false);
        })
      : postTgbot({ ...data, shipper_id }).finally(() => {
          setBtnDisabled(false);
        });
  };

  return (
    <div
      style={{ minHeight: "calc(100vh - 112px)" }}
      className="flex flex-col justify-between"
    >
      <div className="grid grid-cols-2">
        <Card className="m-4" title={t("Полномочия")}>
          <div className="input-label">
            <span>{t("bot_token")}</span>
          </div>
          <Input
            id="bot_token"
            value={tokenAfter}
            onChange={({ target: { value } }) =>
              setBotToken((prev) => ({ ...prev, after: value }))
            }
            disabled={!isEditing}
          />
          <div className="mt-3">
            <div className="input-label">
              <span>{t("status")}</span>
            </div>

            <div className="flex gap-3">
              <p>{t("manage_bots_status")}</p>
              <div className="w-1/4">
                <Switch
                  disabled={!isEditing}
                  checked={statusAfter}
                  onChange={() =>
                    setIsActive((prev) => ({ ...prev, after: !prev.after }))
                  }
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
      <div className="sticky bottom-0 flex justify-end items-center w-full bg-white p-4">
        <Button
          size="large"
          loading={btnDisabled}
          onClick={() => (isEditing ? onSubmit() : setIsEditing(true))}
        >
          {t(isEditing ? "save" : "edit")}
        </Button>
      </div>
    </div>
  );
}
