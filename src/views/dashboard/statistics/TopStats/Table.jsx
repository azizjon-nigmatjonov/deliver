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
import { formatPrice } from "utils/formatPrice";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUpRounded";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDownRounded";

const StyledTableCell = withStyles((theme) => ({
  head: {
    padding: "13px 10px !important",
    borderBottom: "1px solid #F1F2F4 !important",
    "&:first-child": {
      color: "rgba(0, 0, 0, 0.5) !important",
    },
  },
  body: {
    padding: "13px 10px !important",
    borderBottom: "1px solid #F1F2F4 !important",
  },
}))(TableCell);

const TopTable = ({ data, type, setOrderBy }) => {
  const [status, setStatus] = useState({});

  const { t } = useTranslation();

  const toggle = (sort) => {
    setStatus((prevState) => ({
      ...prevState,
      [sort]: prevState[sort] ? !prevState[sort] : true,
    }));
    let bool = status[sort] ? !status[sort] : true;
    setOrderBy({ sort, value: bool ? "asc" : "desc" });
  };

  return (
    <TableContainer style={{ overFlowy: "scroll", maxHeight: "400px" }}>
      <Table
        stickyHeader
        style={{ borderCollapse: "collapse" }}
        aria-label="simple table"
      >
        <TableHead>
          <TableRow>
            <StyledTableCell>№</StyledTableCell>
            <StyledTableCell>{t("fio")}</StyledTableCell>
            <StyledTableCell>
              <div className="flex items-center gap-4">
                {t("count.orders")}
                <div
                  className="flex flex-col cursor-pointer"
                  onClick={() => toggle("count")}
                >
                  <ArrowDropUpIcon
                    style={{ color: status.count ? "black" : "#9AAFCD" }}
                  />
                  <ArrowDropDownIcon
                    style={{
                      color:
                        !status.count && status.count !== undefined
                          ? "black"
                          : "#9AAFCD",
                    }}
                  />
                </div>
              </div>
            </StyledTableCell>
            <StyledTableCell>
              <div className="flex items-center gap-4">
                <p>
                  {type === "operator" ? t("sum.of.order") : t("distance2")}
                </p>
                <div
                  className="flex flex-col cursor-pointer"
                  onClick={() =>
                    toggle(type === "operator" ? "price" : "distance")
                  }
                >
                  <ArrowDropUpIcon
                    style={{
                      color: (
                        type === "operator" ? status.price : status.distance
                      )
                        ? "black"
                        : "#9AAFCD",
                    }}
                  />
                  <ArrowDropDownIcon
                    style={{
                      color: (
                        type === "operator"
                          ? !status.price && status.price !== undefined
                          : !status.distance && status.distance !== undefined
                      )
                        ? "black"
                        : "#9AAFCD",
                    }}
                  />
                </div>
              </div>
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((item, index) => (
            <TableRow
              // ref={lastElementRef}
              key={item?.id + item?.name}
              style={{
                background: index % 2 === 0 ? "white" : "#F9FAFA",
              }}
            >
              <StyledTableCell>{index + 1}</StyledTableCell>
              <StyledTableCell>{item.name}</StyledTableCell>
              <StyledTableCell>{item.total_count}</StyledTableCell>
              <StyledTableCell>
                {formatPrice(item.total_sum) || item.total_distance}
              </StyledTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TopTable;
