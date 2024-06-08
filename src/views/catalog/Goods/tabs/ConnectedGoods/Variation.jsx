import { useEffect, useState, useCallback } from "react";
import Modal from "components/ModalV2";
import { useTranslation } from "react-i18next";
import { connectGoods, deleteGood, getVariants } from "services/v2";
import { useParams } from "react-router-dom";
import VariationsTable from "./VariationsTable";
import VariationAdder from "./VariationAdder";
import AddProductTable from "./AddProductTable";
import Button from "components/Button/Buttonv2";

// const useStyles = makeStyles((theme) => ({
//   connectBtn: {
//     "& > button": {
//       border: "none",
//       width: "100%",
//       margin: "auto",
//       textTransform: "initial",
//       color: "rgb(110, 139, 183)",
//     },
//     "& > button:focus": {
//       color: "rgb(110, 139, 183)",
//     },
//     border: "1px dashed rgb(110, 139, 183)",
//     borderRadius: "8px",
//     background: "#f1f4f8",
//     margin: "auto",
//   },
// }));

export default function Variation({
  parentFormik,
  addModal,
  setAddModal,
  connectProductsModal,
  setConnectProductsModal,
}) {
  const { t } = useTranslation();
  const params = useParams();

  const [items, setItems] = useState({});
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [connectProductLoading, setConnectProductLoading] = useState(false);
  const [connectProductBtnDisabled, setConnectProductBtnDisabled] =
    useState(true);
  const [productIds, setProductIds] = useState([]);

  const getItems = useCallback(() => {
    if (params.id) {
      setIsLoading(true);
      getVariants(params.id, {
        limit,
        page: currentPage,
      })
        .then((res) => {
          setItems({
            count: res?.count,
            data: res?.products,
          });
        })
        .finally(() => setIsLoading(false));
    }
  }, [params.id, limit, currentPage]);

  const handleDeleteItem = useCallback(
    (e) => {
      setDeleteLoading(true);
      deleteGood(deleteModal.id).then((res) => {
        setDeleteModal(false);
        setDeleteLoading(false);
        getItems();
      });
    },
    [deleteModal, getItems],
  );

  const onConnectProduct = () => {
    setConnectProductLoading(true);
    connectGoods({
      connected_variants: productIds,
      parent_id: params.id,
    })
      .then(() => {
        setConnectProductsModal(false);
        getItems();
      })
      .finally(() => {
        setConnectProductLoading(false);
      });
  };

  const closeModal = () => {
    setAddModal(false);
    setDeleteModal(false);
    setConnectProductsModal(false);
  };

  useEffect(() => {
    getItems();
  }, [getItems]);

  return (
    <>
      <VariationsTable
        items={items}
        isLoading={isLoading}
        setDeleteModal={setDeleteModal}
        limit={limit}
        setLimit={setLimit}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <Modal
        title={t("are.you.sure.want.to.delete")}
        open={deleteModal}
        onClose={closeModal}
        maxWidth="xs"
        fullWidth
      >
        <div className="flex gap-4">
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            onClick={closeModal}
          >
            Нет
          </Button>
          <Button
            fullWidth
            color="primary"
            variant="contained"
            onClick={handleDeleteItem}
            disabled={deleteLoading}
          >
            Да
          </Button>
        </div>
      </Modal>

      <Modal
        open={connectProductsModal}
        onClose={closeModal}
        maxWidth="md"
        fullWidth
        title={t("add.goods")}
      >
        <AddProductTable
          setConnectProductBtnDisabled={setConnectProductBtnDisabled}
          setProductIds={setProductIds}
        />

        <Button
          fullWidth
          size="large"
          color="primary"
          variant="contained"
          onClick={onConnectProduct}
          disabled={connectProductBtnDisabled || connectProductLoading}
        >
          {t("save")}
        </Button>
      </Modal>

      <VariationAdder
        addModal={addModal}
        closeModal={closeModal}
        properties={giveModifiedProperties(parentFormik.values?.property_ids)}
        parentProductName={{
          ru: parentFormik.values?.title_ru,
          en: parentFormik.values?.title_en,
          uz: parentFormik.values?.title_uz,
        }}
        getItems={getItems}
        parentFormik={parentFormik}
      />
    </>
  );
}

function giveModifiedProperties(props = []) {
  return props.map((group) => {
    return {
      id: group.id,
      label: group.label,
      options: group.variants,
    };
  });
}
