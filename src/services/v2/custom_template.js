import request from "utils/axios_v2";
import { useQuery } from "@tanstack/react-query";
import { queryConstants } from "constants/queryConstants";

const customTemplateService = {
  getList: (params) => request.get("/custom-template", { params }),
  getById: (id) => request.get(`/custom-template/${id}`),
  create: (data) => request.post("/custom-template", data),
  update: (data) => request.put(`/custom-template`, data),
  delete: (id) => request.delete(`/custom-template/${id}`),
};

export const useCustomTemplateList = ({
  params,
  props = { enabled: false },
}) => {
  return useQuery(
    [queryConstants.GET_CUSTOM_TEMPLATE_LIST, params],
    () => customTemplateService.getList(params),
    props,
  );
};

export default customTemplateService;
