import { useTranslation } from "react-i18next";
import Card from "components/Card";
import Pagination from "components/Pagination";
import ActionMenu from "components/ActionMenu";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Skeleton from "components/Loader";
import Modal from "components/Modal";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import discountService, { useDiscountsList } from "services/v2/discounts";
import { useSelector } from "react-redux";
import Tag from "components/Tag";

export default function DiscountsTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteRecord, setDeleteRecord] = useState(null);
  const [limit, setLimit] = useState(10);

  const { shipper_id } = useSelector((state) => state.auth);
  const { t } = useTranslation();
  const history = useHistory();

  const { data, isLoading, refetch } = useDiscountsList({
    shipper_id,
    params: {
      page: currentPage,
      limit: limit,
      for_crud: true,
    },
    props: { enabled: true },
  });

  const deleteTableData = useMutation({
    mutationFn: discountService.delete,
    onSuccess: () => refetch(),
  });

  const columns = [
    {
      title: "№",
      key: "order-number",
      render: (record, index) => (currentPage - 1) * limit + index + 1,
    },
    {
      title: t("name"),
      key: "name",
      render: (record) => record.name?.ru,
    },
    {
      title: t("type"),
      key: "type",
      render: (record) => t(record.type),
    },
    {
      title: t("status"),
      key: "is_active",
      render: (record) => (
        <Tag className="p-1" color={record.is_active ? "primary" : "warning"} lightMode={true}>
          {record.is_active ? t("active") : t("inactive")}
        </Tag>
      ),
    },
    {
      title: "",
      key: "actions",
      render: (record) => (
        <div className="flex gap-2">
          <ActionMenu
            id={record.id}
            actions={[
              {
                title: t("edit"),
                color: "primary",
                icon: <EditIcon />,
                action: () =>
                  history.push(`/home/settings/discounts/${record.id}`),
              },
              {
                title: t("delete"),
                color: "error",
                icon: <DeleteIcon />,
                action: () => {
                  setDeleteRecord(record.id);
                  setDeleteModal(true);
                },
              },
            ]}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <Card
        footer={
          <Pagination
            title={t("general.count")}
            count={data?.count}
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
              {!isLoading &&
                data?.discounts?.map((elm, index) => (
                  <TableRow
                    key={elm.id}
                    onClick={() =>
                      history.push(`/home/settings/discounts/${elm.id}`)
                    }
                    className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                  >
                    {columns.map((col) => (
                      <TableCell key={col.key}>
                        {col.render ? col.render(elm, index) : "----"}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Skeleton isLoader={isLoading} />
      </Card>
      <Modal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={() => {
          deleteTableData.mutate(deleteRecord);
          setDeleteModal(false);
        }}
      />
    </>
  );
}
