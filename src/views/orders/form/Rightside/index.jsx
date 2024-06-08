import { memo, useCallback, useState } from "react";
import Card from "components/Card";
import { useTranslation } from "react-i18next";
import MapContent from "./MapContent";
import AsyncSelect from "components/Select/Async";
import { getRegions } from "services/region";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

function RightSide({
  formik,
  branches,
  mapLoading,
  mapGeometry,
  handleUserLogs,
  setMapGeometry,
  placemarkGeometry,
  setPlacemarkGeometry,
}) {
  const { t } = useTranslation();
  const { default_region_id } = useSelector((state) => state.auth);
  const [regions, setRegions] = useState([]);
  const params = useParams();

  const handleRegion = useCallback(
    (val) => {
      setRegions(val);
      setMapGeometry([val?.location?.lat, val?.location?.long]);
    },
    [setMapGeometry],
  );

  const loadRegions = useCallback(
    (input, cb) => {
      getRegions({ limit: 12, search: input })
        .then((res) => {
          let regions = res?.regions?.map((region) => ({
            label: region.name,
            value: region.id,
            location: region.location,
          }));
          default_region_id &&
            !params.id &&
            handleRegion(regions.find((r) => r.value === default_region_id));
          cb(regions);
        })
        .catch((err) => console.log(err));
    },
    [default_region_id, handleRegion, params.id],
  );

  return (
    <Card
      className="h-full"
      title={t("map")}
      extra={
        <AsyncSelect
          loadOptions={loadRegions}
          defaultOptions
          placeholder={t("regions")}
          isSearchAble
          required
          value={regions}
          onChange={(val) => handleRegion(val)}
        />
      }
    >
      <MapContent
        formik={formik}
        branches={branches}
        mapLoading={mapLoading}
        mapGeometry={mapGeometry}
        handleUserLogs={handleUserLogs}
        placemarkGeometry={placemarkGeometry}
        setPlacemarkGeometry={setPlacemarkGeometry}
      />
    </Card>
  );
}

export default memo(RightSide);
