import { memo } from "react";
import { Checkbox, FormControlLabel } from "@mui/material";
import styles from "./styles.module.scss";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import numberToPrice from "helpers/numberToPrice";
import Counter from "../Counter";

function ModifierCheckbox({
  checked,
  quantity,
  name,
  single,
  label,
  outPrice,
  increase,
  decrease,
  isCompulsory,
  notAddtoPrice,
  onChange,
}) {
  const { t } = useTranslation();

  return (
    <div
      className={classNames(styles.ModifierCheckbox, {
        [styles.single]: single,
      })}
    >
      <FormControlLabel
        name={name}
        control={<Checkbox color="primary" size="small" disableRipple />}
        label={label}
        onChange={onChange}
        checked={
          checked
            ? true
            : !checked
            ? false
            : isCompulsory
            ? isCompulsory
            : undefined
        }
      />
      <p>
        +{" "}
        {numberToPrice(
          !notAddtoPrice && outPrice !== "" ? outPrice : 0,
          t("uzb.sum"),
        )}
      </p>
      {quantity > 0 && checked && (
        <div className={styles.counter}>
          <Counter
            size="sm"
            value={quantity}
            onIncrease={increase}
            onDecrease={decrease}
          />
        </div>
      )}
    </div>
  );
}

export default memo(ModifierCheckbox);
