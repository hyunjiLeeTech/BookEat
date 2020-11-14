import React, {Component} from "react";
import MainContainer from "../component/Style/MainContainer";
import Parser from "html-react-parser";
import sha256 from "crypto-js/sha256";
import FullscreenError from "../component/Style/FullscreenError";
import FullScrrenLoading from "../component/Style/FullscreenLoading";
import {withRouter} from "react-router-dom";
import dataService from "../Services/dataService";
import {toast} from "react-toastify";

const regExpPassword = RegExp(
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,32}$/,
);

const formValid = ({isError, ...rest}) => {
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

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newPassword: "",
      confirmpw: "",
      isError: {
        newPassword: "&#160;",
        confirmpw: "&#160;",
      },
      resultsErr: false,
      isLoading: false,
      accountId: this.props.match.params.id,
      timestamp: this.props.match.params.timestamp,
      errmsg: null,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (e) => {
    e.preventDefault();
    const {name, value} = e.target;
    let isError = {...this.state.isError};
    switch (name) {
      case "newPassword":
        isError.newPassword = regExpPassword.test(value)
          ? "&#160;"
          : "At least 6 characters required";
        this.state.newPassword = value;
        break;
      case "confirmpw":
        this.state.confirmpw = value;
        isError.confirmpw =
          this.state.confirmpw === this.state.newPassword
            ? "&#160;"
            : "Password not matching";
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
    console.log("submitting");
    e.preventDefault();
    if (formValid(this.state)) {
      this.state.password = sha256(this.state.password).toString(); //hashing password
      this.state.newPassword = sha256(this.state.newPassword).toString();
      dataService
        .resetPasswordWithTimeStamp({
          accountId: this.state.accountId,
          timestamp: this.state.timestamp,
          newPassword: this.state.newPassword,
        })
        .then((res) => {
          toast("Password reset, please login", {
            type: "success",
            autoClose: 5000,
          });
        })
        .catch((err) => {
          var errmsg = "error";
          if (err.errmsg) errmsg = err.errmsg;
          toast(errmsg, {type: "error", autoClose: false});
        });
    } else {
      console.log("Form is invalid!");
    }
  };

  componentDidMount() {
    this.setState({isLoading: true});
    dataService
      .validateTimeStamp({
        accountId: this.state.accountId,
        timestamp: this.state.timestamp,
      })
      .catch((err) => {
        if (err.errcode && err.errcode === 3)
          this.setState({
            resultsErr: true,
            errmsg: "This link is not avaiable anymore.",
          });
        else if (err.errcode && err.errcode === 4)
          this.setState({resultsErr: true, errmsg: "This link has expired."});
        else if (err.errcode && err.errcode === 2)
          this.setState({
            resultsErr: true,
            errmsg: "Failed to validate the link.",
          });
        else if (err.errcode && err.errcode === 1)
          this.setState({
            resultsErr: true,
            errmsg: "This link is not validated.",
          });
        else this.setState({resultsErr: true});
      })
      .finally(() => {
        this.setState({isLoading: false});
      });
    var t2 = document.getElementById("newPassword");
    t2.onkeypress = function (e) {
      if (e.keyCode === 32) return false;
    };
    var t1 = document.getElementById("confirmpw");
    t1.onkeypress = function (e) {
      if (e.keyCode === 32) return false;
    };
  }

  render() {
    const {isError} = this.state;
    return (
      <MainContainer>
        {this.state.resultsErr
          ? FullscreenError(
              this.state.errmsg
                ? this.state.errmsg
                : "An error occured, please try again later",
            )
          : null}

        {this.state.isLoading
          ? FullScrrenLoading({type: "balls", color: "#000"})
          : null}
        <div className="container">
          <div className="page-header text-center">
            <br />
            <br />
            <h3>Reset password</h3>
            <br />
          </div>
        </div>

        <form onSubmit={this.handleSubmit} noValidate>
          <div className="text-center">
            <div className="form-group row">
              <label htmlFor="newPassword" className="col-sm-3 col-form-label">
                New Password{" "}
              </label>
              <div className="col-sm-6">
                <input
                  name="newPassword"
                  type="password"
                  id="newPassword"
                  className={
                    isError.newPassword.length > 6
                      ? "is-invalid form-control"
                      : "form-control"
                  }
                  value={this.state.newPassword}
                  placeholder="Enter new password"
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

          <div className="text-center">
            <div className="form-group row">
              <label htmlFor="confirmpw" className="col-sm-3 col-form-label">
                Password confirmation{" "}
              </label>
              <div className="col-sm-6">
                <input
                  type="password"
                  name="confirmpw"
                  id="confirmpw"
                  className={
                    isError.confirmpw.length > 6
                      ? "is-invalid form-control"
                      : "form-control"
                  }
                  value={this.state.confirmpw}
                  placeholder="Confirm Password"
                  onChange={this.handleChange}
                  required
                />
                <span className="invalid-feedback">
                  {Parser(isError.confirmpw)}
                </span>
              </div>
            </div>

            <br />

            <div className="form-group ">
              <div className="text-center">
                <button type="submit" className="btn btn-info">
                  Submit
                </button>
              </div>
            </div>
          </div>
        </form>
      </MainContainer>
    );
  }
}

export default withRouter(ResetPassword);
