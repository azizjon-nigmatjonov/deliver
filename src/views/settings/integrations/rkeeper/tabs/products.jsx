import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Card from "components/Card";
import Pagination from "components/Pagination";
import LoaderComponent from "components/Loader";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Tag from "components/Tag";
import { useHistory } from "react-router-dom";
import Modal from "components/Modal";
import AddIcon from "@mui/icons-material/Add";
import Button from "components/Button";
import { Update } from "@mui/icons-material";
import { getNonOriginProducts, deleteGood, getCrmCombo } from "services/v2";
import { StyledTab, StyledTabs } from "components/StyledTabs";
import TabPanel from "components/Tab/TabPanel";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material";
import { getRkeeperUpdateMenu } from "services/v2/rkeeper_credentials";
import Search from "components/Search";

const Products = ({ filters }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const theme = useTheme();
  const [deleteGoodId, setDeleteGoodId] = useState(false);
  const [loader, setLoader] = useState(true);
  const [items, setItems] = useState({
    count: "",
    data: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [deleteModal, setDeleteModal] = useState(null);
  const [search, setSearch] = useState("");
  const [tabValue, setTabValue] = useState(0);

  const getItems = useCallback(() => {
    setLoader(true);
    if (tabValue === 0) {
      getNonOriginProducts({
        crm_type: "rkeeper",
        limit,
        page: currentPage,
        ...filters,
        search,
      })
        .then((res) => {
          setItems({
            count: res?.count,
            data: res?.products,
          });
        })
        .finally(() => setLoader(false));
    } else if (tabValue === 1) {
      // getCrmCombo({ limit, page: currentPage, ...filters, search });
      getCrmCombo({
        limit,
        page: currentPage,
        ...filters,
        search,
        type: "rkeeper",
      })
        .then((res) => {
          setItems({
            count: res?.count,
            data: res?.combos,
          });
        })
        .finally(() => setLoader(false));
    }
  }, [currentPage, filters, limit, search, tabValue]);

  const updateIikoMenu = () => {
    getRkeeperUpdateMenu().then(() => {
      getItems();
    });
  };

  const handleDeleteItem = () => {
    // setDeleteLoading(true);
    // deleteProduct(deleteModal.id)
    //   .then((res) => {
    //     getItems(currentPage);
    //     setDeleteLoading(false);
    //     setDeleteModal(null);
    //   })
    //   .finally(() => setDeleteLoading(false));
  };

  const columns_product = [
    {
      title: "№",
      key: "order-number",
      render: (_, index) => <>{(currentPage - 1) * limit + index + 1}</>,
    },
    {
      title: t("meal_name"),
      key: "name",
      dataIndex: "title",
      render: (record) => <>{record?.title?.ru}</>,
    },
    {
      title: t("tied_product"),
      key: "tied_product",
      dataIndex: "tied_product",
      render: (record) => <>{record?.crm_name}</>,
    },
    {
      title: t("price"),
      key: "price",
      dataIndex: "price",
      render: (record) => <>{record?.out_price}</>,
    },
    {
      title: t("type"),
      key: "type",
      dataIndex: "type",
      render: (record) => <>{t(record?.type)}</>,
    },
    {
      title: t("status"),
      key: "is_active",
      render: ({ rkeeper_id }) => (
        <Tag
          className="p-1"
          color={rkeeper_id ? "primary" : "warning"}
          lightMode={true}
        >
          {rkeeper_id ? t("connected") : t("not.connected")}
        </Tag>
      ),
    },
    // {
    //   title: t("action"),
    //   key: "action",
    //   render: (record) => (
    //     <Tag
    //       className="p-1 cursor-pointer self-end"
    //       color="red"
    //       size="large"
    //       shape="subtle"
    //     >
    //       <DeleteIcon
    //         onClick={() => setDeleteGoodId(record.id)}
    //         style={{ color: "red" }}
    //       />
    //     </Tag>
    //   ),
    // },
  ];

  const columns_combo = [
    {
      title: "№",
      key: "order-number",
      render: (_, index) => <>{(currentPage - 1) * limit + index + 1}</>,
    },
    {
      title: t("meal_name"),
      key: "name",
      dataIndex: "title",
      render: (record) => <>{record?.title?.ru}</>,
    },
    {
      title: t("status"),
      key: "is_active",
      render: ({ rkeeper_id }) => (
        <Tag
          className="p-1"
          color={rkeeper_id ? "primary" : "warning"}
          lightMode={true}
        >
          {rkeeper_id ? t("connected") : t("not.connected")}
        </Tag>
      ),
    },
  ];

  const a11yProps = (index) => {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  };

  const handleChange = (event, newValue) => {
    setLimit(10);
    setTabValue(newValue);
  };

  const handleChangeIndex = (index) => setTabValue(index);

  const tabLabel = (text, isActive = false) => (
    <span className="px-1">{text}</span>
  );

  useEffect(() => {
    getItems();
  }, [getItems, currentPage, filters, limit, search, tabValue]);

  const tabSelect = (
    <>
      <StyledTabs
        value={tabValue}
        onChange={handleChange}
        centered={false}
        aria-label="full width tabs example"
        TabIndicatorProps={{ children: <span className="w-2" /> }}
      >
        <StyledTab label={tabLabel(t("goods"))} {...a11yProps(0)} />
        <StyledTab label={tabLabel(t("combo"))} {...a11yProps(1)} />
      </StyledTabs>
    </>
  );

  const handleDeleteGood = () => {
    deleteGood(deleteGoodId)
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
      .finally(() => {
        setDeleteGoodId(false);
        getItems();
      });
  };

  return (
    <Card
      className="m-4"
      title={t("product")}
      extra={
        <div className="flex gap-5">
          <Search setSearch={(value) => setSearch(value)} />
          <Button icon={Update} size="medium" onClick={updateIikoMenu}>
            {t("update")}
          </Button>
          <Button
            icon={AddIcon}
            size="medium"
            onClick={() =>
              tabValue
                ? history.push(
                    "/home/settings/integrations/rkeeper/menu-create-combo",
                  )
                : history.push(
                    "/home/settings/integrations/rkeeper/menu-create",
                  )
            }
          >
            {t("add")}
          </Button>
        </div>
      }
      footer={
        <Pagination
          title={t("general.count")}
          count={items?.count}
          onChange={(pageNumber) => setCurrentPage(pageNumber)}
          pageCount={limit}
          limit={limit}
          onChangeLimit={(limitNumber) => setLimit(limitNumber)}
        />
      }
      filters={[tabSelect]}
    >
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={tabValue}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={tabValue} index={0} dir={theme.direction}>
          <TableContainer className="rounded-lg border border-lightgray-1">
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  {columns_product.map((elm) => (
                    <TableCell key={elm.key}>{elm.title}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {!loader &&
                  items?.data?.map((item, index) => (
                    <TableRow
                      key={item.id}
                      className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                    >
                      {columns_product.map((col) => (
                        <TableCell key={col?.key} width="100">
                          {col?.render
                            ? col?.render(item, index)
                            : item[col?.dataIndex]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>{" "}
        </TabPanel>
        <TabPanel value={tabValue} index={1} dir={theme.direction}>
          <TableContainer className="rounded-lg border border-lightgray-1">
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  {columns_combo.map((elm) => (
                    <TableCell key={elm.key}>{elm.title}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {!loader &&
                  items?.data?.map((item, index) => (
                    <TableRow
                      key={item.id}
                      className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                    >
                      {columns_combo.map((col) => (
                        <TableCell key={col?.key} width="100">
                          {col?.render
                            ? col?.render(item, index)
                            : item[col?.dataIndex]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>{" "}
        </TabPanel>
      </SwipeableViews>

      <LoaderComponent isLoader={loader} />
      <Modal
        open={deleteGoodId}
        onClose={() => setDeleteGoodId(false)}
        onConfirm={handleDeleteGood}
        loading={false}
      />
      <Modal
        open={deleteModal}
        onClose={() => setDeleteModal(null)}
        onConfirm={handleDeleteItem}
        loading={false}
      />
    </Card>
  );
};

export default Products;
