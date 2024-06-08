import TableLoader from "components/TableLoader";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const LineChartStats = ({ data, type, date, loader }) => {
  const CustomTooltip = ({ active, payload, id }) => {
    const total = payload
      ? payload[0]?.payload?.deliveryOrders +
        payload[0]?.payload?.selfPickupOrders +
        payload[0]?.payload?.aggregatorOrders
      : 0;
    return (
      <>
        <div
          style={{
            background: "white",
            border: "none",
            boxShadow: "1px 2px 4px grey",
            padding: "10px 15px",
          }}
        >
          <div className="font-semibold">
            {type === "year"
              ? `${payload && payload[0]?.payload?.month} ${date}`
              : `${payload && payload[0]?.payload?.day} ${date}`}
          </div>
          <div>
            <div style={{ color: "#0e73f6" }}> Итого: {total} </div>
            <div style={{ color: "#84CA85" }}>
              Доставки: {payload && payload[0]?.payload?.deliveryOrders}
            </div>
            <div style={{ color: "#FFD802" }}>
              Самовывоз: {payload && payload[0]?.payload?.selfPickupOrders}
            </div>
            <div style={{ color: "#7048E8", marginBottom: 5 }}>
              Агрегатор: {payload && payload[0]?.payload?.aggregatorOrders}
            </div>
            <hr />
            <div style={{ color: "#FFA252", marginTop: 5 }}>
              Опоздавших: {payload && payload[0]?.payload?.lateOrders}
            </div>
            <div style={{ color: "#F03E3E" }}>
              Отмененных: {payload && payload[0]?.payload?.canceledOrders}
            </div>
          </div>
        </div>
      </>
    );
  };

  const checkLength = data?.some(
    (item) =>
      item?.lateOrders > 1000000 ||
      item?.canceledOrders > 1000000 ||
      item?.deliveryOrders > 1000000 ||
      item?.selfPickupOrders > 1000000 ||
      item?.aggregatorOrders > 1000000,
  );

  return (
    <div className="mt-4">
      <ResponsiveContainer width={"100%"} height={400}>
        {loader ? (
          <TableLoader isVisible={loader} />
        ) : (
          <LineChart
            // width={'100%'}
            // height={250}
            data={data}
            margin={{
              top: 5,
              right: 20,
              left: checkLength ? 50 : 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={type === "year" ? "month" : "day"} />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="canceledOrders"
              stroke="#F03E3E"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="selfPickupOrders"
              stroke="#FFD802"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="lateOrders"
              stroke="#FFA252"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="aggregatorOrders"
              stroke="#7048E8"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="deliveryOrders"
              stroke="#84CA85"
              strokeWidth={2}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartStats;
