import Header from "components/Header";
import TopCouriers from "./TopCouriers";
import TopOperatos from "./TopOperators";
import { useTranslation } from "react-i18next";
import StatisticsByBranch from "../BranchStats";

const TopStatistics = () => {
  const { t } = useTranslation();
  return (
    <div>
      <Header title={t("employees")} />
      <div className="grid gap-4 p-4">
        <TopOperatos />
        <TopCouriers />
        <StatisticsByBranch />
      </div>
    </div>
  );
};

export default TopStatistics;
