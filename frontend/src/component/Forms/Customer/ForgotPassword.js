import React, {Component} from "react";
import MainContainer from "../../Style/MainContainer";
import "./SignUp.js";
import Parser from "html-react-parser";
import $ from "jquery";
import FullscreenError from "../../Style/FullscreenError";
import dataService from "../../../Services/dataService";
import {toast} from "react-toastify";

//Validation
const regExpEmail = RegExp(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/);

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

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      isError: {
        email: "&#160;",
      },
      resultsErr: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (e) => {
    e.preventDefault();
    const {name, value} = e.target;
    let isError = {...this.state.isError};
    switch (name) {
      case "email":
        isError.email = regExpEmail.test(value)
          ? "&#160;"
          : "Email address is invalid";
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
      //console.log(this.state);
    } else {
      console.log("Form is invalid!");
    }
  };

  componentDidMount() {
    // Avoid spacing on the form

    var t2 = document.getElementById("email");
    t2.onkeypress = function (e) {
      if (e.keyCode === 32) return false;
    };

    // Accept term and condition click link
    $("#conditionbtn").on("click", () => {
      $("#accept-terms").removeAttr("disabled");
    });
  }

  render() {
    const {isError} = this.state;
    const getResetPasswordEmail = () => {
      dataService
        .getResetPasswordEmail({email: this.state.email})
        .then((res) => {
          toast("Reset password email sent. Please check your Email inbox", {
            type: "success",
            autoClose: 5000,
          });
        })
        .catch((err) => {
          let errmsg = "Erro occcured";
          if (err.errmsg) errmsg = err.errmsg;
          toast(errmsg, {type: "error", autoClose: false});
        });
    };

    return (
      <MainContainer>
        {this.state.resultsErr
          ? FullscreenError("An error occured, please try again later")
          : null}

        <div className="container">
          <div className="page-header text-center">
            <br />
            <br />
            <h3>Forgot your password ?</h3>
            <p></p>
            Enter the email address associated with your account, and we'll send
            you a link to reset your password.
            <br />
            <br />
            <br />
          </div>
        </div>

        <form onSubmit={this.handleSubmit} className="text-center" noValidate>
          <div className="form-group row">
            <label htmlFor="email" className="col-sm-2 col-form-label">
              Email
            </label>
            <div className="col-sm-8">
              <input
                type="email"
                name="email"
                id="email"
                className={
                  isError.email.length > 6
                    ? "is-invalid form-control"
                    : "form-control"
                }
                value={this.state.email}
                placeholder="Email"
                onChange={this.handleChange}
                required
              />
              <span className="invalid-feedback">{Parser(isError.email)}</span>
            </div>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="btn btn-primary"
              onClick={getResetPasswordEmail}
            >
              Send reset link
            </button>
          </div>
        </form>
      </MainContainer>
    );
  }
}

export default ForgotPassword;
