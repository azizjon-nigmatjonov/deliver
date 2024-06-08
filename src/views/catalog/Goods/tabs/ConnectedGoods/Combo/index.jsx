import { useEffect, useState, useCallback } from "react";
import Modal from "components/Modal";
import { useTranslation } from "react-i18next";
import { getComboProduct, deleteComboProduct } from "services/v2";
import MuiButton from "@mui/material/Button";
import { useParams } from "react-router-dom";
import ComboTable from "./ComboTable";
import AddIcon from "@mui/icons-material/Add";
import AddCombo from "./AddCombo";

// const useStyles = makeStyles((theme) => ({
//   root: {
//     "& > *": {
//       width: "100%",
//       border: "1px solid #ddd",
//       color: "#0e73f6",
//       marginTop: "1rem",
//     },
//     "& > *:hover": {
//       border: "1px solid #0e73f6",
//       background: "#fff",
//     },
//   },
//   icon: {
//     color: "#0e73f6",
//   },
// }));

export default function Combo({ parentFormik, addModal, setAddModal }) {
  const { t } = useTranslation();
  const params = useParams();

  const [items, setItems] = useState({});
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [connectProductsModal, setConnectProductsModal] = useState(false);
  const [connectProductLoading, setConnectProductLoading] = useState(false);
  const [connectProductBtnDisabled, setConnectProductBtnDisabled] =
    useState(true);
  const [comboProducts, setComboProducts] = useState([]);
  const [comboExtras, setComboExtras] = useState(null);
  const [comboData, setComboData] = useState([]);

  const getItems = useCallback(() => {
    setIsLoading(true);
    getComboProduct(params.id, {
      limit,
      page: currentPage,
    })
      .then((res) => {
        setItems({
          count: res?.count,
          data: res?.groups,
        });
      })
      .finally(() => setIsLoading(false));
  }, [params.id, limit, currentPage]);

  const handleDeleteItem = useCallback(
    (e) => {
      setDeleteLoading(true);
      deleteComboProduct(deleteModal).then((res) => {
        setDeleteModal(false);
        setDeleteLoading(false);
        getItems();
      });
    },
    [deleteModal, getItems],
  );

  const closeModal = () => {
    setAddModal(false);
    setDeleteModal(false);
    setConnectProductsModal(false);
    // parentFormik.resetForm(); // we need to delete this
    setComboProducts([]);
  };

  useEffect(() => {
    getItems();
  }, [getItems]);

  return (
    <>
      <ComboTable
        items={items}
        isLoading={isLoading}
        setDeleteModal={setDeleteModal}
        limit={limit}
        setLimit={setLimit}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setConnectProductsModal={setConnectProductsModal}
        setComboExtras={setComboExtras}
        setComboData={setComboData}
      />
      <MuiButton
        variant="outlined"
        startIcon={<AddIcon color="primary" />}
        onClick={() => {
          setConnectProductsModal(true);
        }}
      >
        {t("add.goods")}
      </MuiButton>
      <Modal
        open={deleteModal}
        onClose={closeModal}
        onConfirm={handleDeleteItem}
        loading={deleteLoading}
      />

      <AddCombo
        params={params}
        setConnectProductLoading={setConnectProductLoading}
        connectProductsModal={connectProductsModal}
        setConnectProductsModal={setConnectProductsModal}
        connectProductLoading={connectProductLoading}
        connectProductBtnDisabled={connectProductBtnDisabled}
        closeModal={closeModal}
        getItems={getItems}
        comboExtras={comboExtras}
        setComboExtras={setComboExtras}
        comboData={comboData}
        setComboData={setComboData}
      />
    </>
  );
}
