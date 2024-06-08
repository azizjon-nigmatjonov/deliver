import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  deleteCRMAggregator,
  useAggregators,
} from "services/v2/crm_aggregators";
import AggregatorsCreate from "./aggregatorsCreate";
import { useDispatch, useSelector } from "react-redux";
import ActionMenu from "components/ActionMenu";
import EditIcon from "@mui/icons-material/Edit";
import { showAlert } from "redux/actions/alertActions";
import Card from "components/Card";
import Pagination from "components/Pagination";
import Button from "components/Button";
import Tag from "components/Tag";

const Aggregators = () => {
  const [open, setOpen] = useState(false);
  const [ID, setID] = useState("");
  const [request, setRequest] = useState({
    page: 1,
    limit: 10,
  });

  const lang = useSelector((state) => state.lang.current);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { data, refetch } = useAggregators({
    params: {
      page: request.page,
      limit: request.limit,
    },
    props: {
      enabled: true,
    },
  });

  useEffect(() => refetch(), [request]);

  const columns = [
    {
      title: "№",
      key: "order-number",
      render: (record, index) => (
        <div>{(request.page - 1) * request.limit + index + 1}</div>
      ),
    },
    {
      title: t("first.name"),
      key: "name",
      render: (record) => <div>{record.system_aggregator_name?.[lang]}</div>,
    },
    {
      title: t("IIKO ID"),
      key: "iiko_name",
      render: (record) => <div>{record.aggregator_data?.iiko_name}</div>,
    },
    {
      title: t("status"),
      key: "iiko_id",
      render: (record) => (
        <Tag
          className="p-1"
          color={record.aggregator_data?.iiko_id ? "primary" : "warning"}
          lightMode={true}
        >
          {record.aggregator_data?.iiko_id
            ? t("connected")
            : t("not.connected")}
        </Tag>
      ),
    },
    {
      key: t("actions"),
      render: (record, _, disable) => (
        <div className="flex gap-2 justify-end">
          <ActionMenu
            id={record.system_aggregator_id}
            actions={
              disable
                ? []
                : [
                    {
                      title: t("edit"),
                      color: "primary",
                      icon: <EditIcon />,
                      action: () => {
                        setID(record.system_aggregator_id);
                        setOpen(true);
                      },
                    },
                    {
                      icon: <DeleteIcon />,
                      color: "error",
                      title: t("delete"),
                      action: () => {
                        deleteCRMAggregator(record.system_aggregator_id).then(
                          () => {
                            refetch();
                            dispatch(
                              showAlert(t("successfully_deleted"), "success"),
                            );
                          },
                        );
                      },
                    },
                  ]
            }
          />
        </div>
      ),
    },
  ];

  return (
    <Card
      className="m-4"
      title={t("aggregators")}
      extra={
        <div className="flex gap-5">
          <Button icon={AddIcon} size="medium" onClick={() => setOpen(true)}>
            {t("add")}
          </Button>
        </div>
      }
      footer={
        <Pagination
          title={t("general.count")}
          count={data?.count}
          onChange={(page) =>
            setRequest((prev) => ({
              ...prev,
              page,
            }))
          }
          limit={request.limit}
          onChangeLimit={(limit) =>
            setRequest((prev) => ({
              ...prev,
              limit,
            }))
          }
        />
      }
    >
      <TableContainer className="relative rounded-lg border border-lightgray-1">
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              {columns?.map((elm, key) => (
                <TableCell key={key}>{elm.title}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.aggregators?.map((item, index) => (
              <TableRow
                key={item.system_aggregator_id}
                className={index % 2 === 0 ? "bg-lightgray-5" : ""}
              >
                {columns?.map((col) => (
                  <TableCell
                    key={col.key}
                    style={
                      col.key === "order-number"
                        ? { width: "20px", textAlign: "center" }
                        : { width: "auto" }
                    }
                  >
                    {col.render ? col.render(item, index) : item[col.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <AggregatorsCreate
        open={open}
        refetch={refetch}
        setOpen={setOpen}
        byID={ID}
        clearID={() => setID("")}
      />
    </Card>
  );
};

export default Aggregators;
