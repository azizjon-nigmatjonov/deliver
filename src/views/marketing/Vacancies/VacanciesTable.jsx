import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Card from "components/Card";
import { useTranslation } from "react-i18next";
import Tag from "components/Tag";
import ActionMenu from "components/ActionMenu";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LoaderComponent from "components/Loader";
import { useHistory } from "react-router-dom";
import Pagination from "components/Pagination";
import { useMutation } from "@tanstack/react-query";
import vacancyService, {
  useVacancyList,
} from "services/v2/marketing/vacancies";

const VacanciesTable = ({ search }) => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const history = useHistory();

  const { data, isLoading, refetch } = useVacancyList({
    params: { search, page: currentPage, limit },
    props: { enabled: true },
  });

  const deleteNews = useMutation({
    mutationFn: vacancyService.delete,
    onSuccess: () => refetch(),
    onError: (error) => console.log(error),
  });

  const columns = useMemo(
    () => [
      {
        title: "№",
        key: "order-number",
        render: (record, index) => <>{(currentPage - 1) * limit + index + 1}</>,
      },
      {
        title: t("name"),
        key: "text",
        render: (record) => record.title.ru,
      },
      {
        title: t("status"),
        key: "status",
        render: (record) => (
          <Tag
            className="p-1"
            color={record.is_active ? "primary" : "warning"}
            lightMode={true}
          >
            {record.is_active ? t("active") : t("inactive")}
          </Tag>
        ),
      },
      {
        title: t("actions"),
        key: "actions",
        render: (record) => (
          <div className="flex justify-center items-center">
            <ActionMenu
              id={record.id}
              actions={[
                {
                  icon: <EditIcon />,
                  color: "primary",
                  title: t("change"),
                  action: () => {
                    history.push(`/home/marketing/vacancies/${record.id}`);
                  },
                },
                {
                  icon: <DeleteIcon />,
                  color: "error",
                  title: t("delete"),
                  action: () => deleteNews.mutate(record.id),
                },
              ]}
            />
          </div>
        ),
      },
    ],
    [currentPage, limit, t, deleteNews, history],
  );

  return (
    <Card
      className="m-4"
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
      <TableContainer className="border border-lightgray-1">
        <Table aria-label="simple-label">
          <TableHead>
            <TableRow>
              {columns?.map((elm) => (
                <TableCell key={elm.key}> {elm.title}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!isLoading &&
              data?.vacancies?.map((element, index) => (
                <TableRow
                  key={element.id}
                  className={
                    index % 2 === 0
                      ? "bg-lightgray-5 text-center"
                      : "text-center"
                  }
                >
                  {columns?.map((col) => (
                    <TableCell
                      key={col.key}
                      className="flex justify-center items-center text-center"
                      onClick={() =>
                        history.push(`/home/marketing/vacancies/${element.id}`)
                      }
                    >
                      {col.render ? col.render(element, index) : "----"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <LoaderComponent isLoader={isLoading} />
      </TableContainer>
    </Card>
  );
};

export default VacanciesTable;
