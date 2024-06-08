import { TableRow } from "@mui/material";
import { useState } from "react";

const ExpandableTableRow = ({
  children,
  expandComponent,
  onClick,
  ...otherProps
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <TableRow
        {...otherProps}
        onClick={() => {
          setIsExpanded(!isExpanded);
          onClick();
        }}
      >
        {children}
      </TableRow>
      {isExpanded && expandComponent}
    </>
  );
};

export default ExpandableTableRow;
