import { useQuery } from "@tanstack/react-query";
import { getGeoCodeAddressList } from "services/yandex";

const useGeocoderRequests = ({ searchValue, geocoderProps }) => {
  const fetchGeocoderAddressList = () => {
    return getGeoCodeAddressList(searchValue);
  };

  const geocoder = useQuery(
    ["geocoder", searchValue],
    fetchGeocoderAddressList,
    {
      ...geocoderProps,
      select: (res) => {
        return res?.data?.response?.GeoObjectCollection?.featureMember?.map(
          (item) => ({
            label: item?.GeoObject?.name,
            description: item?.GeoObject?.description,
            location: item?.GeoObject?.Point,
          }),
        );
      },
    },
  );

  return geocoder;
};

export default useGeocoderRequests;
