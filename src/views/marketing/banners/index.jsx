import { useState } from "react";
import Header from "components/Header";
import Card from "components/Card";
import { useTranslation } from "react-i18next";
import Button from "components/Button/Buttonv2";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  deleteBanner,
  useBanners,
  // postBanner,
  // updateBanner,
} from "services/banner";
import Tag from "components/Tag";
import ActionMenu from "components/ActionMenu";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Pagination from "components/Pagination";
import LoaderComponent from "components/Loader";
import Modal from "components/Modal";
// import Gallery from "components/Gallery";
// import Switch from "components/Switch";
import { useHistory } from "react-router-dom";
import Search from "components/Search";
import Filters from "components/Filters";
import { AddRounded } from "@mui/icons-material";

const Banners = () => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  // const [modalStatus, setModalStatus] = useState(false);
  // let initialData = {
  //   image: "",
  //   title_in_uz: "",
  //   title_in_ru: "",
  //   title_in_en: "",
  //   url: "",
  //   active: true,
  // };
  // const [data, setData] = useState(initialData);
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  // const [editId, setEditId] = useState(null);
  const history = useHistory();

  const columns = [
    {
      title: "№",
      key: "order-number",
      render: (record, index) => <>{(currentPage - 1) * limit + index + 1}</>,
    },
    {
      title: t("title"),
      key: "text",
      render: (record) => record?.title?.ru,
    },
    {
      title: t("image"),
      key: "receiver-type",
      render: (record) => (
        <img src={record?.image} alt="brand logo" width="90px" height="90px" />
      ),
    },
    {
      title: t("status"),
      key: "created_at",
      render: (record) => (
        <Tag
          className="p-1"
          color={record.active ? "primary" : "warning"}
          lightMode={true}
        >
          {record.active ? t("active") : t("inactive")}
        </Tag>
      ),
    },
    {
      title: "",
      key: "actions",
      render: (record) => (
        <div className="flex justify-center items-center">
          <ActionMenu
            id={record.id}
            actions={[
              {
                icon: <EditIcon />,
                color: "primary",
                title: t("change"),
                action: () => {
                  // setEditId(record.id);
                  // getABanner(record.id);
                  history.push(`/home/marketing/banners/${record.id}`);
                },
              },
              {
                icon: <DeleteIcon />,
                color: "error",
                title: t("delete"),
                action: () => {
                  setDeleteModal(record.id);
                },
              },
            ]}
          />
        </div>
      ),
    },
  ];

  const { data, isLoading, refetch } = useBanners({
    params: {
      limit,
      page: currentPage,
      search,
    },
    props: { enabled: true },
  });

  // const updateABanner = () => {
  //   setDeleteLoading(true);
  //   updateBanner(editId, {
  //     active: data.active,
  //     image: data.image,
  //     position: "website",
  //     url: data.url,
  //     title: {
  //       uz: data.title_in_uz,
  //       ru: data.title_in_ru,
  //       en: data.title_in_en,
  //     },
  //   }).then(() => {
  //     setEditId(null);
  //     setDeleteLoading(false);
  //     getBannersData();
  //     setData(initialData);
  //   });
  // };

  const deleteItem = (id) => {
    setDeleteLoading(true);
    deleteBanner(id)
      .then(() => {
        setDeleteLoading(false);
        refetch();
      })
      .catch((error) => console.log(error));
  };

  // const onSubmit = () => {
  //   setDeleteLoading(true);
  //   postBanner({
  //     image: data.image,
  //     position: "website",
  //     title: {
  //       uz: data.title_in_uz,
  //       ru: data.title_in_ru,
  //       en: data.title_in_en,
  //     },
  //     url: data.url,
  //   })
  //     .then(() => setDeleteLoading(false))
  //     .finally(() => {
  //       setData(initialData);
  //       getBannersData();
  //       setDeleteLoading(false);
  //     });
  // };

  return (
    <>
      <Header
        title={t("banners")}
        endAdornment={
          <Button
            variant="contained"
            startIcon={<AddRounded />}
            onClick={() => history.push("/home/marketing/banners/create")}
          >
            {t("add")}
          </Button>
        }
      />
      <Filters>
        <Search setSearch={setSearch} />
      </Filters>
      <Card
        className="m-4"
        footer={
          <Pagination
            title={t("general.count")}
            count={data?.count}
            onChange={(pageNumber) => setCurrentPage(pageNumber)}
            pageCount={limit}
            onChangeLimit={(limitNumber) => setLimit(limitNumber)}
            limit={limit}
          />
        }
      >
        <TableContainer className="border border-lightgray-1">
          <Table aria-label="simple-label">
            <TableHead>
              <TableRow>
                {columns?.map((elm) => (
                  <TableCell key={elm.key}>{elm.title}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {!isLoading &&
                data?.banners?.map((banner, index) => (
                  <TableRow
                    key={banner.id}
                    className={
                      index % 2 === 0
                        ? "bg-lightgray-5 text-center"
                        : "text-center"
                    }
                  >
                    {columns?.map((col) => (
                      <TableCell
                        key={col.key}
                        className="flex justify-center items-center text-center"
                      >
                        {col.render ? col.render(banner, index) : "----"}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <LoaderComponent isLoader={isLoading} />
        </TableContainer>
      </Card>

      {/* <Modal
        title={t("add")}
        open={modalStatus}
        width={700}
        onClose={() => {
          setModalStatus(false);
          setData(initialData);
        }}
        onConfirm={() => {
          editId ? updateABanner() : onSubmit();
          setModalStatus(false);
        }}
        isWarning={false}
        loading={deleteLoading}
      >
        <div className="flex justify-between mb-8">
          <div className="w-3/5 mr-4">
            <div className="input-label mb-2 mt-6">
              <span>{t("title.in.ru")}</span>
            </div>
            <Input
              placeholder={t("title.in.ru")}
              value={data.title_in_ru}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  title_in_ru: e.target.value,
                }))
              }
            />
          </div>
          <div className="w-3/5">
            <div className="input-label mb-2 mt-6">
              <span>{t("title.in.uz")}</span>
            </div>
            <Input
              placeholder={t("title.in.uz")}
              value={data.title_in_uz}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  title_in_uz: e.target.value,
                }))
              }
            />
          </div>
        </div>

        <div className="flex justify-between mb-8">
          <div className="w-3/5 mr-4">
            <div className="input-label mb-2 mt-6">
              <span>{t("title.in.en")}</span>
            </div>
            <Input
              placeholder={t("title.in.en")}
              value={data.title_in_en}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  title_in_en: e.target.value,
                }))
              }
            />
          </div>
          <div className="w-3/5">
            <div className="input-label mb-2 mt-6">
              <span>{t("URL")}</span>
            </div>
            <Input
              placeholder={t("URL")}
              value={data.url}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  url: e.target.value,
                }))
              }
            />
          </div>
        </div>
        <div className="flex mb-4">
          <div>
            <div className="input-label mb-2 mt-6">
              <span>{t("image")}</span>
            </div>
            <Gallery
              multiple={false}
              style={{ paddingTop: "20px", marginTop: "20px" }}
              width={120}
              height={120}
              className="mt-8"
              gallery={data?.image ? [data?.image] : []}
              setGallery={(elm) => {
                setData((prev) => ({
                  ...prev,
                  image: elm[0],
                }));
              }}
            />
          </div>
          <div className="self-end ml-8">
            <div className="w-1/4 input-label">
              <span>{t("status")}</span>
            </div>
            <div className="w-3/4">
              <Switch
                id="active"
                checked={data.active}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    active: e,
                  }))
                }
              />
            </div>
          </div>
        </div>
      </Modal> */}

      <Modal
        open={Boolean(deleteModal)}
        onConfirm={() => {
          deleteItem(deleteModal);
          setDeleteModal(null);
        }}
        onClose={() => {
          // setData(initialData);
          setDeleteModal(null);
        }}
        isWarning={false}
        loading={deleteLoading}
      />
    </>
  );
};

export default Banners;
