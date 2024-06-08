import { useState, useEffect, useCallback } from "react";
import Card from "components/Card";
import { useTranslation } from "react-i18next";
import { deleteRegion, getAllRegions } from "services/region";
import { useHistory } from "react-router-dom";
import LoaderComponent from "components/Loader";
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
import ActionMenu from "components/ActionMenu";
import Pagination from "components/Pagination";
import Search from "components/Search";
import Tag from "components/Tag";

export default function Regions() {
  const { t } = useTranslation();
  const [regions, setRegions] = useState([]);
  const [loader, setLoader] = useState(true);
  const history = useHistory();
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [count, setCount] = useState("");

  const getRegions = useCallback(() => {
    setLoader(true);
    getAllRegions({ page: currentPage, limit, search: search })
      .then((res) => {
        setRegions(res?.regions);
        setCount(res?.count);
      })
      .catch((error) => console.log(error))
      .finally(() => setLoader(false));
  }, [search, currentPage, limit]);

  useEffect(() => {
    getRegions();
  }, [search, currentPage, limit, getRegions]);

  const deleteRegionById = (record) => {
    deleteRegion(record.id)
      .then(() => getRegions())
      .catch((e) => console.log(e))
      .finally(() => setLoader(false));
  };

  const columns = [
    {
      title: "№",
      key: "region-number",
      render: (record, index) => (currentPage - 1) * limit + index + 1,
    },
    {
      title: t("regions.name"),
      key: "region-name",
      render: (record) => record.name,
    },
    {
      title: t("status"),
      key: "region-status",
      render: (record) => (
        <Tag
          className="p-1"
          color={record?.isActive ? "primary" : "warning"}
          lightMode={true}
        >
          {record?.isActive ? t("active") : t("inactive")}
        </Tag>
      ),
    },
    {
      title: "",
      key: "actions",
      render: (record) => (
        <div className="float-right">
          <ActionMenu
            id={record.id}
            actions={[
              {
                icon: <EditIcon />,
                color: "primary",
                title: t("change"),
                action: () => {
                  history.push(`/home/settings/company/regions/${record.id}`);
                },
              },
              {
                icon: <DeleteIcon />,
                color: "error",
                title: t("delete"),
                action: () => {
                  deleteRegionById(record);
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
        title={<Search setSearch={setSearch} />}
        className="m-4"
        footer={
          <Pagination
            title={t("general.count")}
            count={count}
            onChange={(pageNumber) => setCurrentPage(pageNumber)}
            pageCount={limit}
            onChangeLimit={(limitNumber) => setLimit(limitNumber)}
            limit={limit}
          />
        }
      >
        <TableContainer className="rounded-md border border-lightgray-1">
          <Table aria-label="simple-table">
            <TableHead>
              <TableRow>
                {columns.map((elm) => (
                  <TableCell key={elm.key}>{elm.title}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {!loader &&
                regions?.length &&
                regions?.map((elm, index) => (
                  <TableRow
                    key={elm.id}
                    className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                    onClick={() =>
                      history.push(`/home/settings/company/regions/${elm.id}`)
                    }
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
        <LoaderComponent isLoader={loader} />
      </Card>
    </>
  );
}
