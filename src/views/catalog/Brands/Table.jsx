import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Card from "components/Card";
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
import { getBrands, deleteBrand, updateBrand, postBrand } from "services/v2";
import SwitchColumns from "components/Filters/SwitchColumns";
import ActionMenu from "components/ActionMenu";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useHistory } from "react-router-dom";
import Modal from "components/Modal";
import * as yup from "yup";
import { useFormik } from "formik";
import Button from "components/Button";
import Form from "components/Form/Index";
import { Input } from "alisa-ui";
import AddIcon from "@mui/icons-material/Add";

export default function BrandsTable({ createModal, setCreateModal, search }) {
  const { t } = useTranslation();
  const history = useHistory();

  const [loader, setLoader] = useState(true);
  const [items, setItems] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [columns, setColumns] = useState([]);
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(null);

  useEffect(() => {
    getItems(currentPage);
  }, [currentPage, search, limit]);

  const getItems = (page) => {
    setLoader(true);
    getBrands({ limit, page, search })
      .then((res) => {
        setItems({
          count: res.count,
          data: res.brands,
        });
      })
      .finally(() => setLoader(false));
  };

  const handleDeleteItem = () => {
    setDeleteLoading(true);
    deleteBrand(deleteModal.id)
      .then((res) => {
        getItems(currentPage);
        setDeleteLoading(false);
        setDeleteModal(null);
      })
      .finally(() => setDeleteLoading(false));
  };

  const initialColumns = [
    {
      title: "№",
      key: "order-number",
      render: (_, index) => <>{(currentPage - 1) * limit + index + 1}</>,
    },
    {
      title: t("logo"),
      key: "image",
      dataIndex: "image",
      render: (record) => (
        <>
          <img
            src={`${process.env.REACT_APP_MINIO_URL}/${record.image}`}
            alt="brand logo"
            width={"50"}
            height={"50"}
          />
        </>
      ),
    },
    {
      title: t("name"),
      key: "title",
      dataIndex: "title",
    },
  ];

  useEffect(() => {
    const _columns = [
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
        key: t("actions"),
        render: (record, _, disable) => (
          <div className="flex gap-2 justify-end">
            <ActionMenu
              id={record.id}
              actions={
                disable
                  ? []
                  : [
                      {
                        icon: <EditIcon />,
                        color: "primary",
                        title: t("change"),
                        action: () => {
                          history.push(`/home/catalog/brands/${record.id}`);
                        },
                      },
                      {
                        icon: <DeleteIcon />,
                        color: "error",
                        title: t("delete"),
                        action: () => {
                          setDeleteModal({ id: record.id });
                        },
                      },
                    ]
              }
            />
          </div>
        ),
      },
    ];
    setColumns(_columns);
  }, []);

  const onSubmit = (values) => {
    const data = {
      ...values,
    };

    setSaveLoading(true);
    const selectedAction = createModal.id
      ? updateBrand(createModal.id, data)
      : postBrand(data);
    selectedAction
      .then((res) => {
        getItems(currentPage);
      })
      .finally(() => {
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

  const { values, handleChange, handleSubmit } = formik;

  const closeModal = () => {
    setCreateModal(null);
    formik.resetForm();
  };

  return (
    <Card
      className="m-4"
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
    >
      <TableContainer className="rounded-lg border border-lightgray-1">
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              {columns.map((elm) => (
                <TableCell
                  key={elm.key}
                  align={`${columns.length === 1 ? "right" : "left"}`}
                >
                  {elm.title}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!loader &&
              items.data &&
              items.data.length &&
              items.data.map((item, index) => (
                <TableRow
                  key={item.id}
                  className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                  onClick={() => {
                    if (columns.length === 1) return;
                    history.push(`/home/catalog/brands/${item.id}`);
                  }}
                >
                  {columns.map((col, i) => (
                    <TableCell
                      key={col.key}
                      align={`${columns.length === 1 ? "right" : "left"}`}
                    >
                      {col.render
                        ? col.render(item, index, columns.length === 1)
                        : item[col.dataIndex].ru}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <LoaderComponent isLoader={loader} />
      <Modal
        open={deleteModal}
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

          <div
            className={`${
              values?.type?.value === "fixed" ? "hidden" : " "
            } grid grid-cols-1 sm:grid-cols-2 gap-x-3 py-8`}
          >
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
