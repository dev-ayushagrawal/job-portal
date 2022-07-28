import UserConfigurations from "../configurations/UserConfigurations";
import AxiosServices from "./AxiosServices";

const axiosServices = new AxiosServices();

const Token = localStorage.getItem("token");
const header = {
  headers: {
    "content-type": "application/json",
    "cache-control": "no-cache",
    Authorization: "Bearer " + Token,
  },
};

export default class ProjectUserServices {
  InsertApplication(data) {
    return axiosServices.post(
      UserConfigurations.InsertApplication,
      data,
      true,
      header
    );
  }

  JobFilter(data) {
    return axiosServices.post(
      UserConfigurations.JobFilter,
      data,
      true,
      header
    );
  }

  GetStreamList() {
    return axiosServices.Get(UserConfigurations.GetStreamList, true, header);
  }
}
