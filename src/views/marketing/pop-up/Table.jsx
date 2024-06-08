import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Card from "components/Card";
import { deletePopUp, getPopUps } from "services/v2/marketing/popup";
import { useTranslation } from "react-i18next";
import Tag from "components/Tag";
import ActionMenu from "components/ActionMenu";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LoaderComponent from "components/Loader";
import { useHistory } from "react-router-dom";
import Pagination from "components/Pagination";

const PopUpsTable = ({ search }) => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [columns, setColumns] = useState([]);
  // const [data, setData] = useState({});
  const history = useHistory();
  const [data, setData] = useState({});
  const [loader, setLoader] = useState(true);

  const initialColumns = [
    {
      title: "№",
      key: "order-number",
      render: (record, index) => <>{(currentPage - 1) * limit + index + 1}</>,
    },
    {
      title: t("image"),
      key: "receiver-type",
      render: (record) => (
        <img
          src={`${process.env.REACT_APP_MINIO_URL}/${record?.image}`}
          alt="brand logo"
          width="90px"
          height="90px"
        />
      ),
    },
    {
      title: t("name"),
      key: "text",
      render: (record) => record.title.ru,
    },
    {
      title: t("description"),
      key: "description",
      render: (record) => record.about.ru,
    },
    {
      title: t("status"),
      key: "created_at",
      render: (record) => (
        <Tag
          className="p-1"
          color={record.active ? "primary" : "warning"}
          lightMode={true}
        >
          {record.active ? t("active") : t("inactive")}
        </Tag>
      ),
    },
  ];

  const getAllPopUps = () => {
    setLoader(true);
    getPopUps({ search, limit, page: currentPage })
      .then((res) => {
        setData(res);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoader(false));
  };

  useEffect(() => {
    const _columns = [
      ...initialColumns,
      {
        title: t("actions"),
        key: t("actions"),
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
                    history.push(`/home/marketing/popup/${record.id}`);
                  },
                },
                {
                  icon: <DeleteIcon />,
                  color: "error",
                  title: t("delete"),
                  action: () => {
                    deletePopUp(record.id)
                      .catch((err) => console.log(err))
                      .finally(() => getAllPopUps());
                  },
                },
              ]}
            />
          </div>
        ),
      },
    ];
    setColumns(_columns);
  }, [limit, currentPage]);

  useEffect(() => {
    getAllPopUps();
  }, [search, limit, currentPage]);

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
            {!loader &&
              data?.popups?.map((element, index) => (
                <TableRow
                  key={element.index}
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
                        history.push(`/home/marketing/popup/${element.id}`)
                      }
                    >
                      {col.render ? col.render(element, index) : "----"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <LoaderComponent isLoader={loader} />
      </TableContainer>
    </Card>
  );
};

export default PopUpsTable;
