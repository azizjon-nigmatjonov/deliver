import SwitchColumns from "components/Filters/SwitchColumns";
import React, { useEffect, useMemo, useState } from "react";
import Pagination from "components/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import TextFilter from "components/Filters/TextFilter";
import { useTranslation } from "react-i18next";
import ActionMenu from "components/ActionMenu";
import Card from "components/Card";
import { FlagSelect } from "components/FlagSelect";
import { FilterFlagIcon } from "constants/icons";
import { getCourierTransactions } from "services/courierBalance";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { useShipperUsers } from "services/operator";
import Search from "components/Search";
import EmptyData from "components/EmptyData";
import RangePicker from "components/DatePicker/RangePicker";
import moment from "moment";

const CourierBalanceTable = ({ refetch }) => {
  const { t } = useTranslation();
  const { id } = useParams();

  const [columns, setColumns] = useState();
  const [transactions, setTransactions] = useState({});
  const [filter, setFilter] = useState({
    type: "",
    creator_id: "",
    limit: 10,
    page: 1,
    search: "",
    from_date: "",
    to_date: "",
  });

  const getTransactions = () => {
    getCourierTransactions(id, {
      page: filter.page,
      limit: filter.limit,
      search: filter.search,
      transaction_type: filter.type,
      creator_id: filter.creator_id,
      from_date: filter.from_date,
      to_date: filter.to_date,
    }).then((res) => {
      setTransactions(res);
    });
  };

  const { data: users } = useShipperUsers({
    params: {
      limit: 100,
      page: 1,
    },
    props: {
      enabled: true,
      select: (data) => {
        const arr = data?.shipper_users.map((shipper) => ({
          value: shipper?.shipper_id,
          label: shipper?.name,
        }));
        return [{ value: "", label: "Все" }, ...arr];
      },
    },
  });

  useEffect(() => {
    getTransactions();
  }, [filter, refetch]);

  const pagination = (
    <Pagination
      title={t("general.count")}
      count={transactions?.count}
      onChange={(page) => {
        setFilter((prev) => ({
          ...prev,
          page: page,
        }));
      }}
      page={filter.page}
      limit={filter.limit}
      onChangeLimit={(limit) => {
        setFilter((prev) => ({
          ...prev,
          limit,
        }));
      }}
    />
  );

  const initialColumns = useMemo(() => {
    return [
      {
        title: "№",
        key: "order-number",
        render: (record, index) => (
          <div>{(filter.page - 1) * filter.limit + index + 1} </div>
        ),
      },
      {
        title: t("external_order_id"),
        key: "external_order_id",
        render: (record) => <div>{record?.external_order_id}</div>,
      },
      {
        title: t("amount_for_courier"),
        key: "amount",
        render: (record) => <div>{record?.amount}</div>,
      },
      {
        title: t("comment"),
        key: "comment",
        render: (record) => <div>{record?.comment}</div>,
      },
      {
        title: (
          <div className="w-full flex items-center justify-between">
            <p>{t("transaction_type")}</p>
            <FlagSelect
              icon={<FilterFlagIcon />}
              options={[
                { value: "", label: "Все" },
                { value: "topup", label: "Пополнение" },
                { value: "withdraw", label: t("withdraw") },
                { value: "bonus", label: t("bonus") },
                { value: "penalty", label: t("penalty") },
              ]}
              // value={filter.type}
              setValue={(val) => {
                setFilter((prev) => ({
                  ...prev,
                  type: val,
                }));
              }}
            />
          </div>
        ),
        key: "transaction_type",
        render: (record) => <div>{t(record?.transaction_type)}</div>,
      },
      {
        title: (
          <div className="w-full flex items-center justify-between">
            <p>{t("creator_name")}</p>
            <FlagSelect
              icon={<FilterFlagIcon />}
              options={users}
              setValue={(val) => {
                setFilter((prev) => ({
                  ...prev,
                  creator_id: val,
                }));
              }}
            />
          </div>
        ),
        key: "creator_name",
        render: (record) => <div>{record?.creator_name}</div>,
      },
      {
        title: t("created_at"),
        key: "created_at",
        render: (record) => <div>{record?.created_at}</div>,
      },
      // {
      //   title: t("currency"),
      //   key: "payment_currency",
      //   render: (record) => <div>{record?.payment_currency}</div>,
      // },
    ];
  }, [users, filter]);

  useEffect(() => {
    const _columns = [
      ...initialColumns,
      {
        title: (
          <SwitchColumns
            columns={initialColumns}
            onChange={(val) =>
              setColumns((prev) => [...val, prev[prev.length - 1]])
            }
          />
        ),
        key: t("actions"),
        render: (record) => <ActionMenu id={record.id} />,
      },
    ];
    setColumns(_columns);
  }, [initialColumns]);

  return (
    <Card
      footer={pagination}
      title={
        <Search
          setSearch={(search) => {
            setFilter((prev) => ({
              ...prev,
              search,
            }));
          }}
        />
      }
      extra={
        <RangePicker
          hideTimePicker
          placeholder={t("transaction.period")}
          onChange={(e) => {
            e[0] === null
              ? setFilter((old) => ({
                  ...old,
                  from_date: moment().subtract(5, "d").format("YYYY-MM-DD"),
                  to_date: moment().format("YYYY-MM-DD"),
                }))
              : setFilter((old) => ({
                  ...old,
                  from_date: moment(e[0]).format("YYYY-MM-DD"),
                  to_date: moment(e[1]).format("YYYY-MM-DD"),
                }));
          }}
        />
      }
      className="mt-4"
    >
      <TableContainer className="rounded-lg border border-lightgray-1">
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              {columns?.map((elm) => (
                <TableCell key={elm.key}>
                  <TextFilter {...elm} />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          {transactions?.count >= 1 ? (
            <TableBody>
              {transactions?.transactions?.map((item, index) => (
                <TableRow
                  className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                  key={item.id}
                >
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      {col.render
                        ? col.render(item, index)
                        : item[col.dataIndex]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <EmptyData />
          )}
        </Table>
      </TableContainer>
    </Card>
  );
};

export default CourierBalanceTable;
