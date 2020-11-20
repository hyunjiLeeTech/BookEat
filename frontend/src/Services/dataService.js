import authHeader from "./authHeader";
import serverAddress from "./ServerUrl";
import Axios from "axios";
import {data} from "jquery";

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export default {
  notAttendReservation(reservationId) {
    return Axios.post(
      serverAddress + "/restaurant/notAttend",
      {reservationId: reservationId},
      {headers: authHeader()},
    )
      .then((res) => {
        if (res.data.errcode !== 0) throw res.data;
        return res.data;
      })
      .catch((err) => {
        throw err;
      });
  },
  validateTimeStamp(info) {
    return Axios.post(serverAddress + "/validateResetPasswrodTimestamp", info)
      .then((res) => {
        if (res.data.errcode !== 0) throw res.data;
        return res.data;
      })
      .catch((err) => {
        throw err;
      });
  },
  externalSignUp(info) {
    return Axios.post(serverAddress + "/signupExternal", info)
      .then((res) => {
        if (res.data.errcode !== 0) throw res.data;

        return res.data;
      })
      .catch((err) => {
        throw err;
      });
  },
  getDaily() {
    return Axios.get(serverAddress + "/daily")
      .then((res) => {
        if (res.data.errcode !== 0) throw res.data;

        return res.data;
      })
      .catch((err) => {
        throw err;
      });
  },
  getFeatured() {
    return Axios.get(serverAddress + "/featured")
      .then((res) => {
        if (res.data.errcode !== 0) throw res.data;

        return res.data;
      })
      .catch((err) => {
        throw err;
      });
  },
  getFavorite() {
    return Axios.get(serverAddress + "/favorite")
      .then((res) => {
        if (res.data.errcode !== 0) throw res.data;

        return res.data;
      })
      .catch((err) => {
        throw err;
      });
  },
  getRestaurantWithoutAuth(restaurantId) {
    return Axios.get(serverAddress + "/restaurants/" + restaurantId)
      .then((res) => {
        if (res.data.errcode !== 0) throw res.data;

        return res.data;
      })
      .catch((err) => {
        throw err;
      });
  },
  updateReservation(info) {
    return Axios.post(serverAddress + "/customers/updatereservation", info, {
      headers: authHeader(),
    })
      .then((res) => {
        if (res.data.errcode !== 0) throw res.data;
        return res.data;
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          window.location.href =
            "/error?Hint=Permission Denied(updateReservation)&message=Your permision is denied, may be your account has been logged in on another device, please login again&foreceLogout=true";
          return;
        }
        throw err;
      });
  },
  getReservationById(reservationId) {
    return Axios.get(
      serverAddress + "/customers/gerreservationbyid/" + reservationId,
      {headers: authHeader()},
    )
      .then((res) => {
        if (res.data.errcode !== 0) throw res.data;
        return res.data;
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          window.location.href =
            "/error?Hint=Permission Denied(getReservationById)&message=Your permision is denied, may be your account has been logged in on another device, please login again&foreceLogout=true";
          return;
        }
        throw err;
      });
  },
  resetPasswordWithTimeStamp(info) {
    return Axios.post(serverAddress + "/resetPasswordWithTimestamp", info)
      .then((res) => {
        if (res.data.errcode !== 0) throw res.data;
        return res.data;
      })
      .catch((err) => {
        throw err;
      });
  },
  getResetPasswordEmail(info) {
    return Axios.post(serverAddress + "/requestResetPasswordEmail", info)
      .then((res) => {
        if (res.data.errcode !== 0) throw res.data;
        return res.data;
      })
      .catch((err) => {
        throw err;
      });
  },
  deleteAccountRestaurantOwner() {
    return Axios.get(serverAddress + "/restaurantOwners/deleteAccount", {
      headers: authHeader(),
    })
      .then((res) => {
        if (res.data.errcode !== 0) throw res.data;
        return res.data;
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          window.location.href =
            "/error?Hint=Permission Denied(deleteAccountCustomer)&message=Your permision is denied, may be your account has been logged in on another device, please login again&foreceLogout=true";
          return;
        }
        throw err;
      });
  },
  deleteAccountCustomer() {
    return Axios.get(serverAddress + "/customers/delete", {
      headers: authHeader(),
    })
      .then((res) => {
        if (res.data.errcode !== 0) throw res.data;
        return res.data;
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          window.location.href =
            "/error?Hint=Permission Denied(deleteAccountCustomer)&message=Your permision is denied, may be your account has been logged in on another device, please login again&foreceLogout=true";
          return;
        }
        throw err;
      });
  },
  getFoodOrder(foodOrderId) {
    return Axios.get(
      serverAddress + "/restaurant/getfoodorder/" + foodOrderId,
      {headers: authHeader()},
    )
      .then((res) => {
        if (res.data.errcode !== 0) throw res.data;
        return res.data;
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          window.location.href =
            "/error?Hint=Permission Denied(getFoodOrder)&message=Your permision is denied, may be your account has been logged in on another device, please login again&foreceLogout=true";
          return;
        }
        throw err;
      });
  },
  getCustomerReservations() {
    return Axios.get(serverAddress + "/customers/reservationsofpast60days", {
      headers: authHeader(),
    })
      .then((res) => {
        if (res.data.errcode !== 0) throw res.data;
        return res.data;
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          window.location.href =
            "/error?Hint=Permission Denied(getCustomerReservations)&message=Your permision is denied, may be your account has been logged in on another device, please login again&foreceLogout=true";
          return;
        }
        throw err;
      });
  },
  addTable(info) {
    return Axios.post(serverAddress + "/restaurant/addtable", info, {
      headers: authHeader(),
    })
      .then((res) => {
        if (res.data.errcode !== 0) {
          throw res.data;
        }
        return res.data;
      })
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.status === 401) {
          window.location.href =
            "/error?Hint=Permission Denied(addTable)&message=Your permision is denied, may be your account has been logged in on another device, please login again&foreceLogout=true";
          return;
        }
        throw err;
      });
  },
  updateTable(info) {
    return Axios.post(serverAddress + "/restaurant/updatetable", info, {
      headers: authHeader(),
    })
      .then((res) => {
        if (res.data.errcode !== 0) {
          throw res.data;
        }
        return res.data;
      })
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.status === 401) {
          window.location.href =
            "/error?Hint=Permission Denied(updateTable)&message=Your permision is denied, may be your account has been logged in on another device, please login again&foreceLogout=true";
          return;
        }
        throw err;
      });
  },
  deleteTable(tableId) {
    return Axios.post(
      serverAddress + "/restaurant/deletetable",
      {tableId: tableId},
      {headers: authHeader()},
    )
      .then((res) => {
        if (res.data.errcode !== 0) {
          throw res.data;
        }
        return res.data;
      })
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.status === 401) {
          window.location.href =
            "/error?Hint=Permission Denied(deleteTable)&message=Your permision is denied, may be your account has been logged in on another device, please login again&foreceLogout=true";
          return;
        }
        throw err;
      });
  },
  confirmEmail(accountId) {
    return Axios.get(serverAddress + "/verifyEmail/" + accountId)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        throw err;
      });
  },
  getMenusCustomer(id) {
    return Axios.get(serverAddress + "/menus/restaurants/" + id, {
      headers: authHeader(),
    })
      .then((req) => {
        if (req.data.errcode !== 0) throw req.data;
        return req.data;
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          window.location.href =
            "/error?Hint=Permission Denied(getMenusCustomer)&message=Your permision is denied, may be your account has been logged in on another device, please login again&foreceLogout=true";
          return;
        }
        throw err;
      });
  },
  getTables() {
    return Axios.get(serverAddress + "/restaurant/gettables", {
      headers: authHeader(),
    })
      .then((req) => {
        if (req.data.errcode !== 0) throw req.data;
        return req.data;
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          window.location.href =
            "/error?Hint=Permission Denied(getTables)&message=Your permision is denied, may be your account has been logged in on another device, please login again&foreceLogout=true";
          return;
        }
        throw err;
      });
  },
  getPriceRanges() {
    return Axios.get(serverAddress + "/pricerange")
      .then(function (req) {
        return req.data;
      })
      .catch((err) => {
        throw err;
      });
  },
  getCuisines() {
    return Axios.get(serverAddress + "/cuisinestyle")
      .then(function (req) {
        return req.data;
      })
      .catch((err) => {
        throw err;
      });
  },
  getCategories() {
    return Axios.get(serverAddress + "/category")
      .then(function (req) {
        return req.data;
      })
      .catch((err) => {
        throw err;
      });
  },
  search(info) {
    return Axios.post(serverAddress + "/search", info)
      .then(function (req) {
        return req.data;
      })
      .catch((err) => {
        throw err;
      });
  },
  restaurantConfirmReservation(reservationId) {
    return Axios.post(
      serverAddress + "/restaurant/confirmattendence",
      {reservationId: reservationId},
      {headers: authHeader()},
    )
      .then((res) => {
        if (res.data.errcode !== 0) {
          throw res.data;
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          window.location.href =
            "/error?Hint=Permission Denied(restaurantConfirmReservation)&message=Your permision is denied, may be your account has been logged in on another device, please login again&foreceLogout=true";
          return;
        }
        console.log(err);
        throw err;
      });
  },
  restaurantCancelReservation(reservationId) {
    return Axios.post(
      serverAddress + "/restaurant/cancelreservation",
      {reservationId: reservationId},
      {headers: authHeader()},
    )
      .then((res) => {
        if (res.data.errcode !== 0) {
          throw res.data;
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          window.location.href =
            "/error?Hint=Permission Denied(restaurantCancelReservation)&message=Your permision is denied, may be your account has been logged in on another device, please login again&foreceLogout=true";
          return;
        }
        console.log(err);
        throw err;
      });
  },
  customerCancelReservation(reservationId) {
    return Axios.post(
      serverAddress + "/customers/cancelreservation",
      {reservationId: reservationId},
      {headers: authHeader()},
    )
      .then((res) => {
        if (res.data.errcode !== 0) {
          throw res.data;
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          window.location.href =
            "/error?Hint=Permission Denied(customerCancelReservation)&message=Your permision is denied, may be your account has been logged in on another device, please login again&foreceLogout=true";
          return;
        }
        console.log(err);
        throw err;
      });
  },

  async changeAccountPassword(oldPassword, newPassword) {
    await sleep(500);
    return Axios.post(
      serverAddress + "/account/resetpassword",
      {oldPassword: oldPassword, newPassword: newPassword},
      {headers: authHeader()},
    )
      .then((res) => {
        if (res.data.errcode !== 0) {
          throw res.data;
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          window.location.href =
            "/error?Hint=Permission Denied(changeAccountPassword)&message=Your permision is denied, may be your account has been logged in on another device, please login again&foreceLogout=true";
          return;
        }
        console.log(err);
        throw err;
      });
  },
  customersReserve(info) {
    return Axios.post(serverAddress + "/restaurant/reserve", info, {
      headers: authHeader(),
    })
      .then(function (req) {
        if (req.data.errcode !== 0) throw req.data;
        return req.data;
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          window.location.href =
            "/error?Hint=Permission Denied(customersReserve)&message=Your permision is denied, may be your account has been logged in on another device, please login again&foreceLogout=true";
          return;
        }
        throw err;
      });
  },

  getTableStatus(info) {
    return Axios.post(serverAddress + "/restaurant/tableinfo", info, {
      headers: authHeader(), //set auth header
    })
      .then(function (res) {
        //
        return res.data;
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          window.location.href =
            "/error?Hint=Permission Denied(getTableStatus)&message=Your permision is denied, may be your account has been logged in on another device, please login again&foreceLogout=true";
          return;
        }
        throw err;
      });
  },
  getCustomerInformation() {
    return Axios.get(serverAddress + "/customers/getcustomerinfo", {
      headers: authHeader(), //set auth header
    })
      .then(function (res) {
        return res.data;
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  },
  getRestaurantInformation() {
    return Axios.get(serverAddress + "/restaurantOwners/getrestaurantinfo", {
      headers: authHeader(),
    })
      .then(function (res) {
        return res.data;
      })
      .catch((err) => {
        throw err;
      });
  },
  getManagerInformation() {
    return Axios.get(serverAddress + "/manager/getmanagerinfo", {
      headers: authHeader(),
    })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        throw err;
      });
  },
  getRestaurantUpcomingReservation() {
    return Axios.get(serverAddress + "/restaurant/upcomingreservations", {
      headers: authHeader(),
    })
      .then(function (res) {
        return res.data;
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          window.location.href =
            "/error?Hint=Permission Denied(getRestaurantUpcomingReservation)&message=Your permision is denied, may be your account has been logged in on another device, please login again&foreceLogout=true";
          return;
        }
        throw err;
      });
  },
  getRestaurantPastReservation() {
    return Axios.get(serverAddress + "/restaurant/reservationsofpast14days", {
      headers: authHeader(),
    })
      .then(function (res) {
        return res.data;
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          window.location.href =
            "/error?Hint=Permission Denied(getRestaurantPastReservation)&message=Your permision is denied, may be your account has been logged in on another device, please login again&foreceLogout=true";
          return;
        }
        throw err;
      });
  },
  editRestaurantProfile(state) {
    return Axios.post(serverAddress + "/restaurant/editresprofile", state, {
      headers: authHeader(),
    })
      .then((res) => {})
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.status === 401) {
          window.location.href =
            "/error?Hint=Permission Denied(editRestaurantProfile)&message=Your permision is denied, may be your account has been logged in on another device, please login again&foreceLogout=true";
          return;
        }
        throw err;
      });
  },
  editManagerProfile(state) {
    Axios.post(serverAddress + "/manager/editmanagerprofile", state, {
      headers: authHeader(),
    })
      .then((res) => {})
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.status === 401) {
          window.location.href =
            "/error?Hint=Permission Denied(editManagerProfile)&message=Your permision is denied, may be your account has been logged in on another device, please login again&foreceLogout=true";
          return;
        }
        throw err;
      });
  },
  updateCustomerInformation(state) {
    Axios.post(serverAddress + "/updatecustomerinfo", state, {
      headers: authHeader(),
    })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          window.location.href =
            "/error?Hint=Permission Denied(updateCustomerInformation)&message=Your permision is denied, may be your account has been logged in on another device, please login again&foreceLogout=true";
          return;
        }
        throw err;
      });
  },
  createManagerAccount(state) {
    return Axios.post(serverAddress + "/managersignup", state, {
      headers: authHeader(),
    })
      .then((res) => {
        if (res.data.errcode !== 0) throw res.data;
        return res.data;
      })
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.status === 401) {
          window.location.href =
            "/error?Hint=Permission Denied(createManagerAccount)&message=Your permision is denied, may be your account has been logged in on another device, please login again&foreceLogout=true";
          return;
        }
        throw err;
      });
  },
  getManagerAccounts() {
    return Axios.get(serverAddress + "/restaurantOwners/getmanagers", {
      headers: authHeader(),
    })
      .then(function (res) {
        return res.data;
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          window.location.href =
            "/error?Hint=Permission Denied(getManagerAccounts)&message=Your permision is denied, may be your account has been logged in on another device, please login again&foreceLogout=true";
          return;
        }
        throw err;
      });
  },
  deleteManagerAccount(managerId) {
    return Axios.post(
      serverAddress + "/restaurantOwners/deletemanager",
      managerId,
      {
        headers: authHeader(),
      },
    )
      .then((res) => {})
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.status === 401) {
          window.location.href =
            "/error?Hint=Permission Denied(deleteManagerAccount)&message=Your permision is denied, may be your account has been logged in on another device, please login again&foreceLogout=true";
          return;
        }
        throw err;
      });
  },
  editCustomerProfile(state) {
    return Axios.post(serverAddress + "/customers/editcustomerprofile", state, {
      headers: authHeader(),
    })
      .then((res) => {})
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.status === 401) {
          window.location.href =
            "/error?Hint=Permission Denied(editCustomerProfile)&message=Your permision is denied, may be your account has been logged in on another device, please login again&foreceLogout=true";
          return;
        }
        throw err;
      });
  },
  addMenu(state) {
    return Axios.post(serverAddress + "/menu/addmenu", state, {
      headers: authHeader(),
    })
      .then((res) => {
        if (res.data.errcode !== 0) throw res.data;
        return res.data;
      })
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.status === 401) {
          window.location.href =
            "/error?Hint=Permission Denied(addMenu)&message=Your permision is denied, may be your account has been logged in on another device, please login again&foreceLogout=true";
          return;
        }
        throw err;
      });
  },
  async getMenus() {
    return await Axios.get(serverAddress + "/menu/getmenus", {
      headers: authHeader(),
    })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.status === 401) {
          window.location.href =
            "/error?Hint=Permission Denied(getMenus)&message=Your permision is denied, may be your account has been logged in on another device, please login again&foreceLogout=true";
          return;
        }
        throw err;
      });
  },
  editMenu(state) {
    return Axios.post(serverAddress + "/menu/editmenu", state, {
      headers: authHeader(),
    })
      .then((res) => {
        if (res.data.errcode === 1) throw data;
        return res.data;
      })
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.status === 401) {
          window.location.href =
            "/error?Hint=Permission Denied(editMenu)&message=Your permision is denied, may be your account has been logged in on another device, please login again&foreceLogout=true";
          return;
        }
        throw err;
      });
  },
  deleteMenu(state) {
    return Axios.post(serverAddress + "/menu/deletemenu", state, {
      headers: authHeader(),
    })
      .then((res) => {})
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.status === 401) {
          window.location.href =
            "/error?Hint=Permission Denied(deleteMenu)&message=Your permision is denied, may be your account has been logged in on another device, please login again&foreceLogout=true";
          return;
        }
        throw err;
      });
  },
  addDiscount(state) {
    return Axios.post(serverAddress + "/discount/adddiscount", state, {
      headers: authHeader(),
    })
      .then((res) => {
        if (res.data.errcode !== 0) throw res.data;
        return res.data;
      })
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.status === 401) {
          window.location.href =
            "/error?Hint=Permission Denied(addDiscount)&message=Your permision is denied, may be your account has been logged in on another device, please login again&foreceLogout=true";
          return;
        }
        throw err;
      });
  },
  getDiscounts() {
    return Axios.get(serverAddress + "/discount/getdiscounts", {
      headers: authHeader(),
    })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          window.location.href =
            "/error?Hint=Permission Denied(getDiscounts)&message=Your permision is denied, may be your account has been logged in on another device, please login again&foreceLogout=true";
          return;
        }
        throw err;
      });
  },
  editDiscount(state) {
    return Axios.post(serverAddress + "/discount/editdiscount", state, {
      headers: authHeader(),
    })
      .then((res) => {
        if (res.data.errcode !== 0) throw res.data;
        return res.data;
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          window.location.href =
            "/error?Hint=Permission Denied(editDiscount)&message=Your permision is denied, may be your account has been logged in on another device, please login again&foreceLogout=true";
          return;
        }
        throw err;
      });
  },
  deleteDiscount(state) {
    return Axios.post(serverAddress + "/discount/deletediscount", state, {
      headers: authHeader(),
    })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          window.location.href =
            "/error?Hint=Permission Denied(deleteDiscount)&message=Your permision is denied, may be your account has been logged in on another device, please login again&foreceLogout=true";
          return;
        }
        throw err;
      });
  },
  async addMenuImage(formData, config) {
    console.log("add menu image start");
    return await Axios.post(serverAddress + "/addMenuImage", formData, config)
      .then((res) => {
        if (res.data.errcode !== 0) throw res.data;
        return res.data.menuImage;
      })
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.status === 401) {
          window.location.href =
            "/error?Hint=Permission Denied(addMenuImage)&message=Your permision is denied, may be your account has been logged in on another device, please login again&foreceLogout=true";
          return;
        }
        throw err;
      });
  },
  async editMenuImage(formData, config) {
    console.log("edit menu image start");
    return await Axios.post(serverAddress + "/editMenuImage", formData, config)
      .then((res) => {
        return res.data.menuImage;
      })
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.status === 401) {
          window.location.href =
            "/error?Hint=Permission Denied(editMenuImage)&message=Your permision is denied, may be your account has been logged in on another device, please login again&foreceLogout=true";
          return;
        }
        throw err;
      });
  },
  async deleteImage(state) {
    console.log("delete image start");
    return await Axios.delete(`${serverAddress}/deleteImage/${state}`)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.status === 401) {
          window.location.href =
            "/error?Hint=Permission Denied(deleteImage)&message=Your permision is denied, may be your account has been logged in on another device, please login again&foreceLogout=true";
          return;
        }
        throw err;
      });
  },
  async getImage(state) {
    return await Axios.get(`${serverAddress}/getimage/${state.imageId}`)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.log(err);

        throw err;
      });
  },
  addReview(state) {
    return Axios.post(serverAddress + "/review/addreview", state, {
      headers: authHeader(),
    })
      .then((res) => {
        if (res.data.errcode !== 0) throw res.data;
        return res.data;
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          window.location.href =
            "/error?Hint=Permission Denied(addReview)&message=Your permision is denied, may be your account has been logged in on another device, please login again&foreceLogout=true";
          return;
        }
        throw err;
      });
  },
  getReviewsCustomerSide() {
    return Axios.get(serverAddress + "/review/getreviewscustomerside", {
      headers: authHeader(),
    })
      .then((res) => {
        return res.data.reviews;
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          window.location.href =
            "/error?Hint=Permission Denied(getReviewsCustomerSide)&message=Your permision is denied, may be your account has been logged in on another device, please login again&foreceLogout=true";
          return;
        }
        throw err;
      });
  },
  getReviewsRestaurantSide(resId) {
    return Axios.get(serverAddress + "/review/getreviewsrestaurantside", {
      headers: authHeader(),
      params: resId,
    })
      .then((res) => {
        return res.data.reviews;
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          window.location.href =
            "/error?Hint=Permission Denied(getReviewsRestaurantSide)&message=Your permision is denied, may be your account has been logged in on another device, please login again&foreceLogout=true";
          return;
        }
        throw err;
      });
  },
  getReviewsResManProfile() {
    return Axios.get(serverAddress + "/review/getreviewsresownermanager", {
      headers: authHeader(),
    })
      .then((res) => {
        return res.data.reviews;
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          window.location.href =
            "/error?Hint=Permission Denied(getReviewsResManProfile)&message=Your permision is denied, may be your account has been logged in on another device, please login again&foreceLogout=true";
          return;
        }
        throw err;
      });
  },
  async addPictures(formData, config) {
    console.log("add pictures start");
    return await Axios.post(serverAddress + "/addPictures", formData, config)
      .then((res) => {
        console.log("add pictures done");
        return res.data.pictures;
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          window.location.href =
            "/error?Hint=Permission Denied(addResPictures)&message=Your permision is denied, may be your account has been logged in on another device, please login again&foreceLogout=true";
          return;
        }
        throw err;
      });
  },
  editReview(state) {
    return Axios.post(serverAddress + "/review/editreview", state, {
      headers: authHeader(),
    })
      .then((res) => {})
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          window.location.href =
            "/error?Hint=Permission Denied(editReview)&message=Your permision is denied, may be your account has been logged in on another device, please login again&foreceLogout=true";
          return;
        }
        throw err;
      });
  },
  deleteReview(state) {
    return Axios.post(serverAddress + "/review/deletereview", state, {
      headers: authHeader(),
    })
      .then((res) => {})
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          window.location.href =
            "/error?Hint=Permission Denied(deleteReview)&message=Your permision is denied, may be your account has been logged in on another device, please login again&foreceLogout=true";
          return;
        }
        throw err;
      });
  },
  updateResPictures(state) {
    return Axios.post(serverAddress + "/restaurant/updaterespictures", state, {
      headers: authHeader(),
    })
      .then((res) => {
        return res.data.pictures;
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          window.location.href =
            "/error?Hint=Permission Denied(updateResPictures)&message=Your permision is denied, may be your account has been logged in on another device, please login again&foreceLogout=true";
          return;
        }
        throw err;
      });
  },
  deleteImages(state) {
    return Axios.delete(serverAddress + "/deleteimages", {
      params: {pictures: state},
    }).then((res) => {});
  },
  getReviewsWithoutSignup(id) {
    return Axios.get(serverAddress + "/getReviewsWithoutSignUp", {
      params: {resId: id},
    }).then((res) => {
      return res.data.reviews;
    });
  },
};
