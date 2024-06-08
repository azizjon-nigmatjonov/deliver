import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const RenderCustomizedLabel = (props) => {
  const { x, y, width, value, count } = props;

  return (
    <>
      {/* <text
        x={x + 10}
        y={y + 4}
        dy={15}
        fontSize="16"
        fontFamily="sans-serif"
        fill={count === 0 ? "black" : "white"}
        textAnchor="central"
      >
        {count === 0 ? "" : count}
      </text> */}
      <text
        x={width + x + 10}
        y={y + 4}
        dy={15}
        fontSize="16"
        fontFamily="sans-serif"
        fill={"black"}
        textAnchor="central"
      >
        {value === 0 ? "" : `${value}%`}
      </text>
    </>
  );
};

const CustomTooltip = ({ active, payload, id }) => {
  return (
    <>
      <div
        style={{
          background: "white",
          boxShadow: "1px 2px 4px grey",
          padding: "10px 15px",
        }}
      >
        {payload && payload[0]?.payload?.name}:{" "}
        {payload && payload[0]?.payload?.count}
      </div>
    </>
  );
};

export default function HorizontalBarChart({
  data,
  setVisible,
  latedOrderVisible,
  setReasonsVisible,
  reasonsVisible,
  type,
}) {
  const canceledReasons = data.filter((item) => item.color === "orange");
  const checkNameLength = data.every((item) => item.name.length < 17);

  return (
    <div className="content c-white mt-4">
      <ResponsiveContainer
        height={
          reasonsVisible &&
          latedOrderVisible &&
          canceledReasons?.length > 0 &&
          type !== "aggregator"
            ? 400
            : reasonsVisible && canceledReasons?.length > 0
            ? 380
            : latedOrderVisible && data.length === 2
            ? 100
            : latedOrderVisible && data.length > 2
            ? 150
            : 100
        }
        width={"100%"}
      >
        <BarChart
          layout="vertical"
          data={data}
          margin={{ left: 50, right: 70 }}
        >
          <XAxis type="number" stroke="none" />
          <YAxis
            type="category"
            axisLine={true}
            dataKey="name"
            fontSize={"14px"}
            width={checkNameLength ? 100 : 200}
          />
          <Tooltip
            cursor={{ fill: "transparent" }}
            content={<CustomTooltip />}
          />
          <Bar
            onClick={(e) => setVisible((prev) => !prev)}
            dataKey={"finishedValue"}
            fill="#84CA85"
            isAnimationActive={false}
            barSize={28}
            stackId="a"
            label={<RenderCustomizedLabel count={data[0].count} />}
          />
          {latedOrderVisible && (
            <Bar
              dataKey={"latedValue"}
              fill="#3593F9"
              barSize={28}
              stackId="a"
              label={<RenderCustomizedLabel count={data[1]?.count} />}
            />
          )}

          <Bar
            onClick={() => setReasonsVisible((prev) => !prev)}
            dataKey={"cancelledValue"}
            fill="#F03E3E"
            barSize={28}
            stackId="a"
            isAnimationActive={false}
            label={
              <RenderCustomizedLabel
                count={
                  latedOrderVisible && type !== "aggregator" && type !== "self"
                    ? data[2]?.count
                    : data[1]?.count
                }
              />
            }
          />

          {reasonsVisible &&
            canceledReasons?.map((item) => (
              <Bar
                key={item.name}
                dataKey={item.name}
                fill="orange"
                barSize={28}
                stackId="a"
                label={<RenderCustomizedLabel count={item?.count} />}
              />
            ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
