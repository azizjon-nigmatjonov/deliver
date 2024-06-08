import { IconButton } from "@mui/material";
import styles from "./FlagSelect.module.scss";
import { useEffect, useRef, useState } from "react";
export const FlagSelect = ({ icon, options, value, setValue }) => {
  const [open, setOpen] = useState(false);
  function useOutsideAlerter(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);
  return (
    <div className={styles.CustomSelect}>
      <IconButton onClick={() => setOpen(!open)}>{icon}</IconButton>
      <ul
        ref={wrapperRef}
        className={`${styles.List} ${open ? styles.open : ""}`}
      >
        {options?.length >= 1 &&
          options.map((option, index) => (
            <li
              className={value === option.value ? styles.selected : ""}
              value={option.value}
              onClick={() => {
                setValue(option.value);
                setOpen(!open);
              }}
              key={index}
            >
              <p>{option.label}</p>
            </li>
          ))}
      </ul>
    </div>
  );
};
