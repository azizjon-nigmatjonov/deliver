import { useState } from "react";
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  Edit as EditIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { deleteBranchUser, useBranchUsersList } from "services";
import LoaderComponent from "components/Loader";
import Card from "components/Card";
import { useParams } from "react-router-dom";
import ActionMenu from "components/ActionMenu";
import Header from "components/Header";
import UserFormModal from "./UserFormModal";
import Search from "components/Search";
import Tag from "components/Tag";
import Filters from "components/Filters";
import Button from "components/Button/Buttonv2";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

const BranchUsers = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");

  const { id } = useParams();
  const history = useHistory();

  const { data, isLoading, refetch } = useBranchUsersList({
    params: { branch_id: id, page: 1, limit: 50, search },
    props: { enabled: true },
  });

  const deleteBranchUserItem = (id) => {
    deleteBranchUser(id).then(() => refetch());
  };

  const columns = [
    {
      title: t("first.name"),
      key: "name",
      dataIndex: "name",
    },
    {
      title: t("phone.number"),
      key: "phone",
      dataIndex: "phone",
    },
    {
      title: t("status"),
      key: "status",
      render: (record) => (
        <Tag
          className="p-1"
          color={record?.is_active ? "primary" : "warning"}
          lightMode={true}
        >
          {record?.is_active ? t("active") : t("inactive")}
        </Tag>
      ),
    },
    {
      title: t("actions"),
      key: "actions",
      render: (record) => (
        <div className="flex justify-center">
          <ActionMenu
            id={record.id}
            actions={[
              {
                title: t("edit"),
                color: "primary",
                icon: <EditIcon />,
                action: () => {
                  setOpen(true);
                  setUserId(record.id);
                },
              },
              {
                title: t("delete"),
                color: "error",
                icon: <DeleteIcon />,
                action: () => deleteBranchUserItem(record.id),
              },
            ]}
          />
        </div>
      ),
    },
  ];

  const headerTitle = (
    <div className="flex gap-3 items-center">
      <IconButton variant="outlined" onClick={() => history.goBack()}>
        <ArrowBackIcon />
      </IconButton>
      <p>Пользователей филиала</p>
    </div>
  );

  return (
    <>
      <Header
        title={headerTitle}
        endAdornment={
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={() => setOpen(true)}
          >
            {t("add")}
          </Button>
        }
      />
      <Filters>
        <Search setSearch={(value) => setSearch(value)} />
      </Filters>
      <Card className="m-4">
        <TableContainer className="rounded-md border border-lightgray-1 mb-6">
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                {columns.map((elm, idx) => (
                  <TableCell
                    style={{
                      textAlign: "center",
                      width: idx === 0 ? "40%" : "fit-content",
                    }}
                    key={elm.key}
                  >
                    {elm.title}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {!isLoading &&
                data?.branch_users?.map((user, index) => (
                  <TableRow
                    key={user.id}
                    className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                  >
                    {columns.map((col) => (
                      <TableCell
                        style={{ textAlign: "center" }}
                        key={col.key}
                        // className="whitespace-nowrap"
                      >
                        {col.render
                          ? col.render(user, index)
                          : user[col.dataIndex]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <LoaderComponent isLoader={isLoading} height={24} />
      </Card>
      <UserFormModal
        open={open}
        onClose={() => {
          userId && setUserId("");
          setOpen(false);
        }}
        onConfirm={refetch}
        items={data}
        userId={userId}
      />
    </>
  );
};

export default BranchUsers;
