import axios from "axios";

export const postGPTReportAPI = async (data, params) => {
  return await axios.post('https://report.api.delevr.uz/v1/gpt-report', data, { headers: { Authorization: 'token 2Jh7qRtAR8Jc' } });
};