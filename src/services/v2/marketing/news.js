import { useQuery } from "@tanstack/react-query";
import { queryConstants } from "constants/queryConstants";
import request from "utils/axios_v2";

const newsService = {
  getList: (params) =>
    request({
      method: "get",
      url: "/news-events",
      params,
    }),
  getById: (id) =>
    request({
      method: "get",
      url: `/news-events/${id}`,
    }),
  create: (data) => request.post("/news-events", data),
  update: (id, data) => request.put(`/news-events/${id}`, data),
  delete: (id) => request.delete(`/news-events/${id}`),
};


export default newsService

export const useNewsList = ({
  params,
  props = { enabled: false },
}) => {
  return useQuery(
    [queryConstants.GET_NEWS_LIST, params],
    () => newsService.getList(params),
    props,
  );
};

export const useNewsById = ({
  id,
  props = { enabled: false },
}) => {
  return useQuery(
    [queryConstants.GET_NEWS_BY_ID],
    () => newsService.getById(id),
    props,
  );
};
