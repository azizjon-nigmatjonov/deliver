import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Card from "components/Card";
import Pagination from "components/Pagination";
import AddIcon from "@mui/icons-material/Add";
import LoaderComponent from "components/Loader";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { getBranches } from "services";
import Tag from "components/Tag";
import { useHistory } from "react-router-dom";
import Header from "components/Header";
import Button from "components/Button";
import {
  Update,
  PaymentRounded as PaymentRoundedIcon,
} from "@mui/icons-material";
import Search from "components/Search";
import ActionMenu from "components/ActionMenu";
import SwitchColumns from "components/Filters/SwitchColumns";
import PaymentTypeForm from "./PaymentTypeForm";
import { iikoUpdateBranches, useIiko } from "services/v2";

export default function Branches({ filters }) {
  const { t } = useTranslation();
  const history = useHistory();

  const [loader, setLoader] = useState(true);
  const [items, setItems] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [columns, setColumns] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [branchId, setBranchId] = useState("");

  const [search, setSearch] = useState("");

  const getItems = useCallback(
    (page) => {
      setLoader(true);
      getBranches({ limit, page, ...filters, search })
        .then((res) => {
          setItems({
            count: res?.count,
            data: res?.branches,
          });
        })
        .finally(() => setLoader(false));
    },
    [filters, limit, search],
  );

  useEffect(() => {
    getItems(currentPage);
  }, [currentPage, filters, limit, search, getItems]);

  const { putStopList } = useIiko({
    props: {},
  });

  const initialColumns = useMemo(
    () => [
      {
        title: "№",
        key: "order-number",
        render: (_, index) => <>{(currentPage - 1) * limit + index + 1}</>,
      },
      {
        title: t("name"),
        key: "name",
        dataIndex: "name",
      },
      {
        title: t("navigation"),
        key: "address",
        dataIndex: "address",
        render: (record) => <>{record.address}</>,
      },
      {
        title: t("status"),
        key: "iiko_id",
        render: (record) => (
          <Tag
            className="p-1"
            color={record?.iiko_id ? "primary" : "warning"}
            lightMode={true}
          >
            {record?.iiko_id ? t("available") : t("unavailable")}
          </Tag>
        ),
      },
    ],
    [currentPage, limit, t],
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
            actions={
              record?.iiko_id
                ? [
                    {
                      icon: <PaymentRoundedIcon />,
                      color: "primary",
                      title: t("payment.types"),
                      action: () => {
                        setBranchId(record.id);
                        setOpenModal(true);
                      },
                    },
                    {
                      icon: <Update />,
                      color: "primary",
                      title: t("update_menu"),
                      action: () => {
                        putStopList.mutate({
                          crm_type: "iiko",
                          organization_id: record.iiko_id,
                        });
                      },
                    },
                  ]
                : [
                    {
                      icon: <PaymentRoundedIcon />,
                      color: "primary",
                      title: t("payment.types"),
                      action: () => {
                        setBranchId(record.id);
                        setOpenModal(true);
                      },
                    },
                  ]
            }
          />
        ),
      },
    ];
    setColumns(_columns);
  }, [limit, currentPage, history, initialColumns, t]);

  //iikoUpdateBranches

  const updateIikoBranches = () => {
    iikoUpdateBranches().then(() => {
      getItems(currentPage);
    });
  };
  return (
    <Card
      className="m-4"
      footer={
        <Pagination
          title={t("general.count")}
          count={items?.count}
          onChange={(pageNumber) => setCurrentPage(pageNumber)}
          pageCount={limit}
          limit={limit}
          onChangeLimit={(limitNumber) => setLimit(limitNumber)}
        />
      }
    >
      <Header
        startAdornment={<Search setSearch={(value) => setSearch(value)} />}
        endAdornment={
          <div className="flex gap-5">
            <Button icon={Update} size="medium" onClick={updateIikoBranches}>
              {t("update")}
            </Button>
            <Button
              icon={AddIcon}
              size="medium"
              onClick={() =>
                history.push("/home/settings/integrations/iiko/branch-create")
              }
            >
              {t("add")}
            </Button>
          </div>
        }
      />
      <TableContainer className="relative rounded-lg border border-lightgray-1">
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              {columns.map((elm) => (
                <TableCell key={elm.key}>{elm.title}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!loader &&
              items?.data?.map((item, index) => (
                <TableRow
                  key={item.id}
                  className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                >
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      {col.render
                        ? col.render(item, index)
                        : item[col.dataIndex]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <LoaderComponent isLoader={loader} />
      <PaymentTypeForm
        open={openModal}
        onClose={() => setOpenModal(false)}
        branchId={branchId}
      />
    </Card>
  );
}
