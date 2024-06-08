import React, { useState } from "react";
import { useFares } from "services/v2/fares";
import { useTranslation } from "react-i18next";
import Card from "components/Card";
import Pagination from "components/Pagination";
import LoaderComponent from "components/Loader";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Button from "components/Button";
import Search from "components/Search";
import Modal from "components/Modal";
import { ErrorIconRounded } from "constants/icons";
import FareChangeModal from "./FareChangeModal";
import { showAlert } from "redux/actions/alertActions";
import { useDispatch } from "react-redux";
import CurrentFareForm from "./CurrentFareForm";

const FareTable = ({ fareName }) => {
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState();
  const [loader, setLoader] = useState(true);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const [newName, setNewName] = useState("");
  const [futureFare, setFutureFare] = useState(null);
  const [fareId, setFareId] = useState("");

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { getFares } = useFares({
    faresParams: {
      page: currentPage,
      limit: limit,
      search,
    },
    faresProps: {
      enabled: true,
      onSuccess: (res) => {
        setLoader(false);
        setItems(res?.shipper_fares);
      },
    },
  });

  const { getFutureFare } = useFares({
    futureFareProps: {
      onSuccess: (res) => {
        setFutureFare(res);
        setOpen(true);
        getFares.refetch();
      },
      onError: (err) => {
        console.log(err);
      },
    },
  });
  const { putFare } = useFares({
    putFareProps: {
      onSuccess: (res) => {
        setOpen(false);
      },
      onError: (err) => {
        err?.data?.error_code === 1 &&
          dispatch(showAlert("Недостаточно средств"));
      },
    },
  });

  const columns_product = [
    {
      title: t("name"),
      key: "name",
      dataIndex: "title",
      render: (record) => <div>{record?.name}</div>,
    },
    {
      title: t("fare.type"),
      key: "fare_type",
      dataIndex: "fare_type",
      render: (record) => (
        <>
          {record?.subscription_fee === "percent"
            ? "По проценту от общей суммы"
            : record?.subscription_fee === "fixed"
            ? "По базовой стоимости заказа"
            : "Фиксированная сумма"}
        </>
      ),
    },
    {
      title: t("payment.type"),
      key: "type",
      dataIndex: "type",
      render: (record) => (
        <p>{record?.type === "after" ? "Постоплата" : "Предоплата"}</p>
      ),
    },
    {
      title: "",
      key: "more",
      dataIndex: "more",
      render: (record) => (
        <>
          <div className="flex justify-around gap-4">
            <Button
              icon={ErrorIconRounded}
              onClick={() => {
                setOpenInfo(true);
                setFareId(record.id);
              }}
              shape="text"
            >
              {t("in_details")}
            </Button>
            <Button
              onClick={() => {
                getFutureFare.mutate({
                  future_fare_id: record.id,
                });
                setNewName(record.name);
                setFareId(record.id);
              }}
            >
              {t("change_fare")}
            </Button>
          </div>
        </>
      ),
    },
  ];

  return (
    <div>
      <Card
        className="m-4"
        title={t("product")}
        extra={<Search setSearch={(value) => setSearch(value)} />}
        footer={
          <Pagination
            title={t("general.count")}
            count={getFares?.data?.count}
            onChange={(pageNumber) => setCurrentPage(pageNumber)}
            pageCount={limit}
            limit={limit}
            onChangeLimit={(limitNumber) => setLimit(limitNumber)}
          />
        }
      >
        <TableContainer className="rounded-lg border border-lightgray-1">
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                {columns_product.map((elm) => (
                  <TableCell key={elm.key}>{elm.title}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {!loader &&
                items?.map((item, index) => (
                  <TableRow
                    key={item.id}
                    className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                  >
                    {columns_product.map((col) => (
                      <TableCell key={col?.key} width="100">
                        {col?.render
                          ? col?.render(item, index)
                          : item[col?.dataIndex]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <LoaderComponent isLoader={loader} />
      </Card>
      <Modal
        width={730}
        key="modal"
        open={open}
        isWarning={false}
        title={null}
        onClose={() => {
          setOpen(false);
        }}
        onConfirm={() => {
          putFare.mutate({
            future_fare_id: fareId,
          });
        }}
        loading={false}
        close={t("cancel")}
        confirm={t("confirm")}
      >
        <FareChangeModal
          data={futureFare}
          prevName={fareName}
          newName={newName}
        />
      </Modal>
      <Modal
        width={730}
        key="modal"
        open={openInfo}
        isWarning={false}
        title={null}
        onClose={() => {
          setOpenInfo(false);
        }}
        onConfirm={() => {
          setOpenInfo(false);
        }}
        loading={false}
        close={t(" ")}
        confirm={t("close")}
      >
        <CurrentFareForm open={openInfo} id={fareId} />
      </Modal>
    </div>
  );
};

export default FareTable;
