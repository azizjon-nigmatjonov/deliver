import moment from "moment";
import styles from "./Balance.module.scss";
import { FlagSelect } from "components/FlagSelect";
import { FilterFlagIcon } from "constants/icons";
import BasicPopover from "components/CustomIconPopover";
import TableChartIcon from "@mui/icons-material/TableChart";
import Switch from "components/Switch";

const balanceHeaderData = ({
  t,
  creatorTypeOptions,
  creatorType,
  setCreatorType,
  typeFilter,
  setTypeFilter,
  typeOptions,
  users,
  setUsers,
  filterColumn,
  setFilterColumn,
  currentPage,
}) => {
  return [
    {
      title: "№",
      key: "index",
      render: (record, index) => (
        <div style={{ textAlign: "center" }}>
          {(currentPage - 1) * 10 + index + 1}
        </div>
      ),
    },
    {
      title: (
        <div
          className={styles.WithNoFilter}
          style={{ maxWidth: "150px", minWidth: "150px" }}
        >
          <p>Сумма</p>
        </div>
      ),
      key: "amount",
      render: (record) => (
        <div>
          {record.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
        </div>
      ),
    },
    {
      title: (
        <div className={styles.WithNoFilter} style={{ minWidth: "300px" }}>
          <p>Коммент</p>
        </div>
      ),
      key: "comment",
      render: (record) => (
        <div style={{ maxWidth: "300px", wordBreak: "break-all" }}>
          {record.comment}
        </div>
      ),
    },
    {
      title: (
        <div style={{ minWidth: "120px" }} className={styles.WithFilter}>
          <p>Тип оплаты</p>
          <FlagSelect
            icon={<FilterFlagIcon />}
            options={typeOptions}
            value={typeFilter}
            setValue={setTypeFilter}
          />
        </div>
      ),
      key: "transaction_type",
      render: (record) => (
        <div style={{ textAlign: "center" }}>{t(record.transaction_type)}</div>
      ),
    },
    {
      title: (
        <div style={{ minWidth: "130px" }} className={styles.WithFilter}>
          <p>Тип создателя</p>
          <FlagSelect
            icon={<FilterFlagIcon />}
            options={creatorTypeOptions}
            value={creatorType}
            setValue={setCreatorType}
          />
        </div>
      ),
      key: "creator_type",
      render: (record) => (
        <div style={{ textAlign: "center" }}>{t(record.creator_type)}</div>
      ),
    },
    // {
    //   title: (
    //     <div className={styles.WithFilter}>
    //       <p>Пользователь</p>
    //       <FilterFlagDropdown
    //         options={
    //           (creatorType === "user" && creatorType) ||
    //           (creatorType === "system-user" && creatorTypeOptions)
    //         }
    //         value={users}
    //         onClick={setUsers}
    //         setUser={setUsers}
    //         reset={() => setUsers([""])}
    //         filter
    //       />
    //     </div>
    //   ),
    //   key: "creator_name",
    //   render: (record) => (
    //     <div style={{ maxWidth: "60px", minWidth: "80px" }}>
    //       {t(record.creator_name)}
    //     </div>
    //   ),
    // },
    {
      title: (
        <div className={styles.WithNoFilter}>
          <p>Валюта</p>
        </div>
      ),
      key: "payment_currency",
      render: (record) => (
        <div
          style={{
            textAlign: "center",
            textTransform: "uppercase",
          }}
        >
          {record.payment_currency}
        </div>
      ),
    },
    {
      title: (
        <div className={styles.WithNoFilter}>
          <p>Дата оплаты</p>
        </div>
      ),
      key: "created_at",
      render: (record) => (
        <div style={{ minWidth: "130px" }}>
          {moment(record.created_at).format("DD.MM.YYYY HH:mm")}
        </div>
      ),
    },
    {
      title: (
        <div className={styles.WithFilter}>
          <p>Статус</p>
        </div>
      ),
      key: "payment_status",
      render: (record) => (
        <div
          style={{ minWidth: "130px" }}
          className={
            record.payment_status === "accepted"
              ? styles.payment_status_accepted
              : record.payment_status === "pending"
              ? styles.payment_status_pending
              : styles.payment_status_canceled
          }
          // className={styles.payment_status_pending}
        >
          {t(record.payment_status)}
        </div>
      ),
    },
    {
      title: (
        <BasicPopover
          style={{ marginLeft: "-100px" }}
          trigger={
            <div className={`fill-current text-primary cursor-pointer`}>
              <TableChartIcon />
            </div>
          }
        >
          {filterColumn.map((filter, idx) => (
            <div style={{ padding: "5px 10px" }} key={idx}>
              <div>
                <Switch
                  id={`switch-columns`}
                  checked={filter.isChecked}
                  onChange={(e) => {
                    setFilterColumn((prevState) =>
                      prevState.map((item, i) =>
                        idx === i
                          ? { ...item, isChecked: !item.isChecked }
                          : item,
                      ),
                    );
                  }}
                />
                <label htmlFor={`switch-columns`}>{filter.title}</label>
              </div>
            </div>
          ))}
        </BasicPopover>
      ),
      key: "status",
      render: (record) => <div></div>,
    },
  ];
};
export default balanceHeaderData;
