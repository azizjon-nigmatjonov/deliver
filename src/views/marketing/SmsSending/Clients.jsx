import CustomCheckbox from "components/Checkbox/Checkbox";
// import moment from "moment";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import LoaderComponent from "components/Loader";
import FilterFlagDropdown from "components/Filters/FilterFlagDropdown";
import { withStyles } from "@mui/styles";
import moment from "moment";
import customerService from "services/customer";
// let isFirstTime = true;

const Clients = ({
  currentPage,
  limit,
  search,
  customers,
  setCustomers,
  loader,
  setLoader,
  value,
  items,
  setItems,
  state,
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

  const [isAllTrueChecked, setIsAllTrueChecked] = useState(false);
  const [sourceType, setSourceType] = useState("");

  const addNumber = (record) => {
    setItems((prev) => ({
      ...prev,
      phone_numbers: prev?.phone_numbers.concat(record.phone),
    }));
  };

  const removeNumber = (record) => {
    setItems((prev) => ({
      ...prev,
      phone_numbers: prev?.phone_numbers?.filter((el) => el !== record.phone),
    }));
  };

  const addAllNumbers = () => {
    setItems((prev) => {
      let phoneNumbers = [];

      customers.data.forEach((el) => phoneNumbers.push(el.phone));

      return {
        ...prev,
        to_all: true,
        phone_numbers: phoneNumbers,
      };
    });

    setIsAllTrueChecked(true);
  };

  const removeAllNumbers = () => {
    setItems((prev) => ({
      ...prev,
      to_all: false,
      phone_numbers: [],
    }));
    setIsAllTrueChecked(false);
  };

  const columns = [
    {
      title: (
        <PrimaryCheckbox
          color="primary"
          iconstyle={{ fill: "white" }}
          checked={isAllTrueChecked}
          onChange={(e) =>
            e.target.checked ? addAllNumbers() : removeAllNumbers()
          }
        />
      ),
      key: "order-number",
      render: (record, index) => (
        <PrimaryCheckbox
          color="primary"
          iconstyle={{ fill: "white" }}
          checked={items.phone_numbers.includes(record.phone)}
          onChange={(e) =>
            e.target.checked ? addNumber(record) : removeNumber(record)
          }
        />
      ),
    },
    {
      title: t("name"),
      key: "name",
      render: (record) => record.name,
    },
    {
      title: t("phone.number"),
      key: "phone_number",
      render: (record) => record.phone,
    },
    {
      title: t("date.branch"),
      key: "date_branch",
      render: (record) => moment(record.created_at).format("DD.MM.YYYY"),
    },
    {
      title: t("date.of.birth"),
      key: "date_birth",
      render: (record) => record.date_of_birth,
    },
    {
      title: (
        <div className="flex items-center">
          <p>{t("source")}</p>
          <FilterFlagDropdown
            options={[
              { value: "", label: t("all") },
              { value: "app", label: t("app") },
              { value: "bot", label: t("telegram_bot") },
              { value: "admin-panel", label: t("admin_panel") },
            ]}
            value={sourceType}
            onClick={setSourceType}
            filter
          />
        </div>
      ),
      key: "source",
      render: (record) =>
        record.registration_source === "app"
          ? t("app")
          : record?.registration_source === "admin-panel"
          ? t("admin_panel")
          : record?.registration_source === "bot"
          ? t("telegram_bot")
          : "",
    },
    {
      title: t("status"),
      key: "status",
      render: (record) => true,
    },
    {
      title: t("count.orders"),
      key: "orders_count",
      render: (record) => record.orders_amount,
    },
    {
      title: t("average.check"),
      key: "average_check",
      render: (record) => record.average_price,
    },
  ];

  useEffect(() => {
    // isFirstTime ? setLoader(true) : setLoader(false);
    setLoader(true);

    if (value === 0) {
      customerService
        .getSMSCustomers({
          page: currentPage,
          limit,
          search,
          start_date: state.start_date,
          end_date: state.end_date,
          start_count: state.start_count,
          end_count: state.end_count,
          start_average: state.start_price,
          end_average: state.end_price,
          reg_source: sourceType[0]?.value,
        })
        .then((res) => {
          setCustomers({
            count: res?.count,
            data: res?.customers,
          });
        })
        .catch((err) => console.log(err))
        .finally(() => {
          // isFirstTime = false;
          setLoader(false);
        });
    }
  }, [
    currentPage,
    limit,
    search,
    value,
    state,
    setCustomers,
    setLoader,
    sourceType,
  ]);

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
              customers?.data?.map((elm, index) => (
                <TableRow
                  key={elm.id}
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
      </TableContainer>
      <LoaderComponent isLoader={loader} />
    </div>
  );
};

export default Clients;
