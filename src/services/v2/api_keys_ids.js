import request from "utils/axios_v2";
import { useQuery } from "@tanstack/react-query";
import { queryConstants } from "constants/queryConstants";

const apikeyService = {
  getList: (params) => request.get("/api-keys-ids", { params }),
  update: (id) => request.put(`/api-keys/${id}`),
};

export const useApiKeysIdList = ({ params, props = { enabled: false } }) => {
  return useQuery(
    [queryConstants.GET_API_KEYS_ID_LIST, props],
    () => apikeyService.getList(params),
    props,
  );
};

export default apikeyService;
