import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "components/Header";
import Filters from "components/Filters";
import RangePicker from "components/DatePicker/RangePicker";
import moment from "moment";
import { BranchesIcon, DownloadIcon, PersonIcon } from "constants/icons";
import FDropdown from "components/Filters/FDropdown";
import { StyledTabs, StyledTab } from "components/StyledTabs";
import Card from "components/Card";
import TabPanel from "components/Tab/TabPanel";
import { useHistory } from "react-router-dom";
import parseQuery from "helpers/parseQuery";
import TableCommentBranch from "./TableCommentBranch";
import TableCommentOperator from "./TableCommentOperator";
import TableCommentUser from "./TableCommentUser";
import TableCommentStatistic from "./TableCommentStatistic";
import { getBranches, getCouriers } from "services";
import Button from "components/Button";
import { ExcelReport } from "services/excel";

function CommentReport() {
  const history = useHistory();
  const { tab } = parseQuery();
  const [tabValue, setTabValue] = useState(+tab || 0);
  const { t } = useTranslation();
  const [branches, setBranches] = useState([]);
  const [couriers, setCouriers] = useState([]);
  const [filters, setFilters] = useState({
    start_date: null,
    end_date: null,
    courier_id: null,
    branch_id: null,
  });

  function a11yProps(index) {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  }

  const tabLabel = (text, isActive = false) => (
    <span className="px-1">{text}</span>
  );

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
    history.push({
      pathname: "/home/reports/comment_report",
      search: `tab=${newValue}`,
    });
  };
  const handleDateClear = (e) => {
    setFilters((old) => ({
      ...old,
      start_date: null,
      end_date: null,
    }));
  };
  const handleDateChange = (e) => {
    setFilters((old) => ({
      start_date: moment(e[0]).format("YYYY-MM-DD"),
      end_date: moment(e[1]).format("YYYY-MM-DD"),
    }));
  };
  const getData = () => {
    getBranches({ limit: 100, page: 1 }).then((res) =>
      setBranches(
        res?.branches && res?.branches?.length
          ? res?.branches.map((branch) => ({
              label: branch.name,
              value: branch.id,
            }))
          : [],
      ),
    );
    getCouriers({ limit: 100, page: 1 }).then((res) =>
      setCouriers(
        res?.couriers && res?.couriers?.length
          ? res?.couriers.map((courier) => ({
              label: courier.first_name + " " + courier.last_name,
              value: courier.id,
            }))
          : [],
      ),
    );
  };
  const downloadExcel = () => {
    ExcelReport.reports_review_excel({
      ...filters,
    })
      .then((res) => downloadURI(res?.url, res?.file_name))
      .catch((e) => console.log(e));
    function downloadURI(uri, name) {
      var link = document.createElement("a");
      link.setAttribute("download", name);
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Header title={t("comment_report")} />
      <Filters
        extra={
          <Button
            className={tabValue === 2 ? "" : "hidden"}
            icon={DownloadIcon}
            iconClassName="text-blue-600"
            color="zinc"
            shape="outlined"
            size="medium"
            onClick={downloadExcel}
          >
            {t("download")}
          </Button>
        }
        className="mb-0"
        style={{ borderBottom: "none" }}
      >
        <div className="flex gap-4 items-center product_report">
          <RangePicker
            hideTimePicker
            placeholder={t("order.period")}
            onChange={(e) =>
              e[0] === null ? handleDateClear() : handleDateChange(e)
            }
          />
          <FDropdown
            icon={<BranchesIcon />}
            options={branches}
            onClick={(branch_id, close) => {
              setFilters({
                ...filters,
                branch_id,
              });
              close();
            }}
            reset={() =>
              setFilters({
                ...filters,
                branch_id: null,
              })
            }
            value={filters.branch_id}
            label={t("branches")}
            className={tabValue === 2 || tabValue === 3 ? "" : "hidden"}
          />
          <FDropdown
            icon={<PersonIcon />}
            options={couriers}
            onClick={(courier_id, close) => {
              setFilters({
                ...filters,
                courier_id,
              });
              close();
            }}
            reset={() =>
              setFilters({
                ...filters,
                courier_id: null,
              })
            }
            value={filters.courier_id}
            label={t("couriers")}
            className={tabValue === 2 || tabValue === 3 ? "" : "hidden"}
          />
        </div>
      </Filters>
      <Card
        className="m-4"
        filters={
          <StyledTabs
            value={tabValue}
            onChange={handleChange}
            indicatorColor="primary"
            centered={false}
            aria-label="full width tabs example"
          >
            <StyledTab label={tabLabel(t("branches"))} {...a11yProps(0)} />
            <StyledTab label={tabLabel(t("operator"))} {...a11yProps(1)} />

            <StyledTab label={tabLabel(t("user_reviews"))} {...a11yProps(2)} />
            <StyledTab label={tabLabel(t("statistics"))} {...a11yProps(3)} />
          </StyledTabs>
        }
      >
        <TabPanel value={tabValue} tabValue={tabValue} index={0}>
          <TableCommentBranch tabValue={tabValue} filters={filters} />
        </TabPanel>
        <TabPanel value={tabValue} tabValue={tabValue} index={1}>
          <TableCommentOperator tabValue={tabValue} filters={filters} />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <TableCommentUser filters={filters} tabValue={tabValue} />
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
          <TableCommentStatistic tabValue={tabValue} filters={filters} />
        </TabPanel>
      </Card>
    </>
  );
}

export default CommentReport;
