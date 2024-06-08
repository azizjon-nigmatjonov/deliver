import { PlacemarkIcon } from "constants/icons";
import Card from "components/Card";

export default function MapDropDown({
  options = [],
  setFieldValue,
  setGeocodeList,
  setPlacemarkGeometry,
}) {
  return (
    <Card
      style={{
        backgroundColor: "#fff",
        position: "absolute",
        zIndex: 99,
        filter: "drop-shadow(0px 16px 40px rgba(0, 0, 0, 0.1))",
      }}
      headerStyle={{ padding: "10px 12px" }}
      bodyStyle={{
        padding: 0,
        overflowY: "auto",
        maxHeight: 336 - 56 * 2,
      }}
    >
      {options?.map((elm, index) => (
        <div
          className={`px-4 py-3 text-sm flex items-center cursor-pointer hover:bg-gray-50 ${
            index + 1 === options.length ? "" : "border-b"
          }`}
          onClick={() => {
            const locationPos = elm.location.pos;
            setGeocodeList("");
            setFieldValue("address", elm.label);
            setFieldValue("location.lat", locationPos.split(" ")[1]);
            setFieldValue("location.long", locationPos.split(" ")[0]);
            setPlacemarkGeometry([
              locationPos.split(" ")[1],
              locationPos.split(" ")[0],
            ]);
          }}
          key={elm.value}
        >
          <div className="mr-2 pt-0.5">
            <PlacemarkIcon />
          </div>
          <div>
            <div className="text-sm mb-1 font-medium font-bold">
              {elm.label}
            </div>
            <span className="text-xs">{elm?.description}</span>
          </div>
        </div>
      ))}
    </Card>
  );
}
