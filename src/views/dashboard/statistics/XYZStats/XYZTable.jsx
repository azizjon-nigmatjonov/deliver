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
import _ from "lodash";
import "../../dashboard.scss";

const StyledTableRow = withStyles(() => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: "#F4F6FA",
    },
    cursor: "pointer",
  },
}))(TableRow);

const StyledTableCell = withStyles(() => ({
  head: {
    color: "#1A2024",
    height: "40px",
    fontSize: 14,
    fontWeight: 600,
    lineHeight: "24px",
    //   boxShadow: "inset -1px -1px 0px #E5E9EB, inset 0.5px 0.5px 0px #E5E9EB",
    border: "none",
    padding: "12px",
    textAlign: "center",
  },
  body: {
    height: "40px",
    fontSize: 13,
    color: "#1A2024",
    padding: "12px",
    //   boxShadow: "inset -1px -1px 0px #E5E9EB, inset 0.7px 0.5px 0px #E5E9EB",
    border: "none",
    whiteSpace: "break-spaces",
  },
}))(TableCell);

const isSticky = (
  sticky,
  left = 0,
  right,
  minWidth,
  boxShadow,
  zIndex,
  padding,
  borderRight,
) => {
  if (sticky) {
    return {
      position: "sticky",
      left: left,
      right: right,
      // backgroundColor: "#fff",
      minWidth: minWidth,
      boxShadow: boxShadow ? boxShadow : "",
      padding: padding ? padding : "",
      borderRight: borderRight ? borderRight : "",
      zIndex: zIndex,
    };
  } else if (minWidth) {
    return {
      minWidth: minWidth,
      boxShadow: boxShadow ? boxShadow : "",
    };
  } else {
    return "";
  }
};

const XYZTable = ({ columns, values, lastBookElementRef }) => {
  const { t } = useTranslation();
  return (
    <>
      <TableContainer style={{ overFlowy: "scroll", maxHeight: "484px" }}>
        <Table
          stickyHeader
          style={{ borderCollapse: "collapse" }}
          aria-label="simple table"
        >
          <TableHead>
            <TableRow>
              {columns?.map((column) => (
                <StyledTableCell
                  style={
                    column?.sticky
                      ? isSticky(
                          column?.sticky,
                          column?.left,
                          column?.right,
                          column?.minWidth,
                          column?.boxShadow,
                          column?.zIndex,
                        )
                      : column?.minWidth
                      ? isSticky(null, null, null, column?.minWidth)
                      : {}
                  }
                  align={column.align}
                  key={column.key}
                >
                  {column.name === "status" || column.name === "Статус" ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        justifyContent: "center",
                      }}
                    >
                      <span>{t(column.name)}</span>
                    </div>
                  ) : (
                    <div style={{ whiteSpace: "nowrap" }}>{t(column.name)}</div>
                  )}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {values?.map((row, index) => (
              <StyledTableRow
                ref={lastBookElementRef}
                style={{
                  background:
                    row?.group === "X"
                      ? "#E6F4E6"
                      : row?.group === "Y"
                      ? "#F4F4E5"
                      : row?.group === ""
                      ? "#F4E6E5"
                      : "#F4E6E5",
                }}
                key={
                  row?.all_amount_products +
                  row?.average_amount_products +
                  row?.group +
                  row?.percent_variation +
                  row?.product_name +
                  row?.stdo
                }
              >
                <>
                  {columns?.map((column) => {
                    // ! CASE FOR INDEX
                    if (column.type === "index") {
                      return (
                        <StyledTableCell
                          align={column.align}
                          key={column.key}
                          className={
                            index % 2 === 0 ? "oddTableCell" : "evenTableCell"
                          }
                          width="48"
                          style={
                            isSticky(
                              column?.sticky,
                              column?.left,
                              column?.right,
                              column?.minWidth,
                              column?.boxShadow,
                            ) || {}
                          }
                        >
                          <div>{index + 1}</div>
                        </StyledTableCell>
                      );
                    }

                    // ! CASE FOR NESTED OBJECTS
                    if (column.type === "nested") {
                      const nestedKey = column.key.split(".");
                      return (
                        <StyledTableCell
                          align={column.align}
                          key={column.key}
                          // className={ index % 2 === 0 ? cls.checkCell : ""}
                          style={
                            isSticky(
                              column?.sticky,
                              column?.left,
                              column?.right,
                              column?.minWidth,
                            ) || {}
                          }
                        >
                          {_.get(row, nestedKey)}
                        </StyledTableCell>
                      );
                    }

                    if (column.type === "price") {
                      return (
                        <StyledTableCell
                          //   className={index % 2 === 0 ? cls.checkCell : ""}
                          style={
                            column?.sticky
                              ? isSticky(
                                  column?.sticky,
                                  column?.left,
                                  column?.right,
                                  column?.minWidth,
                                  column?.boxShadow,
                                )
                              : column?.minWidth
                              ? isSticky(null, null, null, column?.minWidth)
                              : {}
                          }
                          align={column.align}
                          key={column.key}
                          className={
                            column?.sticky
                              ? row?.group === "Z"
                                ? "stickedTableCellZ"
                                : row?.group === "Y"
                                ? "stickedTableCellY"
                                : row?.group === "X"
                                ? "stickedTableCellX"
                                : "stickedTableCellZ"
                              : ""
                          }
                        >
                          {formatPrice(row[column.key])}
                        </StyledTableCell>
                      );
                    }
                    // ! CASE FOR DEFAULT
                    return (
                      <StyledTableCell
                        style={
                          column?.sticky
                            ? isSticky(
                                column?.sticky,
                                column?.left,
                                column?.right,
                                column?.minWidth,
                                column?.boxShadow,
                                column?.background,
                              )
                            : column?.minWidth
                            ? isSticky(null, null, null, column?.minWidth)
                            : {}
                        }
                        align={column.align}
                        key={column.key}
                        className={
                          column?.sticky
                            ? row?.group === "Z"
                              ? "stickedTableCellZ"
                              : row?.group === "Y"
                              ? "stickedTableCellY"
                              : row?.group === "X"
                              ? "stickedTableCellX"
                              : "stickedTableCellZ"
                            : ""
                        }
                      >
                        {row[column.key]}
                      </StyledTableCell>
                    );
                  })}
                </>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default XYZTable;
