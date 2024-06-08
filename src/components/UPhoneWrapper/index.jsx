import UserIcon from "assets/icons/user.svg";
import PhoneIcon from "assets/icons/phone.svg";
import Courier from "assets/icons/courier 1.svg";
import cls from "./UPhone.module.scss";

const UPhoneWrapper = ({
  header = "ФИО и телефон клиента",
  bg = false,
  type,
  name,
  phone,
  className = "",
}) => {
  const showIcon = () => {
    if (type === "courier") {
      return Courier;
    } else if (type === "user") {
      return UserIcon;
    }
  };
  return (
    <div className={`${cls.uphone} ${className}`}>
      {header && <p className={cls.header}>{header}</p>}
      <div className={bg ? cls.uphoneWrapperBg : ""}>
        <div className={cls.uphoneWrapper}>
          <img src={showIcon()} alt="user" />
          <p>{name}</p>
        </div>
        <div className={`${cls.uphoneWrapper} mt-2`}>
          <img src={PhoneIcon} alt="user" />
          <p>{phone}</p>
        </div>
      </div>
    </div>
  );
};

export default UPhoneWrapper;
