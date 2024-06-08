import Card from "components/Card";
import { useEffect, useReducer, useState } from "react";
import { useTranslation } from "react-i18next";
import { getProductListABCXYZ } from "services";
import Pagination from "components/Pagination";
import Filter from "./Filter";
import Button from "components/Button";
import { DownloadIcon } from "constants/icons";
import { downloadProductsListAbcXyz } from "services/v2/excel";
import Table from "./AbcxyzTable";
import moment from "moment";
import Header from "components/Header";

const initialState = {
  abc: "A",
  xyz: "X",
  from_date: moment().subtract(1, "months").format("YYYY-MM"),
  to_date: moment().format("YYYY-MM"),
};

const reducer = (state, action) => {
  switch (action.type) {
    case "abc":
      return {
        ...state,
        abc: action.payload,
      };
    case "xyz":
      return {
        ...state,
        xyz: action.payload,
      };
    case "from_date":
      return {
        ...state,
        from_date: action.payload,
      };
    case "to_date":
      return {
        ...state,
        to_date: action.payload,
      };
    default:
      return state;
  }
};

const ABCXYZ = () => {
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loader, setLoader] = useState(true);
  const [data, setData] = useState({});
  const [abcxyz, dispatchAbcxyz] = useReducer(reducer, initialState);
  const { t } = useTranslation();

  // Fetch product list
  useEffect(() => {
    if (abcxyz.abc && abcxyz.xyz) {
      getProductListABCXYZ({
        abc_xyz: abcxyz.abc + abcxyz.xyz,
        from_date: abcxyz.from_date,
        to_date: abcxyz.to_date,
        page: currentPage,
        limit: limit,
      })
        .then((res) =>
          setData({
            products: res?.products,
            count: res?.count,
          }),
        )
        .catch((err) => console.log(err))
        .finally(() => setLoader(false));
    }
  }, [abcxyz, limit, currentPage]);

  const downloadURL = (url, name) => {
    var link = document.createElement("a");
    link.setAttribute("download", name);
    link.href = url;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const downloadExcel = () => {
    downloadProductsListAbcXyz({
      abc_xyz: abcxyz.abc + abcxyz.xyz,
      from_date: abcxyz.from_date,
      to_date: abcxyz.to_date,
    }).then((res) => {
      downloadURL(res?.url, res?.file_name);
    });
  };

  return (
    <>
      <Header title="ABC-XYZ" />
      <Card
        className="m-4"
        title={<Filter AbcXyzState={abcxyz} dispatchAbcXyz={dispatchAbcxyz} />}
        extra={
          <Button
            icon={DownloadIcon}
            iconClassName="text-blue-600"
            color="zinc"
            shape="outlined"
            size="medium"
            onClick={downloadExcel}
          >
            {t("download")}
          </Button>
        }
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
        <Table
          loader={loader}
          data={data?.products}
          currentPage={currentPage}
          limit={limit}
        />
      </Card>
    </>
  );
};

export default ABCXYZ;
