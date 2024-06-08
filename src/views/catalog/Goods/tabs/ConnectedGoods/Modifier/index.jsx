import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import LoaderComponent from "components/Loader";
import { getModifiers } from "services/v2/modifier";
import MuiButton from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { useParams } from "react-router-dom";
import AddModifierModal from "./AddModifierModal";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteModifier } from "services/v2/modifier";
import Modal from "components/Modal";
import Card from "components/Card";
import Pagination from "components/Pagination";
import { useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import ActionMenu from "components/ActionMenu";

// const useStyles = makeStyles((theme) => ({
//   root: {
//     "& > *": {
//       width: "100%",
//       border: "1px solid #ddd",
//       color: "#000",
//       marginTop: "1rem",
//     },
//     "& > *:hover": {
//       border: "1px solid #000",
//       background: "#fff",
//     },
//   },
//   icon: {
//     color: "#000",
//   },
// }));

const Modifier = ({ formik }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState([]);
  const params = useParams();
  const [modifierModalStatus, setModifierModalStatus] = useState(false);
  const [deleteModalStatus, setDeleteModalStatus] = useState(false);
  const [modifierProductId, setModifierProductId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const lang = useSelector((state) => state.lang.current);
  const [singleModifierId, setSingleModifierId] = useState(null);

  const onDeleteModifier = (id) => {
    deleteModifier(id)
      .then(() => {
        getModifier();
        setDeleteModalStatus(false);
      })
      .catch((error) => console.log(error));
  };

  const initialColumns = useMemo(() => {
    return [
      {
        title: t("good.name"),
        key: "good_name",
        render: (record) => record?.name?.ru,
      },
      {
        title: t("vendor_code"),
        key: "vendor_code",
        render: (record) => record?.code,
      },
      {
        title: t("price"),
        key: "price",
        render: (record) => (
          <>
            {record?.price} {t("uzb.sum")}
          </>
        ),
      },
      {
        title: t("mandatory"),
        key: "mandatory",
        render: (record) => (record?.is_compulsory ? t("yes") : t("no")),
      },
      {
        title: t("not.considering.price"),
        key: "not_considering_price",
        render: (record) => (record?.add_to_price ? t("yes") : t("no")),
      },
      {
        title: t("min.amount"),
        key: "min_amount",
        render: (record) => (record?.min_amount ? record?.min_amount : "0"),
      },
      {
        title: t("max.amount"),
        key: "max_amount",
        render: (record) => record?.max_amount,
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
                  title: t("edit"),
                  color: "primary",
                  icon: <EditIcon />,
                  action: () => {
                    setModifierModalStatus(!modifierModalStatus);
                    setSingleModifierId({
                      id: record.id,
                      to_product_id: record.to_product_id,
                    });
                  },
                },
                {
                  title: t("delete"),
                  color: "error",
                  icon: <DeleteIcon />,
                  action: () => {
                    setDeleteModalStatus(!deleteModalStatus);
                    setModifierProductId(record.id);
                  },
                },
              ]}
            />
          </div>
        ),
      },
    ];
  }, [t, deleteModalStatus, lang, modifierModalStatus]);

  const getModifier = useCallback(() => {
    if (
      formik.values.type?.value === "variant" ||
      formik.values.type?.value === "simple" ||
      formik.values.type?.value === "combo"
    ) {
      getModifiers({ product_id: params.id, limit: limit, page: currentPage })
        .then((res) => setItems(res))
        .catch((error) => console.log(error));
    }
  }, [currentPage, formik.values.type?.value, limit, params.id]);

  useEffect(() => {
    getModifier();
  }, [getModifier, limit, currentPage]);

  return (
    <Card
      footer={
        <Pagination
          title={t("general.count")}
          pageCount={limit}
          limit={limit}
          count={items?.count}
          onChange={(pageNumber) => setCurrentPage(pageNumber)}
          onChangeLimit={(limitNumber) => setLimit(limitNumber)}
        />
      }
    >
      <TableContainer className="rounded-md border border-lightgray-1">
        <Table aria-label="simple-table">
          <TableHead>
            <TableRow>
              {initialColumns.map((elm) => (
                <TableCell key={elm.key} className="whitespace-nowrap">
                  {elm.title}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!isLoading &&
              items?.product_modifiers?.single_modifiers?.length &&
              items?.product_modifiers?.single_modifiers?.map((item, index) => (
                <TableRow key={item.code}>
                  {initialColumns?.map((col) => (
                    <TableCell key={col.key} className="whitespace-nowrap">
                      {col.render
                        ? col?.render(item, index, initialColumns.length === 1)
                        : "----"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            {!isLoading &&
              items?.product_modifiers?.group_modifiers?.length &&
              items?.product_modifiers?.group_modifiers?.map((item, index) => (
                <TableRow key={item.code}>
                  {initialColumns?.map((col) => (
                    <TableCell key={col.key} className="whitespace-nowrap">
                      {col.render
                        ? col?.render(item, index, initialColumns.length === 1)
                        : "----"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <MuiButton
        variant="outlined"
        fullWidth
        startIcon={<AddIcon color="primary" />}
        onClick={() => setModifierModalStatus(true)}
        sx={{ mt: 2, ml: "auto" }}
      >
        {t("add.goods")}
      </MuiButton>

      <Modal
        open={deleteModalStatus}
        onClose={() => setDeleteModalStatus(false)}
        close={t("no")}
        onConfirm={() => onDeleteModifier(modifierProductId)}
      />

      <AddModifierModal
        modifierModalStatus={modifierModalStatus}
        setModifierModalStatus={setModifierModalStatus}
        isLoading={isLoading}
        getModifier={getModifier}
        singleModifierId={singleModifierId}
        setSingleModifierId={setSingleModifierId}
      />
      <LoaderComponent isLoader={isLoading} />
    </Card>
  );
};

export default Modifier;
