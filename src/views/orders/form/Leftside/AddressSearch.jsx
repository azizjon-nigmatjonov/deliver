import AddressDropdown from "components/Filters/AddressDropdown";
import { Input } from "alisa-ui";
import OutsideClickHandler from "react-outside-click-handler";
import { useEffect, useRef, useState } from "react";
import useDebounce from "hooks/useDebounce";
import genSelectOption from "helpers/genSelectOption";
import { getCustomerAddresses } from "services";
import { useQueries } from "@tanstack/react-query";
import apikeyService from "services/v2/api_keys_ids";
import { getAddressListYandex, getGeoCodeAddressList } from "services/yandex";

export default function AddressSearch({
  formik,
  mapGeometry,
  setMapGeometry,
  handleUserLogs,
  debouncedPhoneNumber,
  setPlacemarkGeometry,
  ...props
}) {
  const [highlighted, setHighlightOption] = useState(-1);
  const [isFocus, setFocus] = useState(false);
  const [placeIndex, setPlaceIndex] = useState(0);
  const [geocoderIndex, setGeocoderIndex] = useState(0);

  const showSuggestion = () => setFocus(true);
  const hideSuggestion = () => setFocus(false);
  const { handleChange, values } = formik;

  const [searchAddressQ, setSearchAddressQ] = useState("");
  const [addressResults, setAddressResults] = useState(null);

  const debouncedSearch = useDebounce(searchAddressQ, 600);
  const searchResultRef = useRef(null);

  const [placeKeys, geocoderKeys] = useQueries({
    queries: [
      {
        queryKey: ["GET_YANDEX_PLACES_LIST"],
        queryFn: () =>
          apikeyService.getList({ page: 1, limit: 10, type: "place" }),
      },
      {
        queryKey: ["GET_YANDEX_GEOCODER_LIST"],
        queryFn: () =>
          apikeyService.getList({ page: 1, limit: 10, type: "geocoder" }),
      },
    ],
  });

  useQueries({
    queries: [
      {
        queryKey: ["addressList", debouncedSearch],
        queryFn: () =>
          fetchAddressList(
            debouncedSearch,
            String([mapGeometry[1], mapGeometry[0]]),
            placeKeys?.data?.ids?.length > 0
              ? placeKeys?.data?.ids[placeIndex]
              : "",
            onError,
          ),
        select: (res) => {
          return res?.data?.features?.map((item) => ({
            label: item?.properties?.name,
            description: item?.properties?.description,
            location: {
              pos: `${item?.geometry?.coordinates[0]} ${item?.geometry?.coordinates[1]}`,
            },
          }));
        },
        retry: 1,
        enabled: Boolean(debouncedSearch),
        onSuccess: (data) => {
          if (data) {
            setAddressResults((prev) => ({
              ...prev,
              organizations: data,
            }));
          }
        },
      },
      {
        queryKey: ["geocoder", debouncedSearch],
        queryFn: () =>
          fetchGeocode(
            debouncedSearch,
            String([mapGeometry[1], mapGeometry[0]]),
            geocoderKeys?.data?.ids?.length > 0
              ? geocoderKeys?.data?.ids[geocoderIndex]
              : "",
          ),
        select: (res) => {
          return res?.data?.response?.GeoObjectCollection?.featureMember?.map(
            (item) => ({
              label: item?.GeoObject?.name,
              description: item?.GeoObject?.description,
              location: item?.GeoObject?.Point,
            }),
          );
        },
        retry: 1,
        enabled: Boolean(debouncedSearch),
        onSuccess: (data) => {
          if (data) {
            setAddressResults((prev) => ({
              ...prev,
              addresses: data,
            }));
          }
        },
      },
    ],
  });

  const onError = (err, apikey, type) => {
    if (err.response.data.message === "Invalid key") {
      apikeyService.update(apikey);
      if (type === "Place") setPlaceIndex((prev) => ++prev);
      else setGeocoderIndex((prev) => ++prev);
    }
  };

  const keyboardNavigation = (e) => {
    // if (e?.key === "ArrowDown") {
    //   isFocus
    //     ? setHighlightOption((c) =>
    //         c < customerAddresses[0]?.options.length - 1 ? c + 1 : c,
    //       )
    //     : showSuggestion();
    // }
    if (e?.key === "ArrowUp") {
      setHighlightOption((c) => (c > 0 ? c - 1 : 0));
    }
    if (e?.key === "Escape") {
      hideSuggestion();
    }
    // if (e?.key === "Enter" && highlighted >= 0) {
    //   const locationPos =
    //     customerAddresses[0]?.options[highlighted]?.location.pos;
    //   setFieldValue(
    //     "to_address",
    //     customerAddresses[0]?.options[highlighted]?.label,
    //   );
    //   handleUserLogs({
    //     name: "Адрес доставки",
    //   });
    //   let geomentry = locationPos.length
    //     ? [Number(locationPos.split(" ")[1]), Number(locationPos.split(" ")[0])]
    //     : customerAddresses.length && [
    //         customerAddresses[0]?.options[highlighted]?.location.lat,
    //         customerAddresses[0]?.options[highlighted]?.location.long,
    //       ];

    //   setPlacemarkGeometry(geomentry);
    //   setMapGeometry(geomentry);

    //   setSearchAddressQ("");
    //   setFocus(false);
    // }
  };

  const scrollIntoWiew = (position) => {
    searchResultRef?.current?.parentNode.scrollTo({
      top: position,
      behavior: "smooth",
    });
  };

  // useEffect(() => {
  //   if (
  //     highlighted < 0 ||
  //     highlighted > customerAddresses[0]?.options.length ||
  //     !searchResultRef
  //   ) {
  //     return () => {};
  //   }
  //   if (searchResultRef?.current?.children.length) {
  //     let listItems = Array.from(searchResultRef?.current?.children || []);
  //     listItems[highlighted] &&
  //       scrollIntoWiew(listItems[highlighted].offsetTop);
  //   }
  // }, [highlighted, customerAddresses]);

  useEffect(() => {
    if (values.client_id) {
      if (debouncedPhoneNumber?.length === 13) {
        getCustomerAddresses(debouncedPhoneNumber).then((res) => {
          var addresses = res?.addresses?.map((address) =>
            genSelectOption(
              address.address,
              {
                long: address.location.long,
                lat: address.location.lat,
              },
              {
                apartment: address.apartment,
                building: address.building,
                floor: address.floor,
                accommodation: address.accommodation,
              },
            ),
          );
          setAddressResults((prev) => ({
            ...prev,
            previous: addresses,
          }));
        });
      }
    } else {
      // setAddressResults((prev) => ({
      //   previous: [],
      //   ...prev,
      // }));
    }
  }, [debouncedPhoneNumber, values.client_id]);

  return (
    <OutsideClickHandler onOutsideClick={() => setFocus(false)}>
      <Input
        onChange={(e) => {
          setSearchAddressQ(e.target.value);
          handleChange(e);
          scrollIntoWiew(0);
          setHighlightOption(0);
        }}
        onFocus={showSuggestion}
        onKeyDown={(e) => keyboardNavigation(e)}
        autoComplete="off"
        {...props}
      />
      {addressResults && isFocus && (
        <AddressDropdown
          formik={formik}
          setFocus={setFocus}
          results={addressResults}
          highlighted={highlighted}
          handleUserLogs={handleUserLogs}
          setMapGeometry={setMapGeometry}
          searchResultRef={searchResultRef}
          setSearchAddress={setSearchAddressQ}
          keyboardNavigation={keyboardNavigation}
          setPlacemarkGeometry={setPlacemarkGeometry}
        />
      )}
    </OutsideClickHandler>
  );
}

const fetchAddressList = async (text, region, apikey, onError) => {
  if (apikey) {
    const response = await getAddressListYandex({ text }, region, apikey).catch(
      (err) => onError(err, apikey, "Place"),
    );

    return response;
  }
  return null;
};

const fetchGeocode = async (text, region, apikey, onError) => {
  if (apikey) {
    const response = await getGeoCodeAddressList(text, region, apikey).catch(
      (err) => onError(err, apikey, "Geocoder"),
    );

    return response;
  }
  return null;
};
