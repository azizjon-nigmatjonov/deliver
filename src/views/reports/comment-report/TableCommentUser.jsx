import React, { useEffect, useState } from "react";
import Card from "components/Card";
import { useTranslation } from "react-i18next";
import { getCustomReviews } from "services/reports";
import { StyledTab, StyledTabs } from "components/StyledTabs";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import LoaderComponent from "components/Loader";
function TableCommentUser({ tabValue, filters }) {
  const { t } = useTranslation();
  const [items, setItems] = useState();
  const [loader, setLoader] = useState(false);
  const [tabChildValue, setTabChildValue] = useState(0);
  const [type, setType] = useState("dislike");

  useEffect(() => {
    if (tabValue === 2) {
      setLoader(true);
      getCustomReviews({ ...filters, page: 1, limit: 200 }).then((res) => {
        setItems({ data: res?.type_reports });
        setLoader(false);
      });
    }
  }, [tabValue, filters]);
  const handleChange = (event, newValue) => {
    setTabChildValue(newValue);
  };
  function a11yProps(index) {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  }

  const tabLabel = (text, isActive = false) => (
    <span className="px-1">{text}</span>
  );
  const columns = [
    {
      title: "№",
      key: "order-number",
      render: (_, index) => <>{index + 1}</>,
    },
    {
      title: t("order_number"),
      key: "order_number",
      dataIndex: "order_num",
      render: (record) => <>{record?.order_num}</>,
    },
    {
      title: t("branch"),
      key: "branch",
      dataIndex: "branch",
      render: (record) => <>{record?.branch_name}</>,
    },
    {
      title: t("courier"),
      key: "courier",
      dataIndex: "courier",
      render: (record) => <>{record?.courier_name}</>,
    },
    {
      title: t("delivery_time"),
      key: "delivery_time",
      dataIndex: "delivery_time",
    },

    {
      title: t("operator"),
      key: "order.price",
      dataIndex: "operator_name",
      render: (record) => <>{record?.operator_name}</>,
    },
    {
      title: t("feedback_text"),
      key: "feedback_text",
      dataIndex: "review_message",
      render: (record) => <>{record?.review_message}</>,
    },
  ];
  return (
    <Card
      title={
        <StyledTabs
          value={tabChildValue}
          onChange={handleChange}
          indicatorColor="primary"
          centered={false}
          aria-label="full width tabs example"
        >
          <StyledTab
            label={tabLabel(t("negative"))}
            {...a11yProps(0)}
            onClick={() => setType("dislike")}
          />
          <StyledTab
            label={tabLabel(t("positive"))}
            {...a11yProps(1)}
            onClick={() => setType("like")}
          />
        </StyledTabs>
      }
    >
      <TableContainer
        style={{ maxHeight: "70vh" }}
        className=" comment_table rounded-lg border border-lightgray-1"
      >
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell style={{ textAlign: "center" }}>
                  {col.title}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!loader && items?.data && items.data.length
              ? items?.data
                  ?.filter((elm) => elm?.review_type === type)
                  ?.map((item, index) =>
                    item.user_reviews.map((user_review, item_index) => (
                      <TableRow
                        key={item.id}
                        className={item_index % 2 === 0 ? "bg-lightgray-5" : ""}
                      >
                        {columns.map((col) => (
                          <TableCell
                            key={col.key}
                            style={{ textAlign: "center" }}
                            className={
                              col.key !== "feedback_text"
                                ? "whitespace-nowrap"
                                : ""
                            }
                          >
                            {col.render
                              ? col.render(user_review, item_index)
                              : user_review[col.dataIndex]}
                          </TableCell>
                        ))}
                      </TableRow>
                    )),
                  )
              : null}
          </TableBody>
        </Table>
      </TableContainer>
      <LoaderComponent isLoader={loader} />
    </Card>
  );
}
export default TableCommentUser;
