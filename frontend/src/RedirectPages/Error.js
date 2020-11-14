import React, {Component} from "react";
import "./Error.css";
import $ from "jquery";
import MainContainer from "../component/Style/MainContainer";
import AuthService from "../Services/AuthService";

class ErrorPage extends Component {
  componentDidMount() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if (urlParams.has("message")) {
      $("#ErrorMessage").text(urlParams.get("message"));
    }
    if (urlParams.has("Hint")) {
      $("#ErrorHint").text(urlParams.get("Hint"));
    }
    if (
      urlParams.has("foreceLogout") &&
      urlParams.get("foreceLogout") === "true"
    ) {
      AuthService.logout();
      if (urlParams.has("message")) {
        $("#ErrorMessage").text(
          urlParams.get("message") + " We will redirect for you soon",
        );
      }
      setTimeout(() => {
        window.location.href = "/login";
      }, 5000);
    }
  }

  render() {
    return (
      //partial code from https://tobiasahlin.com/spinkit/, modified.
      <MainContainer>
        <div>
          <div id="ErrorMessageWrapper">
            <h1 style={{width: "100%", textAlign: "center"}}>Error</h1>

            <p id="ErrorMessage">Signing you out</p>

            <p id="ErrorHint">Please wait for Signing out.</p>
          </div>
        </div>
      </MainContainer>
    );
  }
}

export default ErrorPage;
