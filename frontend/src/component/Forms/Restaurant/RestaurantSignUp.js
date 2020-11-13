import React, { Component } from "react";
import MainContainer from "../../Style/MainContainer";
import Parser from "html-react-parser";
import $ from "jquery";
import Axios from "axios";
import sha256 from "crypto-js/sha256";
import serverAddress from "../../../Services/ServerUrl";
import "../Customer/SignUp.css";
import FullscreenError from '../../Style/FullscreenError'

//Validation
const regExpEmail = RegExp(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/);

const regExpPhone = RegExp(
  /^\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})$/
);

const regExpPassword = RegExp(
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,32}$/
);

const regExpPostal = RegExp(/^(?!.*[DFIOQU])[A-VXY][0-9][A-Z] ?[0-9][A-Z][0-9]$/);

const regExpNumbers = RegExp(/^[0-9]*$/);

const formValid = ({ isError, ...rest }) => {
  let isValid = false;

  Object.values(isError).forEach((val) => {
    if (val.length > 0) {
      isValid = false;
    } else {
      isValid = true;
    }
  });

  Object.values(rest).forEach((val) => {
    if (val === null) {
      isValid = false;
    } else {
      isValid = true;
    }
  });

  return isValid;
};

class RestaurantSignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resname: "",
      streetnumber: "",
      streetname: "",
      province: "",
      city: "",
      postalcode: "",
      phonenumber: "",
      email: "",
      businessnumber: "",
      password: "",
      confirmpw: "",
      isError: {
        resname: "&#160;",
        streetnumber: "&#160;",
        streetname: "&#160;",
        province: "&#160;",
        city: "&#160;",
        postalcode: "&#160;",
        phonenumber: "&#160;",
        email: "&#160;",
        businessnumber: "&#160;",
        password: "&#160;",
        confirmpw: "&#160;",
      },
      resultsErr: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    e.preventDefault();
    const { name, value } = e.target;
    let isError = this.state.isError;
    switch (name) {
      case "resname":
        isError.resname =
          value.length >= 3 && value.length <= 50
            ? "&#160;"
            : "Atleast 3 character required";
        break;
      case "streetnumber":
        isError.streetnumber = regExpNumbers.test(value)
          ? "&#160;"
          : "Atleast 1 number required";
        break;
      case "streetname":
        isError.streetname =
          value.length >= 4 && value.length <= 255
            ? "&#160;"
            : "Atleast 4 character required";
        break;
      case "city":
        isError.city =
          value.length >= 2 && value.length <= 50
            ? "&#160;"
            : "Atleast 2 character required";
        break;
      case "province":
        isError.province =
          value.length >= 2 && value.length <= 32
            ? "&#160;"
            : "Atleast 2 character required";
        break;
      case "postalcode":
        isError.postalcode = regExpPostal.test(value)
          ? "&#160;"
          : "Invalid postal code";
        break;
      case "email":
        isError.email = regExpEmail.test(value)
          ? "&#160;"
          : "Invalid email address";
        break;
      case "phonenumber":
        isError.phonenumber = regExpPhone.test(value)
          ? "&#160;"
          : "Phone Number is invalid";
        break;
      case "businessnumber":
        isError.businessnumber = regExpNumbers.test(value)
          ? "&#160;"
          : "Invalid business number";
        break;
      case "password":
        isError.password = regExpPassword.test(value)
          ? "&#160;"
          : "Atleast 6 characters required";
        this.state.password = value;
        break;
      case "confirmpw":
        this.state.confirmpw = value;
        isError.confirmpw =
          this.state.confirmpw === this.state.password
            ? "&#160;"
            : "Password not matching";
        break;
      default:
        break;
    }
    this.setState({
      [e.target.id]: e.target.value,
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (formValid(this.state)) {
      this.state.password = sha256(this.state.password).toString(); //hashing password
      this.state.confirmpw = sha256(this.state.confirmpw).toString();
      Axios.post(serverAddress + "/restaurantownersignup", this.state)
        .then((res) => {
          console.log(res);
          if (res.data.errcode === 0) {
            $("#signResultText")
              .text("Congrats, Confirm your email address and start advertising your business")
              .removeClass("alert-warning")
              .removeClass("alert-danger")
              .removeClass("alert-success")
              .addClass("alert-success");
          } else {
            $("#signResultText")
              .text("Sorry, " + res.data.errmsg)
              .removeClass("alert-warning")
              .removeClass("alert-danger")
              .removeClass("alert-success")
              .addClass("alert-danger");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log("Form is invalid!");
    }
  };

  componentDidMount() {
    // Avoid spacing on the form
    var t1 = document.getElementById("streetnumber");
    t1.onkeypress = function (event) {
      if (event.keyCode === 32) return false;
    };
    var t2 = document.getElementById("email");
    t2.onkeypress = function (e) {
      if (e.keyCode === 32) return false;
    };
    var t3 = document.getElementById("password");
    t3.onkeypress = function (e) {
      if (e.keyCode === 32) return false;
    };
    var t4 = document.getElementById("confirmpw");
    t4.onkeypress = function (e) {
      if (e.keyCode === 32) return false;
    };
    var t5 = document.getElementById("businessnumber");
    t5.onkeypress = function (e) {
      if (e.keyCode === 32) return false;
    };
    var t6 = document.getElementById("phonenumber");
    t6.onkeypress = function (e) {
      if (e.keyCode === 32) return false;
    };
  }
  render() {
    const { isError } = this.state;
    return (
      <MainContainer>
        {this.state.resultsErr
          ?
          FullscreenError("An error occured, please try again later")
          :
          null
        }

        <div className="container">
          <div className="page-header text-center">
            <br />
            <h1>Restaurant's Sign Up</h1>
            <br />
          </div>

          <form className="text-center" onSubmit={this.handleSubmit} noValidate>
            <div className="form-group row">
              <label htmlFor="resname" className="col-sm-2 col-form-label">
                {" "}
                Restaurant Name
              </label>
              <div className="col-sm-10">
                <input
                  type="text"
                  id="resname"
                  name="resname"
                  value={this.state.resname}
                  placeholder="Restaurant Name"
                  className={
                    isError.resname.length > 6
                      ? "is-invalid form-control"
                      : "form-control"
                  }
                  onChange={this.handleChange}
                  required
                />

                <span className="invalid-feedback">
                  {Parser(isError.resname)}
                </span>
              </div>
            </div>

            <div className="form-group row">
              <label htmlFor="streetnumber" className="col-sm-2 col-form-label">
                {" "}
                Street Number
              </label>
              <div className="col-sm-2">
                <input
                  type="text"
                  id="streetnumber"
                  name="streetnumber"
                  value={this.state.streetnumber}
                  placeholder="Street Number"
                  className={
                    isError.streetnumber.length > 6
                      ? "is-invalid form-control"
                      : "form-control"
                  }
                  onChange={this.handleChange}
                  required
                />

                <span className="invalid-feedback">
                  {Parser(isError.streetnumber)}
                </span>
              </div>

              <label htmlFor="streetname" className="col-sm-2 col-form-label">
                {" "}
                Street Name
              </label>
              <div className="col-sm-6">
                <input
                  type="text"
                  id="streetname"
                  name="streetname"
                  value={this.state.streetname}
                  placeholder="Street Name"
                  className={
                    isError.streetname.length > 6
                      ? "is-invalid form-control"
                      : "form-control"
                  }
                  onChange={this.handleChange}
                  required
                />

                <span className="invalid-feedback">
                  {Parser(isError.streetname)}
                </span>
              </div>
            </div>

            <div className="form-group row">
              <label htmlFor="city" className="col-sm-2 col-form-label">
                City
              </label>
              <div className="col-sm-2">
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={this.state.city}
                  placeholder="City"
                  className={
                    isError.city.length > 6
                      ? "is-invalid form-control"
                      : "form-control"
                  }
                  onChange={this.handleChange}
                  required
                />

                <span className="invalid-feedback">{Parser(isError.city)}</span>
              </div>

              <label htmlFor="province" className="col-sm-2 col-form-label">
                {" "}
                Province{" "}
              </label>
              <div className="col-sm-2">
                <input
                  type="text"
                  id="province"
                  name="province"
                  value={this.state.province}
                  placeholder="Province"
                  className={
                    isError.province.length > 6
                      ? "is-invalid form-control"
                      : "form-control"
                  }
                  onChange={this.handleChange}
                  required
                />

                <span className="invalid-feedback">
                  {Parser(isError.province)}
                </span>
              </div>

              <label htmlFor="postalcode" className="col-sm-2 col-form-label">
                {" "}
                Postal Code
              </label>
              <div className="col-sm-2">
                <input
                  type="text"
                  id="postalcode"
                  name="postalcode"
                  value={this.state.postalcode}
                  placeholder="Postal Code"
                  className={
                    isError.postalcode.length > 6
                      ? "is-invalid form-control"
                      : "form-control"
                  }
                  onChange={this.handleChange}
                  required
                />

                <span className="invalid-feedback">
                  {Parser(isError.postalcode)}
                </span>
              </div>
            </div>

            <div className="form-group row">
              <label htmlFor="phonenumber" className="col-sm-2 col-form-label">
                Phone Number{" "}
              </label>
              <div className="col-sm-3">
                <input
                  type="text"
                  id="phonenumber"
                  name="phonenumber"
                  value={this.state.phonenumber}
                  placeholder="Phone Number"
                  className={
                    isError.phonenumber.length > 6
                      ? "is-invalid form-control"
                      : "form-control"
                  }
                  onChange={this.handleChange}
                />

                <span className="invalid-feedback">
                  {Parser(isError.phonenumber)}
                </span>
              </div>

              <label htmlFor="email" className="col-sm-2 col-form-label">
                {" "}
                Email{" "}
              </label>
              <div className="col-sm-5">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={this.state.email}
                  placeholder="Email Address"
                  className={
                    isError.email.length > 6
                      ? "is-invalid form-control"
                      : "form-control"
                  }
                  onChange={this.handleChange}
                />

                <span className="invalid-feedback">
                  {Parser(isError.email)}
                </span>
              </div>
            </div>

            <div className="form-group row">
              <label
                htmlFor="businessnumber"
                className="col-sm-2 col-form-label"
              >
                Business Number{" "}
              </label>
              <div className="col-sm-10">
                <input
                  type="text"
                  id="businessnumber"
                  name="businessnumber"
                  value={this.state.businessnumber}
                  placeholder="Business Number"
                  className={
                    isError.businessnumber.length > 6
                      ? "is-invalid form-control"
                      : "form-control"
                  }
                  onChange={this.handleChange}
                />
                <small> 9 digits Business Number</small>

                <span className="invalid-feedback">
                  {Parser(isError.businessnumber)}
                </span>
              </div>
            </div>

            <div className="form-group row">
              <label htmlFor="password" className="col-sm-2 col-form-label">
                {" "}
                Password{" "}
              </label>
              <div className="col-sm-4">
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={this.state.password}
                  placeholder="Password"
                  className={
                    isError.password.length > 6
                      ? "is-invalid form-control"
                      : "form-control"
                  }
                  onChange={this.handleChange}
                />

                <span className="invalid-feedback">
                  {Parser(isError.password)}
                </span>
              </div>

              <label htmlFor="confirmpw" className="col-sm-2 col-form-label">
                Password Confirmation{" "}
              </label>
              <div className="col-sm-4">
                <input
                  type="password"
                  id="confirmpw"
                  name="confirmpw"
                  value={this.state.confirmpw}
                  placeholder="Confirm Password"
                  className={
                    isError.confirmpw.length > 6
                      ? "is-invalid form-control"
                      : "form-control"
                  }
                  onChange={this.handleChange}
                />

                <span className="invalid-feedback">
                  {Parser(isError.confirmpw)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              data-toggle="modal"
              data-target="#signResultModal"
            >
              Sign Up
            </button>
          </form>

          <div
            className="modal fade"
            id="signResultModal"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="signResultModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="signResultModalLabel">
                    Sign up
                  </h5>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <p className="alert alert-warning" id="signResultText">
                    Please Wait...
                  </p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-primary"
                    data-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainContainer>
    );
  }
}

export default RestaurantSignUp;
