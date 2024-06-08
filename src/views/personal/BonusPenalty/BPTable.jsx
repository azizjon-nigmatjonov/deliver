import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
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

import Pagination from "../../../components/Pagination";
import SwitchColumns from "../../../components/Filters/SwitchColumns";
import ActionMenu from "../../../components/ActionMenu";
import Card from "../../../components/Card";
import { deleteBP, useBPs } from "services/v2/courier-bonus-penalty";
import Filters from "components/Filters";
import Search from "components/Search";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FilterFlagIcon } from "constants/icons";
import { FlagSelect } from "components/FlagSelect";
import { showAlert } from "redux/actions/alertActions";

export default function BPTable() {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const lang = useSelector((state) => state.lang.current);
  const dispatch = useDispatch();

  const [columns, setColumns] = useState([]);
  const [params, setParams] = useState({
    limit: 10,
    page: 1,
    search: "",
    type: "",
  });

  const { data, refetch } = useBPs({
    params: {
      page: params.page,
      limit: params.limit,
      search: params.search,
      type: params.type,
    },
    props: {
      enabled:
        location?.pathname ===
          "/home/personal/couriers/courier-bonus-penalty" ?? false,
    },
  });

  const deleteHandler = useCallback(
    (id) => {
      deleteBP(id).then(() => {
        refetch();
        dispatch(showAlert(t("successfully_deleted"), "success"));
      });
    },
    [dispatch, refetch, t],
  );

  const initialColumns = useMemo(
    () => [
      {
        title: "№",
        key: "order-number",
        render: (_, index) => (
          <>{(params?.page - 1) * params?.limit + index + 1}</>
        ),
      },
      {
        title: t("name"),
        key: "name",
        render: (record) => <>{record.name[lang]}</>,
      },
      {
        title: t("type"),
        key: "type",
        render: (record) => <div>{t(record.type)}</div>,
      },
      {
        title: t("courier.bp.type"),
        key: "bp.type",
        render: (record) => <div>{t(record.bonus_penalty_for)}</div>,
      },
      {
        title: t("courier.bp.price"),
        key: "bp.price",
        render: (record) => (
          <div>
            {record.bonus_penalty_datas?.amount ||
              record.bonus_penalty_datas?.amount_for_top?.[0] + ", ..."}
          </div>
        ),
      },
    ],
    [lang, params?.limit, params?.page, t],
  );

  useEffect(() => {
    const _columns = [
      ...initialColumns,
      {
        title: (
          <SwitchColumns
            columns={initialColumns}
            onChange={(val) =>
              setColumns((prev) => [...val, prev[prev.length - 1]])
            }
          />
        ),
        key: t("actions"),
        render: (record) => (
          <ActionMenu
            id={record.id}
            actions={[
              {
                icon: <EditIcon />,
                color: "primary",
                title: t("change"),
                action: () => {
                  history.push(
                    `/home/personal/couriers/courier-bonus-penalty/${record.id}`,
                  );
                },
              },
              {
                icon: <DeleteIcon />,
                color: "error",
                title: t("delete"),
                action: () => deleteHandler(record.id),
              },
            ]}
          />
        ),
      },
    ];
    setColumns(_columns);
  }, [history, initialColumns, t, deleteHandler]);

  const pagination = (
    <Pagination
      title={t("general.count")}
      count={data?.count}
      limit={params?.limit}
      onChangeLimit={(limit) => {
        setParams((prev) => ({
          ...prev,
          limit,
        }));
      }}
      onChange={(page) => {
        setParams((prev) => ({
          ...prev,
          page,
        }));
      }}
    />
  );

  return (
    <>
      <Filters>
        <Search
          setSearch={(search) => {
            setParams((prev) => ({
              ...prev,
              search,
            }));
          }}
        />
      </Filters>
      <Card className="m-4" footer={pagination}>
        <TableContainer className="rounded-lg border border-lightgray-1">
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                {columns.map((elm) => (
                  <TableCell key={elm.key}>
                    {elm.key === "type" ? (
                      <div className="w-full flex items-center justify-between">
                        <p>{t("type")}</p>
                        <FlagSelect
                          icon={<FilterFlagIcon />}
                          options={[
                            { value: "", label: "Все" },
                            { value: "bonus", label: t("bonus") },
                            { value: "penalty", label: t("penalty") },
                          ]}
                          setValue={(type) => {
                            setParams((prev) => ({
                              ...prev,
                              type,
                            }));
                          }}
                        />
                      </div>
                    ) : (
                      elm.title
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.bonuses_penalties?.map((item, index) => (
                <TableRow
                  key={item.id}
                  className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                >
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      {col.render ? col.render(item, index) : "----"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </>
  );
}
