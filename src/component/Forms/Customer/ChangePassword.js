import React, { Component } from "react";
import { Link } from "react-router-dom";
import MainContainer from "../../Style/MainContainer";
import Parser from "html-react-parser";
import $ from "jquery";

//Validation
const regExpPassword = RegExp(
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,32}$/
);

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

class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      newPassword: "",
      isError: {
        password: "&#160;",
        newPassword: "&#160;",
      },
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    let isError = { ...this.state.isError };
    switch (name) {
      case "password":
        isError.password = regExpPassword.test(value)
          ? "&#160;"
          : "At least 6 characters required";
        this.state.password = value;
        break;
      case "newPassword":
        isError.newPassword = regExpPassword.test(value)
          ? "&#160;"
          : "At least 6 characters required";
        this.state.newPassword = value;
        break;
      default:
        break;
    }
    this.setState({
      isError,
      [e.target.id]: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (formValid(this.state)) {
      console.log(this.state);
    } else {
      console.log("Form is invalid!");
    }
  };

  componentDidMount() {
    // Avoid spacing on the form

    var t3 = document.getElementById("password");
    t3.onkeypress = function (e) {
      if (e.keyCode === 32) return false;
    };
    var t2 = document.getElementById("newPassword");
    t3.onkeypress = function (e) {
      if (e.keyCode === 32) return false;
    };
    // Accept term and condition click link
    $("#conditionbtn").on("click", () => {
      $("#accept-terms").removeAttr("disabled");
    });
  }

  render() {
    const { isError } = this.state;

    return (
      <MainContainer>
        <div className="container">
          <div className="page-header text-center">
            <h1>Change Password</h1>
            <p>{this.state.password}</p>
            <p>{this.state.confirmpw}</p>
          </div>
        </div>

        <form onSubmit={this.handleSubmit} noValidate>
          <div className="col-xs-12 col-md-8 ">
            <div className="form-group row">
              <label htmlFor="password" className="col-sm-2 col-form-label">
                Old Password{" "}
              </label>
              <div className="col-sm-6">
                <input
                  name="password"
                  type="password"
                  id="password"
                  className={
                    isError.password.length > 0
                      ? "is-invalid form-control"
                      : "form-control"
                  }
                  value={this.state.password}
                  placeholder="Password"
                  onChange={this.handleChange}
                  required
                />
                {isError.password.length > 0 && (
                  <span className="invalid-feedback">
                    {Parser(isError.password)}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="col-xs-12 col-md-8 ">
            <div className="form-group row">
              <label htmlFor="newPassword" className="col-sm-2 col-form-label">
                New Password{" "}
              </label>
              <div className="col-sm-6">
                <input
                  name="newPassword"
                  type="password"
                  id="newPassword"
                  className={
                    isError.newPassword.length > 0
                      ? "is-invalid form-control"
                      : "form-control"
                  }
                  value={this.state.newPassword}
                  placeholder="newPassword"
                  onChange={this.handleChange}
                  required
                />
                {isError.newPassword.length > 0 && (
                  <span className="invalid-feedback">
                    {Parser(isError.newPassword)}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="col-xs-12 col-md-8 ">
            <div className="form-group row">
              <label htmlFor="newPassword" className="col-sm-2 col-form-label">
                Password confirmation{" "}
              </label>
              <div className="col-sm-6">
                <input
                  name="confirmPassword"
                  type="password"
                  id="confirmPassword"
                  className={
                    isError.newPassword.length > 0
                      ? "is-invalid form-control"
                      : "form-control"
                  }
                  value={this.state.newPassword}
                  placeholder="Password confirmation"
                  onChange={this.handleChange}
                  required
                />
                {isError.newPassword.length > 0 && (
                  <span className="invalid-feedback">
                    {Parser(isError.newPassword)}
                  </span>
                )}
              </div>
            </div>

            <div className="form-group ">
              <div className="text-center">
                <Link to="/">
                  <button type="submit" className="btn btn-primary">
                    Change password
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </form>
      </MainContainer>
    );
  }
}

export default ChangePassword;