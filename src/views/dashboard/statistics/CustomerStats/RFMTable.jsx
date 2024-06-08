import { RFMDollarSign, RFMPersonIcon } from "constants/icons";
import CountUp from "react-countup";
import { formatPrice } from "utils/formatPrice";

const RFMTable = ({ data, x, y }) => {
  return (
    <>
      <div className="grid grid-cols-4">
        <div className="col-span-1 text-center flex gap-4 flex-col">
          {y?.map((item) => (
            <div
              style={{
                height: "166px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              key={item}
            >
              {item}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 col-span-3 gap-4">
          {data?.map((item) => (
            <div
              className="col-span-1 rounded-md"
              style={{ border: "1px solid #EBEDEE", height: "166px" }}
              key={item.key}
            >
              <div
                className="flex items-center justify-center text-2xl font-bold"
                style={{
                  color: "#0E73F6",
                  height: "81%",
                }}
              >
                <CountUp
                  end={item?.percent}
                  duration={1}
                  decimals={
                    item?.percent
                      ?.toString()
                      .substr(item?.percent?.toString().indexOf(".")).length - 1
                  }
                />
                %
              </div>
              <div
                className="flex justify-between"
                style={{
                  borderTop: "1px solid #EBEDEE",
                  padding: "6px 12px",
                }}
              >
                <div
                  className="flex items-center gap-1 font-bold text-sm"
                  style={{ color: "#6E8BB7" }}
                >
                  <RFMPersonIcon /> {item.client_count}
                </div>
                <div
                  className="flex items-center gap-1 font-bold text-sm"
                  style={{ color: "#6E8BB7" }}
                >
                  <RFMDollarSign /> {formatPrice(item?.client_total_sum)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {x?.map((item) => (
          <div
            className="col-span-1 text-center"
            style={{
              height: "166px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            key={item}
          >
            {item}
          </div>
        ))}
      </div>
    </>
  );
};

export default RFMTable;
