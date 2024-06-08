import React from "react";
import { SortableElement } from "react-sortable-hoc";
import { TableCell, TableRow } from "@mui/material";

const SortableItem = SortableElement(({ value, index, key, columns }) => (
  <TableRow key={key}>
    {columns.map((col) => (
      <TableCell key={col.key} style={{ backgroundColor: "#fff" }}>
        {col.render ? col.render(value, index, columns.length === 1) : "----"}
      </TableCell>
    ))}
  </TableRow>
));

export default SortableItem;
