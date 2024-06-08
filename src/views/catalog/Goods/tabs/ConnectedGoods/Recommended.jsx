import { useEffect, useMemo, useState, useCallback } from "react";
import Modal from "components/ModalV2";
import Pagination from "components/Pagination";
import { useTranslation } from "react-i18next";
import { getNonOriginProducts } from "services/v2";
import LoaderComponent from "components/Loader";
import Card from "components/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import AddIcon from "@mui/icons-material/Add";
import {
  SortableContainer,
  arrayMove,
  SortableHandle,
} from "react-sortable-hoc";
import numberToPrice from "helpers/numberToPrice";
import Async from "components/Select/Async";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import SortableItem from "./SortableItem";
import styles from "../styles.module.scss";
import Button from "components/Button/Buttonv2";

export default function Recommended({ formik }) {
  const { t } = useTranslation();
  const params = useParams();

  const { setFieldValue, values } = formik;

  const [selectedGoods, setSelectedGoods] = useState([]);
  const [columns, setColumns] = useState([]);
  const [limit, setLimit] = useState(10);
  const [items, setItems] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [addLoading, setLoading] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadedGoods, setLoadedGoods] = useState([]);
  const lang = useSelector((state) => state.lang.current);

  const onSortEnd = useCallback(
    ({ oldIndex, newIndex }) => {
      var sortedIds = arrayMove(values?.favourites, oldIndex, newIndex);
      setFieldValue("favourites", sortedIds);
    },
    [setFieldValue, values?.favourites],
  );

  const DragHandle = SortableHandle(() => (
    <DragIndicatorIcon className={styles.dragIcon} />
  ));

  const SortableList = SortableContainer(({ items }) => {
    return (
      <TableContainer className="rounded-md border border-lightgray-1">
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              {columns.map((elm, index) => (
                <TableCell key={index}>{elm.title}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item, index) => (
              <SortableItem
                key={`item-${index}`}
                index={index}
                value={item}
                columns={columns}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  });

  const loadGoods = useCallback(
    (input, cb) => {
      getNonOriginProducts({ limit, page: currentPage, search: input })
        .then((res) => {
          setLoadedGoods({
            count: res?.count,
            data: res?.products,
          });
          let products = res?.products
            ?.filter((el) => el.type !== "combo")
            ?.map((product) => ({
              label: product.title?.[lang],
              value: product.id,
            }));
          cb(products);
        })
        .catch((err) => console.log(err));
    },
    [currentPage, limit, lang],
  );

  const getFavourites = useCallback(() => {
    setIsLoading(true);
    getNonOriginProducts({ limit, page: currentPage })
      .then((res) => {
        setItems({
          count: res?.count,
          data: res?.products,
        });
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  }, [limit, currentPage]);

  const handleDeleteItem = useCallback(
    (e) => {
      setDeleteLoading(true);
      setFieldValue(
        "favourites",
        values.favourites.filter(
          (favorite_id) => favorite_id.id !== deleteModal.id,
        ),
      );
      setDeleteModal(false);
      setDeleteLoading(false);
    },
    [deleteModal, values, setFieldValue],
  );

  const handleAddItem = useCallback(
    (e) => {
      if (items.data?.length && selectedGoods.length) {
        setLoading(true);
        let favourites = selectedGoods.map((good) => good?.value);
        let filteredItems = loadedGoods?.data?.filter((item) =>
          favourites.includes(item.id),
        );
        setFieldValue("favourites", values?.favourites?.concat(filteredItems));
        setSelectedGoods([]);
      }
      setAddModal(false);
      setLoading(false);
    },
    [items, selectedGoods, values, setFieldValue, loadedGoods?.data],
  );

  const closeModal = () => {
    setAddModal(false);
    setDeleteModal(false);
  };

  const initialColumns = useMemo(() => {
    return [
      {
        title: "",
        key: "drag-area",
        render: () => <DragHandle />,
      },
      {
        title: t("product.image"),
        key: "product-image",
        render: (record) => (
          <img
            src={`${process.env.REACT_APP_MINIO_URL}/${record.image}`}
            alt=""
            width={"50"}
            height={"50"}
          />
        ),
      },
      {
        title: t("product.name"),
        key: "product_name",
        render: (record) => record.title.ru,
      },
      {
        title: t("price"),
        key: "price",
        render: (record) => numberToPrice(record.out_price),
      },
    ];
  }, [t]);

  useEffect(() => {
    var _columns = [
      ...initialColumns,
      {
        title: t("action"),
        key: "actions",
        render: (record, _, disable) => (
          <div className="flex gap-2 justify-center">
            <span
              className="cursor-pointer d-block border rounded-md p-2"
              onClick={() => setDeleteModal({ id: record.id })}
            >
              <DeleteIcon color="error" />
            </span>
          </div>
        ),
      },
    ];
    setColumns(_columns);
  }, [initialColumns, t]);

  useEffect(() => {
    getFavourites();
  }, [getFavourites, limit, currentPage]);

  let products = useMemo(() => {
    let ids = [];
    for (let i = 0; i < values?.favourites.length; i++) {
      for (let j = 0; j < items?.data?.length; j++) {
        if (items?.data[j]?.id === values?.favourites[i].id) {
          ids.push(items?.data[j]);
        }
      }
    }
    return ids;
  }, [values?.favourites, items?.data]);

  return (
    <Card
      footer={
        <Pagination
          title={t("general.count")}
          count={products?.length}
          limit={limit}
          onChange={(pageNumber) => setCurrentPage(pageNumber)}
          onChangeLimit={(limitNumber) => setLimit(limitNumber)}
        />
      }
      footerStyle={{ paddingRight: "0", paddingLeft: "0" }}
      bodyStyle={{ paddingRight: "0", paddingLeft: "0" }}
    >
      {!isLoading && (
        <SortableList
          items={values?.favourites} // before there was given products
          onSortEnd={onSortEnd}
          useDragHandle
          useWindowAsScrollContainer
        />
      )}

      <LoaderComponent isLoader={isLoading} />
      <Button
        variant="outlined"
        fullWidth
        startIcon={<AddIcon color="primary" />}
        onClick={() => setAddModal(true)}
        sx={{ mt: 2, ml: "auto" }}
      >
        {t("add.goods")}
      </Button>

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
        open={addModal}
        onClose={closeModal}
        maxWidth="sm"
        fullWidth
        title={t("add.products")}
        contentsx={{
          overflowY: "visible",
        }}
        PaperProps={{
          sx: { overflowY: "visible" },
        }}
      >
        <Async
          isMulti
          isSearchable
          isClearable
          cacheOptions
          id="products-select"
          defaultOptions={true}
          value={selectedGoods}
          loadOptions={loadGoods}
          onChange={(val) => setSelectedGoods(() => [...val])}
          placeholder={t("select")}
          filterOption={(product, inputValue) => product?.value !== params.id}
          maxMenuHeight={300}
          useZIndex
        />
        <Button
          sx={{ mt: 8 }}
          fullWidth
          size="large"
          color="primary"
          variant="contained"
          onClick={handleAddItem}
          disabled={!selectedGoods.length || addLoading}
        >
          {t("save")}
        </Button>
      </Modal>
    </Card>
  );
}
