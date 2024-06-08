import { useState } from "react";
import {
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Table,
} from "@mui/material";
import ActionMenu from "components/ActionMenu";
import Card from "components/Card";
import LoaderComponent from "components/Loader";
import Pagination from "components/Pagination";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useTranslation } from "react-i18next";
import { deleteMenu, useMenuList } from "services/v2";
import moment from "moment";
import { useHistory } from "react-router-dom";

const TableMenu = ({ search }) => {
  const history = useHistory();
  const { t } = useTranslation();
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const initialColumns = [
    {
      title: "№",
      key: "order-number",
      render: (record, index) => (currentPage - 1) * limit + index + 1,
    },
    {
      title: t("menu"),
      key: "menu",
      render: (record) => record.name,
    },
    // {
    //   title: t("branch"),
    //   key: "branch",
    //   render: (record) => t(record?.branch_name),
    // },
    {
      title: t("created.date"),
      key: "created.date",
      render: (record) => moment(record.created_at).format("DD.MM.YYYY"),
    },
    {
      title: null,
      key: t("actions"),
      render: (record) => (
        <div className="flex gap-2 justify-end">
          <ActionMenu
            id={record.id}
            actions={[
              {
                icon: <EditIcon />,
                color: "primary",
                title: t("change"),
                action: () =>
                  history.push(`/home/catalog/menu/edit-menu/${record.id}`),
              },
              {
                icon: <DeleteIcon />,
                color: "error",
                title: t("delete"),
                action: () => onDeleteMenu(record?.id),
              },
            ]}
          />
        </div>
      ),
    },
  ];

  const { data, isLoading, refetch } = useMenuList({
    params: { limit, page: currentPage, search },
    props: {
      enabled: true,
    },
  });

  const onDeleteMenu = (id) => {
    deleteMenu(id).finally(() => refetch());
  };

  return (
    <div>
      <Card
        footer={
          <Pagination
            title={t("general.count")}
            count={data?.count}
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
                {initialColumns.map((col) => (
                  <TableCell key={col.key}>{col.title}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {!isLoading &&
                data?.menus?.map((elm, index) => (
                  <TableRow
                    key={elm.id}
                    onClick={() =>
                      history.push(`/home/catalog/menu/edit-menu/${elm.id}`)
                    }
                    className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                  >
                    {initialColumns.map((col) => (
                      <TableCell key={col.key}>
                        {col.render ? col.render(elm, index) : "--"}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <LoaderComponent isLoader={isLoading} />
      </Card>
    </div>
  );
};
export default TableMenu;
