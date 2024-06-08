import { useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import AsyncSelect from "components/Select/Async";
import {
  getCouriers,
  removeBranchCourier,
  useCouriersByBranch,
} from "services";
import Tag from "components/Tag";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch } from "react-redux";
import { showAlert } from "redux/actions/alertActions";
import LoaderComponent from "components/Loader";
import Pagination from "components/Pagination";
import Modal from "components/ModalV2";
import Button from "components/Button/Buttonv2";

const AddCourierModal = ({
  open,
  onConfirm,
  onClose,
  branchId,
  setFieldValue,
  values,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isFetching, refetch } = useCouriersByBranch({
    branch_id: branchId,
    params: { limit, page: currentPage },
    props: { enabled: open },
  });

  const loadCouriers = useCallback(
    (inputValue, callback) => {
      getCouriers({ search: inputValue })
        .then((res) => {
          let couriers = res?.couriers?.map((courier) => ({
            label: `${courier.first_name} ${
              courier.last_name ? courier.last_name : ""
            }`,
            value: courier.id,
          }));
          let result = couriers.filter(
            (o1) => !data?.couriers?.some((o2) => o1.value === o2.id),
          );
          callback(result);
        })
        .catch((error) => console.log(error));
    },
    [data],
  );

  const deleteCourierFromBranch = (courierID) => {
    removeBranchCourier({ branch_id: branchId, courier_id: courierID })
      .then((res) => {
        refetch();
        dispatch(showAlert(t("successfully_deleted"), "success"));
      })
      .catch((e) => console.log(e));
  };
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t("order.a.courier")}
      maxWidth="sm"
      contentsx={{ overflowY: "visible" }}
    >
      <div className="my-4">
        <h2 className="input-label mb-1">Введите имя или телефон курьера</h2>
        <AsyncSelect
          onChange={(val) => setFieldValue("courier_id", val)}
          loadOptions={loadCouriers}
          defaultOptions
          isSearchable
          isClearable
          useZIndex={true}
          value={values.courier_id}
          maxMenuHeight={250}
          placeholder={t("search")}
        />
      </div>
      <TableContainer
        style={{ overflowY: "auto", maxHeight: "50vh" }}
        className="rounded-lg border border-lightgray-1 mb-6"
      >
        <Table area="simple-table">
          <TableHead>
            <TableRow>
              <TableCell>№</TableCell>
              <TableCell>Имя</TableCell>
              <TableCell>Номер телефона</TableCell>
              <TableCell>{t("action")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!isFetching &&
              data?.couriers?.map((courier, index) => (
                <TableRow
                  key={courier.id}
                  className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                >
                  <TableCell>{(currentPage - 1) * limit + index + 1}</TableCell>
                  <TableCell>{`${courier.first_name} ${courier.last_name}`}</TableCell>
                  <TableCell>{courier.phone}</TableCell>
                  <TableCell>
                    <Tag
                      color="error"
                      lightMode={true}
                      size="large"
                      shape="subtle"
                      className="cursor-pointer"
                    >
                      <DeleteIcon
                        onClick={() => deleteCourierFromBranch(courier.id)}
                        style={{ color: "red" }}
                      />
                    </Tag>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <LoaderComponent isLoader={isFetching} height={24} />
      </TableContainer>
      <Pagination
        noLimitChange
        title={t("general.count")}
        count={data?.count}
        onChange={(pageNumber) => setCurrentPage(pageNumber)}
        pageCount={limit}
        limit={limit}
        onChangeLimit={(limitNumber) => setLimit(limitNumber)}
      />
      <Button
        variant="contained"
        disabled={values.courier_id ? false : true}
        fullWidth
        onClick={onConfirm}
        sx={{ mt: 2 }}
      >
        {t("order.a.courier")}
      </Button>
    </Modal>
  );
};

export default AddCourierModal;
