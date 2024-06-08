import React, { useMemo, useState } from "react";
import { deleteGeozone, useGeozone } from "services/v2/geozone";
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

const GeoTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loader, setLoader] = useState(true);

  const history = useHistory();
  const { t } = useTranslation();

  const { getGeozoneQuery } = useGeozone({
    geozoneParams: {
      page: currentPage,
      limit: limit,
    },
    geozoneProps: {
      enabled: true,
      onSuccess: (res) => {
        setLoader(false);
      },
    },
  });

  const deleteTableData = (id) => {
    deleteGeozone(id);
  };
  const columns = useMemo(() => {
    return [
      {
        title: "№",
        footer_title: t("name"),
        key: "name",
        render: (record, index) => (
          <div style={{ textTransform: "capitalize", textAlign: "center" }}>
            {(currentPage - 1) * limit + index + 1}
          </div>
        ),
      },
      {
        title: t("name"),
        key: "geozone",
        render: (record) => <div>{record.name}</div>,
      },
      {
        title: "",
        key: "geozone_delete_icon",
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
                          history.push(
                            `/home/settings/company/geozone/${record.id}`,
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
  }, []);

  return (
    <Card
      className="m-4"
      footer={
        <Pagination
          title={t("general.count")}
          count={getGeozoneQuery?.data?.count}
          onChange={(pageNumber) => setCurrentPage(pageNumber)}
          pageCount={limit}
          onChangeLimit={(limitNumber) => setLimit(limitNumber)}
          limit={limit}
        />
      }
    >
      <div>
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
                getGeozoneQuery?.data?.geozones?.map((item, index) => (
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
      </div>
    </Card>
  );
};

export default GeoTable;
