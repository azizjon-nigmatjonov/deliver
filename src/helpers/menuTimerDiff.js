import Tag from "components/Tag";
import moment from "moment";

export const menuTimerDiff = (
  { is_active, off_always, from_time, to_time },
  t,
) => {
  // const fromTime = moment(from_time);
  // const toTime = moment(to_time);
  // const diff = toTime.diff(fromTime);
  // const hoursDiff = toTime.diff(fromTime, "hours");
  // let formatDiff = moment.utc(diff).format("mm:ss");

  if (is_active === false && off_always === true) {
    return (
      <Tag className="p-1" color="warning">
        {t("inactive")}
      </Tag>
    );
  }
  if (is_active === false && off_always === false) {
    return (
      <Tag className="p-1" color="primary">
        {moment(to_time).format('DD.MM.YYYY HH:mm')}
      </Tag>
    );
  }
  if (is_active === true && off_always === false) {
    return (
      <Tag className="p-1" color="primary" lightMode={true}>
        {t("active")}
      </Tag>
    );
  }
};
