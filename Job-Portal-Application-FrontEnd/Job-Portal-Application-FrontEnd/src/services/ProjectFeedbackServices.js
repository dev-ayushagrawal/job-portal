import FeedbackConfigurations from "../configurations/FeedbackConfigurations";
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

export default class ProjectFeedbackServices {
  GetFeedbacks(data) {
    return axiosServices.post(
      FeedbackConfigurations.GetFeedbacks,
      data,
      true,
      header
    );
  }

  AddFeedback(data) {
    return axiosServices.post(
      FeedbackConfigurations.AddFeedback,
      data,
      true,
      header
    );
  }

  DeleteFeedback(data) {
    return axiosServices.Delete(
      FeedbackConfigurations.DeleteFeedback + data,
      true,
      header
    );
  }
}
