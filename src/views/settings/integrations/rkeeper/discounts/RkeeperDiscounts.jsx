import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Modal from "components/Modal";
import Card from "components/Card";
import {
  deleteRkeeperDiscount,
  getRkeeperDiscounts,
  postRKeeperDiscounts,
} from "services/v2/rkeeper_discounts";
import LoaderComponent from "components/Loader";
import DiscountsTable from "./DiscountsTable";
import { useTranslation } from "react-i18next";
import AddAllowance from "./AddAllowance";
import Pagination from "components/Pagination";

const RkeeperDiscounts = ({
  addDiscountModalStatus,
  setAddDiscountModalStatus,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [columns, setColumns] = useState([]);
  const [discounts, setDiscounts] = useState({
    count: 0,
    data: [],
  });
  const [loader, setLoader] = useState(true);
  const { t } = useTranslation();
  const { id } = useParams();
  const [data, setData] = useState({});

  const getDiscounts = useCallback(() => {
    if (id) {
      setLoader(true);
      getRkeeperDiscounts({ page: currentPage, limit, branch_id: id })
        .then((res) => {
          setDiscounts({
            count: res?.count,
            data: res?.Discounts,
          });
        })
        .catch((err) => console.log(err))
        .finally(() => setLoader(false));
    }
  }, [currentPage, id, limit]);

  useEffect(() => {
    getDiscounts();
  }, [limit, currentPage, getDiscounts]);

  const deleteDiscount = (id) => {
    deleteRkeeperDiscount(id)
      .catch((err) => console.log(err))
      .finally(() => {
        getDiscounts();
      });
  };

  const postRkeeperDiscount = () => {
    postRKeeperDiscounts({
      branch_id: id,
      price: data.price,
      rkeeper_code: data.rkeeper.value,
    }).then((res) => {
      if (res?.Message === "Successfully updated") {
        getDiscounts();
        setAddDiscountModalStatus(false);
        setData({});
      }
    });
  };

  return (
    <Card
      className="m-4"
      footer={
        <Pagination
          title={t("general.count")}
          count={discounts?.count}
          onChange={(pageNumber) => setCurrentPage(pageNumber)}
          pageCount={limit}
          limit={limit}
          onChangeLimit={(limitNumber) => setLimit(limitNumber)}
        />
      }
    >
      <DiscountsTable
        columns={columns}
        setColumns={setColumns}
        limit={limit}
        currentPage={currentPage}
        loader={loader}
        discounts={discounts}
        deleteDiscount={deleteDiscount}
        addDiscountModalStatus={addDiscountModalStatus}
        setAddDiscountModalStatus={setAddDiscountModalStatus}
        setData={setData}
      />
      <LoaderComponent isLoader={loader} />

      <Modal
        open={addDiscountModalStatus}
        onClose={() => {
          setAddDiscountModalStatus(false);
          setData({});
        }}
        onConfirm={() => {
          postRkeeperDiscount();
        }}
        isWarning={false}
        title="Добавить надбавку"
        close={t("close")}
        confirm={t("add")}
        width={600}
        loading={loader}
      >
        <AddAllowance data={data} setData={setData} branchId={id} />
      </Modal>
    </Card>
  );
};

export default RkeeperDiscounts;
