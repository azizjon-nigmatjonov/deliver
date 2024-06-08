import { useParams } from "react-router-dom/cjs/react-router-dom";
import { PlacemarkIcon } from "../../constants/icons";
import Card from "../Card";
import style from "./style.module.scss";
import { useTranslation } from "react-i18next";

export default function AddressDropdown({
  formik,
  results = [],
  setFocus,
  setMapGeometry,
  setPlacemarkGeometry,
  setSearchAddress,
  searchResultRef,
  highlighted,
  keyboardNavigation,
  handleUserLogs,
}) {
  const { id } = useParams();
  const { t } = useTranslation();

  const { setFieldValue } = formik;

  const handleClientAddresses = (item) => {
    if (!id && item?.details) {
      setFieldValue("accommodation", item.details.accommodation ?? "");
      setFieldValue("building", item.details.building ?? "");
      setFieldValue("floor", item.details.floor ?? "");
      setFieldValue("apartment", item.details.apartment ?? "");
    } else if (!item?.details) {
      setFieldValue("accommodation", "");
      setFieldValue("building", "");
      setFieldValue("floor", "");
      setFieldValue("apartment", "");
    }
  };

  const onOptionClick = (item) => {
    const locationPos = item.location.pos;
    setFieldValue("to_address", item.label);
    handleUserLogs({
      name: "Адрес доставки",
    });
    handleClientAddresses(item);
    let geomentry = item.location.pos
      ? [Number(locationPos.split(" ")[1]), Number(locationPos.split(" ")[0])]
      : [item.location.lat, item.location.long];

    setPlacemarkGeometry(geomentry);
    setMapGeometry(geomentry);
    setSearchAddress("");
    setFocus(false);
  };

  return (
    <Card
      style={{
        backgroundColor: "#fff",
        position: "absolute",
        zIndex: 20,
        filter: "drop-shadow(0px 16px 40px rgba(0, 0, 0, 0.1))",
      }}
      headerStyle={{ padding: "10px 12px" }}
      bodyStyle={{
        padding: 0,
        overflowY: "auto",
        maxHeight: 336 - 56 * 2,
      }}
    >
      {Object.entries(results)?.map(([type, options]) => (
        <div key={type}>
          {options?.length > 0 && (
            <p
              className="px-4 py-3 text-xs border-b font-medium"
              style={{
                textTransform: "uppercase",
                color: "gray",
              }}
            >
              {t(type)}
            </p>
          )}
          {options?.map(
            (item, idx) =>
              item?.label && (
                <div
                  className={style.search_address_option}
                  style={{
                    // backgroundColor: highlighted === index ? "#eee" : undefined,
                    borderBottom: "1px solid #ddd",
                  }}
                  onKeyDown={(e) => keyboardNavigation(e)}
                  onClick={() => onOptionClick(item)}
                  key={
                    item?.description +
                    item?.label +
                    type +
                    item?.location?.long +
                    item?.location?.lat
                  }
                >
                  <div className="mr-2 pt-0.5">
                    <PlacemarkIcon />
                  </div>
                  <div>
                    <div className="text-sm mb-1 font-medium">
                      {item?.label}
                    </div>
                    <span className="text-xs">{item?.description}</span>
                  </div>
                </div>
              ),
          )}
        </div>
      ))}
    </Card>
  );
}
