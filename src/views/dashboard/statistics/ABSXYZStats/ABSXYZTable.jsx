import CountUp from "react-countup";

const ABSXYZTable = ({ data, x, y }) => {
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
            >
              <div>
                <div>{item.text}</div>
                <div style={{ fontSize: "14px" }}> {item?.description} </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 col-span-3 gap-4">
          {data?.map((item) => (
            <div
              className="col-span-1 rounded-md"
              style={{ border: "1px solid #EBEDEE", height: "166px" }}
            >
              <div className="flex items-center justify-center h-full">
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      color: "#0E73F6",
                      lineHeight: "40px",
                    }}
                    className="text-2xl font-bold"
                  >
                    <CountUp end={item?.count} duration={1} />
                  </div>
                  <div
                    style={{
                      color: "#6E8BB7",
                      fontSize: "14px",
                      lineHeight: "20px",
                      marginTop: "4px",
                    }}
                  >
                    {item?.percent}%
                  </div>
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
          >
            <div>
              <div>{item.text}</div>
              <div style={{ fontSize: "14px" }}> {item?.description} </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ABSXYZTable;
