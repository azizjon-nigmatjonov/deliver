import CustomCheckbox from "components/Checkbox/Checkbox";
import moment from "moment";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect } from "react";
import { getCouriers } from "services";
import LoaderComponent from "components/Loader";
import Tag from "components/Tag";
import { withStyles } from "@mui/styles";
// let isFirstTime = true;

const Couriers = ({
  currentPage,
  limit,
  search,
  couriers,
  setCouriers,
  loader,
  setLoader,
  value,
  items,
  setItems,
}) => {
  const { t } = useTranslation();
  const PrimaryCheckbox = withStyles({
    root: {
      color: "#B0BABF",
      "&$checked": {
        color: "#0E73F6",
      },
    },
    checked: {},
  })((props) => <CustomCheckbox color="default" {...props} />);

  const addNumber = (record) => {
    setItems((prev) => ({
      ...prev,
      phone_numbers: prev?.phone_numbers.concat(record.phone),
    }));
  };

  const removeNumber = (record) => {
    setItems((prev) => ({
      ...prev,
      phone_numbers: prev?.phone_numbers.filter((el) => el !== record.phone),
    }));
  };

  const addAllNumbers = () => {
    setItems((prev) => {
      let phoneNumbers = [];

      couriers.data.forEach((el) => phoneNumbers.push(el.phone));

      return {
        ...prev,
        phone_numbers: phoneNumbers,
      };
    });
  };

  const removeAllNumbers = () => {
    setItems((prev) => ({
      ...prev,
      phone_numbers: [],
    }));
  };

  const columns = [
    {
      title: (
        <PrimaryCheckbox
          color="primary"
          iconstyle={{ fill: "white" }}
          checked={items?.phone_numbers?.length === couriers?.data?.length}
          onChange={(e) =>
            e.target.checked ? addAllNumbers() : removeAllNumbers()
          }
        />
      ),
      key: "order-number",
      render: (record, index) => (
        <PrimaryCheckbox
          color="primary"
          checked={items.phone_numbers.includes(record.phone)}
          iconstyle={{ fill: "white" }}
          onChange={(e) =>
            e.target.checked ? addNumber(record) : removeNumber(record)
          }
        />
      ),
    },
    {
      title: t("first.name"),
      key: "name",
      render: (record) => record.first_name,
    },
    {
      title: t("last.name"),
      key: "phone_number",
      render: (record) => record.last_name,
    },
    {
      title: t("phone.number"),
      key: "phone",
      render: (record) => record.phone,
    },
    {
      title: t("date.branch"),
      key: "date_branch",
      render: (record) => <>{moment(record.created_at).format("DD-MM-YYYY")}</>,
    },
    {
      title: t("courier.type"),
      key: "orders_count",
      render: (record) => record.courier_type.name,
    },
    {
      title: t("status"),
      key: "status",
      render: (record) => (
        <Tag
          className="p-1"
          color={record.is_active ? "primary" : "warning"}
          lightMode={true}
        >
          {record?.is_active ? t("active") : t("inactive")}
        </Tag>
      ),
    },
  ];

  useEffect(() => {
    setLoader(true);
    // isFirstTime ? setLoader(true) : setLoader(false);

    if (value === 1) {
      getCouriers({ page: currentPage, limit, search })
        .then((res) => {
          setCouriers({
            count: res?.count,
            data: res?.couriers,
          });
        })
        .catch((err) => console.log(err))
        .finally(() => {
          // isFirstTime = false;
          setLoader(false);
        });
    }
  }, [currentPage, limit, search, value, setCouriers, setLoader]);

  return (
    <div style={{ borderTop: "1px solid #EEEEEE", paddingTop: "10px" }}>
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
            {!loader &&
              couriers?.data?.map((elm, index) => (
                <TableRow
                  key={elm.id}
                  // onClick={() => {
                  //   history.push(
                  //     `/home/settings/company/branches/${elm.id}`,
                  //   );
                  // }}
                  className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                >
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      {col.render ? col.render(elm, index) : "----"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <LoaderComponent isLoader={loader} />
      </TableContainer>
    </div>
  );
};

export default Couriers;
