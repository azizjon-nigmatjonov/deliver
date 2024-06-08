import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

const AddComboTable = ({ comboData, t }) => {
  return (
    <TableContainer
      className="rounded-md border border-lightgray-1 overflow-auto mb-8"
      style={{ maxHeight: "200px" }}
    >
      <Table aria-label="simple-table">
        <TableHead>
          <TableRow>
            <TableCell>№</TableCell>
            <TableCell>{t("photo")}</TableCell>
            <TableCell>{t("name")}</TableCell>
            <TableCell>{t("vendor_code")}</TableCell>
            <TableCell>{t("type")}</TableCell>
            <TableCell>{t("price")}</TableCell>
            <TableCell>{t("description")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {comboData?.map((data, index) => (
            <TableRow>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                <img
                  src={`${process.env.REACT_APP_MINIO_URL}/${data?.image}`}
                  alt="product"
                  width={"50"}
                  height={"50"}
                />
              </TableCell>
              <TableCell>{data?.title?.ru}</TableCell>
              <TableCell>{data?.code}</TableCell>
              <TableCell>{data?.type}</TableCell>
              <TableCell>{data?.out_price}</TableCell>
              <TableCell>{data?.description?.ru}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AddComboTable;
