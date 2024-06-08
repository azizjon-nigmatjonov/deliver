import {
  createTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
} from "@mui/material";

export default function CTable({
  headColumns,
  bodyData,
  // footerColumns,
  isLoading = false,
  footerData,
}) {
  return (
    <div style={{ borderTop: "1px solid #EEEEEE", paddingTop: "10px" }}>
      <TableContainer className="rounded-lg border border-lightgray-1">
        <Table aria-label="simple-table">
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
                      <TableCell key={col?.key}>
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
                        style={{ fontWeight: "900", color: "#1A2024" }}
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
                    <TableCell style={{ fontWeight: "900", color: "#1A2024" }}>
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
        </Table>
      </TableContainer>
    </div>
  );
}
