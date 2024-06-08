import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";

export default function GPTReportTable({ data }) {
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const _columns = data?.columns?.map((item) => ({
      title: item.label,
      key: item.slug,
      render: (record) => record[item.slug],
    }));
    setColumns(_columns);
  }, [data]);

  return (
    <TableContainer className="rounded-lg border border-lightgray-1">
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            {columns?.map((item) => (
              <TableCell
                style={{ textAlign: "center" }}
                key={item.key}
                className="whitespace-nowrap"
              >
                {item.title}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.rows?.map((item, index) => (
            <TableRow
              key={item.column}
              className={index % 2 === 0 ? "bg-lightgray-5" : ""}
            >
              {columns?.map((col) => (
                <TableCell
                  style={{ textAlign: "center" }}
                  key={col.key}
                  className="whitespace-nowrap"
                >
                  {col.render(item)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
