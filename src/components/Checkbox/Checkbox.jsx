import Checkbox from "@mui/material/Checkbox";
import styles from "./Checkbox.module.scss";

export default function CustomCheckbox(props) {
  return <Checkbox className={styles.checkbox} {...props} />;
}
