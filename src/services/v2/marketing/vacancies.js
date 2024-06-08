import { useQuery } from "@tanstack/react-query";
import { queryConstants } from "constants/queryConstants";
import request from "utils/axios_v2";

const vacancyService = {
  getList: (params) => request.get("/vacancy", { params }),
  getById: (id) => request.get(`/vacancy/${id}`),
  create: (data) => request.post("/vacancy", data),
  update: (id, data) => request.put(`/vacancy/${id}`, data),
  delete: (id) => request.delete(`/vacancy/${id}`),
};

export const vacancyCandidateService = {
  getList: (params) => request.get("/vacancy-candidate", { params }),
  getById: (id) => request.get(`/vacancy-candidate/${id}`),
  create: (data) => request.post("/vacancy-candidate", data),
  update: (id, data) => request.put(`/vacancy-candidate/${id}`, data),
  delete: (id) => request.delete(`/vacancy-candidate/${id}`),
};

export const useVacancyList = ({ params, props = { enabled: false } }) => {
  return useQuery(
    [queryConstants.GET_VACANCY_LIST, params],
    () => vacancyService.getList(params),
    props,
  );
};

export const useVacancyById = ({ id, props = { enabled: false } }) => {
  return useQuery(
    [queryConstants.GET_VACANCY_BY_ID],
    () => vacancyService.getById(id),
    props,
  );
};

export const useVacancyCandidateList = ({
  params,
  props = { enabled: false },
}) => {
  return useQuery(
    [queryConstants.GET_VACANCY_CANDIDATE_LIST, props, params],
    () => vacancyCandidateService.getList(params),
    props,
  );
};

export default vacancyService;
