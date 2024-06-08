import { useState } from "react";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Popover } from "@mui/material";
import { Pagination as MuiPagination } from "@mui/material";

function Pagination({
  count = 0,
  limit = 10,
  onChange = () => {},
  onChangeLimit = () => {},
  noLimitChange,
  marginTop = 0,
  // currentPage = 1,
  // children,
  // className = "",
  // size = "large",
  // type = "simple",
  // pageBound = 5,
  // pageCount = 10,
  // title = "Elementlar soni",
}) {
  const [page, setPage] = useState(1);
  // const [upperPageBound, setUpperPageBound] = useState(pageBound);
  // const [lowerPageBound, setLowerPageBound] = useState(0);

  // useEffect(() => {
  //   onChange(page);
  // }, [page]);

  // const getSize = (theme) => {
  //   switch (theme) {
  //     case "large":
  //       return {
  //         size: "text-sm",
  //         width: "88px",
  //         height: "32px",
  //         // padding: "py-1 px-3",
  //       };
  //     case "small":
  //       return {
  //         size: "text-xs",
  //         width: "72px",
  //         height: "24px",
  //         // padding: "px-2",
  //       };
  //     default:
  //   }
  // };

  // get the number of pages
  // const pages = Math.ceil(count / pageCount);
  // const gaps = Math.ceil(pages / (pageBound * 2))

  // const btnIncrementClick = () => {
  //   setUpperPageBound(upperPageBound + pageBound);
  //   setLowerPageBound(lowerPageBound + pageBound);
  //   let listId = upperPageBound + 1;
  //   setIsActivePage(listId);
  // };

  // const btnDecrementClick = () => {
  //   setUpperPageBound(upperPageBound - pageBound);
  //   setLowerPageBound(lowerPageBound - pageBound);
  //   let listId = upperPageBound - pageBound;
  //   setIsActivePage(listId);
  // };

  // const listedItems = [];
  // for (let i = 1; i <= pages; i++) {
  //   listedItems.push(i);
  // }
  // let pageIncrementBtn = null;
  // let pageDecrementBtn = null;

  // DOTS before
  // if (lowerPageBound >= 1) {
  //   pageDecrementBtn = (
  //     <span
  //       className="rounded w-8 h-8 flex items-center justify-center mx-0.5 hover:bg-primary hover:text-white cursor-pointer"
  //       onClick={btnDecrementClick}
  //     >
  //       &hellip;
  //     </span>
  //   );
  // }

  // DOTS after
  // if (upperPageBound <= pages) {
  //   pageIncrementBtn = (
  //     <span
  //       className="rounded w-8 h-8 flex items-center justify-center mx-0.5 hover:bg-primary hover:text-white cursor-pointer"
  //       onClick={btnIncrementClick}
  //     >
  //       &hellip;
  //     </span>
  //   );
  // }

  // const handleClick = (event) => {
  //   let listId = Number(event.target.id);
  //   setIsActivePage(listId);
  // };

  // const handleLastItemClick = () => {
  //   setUpperPageBound(pages + 1);
  //   setLowerPageBound(pages - pageBound);

  //   setIsActivePage(pages);
  // };

  // const handleFirstItemClick = () => {
  //   setUpperPageBound(pageBound);
  //   setLowerPageBound(0);

  //   setIsActivePage(listedItems[0]);
  // };

  // const renderPageNumbers = listedItems.map((number) => {
  //   if (number === 1 && isActivePage === 1) {
  //     return (
  //       <span
  //         key={number + Math.random()}
  //         className={`
  //         bg-primary text-white rounded w-8 h-8 flex items-center justify-center mx-0.5 hover:bg-primary hover:text-white cursor-pointer`}
  //         id={number}
  //         onClick={handleClick}
  //       >
  //         {number}
  //       </span>
  //     );
  //   } else if (number < upperPageBound + 1 && number > lowerPageBound) {
  //     return (
  //       <span
  //         className={`${
  //           isActivePage === number && "bg-primary text-white"
  //         } rounded w-8 h-8 flex items-center justify-center mx-0.5 hover:bg-primary hover:text-white cursor-pointer`}
  //         key={number + Math.random()}
  //         id={number}
  //         onClick={handleClick}
  //       >
  //         {number}
  //       </span>
  //     );
  //   }
  //   return <span key={number + Math.random()}></span>;
  // });

  // go to previous page
  // const goToPrevPage = () => {
  //   if (isActivePage !== 1) {
  //     if ((isActivePage - 1) % pageBound === 0) {
  //       setUpperPageBound((prev) => prev - pageBound);
  //       setLowerPageBound((prev) => prev - pageBound);
  //     }
  //     let listId = isActivePage - 1;
  //     setIsActivePage(listId);
  //   }
  // };

  // go to next page
  // const goToNextPage = () => {
  //   if (isActivePage !== pages) {
  //     if (isActivePage + 1 > upperPageBound) {
  //       setUpperPageBound((prev) => prev + pageBound);
  //       setLowerPageBound((prev) => prev + pageBound);
  //     }
  //     let listId = isActivePage + 1;
  //     setIsActivePage(listId);
  //   }
  // };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClickPopup = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div
      className={`flex w-full align-center ${
        noLimitChange ? "justify-end" : "justify-between"
      }`}
      style={{ marginTop }}
    >
      {/* <sta>{`${title}: ${count}`}</p> */}
      {!noLimitChange && (
        <div
          className="py-1.5 px-4 text-sm border rounded-md flex items-center text-primary cursor-pointer"
          onClick={handleClickPopup}
        >
          <InsertDriveFileIcon fontSize="small" className="mr-2" />
          <span className="text-black-1 font-medium">Показать по {limit}</span>
          <KeyboardArrowDownIcon className="ml-2" />
        </div>
      )}
      {count !== 0 && (
        <MuiPagination
          count={Math.ceil(count / limit)}
          shape="rounded"
          color="primary"
          page={page}
          onChange={(_, value) => {
            onChange(value);
            setPage(value);
          }}
        />
      )}
      {!noLimitChange && (
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <div
            className="w-40 px-3 py-2 hover:bg-gray-50 cursor-pointer text-base font-medium"
            onClick={() => {
              onChangeLimit(10);
              handleClose();
            }}
          >
            10
          </div>
          <div
            className="w-40 px-3 py-2 hover:bg-gray-50 cursor-pointer text-base font-medium"
            onClick={() => {
              onChangeLimit(30);
              handleClose();
            }}
          >
            30
          </div>
          <div
            className="w-40 px-3 py-2 hover:bg-gray-50 cursor-pointer text-base font-medium"
            onClick={() => {
              onChangeLimit(50);
              handleClose();
            }}
          >
            50
          </div>
        </Popover>
      )}
    </div>
  );
}

export default Pagination;
