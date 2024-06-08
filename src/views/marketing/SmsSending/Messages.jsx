import { useEffect, useMemo } from "react";
// import CustomCheckbox from "components/Checkbox/Checkbox";
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
import LoaderComponent from "components/Loader";
import { getRfmSms } from "services/v2/sms";

// let isFirstTime = true;

const Message = ({
  currentPage,
  limit,
  search,
  customers,
  setCustomers,
  loader,
  setLoader,
  value,
  state,
}) => {
  const { t } = useTranslation();

  // const PrimaryCheckbox = withStyles({
  //   root: {
  //     color: "#B0BABF",
  //     "&$checked": {
  //       color: "#0E73F6",
  //     },
  //   },
  //   checked: {},
  // })((props) => <CustomCheckbox color="default" {...props} />);

  // const [isAllTrueChecked, setIsAllTrueChecked] = useState(false);

  // const addNumber = (record) => {
  //   setItems((prev) => ({
  //     ...prev,
  //     phone_numbers: prev?.phone_numbers.concat(record.phone),
  //   }));
  // };

  // const removeNumber = (record) => {
  //   setItems((prev) => ({
  //     ...prev,
  //     phone_numbers: prev?.phone_numbers.filter((el) => el !== record.phone),
  //   }));
  // };

  // const addAllNumbers = () => {
  //   setItems((prev) => {
  //     let phoneNumbers = [];

  //     customers.data.forEach((el) => phoneNumbers.push(el.phone));

  //     return {
  //       ...prev,
  //       to_all: true,
  //       phone_numbers: phoneNumbers,
  //     };
  //   });

  //   setIsAllTrueChecked(true);
  // };

  // const removeAllNumbers = () => {
  //   setItems((prev) => ({
  //     ...prev,
  //     to_all: false,
  //     phone_numbers: [],
  //   }));
  //   setIsAllTrueChecked(false);
  // };

  const columns = useMemo(() => {
    return [
      {
        title: "№",
        key: "number",
        render: (_, index) => (
          <div className="text-info">
            {(currentPage - 1) * limit + index + 1}
          </div>
        ),
      },
      {
        title: t("text"),
        key: "text",
        render: (record) => (
          <div
            style={{
              maxWidth: "300px",
              maxHeight: "80px",
              width: "100%",
              overflow: "auto",
              whiteSpace: "pre-line",
              wordWrap: "break-word",
            }}
          >
            {record.text}
          </div>
        ),
      },
      {
        title: t("number.of.receivers"),
        key: "sent_count",
        render: (record) => record.sent_count,
      },
      {
        title: t("filter"),
        key: "filter",
        columns: [
          {
            key: "r",
            title: "R",
            render: (record) => record.filter?.r,
          },
          {
            key: "f",
            title: "F",
            render: (record) => record.filter?.f,
          },
          {
            key: "m",
            title: "M",
            render: (record) => record.filter?.m,
          },
          {
            key: "from_monetary",
            title: "Средний чек",
            render: (record) =>
              record.filter?.from_monetary + "-" + record.filter?.to_monetary,
          },
          {
            key: "from_frequency",
            title: "Кол-во заказов",
            render: (record) =>
              record.filter?.from_frequency + "-" + record.filter?.to_frequency,
          },
          {
            key: "from_recency",
            title: "Дни с последнего заказа",
            render: (record) =>
              record.filter?.from_recency + "-" + record.filter?.to_recency,
          },
        ],
      },
      {
        title: t("date.scheduled"),
        key: "scheduled_at",
        render: (record) => (
          <div style={{ width: 130 }}>
            {moment(record.scheduled_at).format("DD.MM.YYYY HH:mm:ss")}
          </div>
        ),
      },
      {
        title: t("date.branch"),
        key: "created_at",
        render: (record) => (
          <div style={{ width: 130 }}>
            {moment(record.created_at).format("DD.MM.YYYY HH:mm:ss")}
          </div>
        ),
      },
    ];
  }, [currentPage, limit, t]);

  useEffect(() => {
    // isFirstTime ? setLoader(true) : setLoader(false);
    setLoader(true);

    if (value === 2) {
      getRfmSms({
        page: currentPage,
        limit,
        search,
        from_date: moment(state.start_date).isValid()
          ? moment(state.start_date).format("YYYY-MM-DD")
          : moment().subtract(1, "month").format("YYYY-MM-DD"),
        to_date: moment(state.end_date).isValid()
          ? moment(state.end_date).format("YYYY-MM-DD")
          : moment().add(1, "d").format("YYYY-MM-DD"),
      })
        .then((res) => {
          setCustomers({
            count: res?.count,
            data: res?.messages,
          });
        })
        .catch((err) => console.log(err))
        .finally(() => {
          // isFirstTime = false;
          setLoader(false);
        });
    }
  }, [currentPage, limit, search, value, state, setCustomers, setLoader]);

  return (
    <div style={{ borderTop: "1px solid #EEEEEE", paddingTop: "10px" }}>
      <TableContainer className="rounded-lg border border-lightgray-1">
        <Table aria-label="simple-table">
          <TableHead>
            <TableRow>
              {columns.map((elm) => (
                <TableCell
                  colSpan={elm.columns ? elm.columns.length : 1}
                  rowSpan={elm.columns ? 1 : 2}
                  key={elm?.key}
                  style={{ textAlign: "center" }}
                >
                  {elm.title}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              {columns?.map(
                (item) =>
                  item?.columns?.length > 0 &&
                  item?.columns?.map((element, idx) => (
                    <TableCell
                      key={element?.key}
                      style={{
                        borderRight:
                          idx === item?.columns.length - 1
                            ? "1px solid #e5e9eb"
                            : "none",
                        textAlign: "center",
                      }}
                    >
                      {element?.title}
                    </TableCell>
                  )),
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {!loader &&
              customers?.data?.map((item, index) => (
                <TableRow
                  key={item.id}
                  className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                >
                  {columns.map((col) =>
                    col.columns?.length > 0 ? (
                      col?.columns?.map((element) => (
                        <TableCell key={element.key}>
                          {element?.render
                            ? element.render(item, index)
                            : "---"}
                        </TableCell>
                      ))
                    ) : (
                      <TableCell key={col.key}>
                        {col?.render ? col.render(item, index) : "---"}
                      </TableCell>
                    ),
                  )}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <LoaderComponent isLoader={loader} />
    </div>
  );
};

export default Message;
