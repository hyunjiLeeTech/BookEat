import React, {Component} from "react";
import {withRouter, Route, Switch, Redirect} from "react-router-dom";
import SignUp from "./component/Forms/Customer/SignUp";
import Home from "./component/Home/Home";

import RestaurantSignUp from "./component/Forms/Restaurant/RestaurantSignUp";
import NavBar from "./component/Style/NavBar";
import Footer from "./component/Style/Footer";
import RestaurantProfile from "./component/Profile/Restaurant/RestaurantProfile";
import Manager from "./component/Profile/Manager/Manager";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";

import Login from "./component/Forms/Customer/Login";
import ForgotPassword from "./component/Forms/Customer/ForgotPassword";
import ViewCustomerProfile from "./component/Profile/Customer/ViewCustomerProfile";
import ChangePassword from "./component/Forms/Customer/ChangePassword";
import Logout from "./component/Forms/Logout";
import Layout from "./component/RestaurantLayout/Layout";
import CustomerReservationHistory from "./component/Reservation/Customer/CustomerReservationHistory";
import CustomerReviewHistory from "./component/Review/Customer/CustomerReviewHistory";
import Menu from "./component/Menu/Menu";

import $ from "jquery";

import ds from "./Services/dataService";
import ManagerProfile from "./component/Profile/Manager/ManagerProfile";
import EmailConfirmation from "./RedirectPages/EmailConfirmation";
import NotFound from "./RedirectPages/NotFound";
import authService from "./Services/AuthService";
import RestaurantReservation from "./component/Reservation/Restaurant/RestaurantReservation";
import CustomerReserve from "./component/Reservation/Customer/customerReserve";

import Restaurant from "./component/Restaurant/restaurant";
import SearchResult from "./component/Home/SearchResult";
import Daily from "./component/Home/Daily";
import Favorite from "./component/Home/Favorite";
import Feature from "./component/Home/Feature";

import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorPage from "./RedirectPages/Error";
import ResetPassword from "./RedirectPages/ResetPassword";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isUser: true,
    };
  }
  componentWillMount() {
    var u = authService.getCurrentUser();
    if (!u) this.state.isUser = false;
    else this.state.isUser = true;
  }

  queryUserInfo = async function (userType) {
    let user = null;
    try {
      if (userType === 1) {
        user = await ds.getCustomerInformation();
      } else if (userType === 2) {
        user = await ds.getRestaurantInformation();
      } else if (userType === 3) {
        user = await ds.getManagerInformation();
      }
    } catch (err) {
      console.log(err);
      console.log("getting user info error");
      throw err;
    }
    return user;
  };

  updateUserInfo = async function () {
    let u;
    try {
      const usr = authService.getCurrentUser();
      if (usr) {
        const userType = usr.user.userTypeId;
        u = await this.queryUserInfo(userType);
        if (u) {
          if (userType === 1) {
            $("#user-status-indicator").text(u.firstName + " " + u.lastName);
          } else if (userType === 2) {
            $("#user-status-indicator").text(u.resName);
          }
        }
      }
    } catch (err) {
      console.log(err);
      console.log("getting user info error");
      if (
        err.response &&
        err.response.status === 401 &&
        this.props.location.pathname === "/"
      ) {
        await authService.logout();
        window.location.href = "/";
      }
    }
  };

  componentDidMount() {
    $("#user-status-indicator").text("Updating");
    this.updateUserInfo();
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      //console.log("Route change! from " + prevProps.location.pathname +' to ' + this.props.location.pathname);
    }
  }
  render() {
    return (
      <div style={{position: "relative", minHeight: "100vh"}}>
        <NavBar />
        <Switch>
          <Route exact path="/" render={() => <Home />} />
          <Route exact path="/SignUp" render={() => <SignUp />} />
          <Route exact path="/Login" render={() => <Login />} />
          <Route path="/logout" component={Logout} />
          <Route path="/layout" component={Layout} />
          <Route
            path="/customerreserve/:id/:date?/:time?/:numOfPeople?/:isUpdate?/:reservationId?"
            render={() => {
              return !this.state.isUser ? (
                <Redirect to="/login" />
              ) : (
                <CustomerReserve />
              );
            }}
          />
          <Route
            path="/restaurant/:id/:date?/:time?/:numOfPeople?"
            component={Restaurant}
          />

          <Route
            exact
            path="/ViewCustomerProfile"
            render={() =>
              !this.state.isUser ? (
                <Redirect to="/login" />
              ) : (
                <ViewCustomerProfile />
              )
            }
          />
          <Route
            exact
            path="/ForgotPassword"
            render={() => <ForgotPassword />}
          />
          <Route
            exact
            path="/ChangePassword"
            render={() => <ChangePassword />}
          />
          <Route
            exact
            path="/RestaurantSignUp"
            render={() => <RestaurantSignUp />}
          />
          <Route
            exact
            path="/RestaurantProfile"
            render={() =>
              !this.state.isUser ? (
                <Redirect to="/login" />
              ) : (
                <RestaurantProfile />
              )
            }
          />
          <Route
            exact
            path="/Manager"
            render={() =>
              !this.state.isUser ? <Redirect to="/login" /> : <Manager />
            }
          />
          <Route
            exact
            path="/ManagerProfile"
            render={() =>
              !this.state.isUser ? <Redirect to="/login" /> : <ManagerProfile />
            }
          />
          <Route
            exact
            path="/EmailConfirmation/:id"
            render={() => <EmailConfirmation />}
          />
          <Route
            exact
            path="/CustomerReservationHistory"
            render={() =>
              !this.state.isUser ? (
                <Redirect to="/login" />
              ) : (
                <CustomerReservationHistory />
              )
            }
          />
          <Route
            exact
            path="/CustomerReviewHistory"
            render={() =>
              !this.state.isUser ? (
                <Redirect to="/login" />
              ) : (
                <CustomerReviewHistory />
              )
            }
          />

          <Route exact path="/Menu" render={() => <Menu />} />
          <Route exact path="/error" render={() => <ErrorPage />} />

          <Route exact path="/NotFound" render={() => <NotFound />} />
          <Route
            exact
            path="/RestaurantReservation"
            render={() =>
              !this.state.isUser ? (
                <Redirect to="/login" />
              ) : (
                <RestaurantReservation />
              )
            }
          />
          <Route exact path="/SearchResult" render={() => <SearchResult />} />
          <Route exact path="/Daily" render={() => <Daily />} />
          <Route exact path="/Feature" render={() => <Feature />} />
          <Route exact path="/Favorite" render={() => <Favorite />} />
          <Route
            exact
            path="/ResetPassword/:id/:timestamp"
            render={() => <ResetPassword />}
          />
        </Switch>
        <div className="footer-padding"></div>
        <div className="footer">
          <Footer />
        </div>
        <ToastContainer />
      </div>
    );
  }
}

export default withRouter((props) => <App {...props} />);
