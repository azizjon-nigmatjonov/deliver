import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { withStyles } from "@mui/styles";
import { ArrowDropDown, ArrowDropUp } from "constants/icons";
import LoaderComponent from "components/Loader";
import { formatPrice } from "utils/formatPrice";

const StyledTableCell = withStyles((theme) => ({
  head: {
    padding: "13px 10px !important",
    "&:first-child": {
      color: "rgba(0, 0, 0, 0.5) !important",
    },
  },
  body: {
    padding: "13px 10px !important",
    borderBottom: "1px solid #F1F2F4",
  },
}))(TableCell);

const BranchTable = ({ data, setOrderBy, loading }) => {
  const { t } = useTranslation();
  const [arrowOrderCount, setOrderCount] = useState(null);
  const [arrowOrderSum, setOrderSum] = useState(null);

  const orderCountToggle = () => {
    setOrderBy({ sort: "count", value: arrowOrderCount ? "desc" : "asc" });
    setOrderCount((prev) => !prev);
  };
  const orderSumToggle = () => {
    setOrderBy({ sort: "price", value: arrowOrderSum ? "desc" : "asc" });
    setOrderSum((prev) => !prev);
  };

  return (
    <>
      <TableContainer style={{ overFlowy: "scroll", maxHeight: "400px" }}>
        <Table
          stickyHeader
          style={{ borderCollapse: "collapse" }}
          aria-label="simple table"
        >
          <TableHead>
            <TableRow>
              <StyledTableCell style={{ textAlign: "center" }}>
                №
              </StyledTableCell>
              <StyledTableCell>{t("name")}</StyledTableCell>
              <StyledTableCell width={"210px"}>
                <div className="flex gap-3 items-end cursor-pointer">
                  {t("order.amount")}
                  <div className="flex flex-col" onClick={orderCountToggle}>
                    <ArrowDropUp
                      color={arrowOrderCount ? "black" : "#9AAFCD"}
                    />
                    <ArrowDropDown
                      color={
                        !arrowOrderCount && arrowOrderCount !== null
                          ? "black"
                          : "#9AAFCD"
                      }
                    />
                  </div>
                </div>
              </StyledTableCell>
              <StyledTableCell>{t("sum.average.bill")}</StyledTableCell>
              <StyledTableCell>
                <div className="flex gap-3 items-end cursor-pointer">
                  {t("order.of.sum")}
                  <div className="flex flex-col" onClick={orderSumToggle}>
                    <ArrowDropUp color={arrowOrderSum ? "black" : "#9AAFCD"} />
                    <ArrowDropDown
                      color={
                        !arrowOrderSum && arrowOrderSum !== null
                          ? "black"
                          : "#9AAFCD"
                      }
                    />
                  </div>
                </div>
              </StyledTableCell>
              <StyledTableCell width={"203px"}>
                {t("average.sum.of.delivery")}
              </StyledTableCell>
              <StyledTableCell width={"191px"}>
                {t("average.time.cooking")}
              </StyledTableCell>
            </TableRow>
          </TableHead>
          {!loading && (
            <TableBody>
              {data?.map((item, index) => (
                <TableRow
                  key={item?.id}
                  style={{ background: index % 2 === 0 ? "white" : "#F9FAFA" }}
                >
                  <StyledTableCell style={{ textAlign: "center" }}>
                    {index + 1}
                  </StyledTableCell>
                  <StyledTableCell>{item.name}</StyledTableCell>
                  <StyledTableCell>{item.order_count}</StyledTableCell>
                  <StyledTableCell>
                    {formatPrice(item.order_average_amount)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {formatPrice(item.order_total_amount)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {item.average_delivery_time}
                  </StyledTableCell>
                  <StyledTableCell>{item.average_cooking_time}</StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </TableContainer>

      <LoaderComponent isLoader={loading} height={32} />
    </>
  );
};

export default BranchTable;
