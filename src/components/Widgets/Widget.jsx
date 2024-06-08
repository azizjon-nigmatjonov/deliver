import Card from "../Card/index";
import CountUp from "react-countup";

const Widget = ({ Icon, number, title }) => {
  return (
    <Card style={{ flex: 1 }} bodyClass="h-full">
      <div
        className="h-full flex items-center justify-between gap-4 rounded-md p-6"
        style={{ border: "1px solid #EBEDEE" }}
      >
        <div className="info-block">
          <h3 className="number">
            <CountUp end={number} duration={1} separator="," />
          </h3>
          <p className="subtitle">{title ?? "---"}</p>
        </div>

        <div className="icon-block">{Icon && <Icon className="icon" />}</div>
      </div>
    </Card>
  );
};

export default Widget;
