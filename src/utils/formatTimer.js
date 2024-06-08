export const formatTimer = (time, t) => {
  if (time < 60) {
    return (
      <>
        {time} {t("min")}
      </>
    );
  } else if (time > 60) {
    return (
      <>
        {Math.floor(time / 60)} {t("hour")} {Math.floor(time % 60)} {t("min")}{" "}
      </>
    );
  }
};

export function convertSecondsToTime(seconds) {
  let hours = Math.floor(seconds / 3600);
  let minutes = Math.floor((seconds % 3600) / 60);
  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  return `${hours}:${minutes}`;
}