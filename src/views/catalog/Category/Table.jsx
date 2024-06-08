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
  getCategories,
  deleteCategory,
  postCategory,
  updateCategory,
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
import RemoveIcon from "@mui/icons-material/Remove";
import ExpandableTableRow from "./ExpandableTableRow";
import { useSelector } from "react-redux";
import Tag from "components/Tag";

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
  const [expandButtonStatus, setExpandButtonStatus] = useState([]);
  const lang = useSelector((state) => state.lang.current);

  const getItems = useCallback(
    (page) => {
      setLoader(true);
      getCategories({ limit, page, search })
        .then((res) => {
          setItems({
            count: res?.count,
            data: res?.categories.map((elm) => ({
              ...elm,
              isSelected: false,
            })),
          });
        })
        .catch((err) => console.log(err))
        .finally(() => setLoader(false));
    },
    [limit, search],
  );

  useEffect(() => {
    getItems(currentPage);
  }, [currentPage, search, limit, getItems]);

  const handleDeleteItem = () => {
    setDeleteLoading(true);
    deleteCategory(deleteModal.id)
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
      ? updateCategory(createModal.id, data)
      : postCategory(data);
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

  const changeExpandIcon = (id) => {
    if (!expandButtonStatus.includes(id)) {
      setExpandButtonStatus((prev) => [...prev, id]);
    } else {
      setExpandButtonStatus((prev) => prev.filter((elm) => elm !== id));
    }
  };

  const initialColumns = useMemo(
    () => [
      {
        title: t("name"),
        key: "name",
        render: (record) => (
          <div className="flex">
            {record?.child_categories?.length && (
              <button className="bg-white mr-2 rounded-md border border-lightgray-1">
                {expandButtonStatus.includes(record.id) ? (
                  <RemoveIcon className="text-primary" />
                ) : (
                  <AddIcon className="text-primary" />
                )}
              </button>
            )}
            {record?.title?.[lang]}
          </div>
        ),
      },
      {
        title: t("created.date"),
        key: "created.date",
        render: (record) => (
          <>{moment(record.created_at).format("DD-MM-YYYY")}</>
        ),
      },
      {
        title: t("status"),
        key: "is_active",
        render: (record) => (
          <Tag
            className="p-1"
            color={record?.active ? "primary" : "warning"}
            lightMode={true}
          >
            {record?.active ? t("active") : t("inactive")}
          </Tag>
        ),
      },
    ],
    [expandButtonStatus, lang, t],
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
                        title: t("edit"),
                        color: "primary",
                        icon: <EditIcon />,
                        action: () =>
                          history.push(`/home/catalog/category/${record.id}`),
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
  }, [expandButtonStatus, history, initialColumns, t]);

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
                <TableCell key={elm.key}>{elm.title}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!loader && items?.data && items?.data?.length ? (
              items?.data?.map((elm, index) => (
                <ExpandableTableRow
                  key={elm.id}
                  onClick={() => {
                    changeExpandIcon(elm.id);
                    // history.push(`/home/catalog/category/${elm.id}`);
                  }}
                  expandComponent={
                    <>
                      {elm?.child_categories?.map((child, disable) => (
                        <TableRow
                          key={child.id}
                          className="whitespace-nowrap bg-red-100"
                        >
                          <TableCell>{child?.title?.ru}</TableCell>
                          <TableCell>
                            {moment(child.created_at).format("DD.MM.YYYY")}
                          </TableCell>
                          <TableCell>
                            <Tag
                              className="p-1"
                              color={child?.active ? "primary" : "warning"}
                              lightMode={true}
                            >
                              {child?.active ? t("active") : t("inactive")}
                            </Tag>
                          </TableCell>
                          <TableCell>
                            <ActionMenu
                              id={child.id}
                              actions={[
                                {
                                  title: t("edit"),
                                  color: "primary",
                                  icon: <EditIcon />,
                                  action: () =>
                                    history.push(
                                      `/home/catalog/category/${child.id}`,
                                    ),
                                },
                                {
                                  title: t("delete"),
                                  color: "error",
                                  icon: <DeleteIcon />,
                                  action: () =>
                                    setDeleteModal({ id: child.id }),
                                },
                              ]}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  }
                  className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                >
                  {columns.map((col) => (
                    <TableCell key={col.key} className="whitespace-nowrap">
                      {col.render
                        ? col.render(elm, index, columns.length === 1)
                        : "----"}
                    </TableCell>
                  ))}
                </ExpandableTableRow>
              ))
            ) : (
              <></>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <LoaderComponent isLoader={loader} />
      {/* <Pagination title={t("general.count")} count={items?.count} onChange={pageNumber => setCurrentPage(pageNumber)} /> */}

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
