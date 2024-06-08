import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "components/Header";
import Filters from "components/Filters";
import RangePicker from "components/DatePicker/RangePicker";
import moment from "moment";
import Button from "components/Button";
import { BranchesIcon, DownloadIcon } from "constants/icons";
import Card from "components/Card";
import AllAggregatorTable from "./Table";
import { getBranches, useAllAggregators } from "services";
import FDropdown from "components/Filters/FDropdown";
import { ExcelReport } from "services/excel";

function AllAggregator() {
  const { t } = useTranslation();
  const [branches, setBranches] = useState([]);

  const [filters, setFilters] = useState({
    start_date: moment().subtract(1, "days").format("YYYY-MM-DD"),
    end_date: moment().format("YYYY-MM-DD"),
    branch_id: null,
    aggregator_id: "",
  });
  useEffect(() => {
    getBranches({ limit: 100 }).then((res) => {
      res?.branches?.map((branch) =>
        setBranches((old) => [
          ...old,
          { label: branch.name, value: branch.id },
        ]),
      );
    });
  }, []);

  const { data: aggregators } = useAllAggregators({
    params: {
      page: 1,
      limit: 100,
    },
    props: {
      enabled: true,
      select: (res) => {
        const arr = res?.aggregators.map((agg) => ({
          value: agg?.id,
          label: agg?.name,
        }));
        return [...arr];
      },
    },
  });

  const clearBranch = () => {
    setFilters({
      ...filters,
      branch_id: null,
    });
  };

  const downloadExcel = () => {
    ExcelReport.aggregator_order_report({ ...filters })
      .then((res) => downloadURI(res?.url, res?.file_name))
      .catch((e) => console.log("excel", e));
    function downloadURI(uri, name) {
      var link = document.createElement("a");
      link.setAttribute("download", name);
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };
  const handleDateClear = (e) => {
    setFilters((old) => ({
      ...old,
      start_date: moment().subtract(1, "d").format("YYYY-MM-DD"),
      end_date: moment().format("YYYY-MM-DD"),
    }));
  };
  const handleDateChange = (e) => {
    setFilters((old) => ({
      ...old,
      start_date: moment(e[0]).format("YYYY-MM-DD"),
      end_date: moment(e[1]).format("YYYY-MM-DD"),
    }));
  };
  // const handleFDDropdown = (branchId) => {
  //   setFilters({
  //     ...filters,
  //     branch_id: branchId,
  //   });
  // };

  return (
    <>
      <Header title={t("general_aggregator")} />
      <Filters
        className="mb-0"
        style={{ borderBottom: "none" }}
        extra={
          <Button
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
            options={branches}
            onClick={(branchId) =>
              setFilters({
                ...filters,
                branch_id: branchId,
              })
            }
            reset={clearBranch}
            value={filters.branch_id}
            label={t("branch")}
            icon={<BranchesIcon />}
          />
          <FDropdown
            options={aggregators}
            onClick={(aggregatorId) =>
              setFilters({
                ...filters,
                aggregator_id: aggregatorId,
              })
            }
            reset={() =>
              setFilters({
                ...filters,
                aggregator_id: "",
              })
            }
            value={filters.aggregator_id}
            label={t("aggregators")}
            icon={<></>}
          />
        </div>
      </Filters>
      <Card className="m-4">
        <AllAggregatorTable filters={filters} />
      </Card>
    </>
  );
}

export default AllAggregator;
