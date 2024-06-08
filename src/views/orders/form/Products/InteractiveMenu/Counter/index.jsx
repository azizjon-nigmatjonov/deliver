import styles from "./styles.module.scss";
import classNames from "classnames";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";

export default function Counter({
  value,
  onIncrease,
  onDecrease,
  min,
  size,
  max,
  className,
  disabled,
}) {
  return (
    <div
      className={classNames(styles.counter, {
        [styles.small]: size === "sm",
        [className]: className,
      })}
    >
      <div
        className={classNames(styles.button, {
          [styles.disabled]: min === value || disabled,
        })}
        onClick={onDecrease}
      >
        <RemoveRoundedIcon />
      </div>
      <p className={styles.value}>{value}</p>
      <div
        className={classNames(styles.button, {
          [styles.disabled]: max === value || disabled,
        })}
        onClick={onIncrease}
      >
        <AddRoundedIcon />
      </div>
    </div>
  );
}
