import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { getNonOriginProducts, postMenuProducts } from "services/v2";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import Search from "components/Search";
import CustomCheckbox from "components/Checkbox/Checkbox";
import Modal from "components/ModalV2";
import Button from "components/Button/Buttonv2";

const Add = ({ fetchData, goodOpenModal, setGoodOpenModal }) => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [productIds, setProductIds] = useState([]);
  const [data, setData] = useState(null);
  const [all, setAll] = useState(false);

  const handleChange = (e) => {
    const { name, checked } = e.target;
    if (name === "allSelect") {
      setData((prevState) =>
        prevState?.map((item) => ({
          ...item,
          isChecked: checked,
        })),
      );
      setAll(checked);
      if (checked) {
        setProductIds(data?.map((item) => item.id));
      } else {
        setProductIds([]);
      }
    } else {
      if (
        checked &&
        data?.filter((item) => item?.isChecked !== true)?.length < 2
      ) {
        setAll(true);
      } else setAll(false);
      setProductIds((prev) => [...prev, name]);
      setData((prevState) =>
        prevState?.map((item) =>
          item.id === name ? { ...item, isChecked: checked } : item,
        ),
      );
    }
  };

  const onSubmit = useCallback(() => {
    if (productIds?.length) {
      postMenuProducts({
        menu_id: id,
        product_ids: all ? undefined : productIds.join(","),
        all,
      }).finally(() => {
        setGoodOpenModal(false);
        fetchData();
      });
    }
  }, [productIds, fetchData, id, setGoodOpenModal, all]);

  const fetchProduct = useCallback(
    (search) => {
      getNonOriginProducts({ search, limit: 50 }).then((res) => {
        setData(res?.products);
      });
    },
    [setData],
  );

  const columns = [
    {
      title: (
        <CustomCheckbox
          onChange={handleChange}
          name="allSelect"
          checked={all}
          color="primary"
        />
      ),
      key: "checkbox",
      render: (record) => (
        <CustomCheckbox
          onChange={handleChange}
          name={record.id}
          checked={record?.isChecked || all}
          color="primary"
        />
      ),
    },
    // { title: "№", key: "order-number", render: (_, index) => <>{index + 1}</> },
    {
      title: t("name"),
      key: "name",
      render: (record) => record?.title.ru,
    },
  ];

  useEffect(() => {
    fetchProduct();
  }, [goodOpenModal, fetchProduct]);

  return (
    <Modal
      open={goodOpenModal}
      title={t("add.goods")}
      onClose={() => setGoodOpenModal(false)}
      maxWidth="sm"
      fullWidth
    >
      <Search
        setSearch={(value) => fetchProduct(value)}
        size="large"
        className="mb-4"
      />
      <TableContainer
        style={{ maxHeight: "400px" }}
        className="rounded-md border border-lightgray-1 overflow-y-auto mb-4"
      >
        <Table aria-label="simple table">
          <TableHead className="sticky top-0 bg-white z-50">
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.key} style={{ maxWidth: "75px" }}>
                  {col.title}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((elm, index) => (
              <TableRow
                key={elm.id}
                className={index % 2 === 0 ? "bg-lightgray-5" : ""}
              >
                {columns.map((col) => (
                  <TableCell
                    key={col.key}
                    style={{ width: index ? "fit-content" : "max-content" }}
                  >
                    {col.render ? col.render(elm, index) : "--"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="contained" fullWidth onClick={onSubmit}>
        {t("save")}
      </Button>
    </Modal>
  );
};
export default Add;
