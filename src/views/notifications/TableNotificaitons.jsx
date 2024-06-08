import {
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
} from "@mui/material";
import moment from "moment";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Pagination from "components/Pagination";
import Card from "components/Card";
import { useNotificationAlerts } from "services/v2/notification-alerts";
import styles from "./style.module.scss";

const TableNotifications = ({
  isLoading = false,
  footerData,
  setId,
  setOpen,
}) => {
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [bodyData, setBodyData] = useState([]);

  const { getNotificationAlertsQuery } = useNotificationAlerts({
    notificationParams: {
      page: currentPage,
      limit: limit,
    },
    notificationProps: {
      enabled: true,
      onSuccess: (res) => setBodyData(res?.notifications),
    },
  });
  const { t } = useTranslation();
  const headColumns = useMemo(() => {
    return [
      {
        title: "№",
        key: "number",
        render: (record, index) => (
          <div>{(currentPage - 1) * limit + index + 1}</div>
        ),
      },
      {
        title: t("name"),
        key: "title",
        render: (record) => (
          <div className={styles.clamped}>{record?.title?.ru}</div>
        ),
      },
      {
        title: t("text"),
        key: "text",
        render: (record) => (
          <div className={styles.clamped}>{record?.text?.ru}</div>
        ),
      },
      {
        title: t("notification_type"),
        key: "type",
        render: (record) => <div>{record?.type}</div>,
      },
      {
        title: t("date.branch"),
        key: "created_at",
        render: (record) => (
          <div style={{ width: "130px" }}>
            {moment(record?.created_at).format("DD/MM/YYYY hh:mm")}
          </div>
        ),
      },
    ];
  }, []);
  return (
    <Card
      className="m-4"
      footer={
        <Pagination
          title={t("general.count")}
          count={bodyData?.length}
          onChange={(pageNumber) => setCurrentPage(pageNumber)}
          pageCount={limit}
          onChangeLimit={(limitNumber) => setLimit(limitNumber)}
          limit={limit}
        />
      }
    >
      <div>
        <TableContainer className="rounded-lg border border-lightgray-1">
          <TableContainer aria-label="simple-table">
            <TableHead>
              <TableRow>
                {headColumns?.map((elm, ind) => (
                  <TableCell
                    colSpan={elm?.columns ? elm?.columns.length : 1}
                    rowSpan={elm?.columns ? 1 : 2}
                    key={elm?.key}
                    style={{ textAlign: "center" }}
                  >
                    {" "}
                    {elm?.title}{" "}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                {headColumns?.map(
                  (item, index) =>
                    item?.columns &&
                    item?.columns.map((element, ind) => (
                      <TableCell
                        key={item?.key + element?.key}
                        style={
                          ind === item?.columns.length - 1
                            ? { borderRight: "1px solid #e5e9eb" }
                            : {}
                        }
                      >
                        <div className="text-center">{element?.title}</div>
                      </TableCell>
                    )),
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {!isLoading &&
                bodyData?.map((item, index) => (
                  <TableRow
                    key={item.id}
                    className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                    onClick={() => {
                      setId(item?.id);
                      setOpen(true);
                    }}
                  >
                    {headColumns?.map((col) =>
                      col?.columns ? (
                        col?.columns?.map((element) => (
                          <TableCell key={col?.key + element?.key}>
                            <div key={element?.key}>
                              {element?.render
                                ? element?.render(item, index)
                                : item?.[col?.key]?.[element?.key]
                                    .toString()
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
                            </div>
                          </TableCell>
                        ))
                      ) : (
                        <TableCell
                          style={{
                            width:
                              col?.key === "text"
                                ? "65%"
                                : col?.key === "title"
                                ? "35%"
                                : "fit-content",
                          }}
                          key={col?.key}
                        >
                          {col?.render
                            ? col?.render(item, index)
                            : item?.[col?.key]}
                        </TableCell>
                      ),
                    )}
                  </TableRow>
                ))}
            </TableBody>
            {!!footerData && (
              <TableFooter>
                <TableRow>
                  {headColumns.map((element) =>
                    element.columns ? (
                      element.columns.map((col) => (
                        <TableCell
                          style={{
                            fontWeight: "900",
                            color: "#1A2024",
                          }}
                        >
                          <div>
                            {col.footer_title
                              ? col.footer_title
                              : col.render
                              ? col.render(footerData[element.key][col.key])
                              : footerData[element.key][col.key]
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
                          </div>
                        </TableCell>
                      ))
                    ) : (
                      <TableCell
                        style={{ fontWeight: "900", color: "#1A2024" }}
                      >
                        <div>
                          {element?.footer_title
                            ? element?.footer_title
                            : element?.key}
                        </div>
                      </TableCell>
                    ),
                  )}
                </TableRow>
              </TableFooter>
            )}
          </TableContainer>
        </TableContainer>
      </div>
    </Card>
  );
};

export default TableNotifications;
