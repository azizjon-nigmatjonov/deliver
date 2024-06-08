import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import Card from "components/Card";
import Modal from "components/Modal";
// import EmptyData from "components/EmptyData";
import ActionMenu from "components/ActionMenu";
import Pagination from "components/Pagination";
import LoaderComponent from "components/Loader";
import { getReviews, deleteReview } from "services";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import SwitchColumns from "components/Filters/SwitchColumns";
import Tag from "components/Tag";

export default function RestaurantTable({ search, setSearch }) {
  const [loader, setLoader] = useState(true);
  const { t } = useTranslation();
  const history = useHistory();

  const [columns, setColumns] = useState([]);
  const [limit, setLimit] = useState(10);
  const [items, setItems] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);

  const getItems = (params) => {
    setLoader(true);
    getReviews({ ...params, search })
      .then((res) => {
        setItems({
          count: res?.count,
          data: res?.reviews,
        });
      })
      .finally(() => setLoader(false));
  };

  useEffect(() => {
    getItems({ limit, page: currentPage, search });
  }, [limit, currentPage, search]);

  const handleDeleteItem = () => {
    setDeleteLoading(true);
    deleteReview(deleteModal.id)
      .then((res) => {
        getItems({ limit, page: currentPage, search });
        setDeleteLoading(false);
        setDeleteModal(null);
      })
      .finally(() => setDeleteLoading(false));
  };

  const initialColumns = useMemo(() => {
    return [
      {
        title: "№",
        key: "order-number",
        render: (record, index) => (
          <div className="text-info">
            {(currentPage - 1) * limit + index + 1}
          </div>
        ),
      },
      {
        title: t("comment"),
        key: "comment",
        render: (record) => record.message.ru,
      },
      // {
      //   title: t("rating"),
      //   key: "rating",
      //   render: (record, index) => <FiveStar value={record.rating} />,
      // },
      {
        title: t("status"),
        key: "status",
        render: ({ active }, index) => (
          <Tag
            className="p-1"
            color={active ? "primary" : "warning"}
            lightMode={true}
          >
            {active ? t("active") : t("inactive")}
          </Tag>
        ),
      },
    ];
  }, [t, currentPage, limit]);

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
              actions={[
                {
                  title: t("edit"),
                  icon: <EditIcon />,
                  color: "primary",
                  action: () =>
                    history.push(`/home/settings/content/reviews/${record.id}`),
                },
                {
                  title: t("delete"),
                  color: "error",
                  icon: <DeleteIcon />,
                  action: () => setDeleteModal({ id: record.id }),
                },
              ]}
            />
          </div>
        ),
      },
    ];
    setColumns(_columns);
  }, [t, initialColumns, history, currentPage, limit]);

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
      <TableContainer className="rounded-lg border border-lightgray-1">
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              {columns.map((elm) => (
                <TableCell key={elm.key}>{elm.title}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!loader &&
              items?.data?.map((item, index) => (
                <TableRow
                  key={item.id}
                  className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                  onClick={() =>
                    history.push(`/home/settings/content/reviews/${item.id}`)
                  }
                >
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      {col.render
                        ? col.render(item, index)
                        : item[col.dataIndex]}
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
    </Card>
  );
}
