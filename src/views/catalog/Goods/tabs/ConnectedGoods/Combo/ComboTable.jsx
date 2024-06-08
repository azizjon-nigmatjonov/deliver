import { useState, useMemo, useEffect } from "react";
import Pagination from "components/Pagination";
import LoaderComponent from "components/Loader";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Card from "components/Card";
import { useTranslation } from "react-i18next";
import DeleteIcon from "@mui/icons-material/Delete";
import Modal from "components/Modal";
import ActionMenu from "components/ActionMenu";
import EditIcon from "@mui/icons-material/Edit";

export default function ComboTable({
  items,
  isLoading,
  setDeleteModal,
  limit,
  setLimit,
  currentPage,
  setCurrentPage,
  setConnectProductsModal,
  setComboExtras,
  setComboData,
}) {
  const { t } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [variantModalStatus, setVariantModalStatus] = useState(false);
  const [variants, setVariants] = useState([]);

  // const myArray = [
  //   false,
  //   24,
  //   "English",
  //   false,
  //   "english",
  //   22,
  //   19,
  //   false,
  //   "English",
  //   19,
  // ];

  const initialColumns = useMemo(() => {
    return [
      {
        title: "№",
        key: "order-number",
        render: (record, index) => (currentPage - 1) * limit + index + 1,
      },
      {
        title: t("product.name"),
        key: "product_name",
        render: (record) => record.title.ru,
      },
      {
        title: t("quantity"),
        key: "quantity",
        render: (record) => record.quantity,
      },
      {
        title: t("type"),
        key: "type",
        render: (record) =>
          record.type === "combo_basic" ? t("simple.combo") : t("group.combo"),
      },
    ];
  }, [t, currentPage, limit]);

  useEffect(() => {
    var _columns = [
      ...initialColumns,
      {
        title: t("action"),
        key: t("actions"),
        render: (record, _, disable) => (
          <div className="flex gap-2 justify-center">
            <ActionMenu
              id={record.id}
              actions={[
                {
                  icon: <EditIcon />,
                  color: "primary",
                  title: t("change"),
                  action: () => {
                    console.log("record", record);
                    setConnectProductsModal(true);
                    setComboExtras({
                      ru: record?.title?.ru,
                      uz: record?.title?.uz,
                      en: record?.title?.en,
                      quantity: record.quantity,
                      type: record.type,
                      group_id: record.id,
                    });
                    setComboData(record.variants);
                  },
                },
                {
                  icon: <DeleteIcon color="red" />,
                  color: "error",
                  title: t("delete"),
                  action: () => {
                    setDeleteModal(record.id);
                  },
                },
              ]}
            />
          </div>
        ),
      },
    ];
    setColumns(_columns);
  }, [initialColumns, t, setDeleteModal]);

  return (
    <Card
      footer={
        <Pagination
          title={t("general.count")}
          count={items?.count}
          onChange={(pageNumber) => setCurrentPage(pageNumber)}
          pageCount={limit}
          limit={limit}
          onChangeLimit={(limitNumber) => setLimit(limitNumber)}
        />
      }
      footerStyle={{ paddingRight: "0", paddingLeft: "0" }}
      bodyStyle={{ paddingRight: "0", paddingLeft: "0" }}
    >
      <TableContainer className="rounded-md border border-lightgray-1">
        <Table aria-label="simple-table">
          <TableHead>
            <TableRow>
              {columns.map((elm) => (
                <TableCell key={elm.key}>{elm.title}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!isLoading && items.data?.length
              ? items?.data?.map((item, index) => (
                  <TableRow
                    key={item.code}
                    onClick={() => {
                      setVariantModalStatus(true);
                      setVariants(item.variants);
                    }}
                  >
                    {columns?.map((col) => (
                      <TableCell
                        key={col.key}
                        style={{
                          width: "100vw",
                        }}
                      >
                        {col.render
                          ? col?.render(item, index, columns.length === 1)
                          : "----"}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal
        open={variantModalStatus}
        onClose={() => setVariantModalStatus(false)}
        isWarning={false}
        title={t("variation")}
        width={800}
        closeIcon
        footer={null}
      >
        <TableContainer className="rounded-md border border-lightgray-1">
          <Table aria-label="simple-table">
            <TableHead>
              <TableRow>
                <TableCell>{t("photo")}</TableCell>
                <TableCell>{t("name")}</TableCell>
                <TableCell>{t("vendor_code")}</TableCell>
                <TableCell>{t("price")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {variants.map((variant) => (
                <TableRow key={variant.code}>
                  <TableCell className="w-1/5">
                    <img
                      src={`${process.env.REACT_APP_MINIO_URL}/${variant.image}`}
                      alt="product img"
                      width={"50"}
                      height={"50"}
                    />
                  </TableCell>
                  <TableCell className="w-2/4">{variant.title.ru}</TableCell>
                  <TableCell className="w-1/4">{variant.code}</TableCell>
                  <TableCell className="w-1/4">{variant.out_price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Modal>
      <LoaderComponent isLoader={isLoading} />
    </Card>
  );
}
