import moment from "moment";

export default function orderTimer(
  createdAt,
  finishedAt,
  future_time,
  status_id,
  order_title,
) {
  if (
    status_id === process.env.REACT_APP_NEW_STATUS_ID &&
    order_title === "operator_accepted_timer"
  ) {
    return "--:--:--";
  } else if (status_id === process.env.REACT_APP_FUTURE_STATUS_ID) {
    const future = moment(future_time);
    const currentTime = moment(new Date().toISOString());
    let currentDate = new Date(currentTime);
    currentDate.setHours(
      currentDate.getHours() - new Date(future_time).getTimezoneOffset() / 60,
    );
    const future_order_time = localStorage.getItem("future_order_time");
    const duration = moment
      .duration(future.diff(currentDate))
      .subtract(Number(future_order_time), "minutes");

    return `${
      duration.get("hours") > 9
        ? duration.get("hours")
        : "0" + duration.get("hours")
    }:${
      duration.get("minutes") > 9
        ? duration.get("minutes")
        : "0" + duration.get("minutes")
    }:${
      duration.get("seconds") > 9
        ? duration.get("seconds")
        : "0" + duration.get("seconds")
    }`;
  } else if (
    status_id === process.env.REACT_APP_OPERATOR_CANCELED_STATUS_ID ||
    status_id === process.env.REACT_APP_SERVER_CANCELED_STATUS_ID ||
    status_id === process.env.REACT_APP_FINISHED_STATUS_ID
  ) {
    let finished = moment(finishedAt);
    let created = moment(createdAt);
    let diff_s = finished.diff(created, "seconds");
    let differenceForFinished = moment
      .utc(moment.duration(diff_s, "seconds").asMilliseconds())
      .format("HH:mm:ss");

    return differenceForFinished;
  } else {
    var start = moment(createdAt);
    var end = moment(finishedAt || undefined);
    var diff = end.diff(start);
    var hours = end.diff(start, "hours");
    return hours + ":" + moment.utc(diff).format("mm:ss");
  }
}
