import { useState, useEffect } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import styles from "./styles.module.scss";

function Menu({
  title,
  children,
  isExpanded = false,
  onChange = function () {},
}) {
  const [expand, setExpand] = useState(isExpanded);

  useEffect(() => {
    setExpand(isExpanded);
  }, [isExpanded]);

  return (
    <div className={`${styles.menu} ${expand ? styles.expanded : ""}`}>
      <div
        className={`${styles.header} ${expand ? styles.expanded : ""}`}
        onClick={onChange}
      >
        <div>{title}</div>
        <div
          className={`${styles.icon} ${expand ? styles.expanded : ""}`}
          style={{ transform: expand ? "-rotate-180" : "rotate-0" }}
        >
          <ExpandMoreIcon />
        </div>
      </div>

      <div className={styles.children}>{expand && children}</div>
    </div>
  );
}

export default Menu;
