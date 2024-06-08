import { useQuery } from "@tanstack/react-query";
import {
  getBrands,
  getMeasurements,
  getTags,
} from "services/v2";

const fetchTags = () => {
  return getTags({ page: 1, limit: 30 });
};

const fetchMeasurements = () => {
  return getMeasurements({ page: 1, limit: 30 });
};

const fetchBrands = () => {
  return getBrands({ page: 1, limit: 30 });
};

const useGoodsPageData = ({
  brandsProps,
  measurementsProps,
  properitesProps,
  tagsProps,
}) => {
  const tags = useQuery(
    ["GET_TAGS_LIST", tagsProps], () => fetchTags(), tagsProps);
  const measurements = useQuery(
    ["GET_MEASUREMENTS_LIST", measurementsProps],
    () => fetchMeasurements(),
    measurementsProps,
  );
  const brands = useQuery(
    ["GET_BRANDS_LIST", brandsProps], () => fetchBrands(), brandsProps);

  return {
    tags: tags,
    mesasurements: measurements,
    brands: brands,
  };
};

export default useGoodsPageData;
