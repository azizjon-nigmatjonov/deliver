import { useEffect, useState } from "react";
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
  getMeasurements,
  deleteMeasurement,
  postMeasurement,
  updateMeasurement,
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
import SwitchColumns from "components/Filters/SwitchColumns";

export default function MainTable({ createModal, setCreateModal, search }) {
  const { t } = useTranslation();
  const history = useHistory();
  const [items, setItems] = useState({});
  const [loader, setLoader] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [saveLoading, setSaveLoading] = useState(null);
  const [limit, setLimit] = useState(10);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    getItems(currentPage);
  }, [currentPage, search, limit]);

  const getItems = (page) => {
    setLoader(true);
    getMeasurements({ limit, page, search })
      .then((res) => {
        console.log(res);
        setItems({
          count: res?.count,
          data: res?.measurements,
        });
      })
      .catch((err) => console.log(err))
      .finally(() => setLoader(false));
  };

  const handleDeleteItem = () => {
    setDeleteLoading(true);
    deleteMeasurement(deleteModal.id)
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
      ? updateMeasurement(createModal.id, data)
      : postMeasurement(data);
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

  const closeModal = () => {
    setCreateModal(null);
    formik.resetForm();
  };

  const initialColumns = [
    {
      title: "№",
      key: "order-number",
      render: (record, index) => (currentPage - 1) * limit + index + 1,
    },
    {
      title: t("unit"),
      key: "unit",
      render: (record) => record.title.ru,
    },
    {
      title: t("reduction"),
      key: "reduction",
      render: (record) => <>{record.short_name}</>,
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
                          history.push(`/home/catalog/units/${record.id}`);
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

  const { values, handleChange, setFieldValue, handleSubmit } = formik;

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
      <TableContainer className="rounded-md border border-lightgray-1">
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              {columns.map((elm) => (
                <TableCell key={elm.key}>{elm.title}</TableCell>
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
                    history.push(`/home/catalog/units/${elm.id}`);
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
