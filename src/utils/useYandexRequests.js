import { useQuery } from "@tanstack/react-query";
import { useApiKeysIdList } from "services/v2/api_keys_ids";
import { getAddressListYandex, getGeoCodeAddressList } from "services/yandex";

const placeSearchApiKeys = [
  "a35870bb-7c46-4473-8979-3292d3605c6e",
  "759b84ef-5617-425f-83f7-7c320c1ce27b",
  "07f5747e-f2f2-4c59-afdb-206d06d5de07",
  "c9950c7e-6fed-4c1d-8487-5dc8b24df103",
  "a924001f-05fc-4978-b282-e0cc785004c7",
  "0586fcf6-959d-4bcd-a6dc-bb9f3995cfe4",
  "b66c0e00-3436-4862-8dfb-bc0dca69406d",
  "b7f9539a-7343-4070-94ac-d2bc32c48fc1",
  "96b47f6d-1005-4531-9336-93a2a798dd22",
  "4aeda2d1-130c-4f22-9a31-9bba3198264a",
  "90019ff7-9264-40fe-9cf3-00c7d41c1b92",
  "586ceb0e-2504-440d-9972-997af51914d1",
  "c91a786a-9864-4735-a18a-a5791969d23d",
  "644b9512-cf6f-46de-ba11-535c0255b373",
];

const pointSearchApiKeys = [
  "650c4be4-ce15-446e-81ef-99525c200558",
  "3e9a1241-7241-4975-b2a1-77203e9c0333",
  "679a08be-aa49-4a79-ad31-80c65dda374a",
  "c8e3f2db-2125-41f0-b64a-c6a8337718cf",
  "bdc4ef88-3fea-43f2-8f54-9d4018fe15db",
  "8bb558ee-700a-4979-b70d-62a3b6895d67",
  "7a04253b-a9d4-4b28-9695-5195e98c3f08",
  "b7811eef-adfc-44ba-a06b-915bd56f37e6",
  "44efe0ce-4eeb-4ea3-a425-d9355b61e886",
  "54859190-2d05-4882-b44e-41513d34bf99",
  "c8ca8d47-c03b-48a6-86e6-f8eaa3863e64",
  "64e73b69-f266-4cc8-bfbc-db7227346eb5",
  "98270eae-5ead-43d3-a2eb-2a0c150d660d",
  "b240cb9e-32b6-4d51-a448-605900dcadaa",
  "36338186-4ec8-4bb6-926b-6708908b299e",
  "edf2caef-d0b7-42b9-8423-0f9744448da8",
  "a511ae71-c417-4b6e-93a5-a90ef35656f0",
];

const useYandexRequests = ({
  geocoderProps,
  addressListProps,
  text = "",
  region,
}) => {
  return {};
};

export default useYandexRequests;
