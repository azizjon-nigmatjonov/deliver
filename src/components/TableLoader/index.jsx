import { CircularProgress } from "@mui/material";

const TableLoader = ({ isVisible = true, type = "table" }) => {
  if (!isVisible) return null;

  return (
    <div className="absolute w-full h-full opacity-50 bg-white top-0 left-0 items-center flex justify-center align-center py-10">
      <CircularProgress />
    </div>
  );
};

export default TableLoader;
