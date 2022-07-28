import AdminConfigurations from "../configurations/AdminConfigurations";
import AxiosServices from "./AxiosServices";

const axiosServices = new AxiosServices();

// const headers = {
//   "content-type": "application/json",
//   "cache-control": "no-cache",
//   Authorization: `Bearer ${localStorage.getItem("token")}`,
// };

const Token = localStorage.getItem("token");
const header = {
  headers: {
    "content-type": "application/json",
    "cache-control": "no-cache",
    Authorization: "Bearer " + Token,
  },
};

export default class ProjectAdminServices {
  GetFields(data) {
    return axiosServices.Get(
      AdminConfigurations.GetFields + data,
      true,
      header
    );
  }

  GetStreams() {
    return axiosServices.Get(AdminConfigurations.GetStreams, true, header);
  }

  AddJob(data) {
    return axiosServices.post(AdminConfigurations.AddJob, data, true, header);
  }

  UpdateJob(data) {
    return axiosServices.post(
      AdminConfigurations.UpdateJob,
      data,
      true,
      header
    );
  }

  DeleteJob(data) {
    return axiosServices.Delete(
      AdminConfigurations.DeleteJob + data,
      true,
      header
    );
  }

  GetJob(data) {
    return axiosServices.post(AdminConfigurations.GetJob, data, true, header);
  }

  GetTrashJob(data) {
    return axiosServices.post(
      AdminConfigurations.GetTrashJob,
      data,
      true,
      header
    );
  }

  GetApplications(data) {
    return axiosServices.post(
      AdminConfigurations.GetApplications,
      data,
      true,
      header
    );
  }

  RejectApplication(data) {
    return axiosServices.Delete(
      AdminConfigurations.RejectApplication + data,
      true,
      header
    );
  }
}
