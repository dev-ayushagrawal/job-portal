import AxiosServices from "./AxiosServices";
import Configurations from "../configurations/Configurations";
import Auth from "../components/Auth";
import AdminDashboard from "../components/Dashboard/AdminDashboard";
import UserDashboard from "../components/Dashboard/UserDashBoard";

const axiosServices = new AxiosServices();

export default class AuthServices {
  SignUp(data) {
    return axiosServices.post(Configurations.SignUp, data, false);
  }

  SignIn(data) {
    return axiosServices.post(Configurations.SignIn, data, false);
  }

}
