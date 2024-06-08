import { useCallback, useEffect, useMemo, useState } from "react";
import Form from "components/Form/Index";
import Modal from "components/Modal";
import Button from "components/Button";
import AddIcon from "@mui/icons-material/Add";
import * as yup from "yup";
import EditIcon from "@mui/icons-material/Edit";
import { Input } from "alisa-ui";
import DeleteIcon from "@mui/icons-material/Delete";
import Pagination from "components/Pagination";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import {
  deleteGood,
  postGood,
  updateGood,
  getNonVariantProducts,
} from "services/v2";
import { useHistory } from "react-router-dom";
import LoaderComponent from "components/Loader";
import Card from "components/Card";
import ActionMenu from "components/ActionMenu";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import moment from "moment";
import SwitchColumns from "components/Filters/SwitchColumns";
import TextFilter from "components/Filters/TextFilter";
import numberToPrice from "helpers/numberToPrice";

var firstTime = true;

export default function MainTable({ createModal, setCreateModal, search }) {
  const { t } = useTranslation();
  const history = useHistory();

  const [columns, setColumns] = useState([]);
  const [limit, setLimit] = useState(10);
  const [items, setItems] = useState({});
  const [loader, setLoader] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [saveLoading, setSaveLoading] = useState(null);
  const [sort, setSort] = useState("created_at|desc");

  const getItems = useCallback(() => {
    setLoader(true);
    getNonVariantProducts({
      limit,
      page: currentPage,
      search,
      sort: sort,
    })
      .then((res) => {
        setItems({
          count: res?.count,
          data: res?.products,
        });
        if (firstTime) firstTime = false;
      })
      .finally(() => {
        setLoader(false);
      });
  }, [limit, search, sort, currentPage]);

  const handleDeleteItem = () => {
    setDeleteLoading(true);
    deleteGood(deleteModal.id)
      .then((res) => {
        getItems(currentPage);
        setDeleteLoading(false);
        setDeleteModal(null);
      })
      .finally(() => setDeleteLoading(false));
  };

  const onSubmit = (values) => {
    const data = {
      ...values,
    };

    setSaveLoading(true);
    const selectedAction = createModal.id
      ? updateGood(createModal.id, data)
      : postGood(data);
    selectedAction.then(getItems).finally(() => {
      setSaveLoading(false);
      closeModal();
    });
  };

  const formik = useFormik({
    initialValues: {
      name: null,
      created_at: null,
    },
    validationSchema: yup.object().shape({
      name: yup.mixed().required(t("required.field.error")),
      created_at: yup.mixed().required(t("required.field.error")),
    }),
    onSubmit,
  });

  const closeModal = () => {
    setCreateModal(null);
    formik.resetForm();
  };

  const initialColumns = useMemo(
    () => [
      {
        title: "№",
        key: "order-number",
        render: (record, index) => (currentPage - 1) * limit + index + 1,
      },
      {
        title: t("good"),
        key: "title",
        render: (record) => record.title.ru,
      },
      {
        title: t("vendor_code"),
        key: "vendor_code",
        render: (record) => <>{record.code}</>,
      },
      {
        title: t("type"),
        key: "amount",
        render: (record) => <>{t(record.type)}</>,
      },
      {
        title: t("image"),
        key: "image",
        render: (record) => (
          <>
            {record.image ? (
              <img
                src={`${process.env.REACT_APP_MINIO_URL}/${record.image}`}
                alt="product"
                width={"50"}
                height={"50"}
              />
            ) : (
              t("no.image")
            )}
          </>
        ),
      },
      {
        title: t("income.price"),
        key: "income.price",
        render: (record) => numberToPrice(record.in_price),
      },
      {
        title: t("sales.price"),
        key: "sales.price",
        render: (record) => numberToPrice(record.out_price),
      },
      {
        title: t("order.number"),
        key: "order_number",
        render: (record) => record.order,
      },
      {
        title: t("created.date"),
        key: "created.date",
        render: (record) => (
          <>{moment(record?.created_at).format("DD.MM.YYYY")}</>
        ),
        sorter: true,
        onSort: (order = "asc") => {
          setSort("created_at|" + order);
        },
      },
    ],
    [currentPage, limit, t],
  );

  useEffect(() => {
    var _columns = [
      ...initialColumns,
      {
        title: (
          <SwitchColumns
            columns={initialColumns}
            onChange={(val) =>
              setColumns((prev) => [...val, prev[prev.length - 1]])
            }
            iconClasses="flex justify-end mr-1"
          />
        ),
        key: "actions",
        render: (record, _, disable) => (
          <div className="flex gap-2 justify-end">
            <ActionMenu
              id={record.id}
              actions={
                disable
                  ? []
                  : [
                      {
                        title: t("edit"),
                        color: "primary",
                        icon: <EditIcon />,
                        action: () =>
                          history.push(`/home/catalog/goods/${record.id}`),
                      },
                      {
                        title: t("delete"),
                        color: "error",
                        icon: <DeleteIcon />,
                        action: () => setDeleteModal({ id: record.id }),
                      },
                    ]
              }
            />
          </div>
        ),
      },
    ];
    setColumns(_columns);
  }, [history, t, currentPage, limit, initialColumns]);

  useEffect(() => {
    getItems();
  }, [currentPage, limit, sort, search, getItems]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const { values, handleChange, handleSubmit } = formik;

  return (
    <Card
      className="m-4"
      footer={
        <Pagination
          title={t("general.count")}
          count={items?.count}
          onChange={(pageNumber) => setCurrentPage(pageNumber)}
          pageCount={limit}
          onChangeLimit={(limitNumber) => setLimit(limitNumber)}
          limit={limit}
        />
      }
    >
      <TableContainer className="rounded-md border border-lightgray-1">
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              {columns.map((elm) => (
                <TableCell key={elm.key}>
                  <TextFilter {...elm} initialSorterValue={sort} />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!loader && items?.data && items?.data?.length ? (
              items?.data?.map((elm, index) => (
                <TableRow
                  key={elm.id}
                  onClick={() => {
                    if (columns.length === 1) return;
                    history.push(`/home/catalog/goods/${elm.id}`);
                  }}
                  className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                >
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      {col.render
                        ? col.render(elm, index, columns.length === 1)
                        : "----"}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <></>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <LoaderComponent isLoader={loader} />

      <Modal
        open={deleteModal || false}
        onClose={() => setDeleteModal(null)}
        onConfirm={handleDeleteItem}
        loading={deleteLoading}
      />

      <Modal
        open={createModal}
        title={t(createModal?.id ? "update" : "create")}
        footer={null}
        onClose={closeModal}
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 py-8">
            <div>
              <Form.Item formik={formik} name="base_price" label={t("price")}>
                <Input
                  type="number"
                  id="base_price"
                  value={values.base_price}
                  onChange={handleChange}
                />
              </Form.Item>
            </div>
          </div>

          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-x-3 py-8`}>
            <div>
              <Form.Item
                formik={formik}
                name="base_distance"
                label={t("base.distance")}
              >
                <Input
                  type="number"
                  id="base_distance"
                  value={values.base_distance}
                  onChange={handleChange}
                />
              </Form.Item>
            </div>
            <div>
              <Form.Item
                formik={formik}
                name="price_per_km"
                label={t("price.per.km")}
              >
                <Input
                  type="number"
                  id="price_per_km"
                  value={values.price_per_km}
                  onChange={handleChange}
                />
              </Form.Item>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              size="large"
              loading={saveLoading}
              icon={createModal?.id ? EditIcon : AddIcon}
            >
              {t(createModal?.id ? "update" : "add")}
            </Button>
          </div>
        </form>
      </Modal>
    </Card>
  );
}
