import axios from "axios";
import serverAddress from "./ServerUrl";
import authHeader from "./authHeader";
import Axios from "axios";

const API_URL = serverAddress;

class AuthService {
  loginExternal(externalType, externalAccessToken, isLogin) {
    return Axios.post(API_URL + "/loginExternal", {
      externalType: externalType,
      token: externalAccessToken,
    })
      .then((res) => {
        if (res.data.errcode !== 0) throw res.data;
        if (isLogin !== false) {
          localStorage.removeItem("user");
          localStorage.setItem("user", JSON.stringify(res.data));
        }
        return res.data;
      })
      .catch((err) => {
        throw err;
      });
  }
  login(email, password) {
    return axios
      .post(API_URL + "/login", {
        email,
        password,
      })
      .then((response) => {
        if (response.data.errcode === 0) {
          localStorage.removeItem("user");
          localStorage.setItem("user", JSON.stringify(response.data));
        } else {
          console.log("login failed: ");
          console.log(response.data);
        }
        return response;
      })
      .catch((err) => console.log("AuthService Login: err: " + err));
  }
  logout() {
    return axios
      .get(API_URL + "/logout", {
        headers: authHeader(),
      })
      .then((res) => {
        if (res.errcode !== 0) {
          console.log("logout error returned from server side");
          console.log(res.data);
        }
        localStorage.removeItem("user");
        return res;
      })
      .catch((err) => {
        console.log("logout error");
        console.log(err);
        localStorage.removeItem("user");
        throw err;
        //return err;
      });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
}

export default new AuthService();
