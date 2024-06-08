import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import Pagination from "components/Pagination";
import LoaderComponent from "components/Loader";
import Card from "components/Card";
import StatusTag from "components/Tag/StatusTag";
import { useCustomerBirthdays } from "services";

export default function CustomerBirthdays({ active }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { t } = useTranslation();
  const history = useHistory();

  const columns = useMemo(
    () => [
      {
        title: "№",
        key: "order-number",
        render: (_, index) => <>{(currentPage - 1) * limit + index + 1}</>,
      },
      {
        title: t("client_name"),
        key: "first.name",
        render: (record) => <>{record.name}</>,
      },
      {
        title: t("count.orders"),
        key: "order-count",
        render: (record) => <>{record.orders_amount}</>,
      },
      {
        title: t("phone.number"),
        key: "phone-number",
        render: (record) => <>{record.phone}</>,
      },
      {
        title: t("status"),
        key: "status",
        render: (record) => (
          <StatusTag
            status={!record?.is_blocked}
            color={record.is_blocked ? "#F2271C" : "#0E73F6"}
          />
        ),
      },
    ],
    [currentPage, limit, t],
  );

  const { data, isLoading } = useCustomerBirthdays({
    params: { page: currentPage, limit },
    props: { enabled: active },
  });

  return (
    <Card
      className="m-4"
      footer={
        <Pagination
          title={t("general.count")}
          count={data?.count}
          onChange={(pageNumber) => setCurrentPage(pageNumber)}
          pageCount={limit}
          limit={limit}
          onChangeLimit={(limitNumber) => setLimit(limitNumber)}
        />
      }
    >
      <TableContainer className="rounded-lg border border-lightgray-1">
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              {columns?.map((elm) => (
                <TableCell key={elm.key}>{elm.title}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!isLoading &&
              data?.customers?.map((item, index) => (
                <TableRow
                  key={item.id}
                  onClick={() => history.push(`/home/clients/${item?.id}`)}
                  className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                >
                  {columns?.map((col) => (
                    <TableCell key={col.key}>
                      {col?.render ? col?.render(item, index) : "-----"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <LoaderComponent isLoader={isLoading} />
    </Card>
  );
}
