import { useEffect, useState } from "react";
import axios from "../../utils/axios";
import Table from "@mui/material/Table";
import Input from "../../components/Input";
import Header from "../../components/Header";
import Filters from "../../components/Filters";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import Breadcrumb from "../../components/Breadcrumb/index";
import CustomButton from "../../components/Buttons/index";
import { useHistory } from "react-router-dom";
import TableContainer from "@mui/material/TableContainer";
import { useTranslation } from "react-i18next";
import Pagination from "../../components/Pagination";
import TableLoader from "../../components/TableLoader";

export default function Status() {
  const { t } = useTranslation();
  const history = useHistory();
  const [items, setItems] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    getItems(currentPage);
  }, [currentPage]);

  const clearItems = () => {
    setItems((prev) => ({ count: prev.count }));
  };

  const getItems = (page) => {
    setLoader(true);
    clearItems();
    axios
      .get("/permission", { params: { limit: 10, page } })
      .then((res) => setItems(res))
      .finally(() => setLoader(false));
  };

  const routes = [
    {
      title: t("settings"),
      link: true,
      route: "/home/settings",
    },
    {
      title: t("permission"),
    },
  ];

  return (
    <div>
      <Header
        title={t("permission")}
        startAdornment={[<Breadcrumb routes={routes} />]}
        endAdornment={
          <CustomButton
            size="large"
            shape="text"
            color="text-primary-600"
            onClick={() => history.push("/home/settings/permission/create")}
          >
            {t("create")}
          </CustomButton>
        }
      />

      <Filters>
        <Input placeholder={t("search") + "..."} style={{ width: 410 }} />
      </Filters>

      <div className="m-4 p-4 rounded-lg bg-white">
        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow className="bg-gray-100">
                <TableCell>#</TableCell>
                <TableCell>{t("name")}</TableCell>
                <TableCell>{t("description")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.permissions && items.permissions.length ? (
                items.permissions.map(({ id, name, description }, index) => (
                  <TableRow
                    key={id}
                    onClick={() =>
                      history.push(`/home/settings/permission/${id}`)
                    }
                  >
                    <TableCell>
                      <p className="text-blue-600 cursor-pointer">
                        {(currentPage - 1) * 10 + index + 1}
                      </p>
                    </TableCell>
                    <TableCell>{name}</TableCell>
                    <TableCell>{description}</TableCell>
                  </TableRow>
                ))
              ) : (
                <></>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TableLoader isVisible={loader} />

        <Pagination
          count={items?.count}
          onChange={(pageNumber) => setCurrentPage(pageNumber)}
        />
      </div>
    </div>
  );
}
