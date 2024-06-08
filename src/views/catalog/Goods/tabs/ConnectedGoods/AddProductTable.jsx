import { useEffect, useState, useMemo, useCallback, useReducer } from "react";
import Pagination from "components/Pagination";
import { useTranslation } from "react-i18next";
import { getNonVariantProducts } from "services/v2";
import { useHistory } from "react-router-dom";
import LoaderComponent from "components/Loader";
import Card from "components/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import CustomCheckbox from "components/Checkbox/Checkbox";
import Search from "components/Search";
import { flatten } from "lodash";

var reducer = function (state, { type, payload }) {
  const [...products] = state;

  switch (type) {
    case "set":
      products[payload.page][payload.id] = !products[payload.page][payload.id];
      return products;
    case "set-all":
      payload.products.forEach((id) => {
        products[payload.page][id] = payload.to;
      });
      return products;
    case "create-new-entry":
      return products.concat({});
    default:
      return state;
  }
};

export default function AddProductTable({
  setConnectProductBtnDisabled,
  setProductIds,
}) {
  const { t } = useTranslation();
  const history = useHistory();

  const [products, dispatchProducts] = useReducer(reducer, [{}]);
  const [allChecked, setAllChecked] = useState(false);
  const [search, setSearch] = useState("");
  const [items, setItems] = useState({});
  const [loader, setLoader] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [columns, setColumns] = useState([]);

  const getItems = useCallback(
    (page) => {
      setLoader(true);
      getNonVariantProducts({
        limit,
        page,
        search,
      })
        .then((res) => {
          setItems({
            count: res?.count,
            data: res?.products,
          });
        })
        .catch((err) => console.log(err))
        .finally(() => setLoader(false));
    },
    [limit, search],
  );

  const initialColumns = useMemo(
    () => [
      {
        title: (
          <CustomCheckbox
            color="primary"
            checked={allChecked}
            onChange={(e) => {
              setAllChecked((prev) => {
                dispatchProducts({
                  type: "set-all",
                  payload: {
                    products: items?.data?.map((item) => item.id),
                    to: !prev,
                    page: currentPage - 1,
                  },
                });
                return !prev;
              });
            }}
          />
        ),
        key: "checkbox",
        render: (record) => {
          return (
            <CustomCheckbox
              color="primary"
              checked={products[currentPage - 1][record.id] ? true : false}
              onChange={(e) => {
                dispatchProducts({
                  type: "set",
                  payload: { page: currentPage - 1, id: record.id },
                });
              }}
            />
          );
        },
      },
      // {
      //   title: t("photo"),
      //   key: "photo",
      //   render: (record) => (
      //     <img
      //       src={`${process.env.REACT_APP_MINIO_URL}/${record.image}`}
      //       alt="brand logo"
      //       width={"50"}
      //       height={"50"}
      //     />
      //   ),
      // },
      {
        title: t("name"),
        key: "name",
        render: (record) => record.title.ru,
      },
      // {
      //   title: t("vendor_code"),
      //   key: "vendor_code",
      //   render: (record) => record.code,
      // },
      // {
      //   title: t("attributes"),
      //   key: "attributes",
      //   render: (record) => <>{record.attributes}</>,
      // },
      {
        title: t("price"),
        key: "price",
        render: (record) => record.out_price,
      },
    ],
    [currentPage, allChecked, items.data, products, t],
  );

  useEffect(() => {
    var userHasChecked;
    products.forEach((page) => {
      if (Object.values(page).some((val) => !!val)) {
        userHasChecked = true;
      }
    });
    if (userHasChecked) {
      setConnectProductBtnDisabled(false);
    } else {
      setConnectProductBtnDisabled(true);
    }
  }, [products, setConnectProductBtnDisabled]);

  const handleEntries = useCallback(() => {
    let entries = Object.values(products[currentPage - 1]);
    let allEntriesChecked = entries.length
      ? entries.every((entry) => entry === true)
      : false;
    setAllChecked(allEntriesChecked);
  }, [currentPage]);

  useEffect(() => {
    const _columns = [...initialColumns];
    setColumns(_columns);
  }, [history, t, initialColumns]);

  useEffect(() => {
    getItems(currentPage);
  }, [currentPage, search, limit, getItems]);

  useEffect(() => {
    var ids = products.map((pageIds) => {
      var checkedEntries = [];

      for (let [id, status] of Object.entries(pageIds)) {
        if (status) {
          checkedEntries.push(id);
        }
      }
      return checkedEntries;
    });
    setProductIds(flatten(ids));
  }, [products, setProductIds]);

  return (
    <Card
      title={<Search setSearch={(value) => setSearch(value)} />}
      footer={
        <Pagination
          title={t("general.count")}
          count={items?.count}
          onChange={(pageNumber) => {
            if (pageNumber > products.length) {
              dispatchProducts({ type: "create-new-entry" });
            }
            handleEntries();
            setCurrentPage(pageNumber);
          }}
          pageCount={limit}
          limit={limit}
          onChangeLimit={(limitNumber) => setLimit(limitNumber)}
        />
      }
      bodyStyle={{ padding: "0 0 1rem 0" }}
      footerStyle={{ padding: "0.75rem 0" }}
      headerStyle={{ marginBottom: "1rem", padding: "0.5rem 0" }}
    >
      <TableContainer className="rounded-md border border-lightgray-1 overflow-auto max-h-96">
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              {columns.map((elm) => (
                <TableCell key={elm.key}>{elm.title}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!loader &&
              items?.data?.length > 0 &&
              items?.data?.map((elm, index) => (
                <TableRow
                  key={elm.id}
                  className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                >
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      {col.render
                        ? col.render(elm, index, columns.length === 1)
                        : "----"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <LoaderComponent isLoader={loader} />
    </Card>
  );
}
