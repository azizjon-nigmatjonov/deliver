import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { withStyles } from "@mui/styles";
import { useTranslation } from "react-i18next";
import { formatPrice } from "utils/formatPrice";

const StyledTableCell = withStyles((theme) => ({
  head: {
    border: "none",
    paddingTop: "0px !important",
    "&:first-child": {
      color: "rgba(0, 0, 0, 0.5) !important",
    },
  },
  body: {
    border: "none",
    borderBottom: "1px solid #F1F2F4",
    "&:first-child": {
      background: "white",
    },
  },
}))(TableCell);

const ABCTable = ({ data, totalCount, lastBookElementRef }) => {
  const { t } = useTranslation();

  return (
    <>
      <TableContainer style={{ overflowY: "scroll", maxHeight: "484px" }}>
        <Table
          stickyHeader
          style={{ borderCollapse: "collapse" }}
          aria-label="simple table"
        >
          <TableHead>
            <TableRow>
              <StyledTableCell> № </StyledTableCell>
              <StyledTableCell> {t("name")} </StyledTableCell>
              <StyledTableCell> {t("saled.count")} </StyledTableCell>
              <StyledTableCell> {t("share.of.total")}(%) </StyledTableCell>
              <StyledTableCell> {t("growing.total")}(%) </StyledTableCell>
              <StyledTableCell width={"150px"}> {t("group")}</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((item, index) => (
              <TableRow
                ref={lastBookElementRef}
                key={item?.product_id}
                style={{
                  background:
                    item?.group === "A"
                      ? "#CEE8CE80"
                      : item?.group === "B"
                      ? "#E8E8CE80"
                      : "#E8CECE80",
                }}
              >
                <StyledTableCell
                  style={{
                    background: index % 2 === 0 ? "#F9FAFA" : "white",
                  }}
                >
                  {index + 1}
                </StyledTableCell>
                <StyledTableCell>{item?.product_name?.ru}</StyledTableCell>
                <StyledTableCell width={"250px"}>
                  {formatPrice(item?.saled_amount)} сум
                </StyledTableCell>
                <StyledTableCell>{item?.percent_from_all}%</StyledTableCell>
                <StyledTableCell width={"250px"}>
                  {item?.percent_growing}%
                </StyledTableCell>
                <StyledTableCell
                  style={{
                    borderLeft: "1px solid",
                    textAlign: "center",
                  }}
                >
                  {item?.group}
                </StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TableContainer>
        <Table aria-label="simple table">
          <TableBody>
            <TableRow>
              <StyledTableCell></StyledTableCell>
              <StyledTableCell style={{ fontWeight: "600" }}>
                {t("total")}
              </StyledTableCell>
              <StyledTableCell style={{ fontWeight: "600" }}>
                {formatPrice(totalCount)} сум
              </StyledTableCell>
              <StyledTableCell colSpan={3}></StyledTableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ABCTable;
