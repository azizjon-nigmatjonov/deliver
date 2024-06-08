import React, { useEffect, useRef, useState } from "react";
import Modal from "components/Modal";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Pagination from "components/Pagination";
import { useTranslation } from "react-i18next";
import { deleteBranch, getBranches, postBranchCourier } from "services";
import { useHistory } from "react-router-dom";
import LoaderComponent from "components/Loader";
import Card from "components/Card";
import ActionMenu from "components/ActionMenu";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import QrCodeIcon from "@mui/icons-material/Code";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useSelector } from "react-redux";
import moment from "moment";
import Button from "components/Button";
import { useFormik } from "formik";
import Search from "components/Search";
import AddCourierModal from "./AddCourierModal";
import QRCode from "react-qr-code";
import { saveAs } from "file-saver";

export default function Branches() {
  const { t } = useTranslation();
  const history = useHistory();
  const shipper_id = useSelector((state) => state.auth.shipper_id);

  const [items, setItems] = useState({});
  const [loader, setLoader] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [openCourierModal, setOpenCourierModal] = useState(false);
  const [branchId, setBranchId] = useState("");
  const [QRModal, setQRModal] = useState({ data: "", open: false });

  const { setFieldValue, values } = useFormik({
    initialValues: {
      couriers: {
        first_name: "",
        last_name: "",
        phone: "",
        created_at: "",
      },
      courier_id: "",
    },
  });

  useEffect(() => {
    getItems(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, limit, search]);

  const getItems = (page) => {
    setLoader(true);
    getBranches({ limit, page, search }, shipper_id)
      .then((res) => {
        setItems({
          count: res?.count,
          data: res?.branches,
        });
      })
      .finally(() => setLoader(false));
  };

  const handleDeleteItem = () => {
    setDeleteLoading(true);
    deleteBranch(deleteModal.id)
      .then((res) => {
        getItems(currentPage);
        setDeleteLoading(false);
        setDeleteModal(false);
      })
      .finally(() => setDeleteLoading(false));
  };

  const qrCodeRef = useRef();

  const handleDownload = () => {
    const svgElement = qrCodeRef.current;
    const svgData = new XMLSerializer().serializeToString(svgElement);

    const blob = new Blob([svgData], { type: "image/svg+xml" });
    saveAs(blob, "qrcode.svg");
  };
  const columns = [
    {
      title: "№",
      key: "order-number",
      render: (record, index) => (currentPage - 1) * limit + index + 1,
    },
    {
      title: t("branches"),
      key: "name",
      render: (record) => record.name,
    },
    {
      title: t("date_founded"),
      key: "created_at",
      render: (record) => <>{moment(record.created_at).format("DD.MM.YYYY")}</>,
    },
    {
      title: "",
      key: "actions",
      render: (record) => (
        <div className="flex gap-2">
          <ActionMenu
            id={record.id}
            actions={[
              {
                title: t("order.a.courier"),
                color: "success",
                icon: <DirectionsCarIcon />,
                action: () => {
                  setOpenCourierModal(true);
                  setBranchId(record.id);
                },
              },
              {
                title: t("Пользователи филиала"),
                color: "primary",
                icon: <GroupAddIcon />,
                action: () =>
                  history.push(
                    `/home/settings/company/add-branch-users/${record.id}`,
                  ),
              },
              {
                title: "QR-код",
                color: "gray",
                icon: <QrCodeIcon />,
                action: () => {
                  setQRModal((prev) => ({
                    ...prev,
                    data: `${process.env.REACT_APP_WEBAPP_QRCODE_URL}?shipper_id=${shipper_id}&branch_id=${record.id}&menu_id=${record.menu_id}&is_hall=true`,
                    open: true,
                  }));
                },
              },
              {
                title: t("edit"),
                color: "primary",
                icon: <EditIcon />,
                action: () =>
                  history.push(`/home/settings/company/branches/${record.id}`),
              },
              {
                title: t("delete"),
                color: "error",
                icon: <DeleteIcon style={{ color: "red" }} />,
                action: () => setDeleteModal({ id: record.id }),
              },
            ]}
          />
        </div>
      ),
    },
  ];

  const onConfirm = () => {
    postBranchCourier({
      branch_id: branchId,
      courier_id: values.courier_id?.value,
    })
      .then((res) => {
        setOpenCourierModal(false);
        setFieldValue("courier_id", "");
      })
      .catch((e) => console.log(e));
  };

  return (
    <Card
      title={<Search setSearch={setSearch} />}
      className="m-4"
      footer={
        <Pagination
          title={t("general.count")}
          count={items?.count}
          onChange={(pageNumber) => setCurrentPage(pageNumber)}
          pageCount={limit}
          onChangeLimit={(limitNumber) => setLimit(limitNumber)}
          limit={limit}
        />
      }
    >
      <TableContainer className="rounded-md border border-lightgray-1">
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              {columns.map((elm) => (
                <TableCell key={elm.key}>{elm.title}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!loader && items.data && items.data.length
              ? items.data.map((elm, index) => (
                  <TableRow
                    key={elm.id}
                    onClick={() => {
                      history.push(`/home/settings/company/branches/${elm.id}`);
                    }}
                    className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                  >
                    {columns.map((col) => (
                      <TableCell key={col.key}>
                        {col.render ? col.render(elm, index) : "----"}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </TableContainer>

      <LoaderComponent isLoader={loader} />

      <AddCourierModal
        open={openCourierModal}
        onConfirm={onConfirm}
        onClose={() => {
          setOpenCourierModal(false);
          setFieldValue("courier_id", "");
        }}
        branchId={branchId}
        setFieldValue={setFieldValue}
        values={values}
        // initialValues={initialValues}
      />

      <Modal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDeleteItem}
        loading={deleteLoading}
      />
      <Modal
        open={QRModal.open}
        title={"QRCode"}
        footer={null}
        onClose={() => setQRModal((prev) => ({ ...prev, open: false }))}
        width={300}
        isWarning={false}
      >
        <div
          style={{
            height: "auto",
            margin: "0 auto",
            marginBottom: "20px",
          }}
        >
          <QRCode
            value={QRModal.data}
            ref={qrCodeRef}
            size={256}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            viewBox={`0 0 256 256`}
          />
        </div>
        <Button onClick={handleDownload}>Скачать QR код</Button>
      </Modal>
    </Card>
  );
}
