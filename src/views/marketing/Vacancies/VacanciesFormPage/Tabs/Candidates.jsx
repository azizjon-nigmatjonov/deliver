import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import ActionMenu from "components/ActionMenu";
import Card from "components/Card";
import LoaderComponent from "components/Loader";
import Pagination from "components/Pagination";
import Search from "components/Search";
import Tag from "components/Tag";
import {
  useVacancyCandidateList,
  vacancyCandidateService,
} from "services/v2/marketing/vacancies";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import DoNotDisturbRoundedIcon from "@mui/icons-material/DoNotDisturbRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";

function Candidates() {
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { id } = useParams();

  const { t } = useTranslation();

  const columns = [
    {
      title: "№",
      key: "order-number",
      render: (_, index) => (currentPage - 1) * limit + index + 1,
    },
    {
      title: t("full_name"),
      key: "full_name",
      render: (record) => record?.full_name,
    },
    {
      title: t("phone"),
      key: "phone",
      render: (record) => record?.phone_number,
    },
    {
      title: t("description"),
      key: "description",
      render: (record) => record?.description,
    },
    {
      title: t("status"),
      key: "status",
      render: (record) => (
        <Tag
          className="p-1"
          color={
            record.status === "new"
              ? "primary"
              : record.status === "accepted"
              ? "success"
              : "error"
          }
          lightMode={true}
        >
          {t(record.status)}
        </Tag>
      ),
    },
    {
      title: t("actions"),
      key: t("actions"),
      render: (record) => (
        <div className="flex justify-center items-center">
          <ActionMenu
            id={record.id}
            actions={
              record.status === "new"
                ? [
                    {
                      icon: <CheckRoundedIcon />,
                      color: "success",
                      title: t("accept"),
                      action: () => update(record, "accepted"),
                    },
                    {
                      icon: <DoNotDisturbRoundedIcon />,
                      color: "error",
                      title: t("reject"),
                      action: () => update(record, "rejected"),
                    },
                    {
                      icon: <DownloadRoundedIcon />,
                      color: record?.file ? "primary" : "gray",
                      title: record?.file ? t("download") : t("no_file"),
                      action: () =>
                        record?.file &&
                        window.open(
                          process.env.REACT_APP_MINIO_URL + record?.file,
                        ),
                    },
                  ]
                : record?.file
                ? [
                    {
                      icon: <DownloadRoundedIcon />,
                      color: "error",
                      title: t("download"),
                      action: () =>
                        window.open(
                          process.env.REACT_APP_MINIO_URL + record?.file,
                        ),
                    },
                  ]
                : null
            }
          />
        </div>
      ),
    },
  ];

  const { data, isLoading, refetch } = useVacancyCandidateList({
    params: { search, page: currentPage, limit, vacancy_id: id },
    props: { enabled: true },
  });

  const update = (values, status) => {
    const data = {
      description: values?.description,
      file: values?.file,
      full_name: values?.full_name,
      phone_number: values?.phone_number,
      status: status,
      vacancy_id: values?.vacancy_id,
    };
    vacancyCandidateService
      .update(values?.id, data)
      .then(() => refetch())
      .catch((err) => console.log(err));
  };

  return (
    <Card
      className="m-4"
      title={<Search setSearch={setSearch} />}
      footer={
        <Pagination
          count={data?.count}
          limit={limit}
          pageCount={limit}
          onChange={(pageCount) => setCurrentPage(pageCount)}
          onChangeLimit={(limit) => setLimit(limit)}
        />
      }
    >
      <TableContainer className="rounded-md border border-lightgray-1">
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              {columns?.map((col) => (
                <TableCell key={col.key}>{col.title}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!isLoading &&
              data?.vacancy_candidates?.map((elm, index) => (
                <TableRow key={elm.id}>
                  {columns.map((col) => (
                    <TableCell
                      className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                      key={col.key}
                    >
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
  );
}

export default Candidates;
