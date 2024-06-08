import React, { useEffect, useState } from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { getMenuProduct, putMenuStopProducts } from "services/v2";
import CustomCheckbox from "components/Checkbox/Checkbox";
import Button from "components/Button/Buttonv2";
import DatePicker from "components/DatePicker";
import Modal from "components/ModalV2";

const StopModal = ({ open, product, fetchData, onClose }) => {
  const [formData, setFormData] = useState({
    off_always: false,
    from_time: undefined,
    to_time: undefined,
  });
  const { id } = useParams();
  const { t } = useTranslation();

  useEffect(() => {
    if (open && product) {
      getMenuProduct(product?.product_id, { menu_id: id }).then((res) =>
        setFormData({
          off_always: res.off_always,
          from_time: res.from_time ? res.from_time : undefined,
          to_time: res.to_time ? res.to_time : undefined,
        }),
      );
    }
  }, [open, product, id]);

  const onStop = () => {
    let data = {
      ...formData,
      from_time: undefined,
      to_time: undefined,
      menu_id: product?.menu_id,
    };
    if (formData.from_time && formData.to_time && !formData.off_always) {
      const fromTime = moment(formData.from_time, "DD.MM.YYYY HH:mm", true);
      const toTime = moment(formData.to_time, "DD.MM.YYYY HH:mm", true);
      data.from_time = fromTime.isValid()
        ? moment(formData.from_time).format()
        : undefined;
      data.to_time = toTime.isValid()
        ? moment(formData.to_time).format()
        : undefined;
    }
    putMenuStopProducts(product?.product_id, data).finally(() => {
      onClose();
      setFormData({
        off_always: false,
        from_time: undefined,
        to_time: undefined,
      });
      fetchData();
    });
  };

  return (
    <Modal
      open={open}
      title={t("stop.product")}
      onClose={onClose}
      contentsx={{ overflow: "visible" }}
    >
      <div className="flex flex-col">
        <div className="input-label">Период (дата и время)</div>
        <div className="flex gap-5">
          <DatePicker
            icon={null}
            dateformat="DD.MM.YYYY HH:mm"
            placeholder={t("enter.date")}
            onChange={(e) => {
              e !== null &&
                setFormData((prev) => ({
                  ...prev,
                  from_time: e,
                }));
            }}
            value={
              formData?.from_time
                ? moment(formData?.from_time)
                : formData?.from_time
            }
            disabled={formData.off_always}
            oldDateShow={false}
            style={{
              maxHeight: "34px",
              "& input": { marginLeft: 0 },
            }}
          />
          <DatePicker
            icon={null}
            dateformat="DD.MM.YYYY HH:mm"
            hideTimePicker
            placeholder={t("enter.date")}
            onChange={(e) => {
              e !== null &&
                setFormData((prev) => ({
                  ...prev,
                  to_time: e,
                }));
            }}
            value={
              formData.to_time ? moment(formData.to_time) : formData.to_time
            }
            hideTimeBlock
            disabled={formData.off_always}
            oldDateShow={false}
            style={{
              maxHeight: "34px",
              "& input": { marginLeft: 0 },
            }}
          />
        </div>
      </div>
      <div className="flex items-center gap-5 mt-5 mb-5">
        <div className="input-label mt-2">Отключить навсегда</div>
        <div>
          <CustomCheckbox
            checked={formData.off_always}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                off_always: e.target.checked,
              }))
            }
            color="primary"
          />
        </div>
      </div>
      <Button variant="contained" fullWidth onClick={onStop}>{t("save")}</Button>
    </Modal>
  );
};
export default StopModal;
