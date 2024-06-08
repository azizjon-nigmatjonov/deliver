import React, { useCallback, useMemo, useState } from "react";
import ActionMenu from "components/ActionMenu";
import { useTranslation } from "react-i18next";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useHistory } from "react-router-dom";
import Card from "components/Card";
import Pagination from "components/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import LoaderComponent from "components/Loader";
import { deleteFreeGeozone, useFreeGeozone } from "services/v2/free_geozone";
import Search from "components/Search";

const FreeGeoTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loader, setLoader] = useState(true);
  const [search, setSearch] = useState("");

  const history = useHistory();
  const { t } = useTranslation();

  const { getFreeGeozoneList } = useFreeGeozone({
    freeGeozoneParams: {
      page: currentPage,
      limit: limit,
      search,
    },
    geozoneProps: {
      enabled: true,
      onSuccess: (res) => {
        setLoader(false);
      },
    },
  });

  const deleteTableData = useCallback(
    (id) => {
      deleteFreeGeozone(id).then(() => getFreeGeozoneList.refetch());
    },
    [getFreeGeozoneList],
  );

  const columns = useMemo(() => {
    return [
      {
        title: "№",
        footer_title: t("name"),
        key: "count",
        render: (record, index) => (
          <div style={{ textTransform: "capitalize", textAlign: "center" }}>
            {(currentPage - 1) * limit + index + 1}
          </div>
        ),
      },
      {
        title: t("name"),
        key: "name",
        render: (record) => <div>{record.name}</div>,
      },
      {
        title: "",
        key: "geozone_delete_icon",
        render: (record, _, disable) => (
          <div className="flex justify-center">
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
                          history.push(
                            `/home/settings/company/free-geozone/${record.id}`,
                          );
                        },
                      },
                      {
                        icon: <DeleteIcon />,
                        color: "error",
                        title: t("delete"),
                        action: () => {
                          deleteTableData(record.id);
                        },
                      },
                    ]
              }
            />
          </div>
        ),
      },
    ];
  }, [currentPage, deleteTableData, history, limit, t]);

  return (
    <Card
      title={<Search setSearch={setSearch} />}
      className="m-4"
      footer={
        <Pagination
          title={t("general.count")}
          count={getFreeGeozoneList?.data?.count}
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
              {columns?.map((elm) => (
                <TableCell key={elm.key}>{elm.title}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!loader &&
              getFreeGeozoneList?.data?.geozones?.map((item, index) => (
                <TableRow
                  key={item.id}
                  className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                >
                  {columns?.map((col) => (
                    <TableCell key={col.key}>
                      {col?.render ? col?.render(item, index) : "-----"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <LoaderComponent isLoader={loader} />
    </Card>
  );
};

export default FreeGeoTable;
