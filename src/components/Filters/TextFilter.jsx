import React from "react";
import FilterDropdown from "./FilterDropdown";
import Sorter from "./Sorter";

const TextFilter = ({
  title,
  filterOptions,
  onFilter,
  sorter,
  onSort,
  style,
  initialSorterValue,
  customIcon,
  className,
  ...props
}) => (
  <div className="flex justify-between items-center" style={style}>
    <div
      key="column-title"
      className={`flex items-center gap-2.5 justify-between w-full whitespace-nowrap ${className}`}
    >
      {title}
      {sorter && onSort && (
        <Sorter
          customIcon={customIcon}
          value={initialSorterValue}
          onChange={onSort}
        />
      )}
    </div>
    {/* {filterOptions && filterOptions.length > 0 && (
      <FilterDropdown options={filterOptions} onFilter={onFilter} {...props} />
    )} */}
  </div>
);

export default React.memo(TextFilter);
