import React, {Component} from "react";
import {Link} from "react-router-dom";
import {gapi} from "gapi-script";
import MainContainer from "../../Style/MainContainer";
import "./SignUp.css";
import Parser from "html-react-parser";
import $ from "jquery";
import Axios from "axios";
import sha256 from "crypto-js/sha256";
import serverAddress from "../../../Services/ServerUrl";
import FacebookLogin from "react-facebook-login";
import FullscreenError from "../../Style/FullscreenError";
import AuthService from "../../../Services/AuthService";
import dataService from "../../../Services/dataService";
import {toast} from "react-toastify";

//Validation
const regExpEmail = RegExp(
  /^(([A-Za-z0-9]+_+)|([A-Za-z0-9]+-+)|([A-Za-z0-9]+\.+)|([A-Za-z0-9]+\++))*[A-Za-z0-9]+@((\w+-+)|(\w+\.))*\w{1,63}\.[a-zA-Z]{2,6}$/,
);

const regExpPhone = RegExp(
  /^\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})$/,
);

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

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: "",
      lastname: "",
      email: "",
      phonenumber: "",
      password: "",
      confirmpw: "",
      isSignedIn: false,
      isError: {
        firstname: "&#160;",
        lastname: "&#160;",
        email: "&#160;",
        phonenumber: "&#160;",
        password: "&#160;",
        confirmpw: "&#160;",
      },
      resultsErr: false,
      isExternal: false,
      externalType: 0,
      externalToken: "",
      isCheckedTerm: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (e) => {
    e.preventDefault();
    const {name, value} = e.target;
    let isError = {...this.state.isError};
    switch (name) {
      case "firstname":
        isError.firstname =
          value.length >= 2 && value.length <= 32
            ? "&#160;"
            : "Atleast 2 character required";

        break;
      case "lastname":
        isError.lastname =
          value.length >= 2 && value.length <= 32
            ? "&#160;"
            : "Atleast 2 character required";
        break;
      case "email":
        isError.email = regExpEmail.test(value)
          ? "&#160;"
          : "Email address is invalid";
        break;
      case "phonenumber":
        isError.phonenumber = regExpPhone.test(value)
          ? "&#160;"
          : "Phone Number is invalid";
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
      isError,
      [e.target.id]: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (!this.state.isCheckedTerm) {
      $("#signResultText")
        .text("You must accept the term and conditions before sign up")
        .removeClass("alert-warning")
        .removeClass("alert-danger")
        .removeClass("alert-success")
        .addClass("alert-danger");
      return;
    }

    if (formValid(this.state)) {
      if (this.state.isExternal) {
        dataService
          .externalSignUp({
            token: this.state.externalToken,
            externalType: this.state.externalType,
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            email: this.state.email,
            phonenumber: this.state.phonenumber,
          })
          .then((res) => {
            $("#signResultText")
              .text("Congrats, Please Login")
              .removeClass("alert-warning")
              .removeClass("alert-danger")
              .removeClass("alert-success")
              .addClass("alert-success");
          })
          .catch((err) => {
            $("#signResultText")
              .text(
                "Sorry, " + err.errmsg
                  ? err.errmsg
                  : "we cannot sign up for you",
              )
              .removeClass("alert-warning")
              .removeClass("alert-danger")
              .removeClass("alert-success")
              .addClass("alert-danger");
            toast("error");
            console.log(err);
          });
      } else {
        this.state.password = sha256(this.state.password).toString(); //hashing password
        this.state.confirmpw = sha256(this.state.confirmpw).toString();
        Axios.post(serverAddress + "/customersignup", this.state)
          .then((res) => {
            if (res.data.errcode === 0) {
              $("#signResultText")
                .text("Congrats, Please confirm your email")
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
      }
    } else {
      console.log("Form is invalid!");
    }
  };

  // Google Sign In

  onSuccess(resp) {
    AuthService.loginExternal(1, resp.wc.access_token, false)
      .then((res) => {
        if (this.state.isExternal && this.state.externalType === 1) {
          toast("This Google account is already registered, please sign in :)");
          this.setState({isExternal: false});
        }
      })
      .catch((err) => {
        console.log(err);
        if (
          err.errcode === 2 &&
          this.state.isExternal &&
          this.state.externalType === 1
        ) {
          //signup
          this.setState({
            externalToken: resp.wc.access_token,
            email: err.profile.email,
            firstname: err.profile.given_name,
            lastname: err.profile.family_name,
          });
          $("#email").prop("disabled", "true");
          $("#firstname").prop("disabled", "true");
          $("#lastname").prop("disabled", "true");
        }
      });
  }

  onLoginFailed(err) {}

  getContent() {
    var googleBtn = () => {
      this.setState({isExternal: true, externalType: 1});
    };
    return (
      <div>
        <button id="loginButton" onClick={googleBtn}>
          Login with Google
        </button>
      </div>
    );
  }

  componentDidMount() {
    const successCallback = this.onSuccess.bind(this);
    // Avoid spacing on the form
    var t1 = document.getElementById("firstname");
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
    // Accept term and condition click link
    $("#conditionbtn").on("click", () => {
      $("#accept-terms").removeAttr("disabled");
    });

    //Google Sign In
    window.gapi.load("auth2", () => {
      this.auth2 = gapi.auth2.init({
        client_id:
          "377822834291-u5q8t038me7rn1k5gieq1b6qrohgqedf.apps.googleusercontent.com",
      });

      this.auth2.then(() => {
        this.setState({
          isSignedIn: this.auth2.isSignedIn.get(),
        });
      });
    });

    window.gapi.load("signin2", function () {
      // Method 3: render a sign in button
      // using this method will show Signed In if the user is already signed in
      var opts = {
        width: 200,
        height: 50,
        client_id:
          "377822834291-u5q8t038me7rn1k5gieq1b6qrohgqedf.apps.googleusercontent.com",
        onsuccess: successCallback,
      };
      gapi.signin2.render("loginButton", opts);
    });
  }

  handleTerms(result, dom) {
    $("#accept-terms").removeAttr("disabled");
    if (result) {
      $("#accept-terms").attr("checked", "checked");
      this.setState({isCheckedTerm: true});
    }
    if (result === false) {
      $("#accept-terms").removeAttr("checked");
      this.setState({isCheckedTerm: false});
    }
  }

  render() {
    const {isError} = this.state;
    const fbcallback = (data) => {
      this.setState({isExternal: true, externalType: 2});
      this.setState({
        externalToken: data.accessToken,
        email: data.email,
        firstname: data.first_name,
        lastname: data.last_name,
      });
      $("#email").prop("disabled", "true");
      $("#firstname").prop("disabled", "true");
      $("#lastname").prop("disabled", "true");
      AuthService.loginExternal(2, data.accessToken)
        .then((res) => {})
        .catch((err) => {
          console.log(err);
        });
    };
    const termCheck = (e) => {
      this.setState({isCheckedTerm: e.target.checked});
    };
    return (
      <MainContainer>
        {this.state.resultsErr
          ? FullscreenError("An error occured, please try again later")
          : null}

        <div className="container">
          <div className="page-header text-center">
            <br />
            <h1>Sign Up</h1>
          </div>

          <div className="row">
            <form
              onSubmit={this.handleSubmit}
              className="col-xs-6 col-md-8 needs-validation"
              noValidate
            >
              <div className="col-xs-16 col-md-16 ">
                <div className="form-group row">
                  <label
                    htmlFor="firstname"
                    className="col-sm-2 col-form-label"
                  >
                    {" "}
                    First Name{" "}
                  </label>
                  <div className="col-sm-6">
                    <input
                      type="text"
                      id="firstname"
                      name="firstname"
                      value={this.state.firstname}
                      placeholder="First Name"
                      className={
                        isError.firstname.length > 6
                          ? "is-invalid form-control"
                          : "form-control"
                      }
                      onChange={this.handleChange}
                      required
                    />
                    <span className="invalid-feedback">
                      {Parser(isError.firstname)}
                    </span>
                    {/* <span className="valid-feedback"></span> */}
                  </div>
                </div>

                <div className="form-group row">
                  <label htmlFor="lastname" className="col-sm-2 col-form-label">
                    Last Name{" "}
                  </label>
                  <div className="col-sm-6">
                    <input
                      type="text"
                      id="lastname"
                      name="lastname"
                      value={this.state.lastname}
                      placeholder="Last Name"
                      className={
                        isError.lastname.length > 6
                          ? "is-invalid form-control"
                          : "form-control"
                      }
                      onChange={this.handleChange}
                      required
                    />
                    <span className="invalid-feedback">
                      {Parser(isError.lastname)}
                    </span>
                  </div>
                </div>

                <div className="form-group row">
                  <label htmlFor="email" className="col-sm-2 col-form-label">
                    {" "}
                    Email{" "}
                  </label>
                  <div className="col-sm-6">
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
                    <span className="invalid-feedback">
                      {Parser(isError.email)}
                    </span>
                  </div>
                </div>

                <div className="form-group row">
                  <label
                    htmlFor="phonenumber"
                    className="col-sm-2 col-form-label"
                  >
                    Phone Number{" "}
                  </label>
                  <div className="col-sm-6">
                    <input
                      type="text"
                      id="phonenumber"
                      name="phonenumber"
                      className={
                        isError.phonenumber.length > 6
                          ? "is-invalid form-control"
                          : "form-control"
                      }
                      value={this.state.phonenumber}
                      placeholder="Phone Number"
                      onChange={this.handleChange}
                      required
                    />
                    <span className="invalid-feedback">
                      {Parser(isError.phonenumber)}
                    </span>
                  </div>
                </div>
                {this.state.isExternal ? null : (
                  <div className="form-group row">
                    <label
                      htmlFor="password"
                      className="col-sm-2 col-form-label"
                    >
                      Password{" "}
                    </label>
                    <div className="col-sm-6">
                      <input
                        name="password"
                        type="password"
                        id="password"
                        className={
                          isError.password.length > 6
                            ? "is-invalid form-control"
                            : "form-control"
                        }
                        value={this.state.password}
                        placeholder="Password"
                        onChange={this.handleChange}
                        required
                      />
                      <span className="invalid-feedback">
                        {Parser(isError.password)}
                      </span>
                    </div>
                  </div>
                )}

                {this.state.isExternal ? null : (
                  <div className="form-group row">
                    <label
                      htmlFor="confirmpw"
                      className="col-sm-2 col-form-label"
                    >
                      Password Confirmation{" "}
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
                )}

                <div className="form-group ">
                  <div className="form-check checkbox-xl">
                    {/* <input type="checkbox" id="accept-terms" disabled className="form-check-input" required /> */}
                    <input
                      type="checkbox"
                      id="accept-terms"
                      name="accept-terms"
                      onChange={termCheck}
                      className="form-check-input"
                      required
                      disabled
                    />

                    <button
                      type="button"
                      id="termsmodal"
                      className="btn btn-primary"
                      data-toggle="modal"
                      data-target="#TmersModal"
                    >
                      Terms and Conditions
                    </button>
                  </div>
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    data-toggle="modal"
                    data-target="#signResultModal"
                  >
                    Sign Up
                  </button>
                  <p>
                    Already a member? <Link to="/Login"> Log In </Link>
                  </p>
                  <hr />
                </div>

                <p className="text-center">Or sign up with</p>
                <div className="text-center">
                  {/* GoogleSignUp */}
                  {this.getContent()}
                  <br></br>
                  <FacebookLogin
                    appId="186311976091336"
                    autoLoad={false}
                    fields="first_name,last_name,email,picture"
                    callback={fbcallback}
                  />
                </div>
              </div>
            </form>

            <div className="col-xs-6 col-md-4">
              <div className="resbox">
                <h4>Be part of BookEat</h4>
                <p>
                  Want to advertise your restaurant? Sign Up here and be part of
                  the BookEat Family!
                </p>
                <div className="text-center">
                  <Link to="/RestaurantSignUp" className="btn btn-primary">
                    Restaurant Sign Up
                  </Link>
                </div>
              </div>
            </div>

            <div
              className="modal fade"
              id="TmersModal"
              tabIndex="-1"
              role="dialog"
              aria-labelledby="TermsModalLabel"
              aria-hidden="true"
            >
              <div
                className="modal-dialog modal-dialog-scrollable"
                role="document"
              >
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="TermsModalLabel">
                      Terms and Conditions
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
                    BookEat Inc. ( "BookEat”, “we”, “us” and terms of similar
                    meaning) provides BookEat reservations and online ordering
                    services via websites, mobile sites, widgets and
                    applications (collectively, the BookEat Reservations and
                    Online Ordering Sites”) and the content, features, and
                    services made available by BookEat through the BookEat
                    Reservations and Online Ordering Sites (the “Services”).
                    These terms and conditions of use (these “Terms”) constitute
                    a legal agreement and are entered into by and between you
                    and BookEat. These Terms govern your access to and use of
                    the Services, including any content, functionality, and
                    related services offered on or through the BookEat
                    Reservations and Online Ordering Sites. BY USING THE
                    SERVICES, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTAND AND
                    AGREE TO BE BOUND AND COMPLY WITH THESE TERMS AND CONDITIONS
                    AND OUR PRIVACY NOTICE. IF YOU DO NOT AGREE TO THESE TERMS
                    AND CONDITIONS OR THE PRIVACY NOTICE, YOU MUST NOT ACCESS OR
                    USE THE SERVICES. By using the Services, you represent and
                    warrant that you are the legal age of majority under
                    applicable law to form a binding contract with BookEat and
                    meet all of the foregoing eligibility requirements. If you
                    do not meet all of these requirements, you must not access
                    or use the Services. You are solely responsible for ensuring
                    that your use of the Services is in compliance with all
                    applicable laws. THIS AGREEMENT CONTAINS, AMONG OTHER
                    THINGS, AN ARBITRATION PROVISION CONTAINING A CLASS ACTION
                    WAIVER. We reserve the right in our sole discretion to
                    revise and update these terms and conditions from time to
                    time. Any and all such modifications are effective
                    immediately upon posting and apply to all access to and
                    continued use of the Services. You agree to periodically
                    review the terms and conditions in order to be aware of any
                    such modifications and your continued use shall be your
                    acceptance of these. If you do not agree with the changes,
                    you can cancel your account with us by contacting support
                    BookEat.com. Any changes or modifications will be effective
                    immediately upon posting of the revisions on the BookEat
                    Reservations and Online Ordering Sites, and your continued
                    use of Services after such time will constitute your
                    acceptance of such changes or modifications. The information
                    and material on the Services, and the Services, may be
                    changed, withdrawn or terminated at any time in our sole
                    discretion without notice. We will not be liable if, for any
                    reason, all or any part of the Services is restricted to
                    users or unavailable at any time or for any period. You
                    should from time to time review the Terms and any policies
                    and documents incorporated in them to understand the terms
                    and conditions that apply to your use of Services. The Terms
                    will always show the ‘last updated’ date at the top. If you
                    do not agree to any amended Terms, you must stop using
                    Services. 1. Privacy Notice. By submitting your personal
                    information and using the Services, you consent to the
                    collection, use, reproduction, hosting, transmission and
                    disclosure of any such user content submissions in
                    compliance with the Terms and our Privacy Notice, as we deem
                    necessary for use and provision of the Services. By using
                    the Services, you consent to BookEat contacting you via
                    email, text message (SMS), mobile push notifications, or
                    other electronic communications, in each case in accordance
                    with our Privacy Notice. By using the Services you are
                    consenting to the use of cookies which allow a server to
                    recall previous requests or registration and/or IP addresses
                    to analyze website use patterns. You can set your browser to
                    notify you before you receive a cookie, giving you the
                    chance to decide whether to accept it. You can also set your
                    browser to turn off cookies. If you do, however, some areas
                    of the Services may not function adequately. For more
                    information on this automated information gathering
                    practices, see Cookies Preferences. Please refer to
                    BookEat’s Privacy Notice, available at Privacy Notice for
                    information on how BookEat collects, uses and discloses
                    personally identifiable information of users. 2.
                    Registration Data; Account Security. You may use some of the
                    Services without signing up for an account. If you register
                    for an account for the Services, you agree to (a) provide
                    and maintain accurate, current and complete information as
                    may be prompted by any registration forms on Services
                    (“Registration Data”); (b) maintain the security of your
                    password/s; (c) maintain and promptly update the
                    Registration Data and any other information you provide to
                    BookEat, and to keep it accurate, current and complete; and
                    (d) accept all risks of unauthorized access to the
                    Registration Data and any other information or data you
                    provide to BookEat or through your use of the Services. You
                    must exercise caution when accessing your account from a
                    public or shared computer so that others are not able to
                    view or record your password or other personal information.
                    You are responsible for all activity on your BookEat
                    account, and for charges incurred by your BookEat account.
                    Without restricting the generality of the foregoing, it is
                    expressly acknowledged and agreed that BookEat may utilize
                    any information or data collected by it through the
                    provision of the Services, including without limitation,
                    personally identifiable information of users, for any
                    legitimate business purpose whatsoever, and may share any
                    and all such information and data with third parties at its
                    discretion, including without limitation, Restaurants. You
                    are solely responsible for maintaining the confidentiality
                    of your account and the information in your account, and you
                    are solely responsible for all use of your account, whether
                    or not authorized by you. You agree to immediately notify
                    BookEat of any unauthorized use of your account or any other
                    breach of security related to your use of the Services. We
                    reserve the right to take any and appropriate legal action,
                    including, without limitation, referral to law enforcement
                    or regulatory authority, or notifying the harmed party of
                    any illegal or unauthorized use of the Services. Without
                    limiting the foregoing, we have the right to fully cooperate
                    with any law enforcement authorities or court order
                    requesting or directing us to disclose the identity or other
                    information of anyone posting any materials on or through
                    the Services. We may, without notice and in our sole
                    discretion, terminate or suspend your Account and/or ability
                    to use the Services or parts thereof for any reason or no
                    reason. We are not required to provide access to the
                    Services to any individual whose Account has previously been
                    suspended or terminated and, in the event your Account is
                    suspended or terminated, you are not guaranteed access to
                    any information saved to your Account. You acknowledge and
                    agree that BookEat has no responsibility to you or liability
                    whatsoever in connection with suspension or termination of
                    your Account. BookEat may monitor your use of the Services
                    for any reason, including but not limited to, quality
                    assurance, the improvement of BookEat products and services,
                    and for verification of your compliance with the Terms. You
                    shall not interfere with such monitoring or otherwise
                    obscure from BookEat any aspect of your use of the Services.
                    3. Restaurant Reservations. BookEat makes available
                    restaurant reservation services and waitlist services
                    through the BookEat Reservations and Online Ordering Sites
                    to users of the Services, for the purpose of assisting users
                    in securing dining reservations or joining a waitlist at
                    participating third-party restaurants (each, a
                    “Restaurant”). Once a reservation or waitlist request is
                    made by you through the BookEat Reservations and Online
                    Ordering Sites, BookEat will provide confirmation of the
                    reservation or waitlist status to you by email or other
                    electronic message. Please note that reservations are not
                    confirmed until you receive a notification of confirmation
                    displayed through the Services. By using the reservation
                    services or waitlist services, you agree to receive
                    reservation and waitlist confirmations, updates,
                    modifications and/or cancellations by email or other
                    electronic messages. Certain Restaurants may require payment
                    information at the time of booking for the purpose of
                    prepayments, cancellation fees, or otherwise. Reservations
                    with such Restaurants will require you to provide your
                    credit or debit card information. Restaurants use
                    third-party payment processors (in this Paragraph a “Payment
                    Processor”) to authorize a payment as required. In cases
                    where a payment authorization is required in order to make a
                    reservation, in addition to these Terms, the Payment
                    Processor’s terms and conditions and privacy policy will
                    govern your payment. You agree that by making a reservation,
                    you agree to and will pay all applicable fees in accordance
                    with the terms of the applicable Restaurant and in
                    accordance with the terms and conditions and policies of the
                    Payment Processor. BookEat shall have no liability for any
                    charges made by the Restaurant to the debit or credit card
                    account for any reason, including without limitation, any
                    failure to cancel your reservation in accordance with the
                    cancellation policy of the subject Restaurant. 4. No-Show
                    Policy. The cancellation of booked reservations is subject
                    to the particular Restaurant’s cancellation policy, which
                    shall be disclosed to you at the time you make the
                    reservation. You may cancel your reservation via the BookEat
                    Reservations and Online Ordering Sites or by calling the
                    Restaurant directly. Upon arriving at the Restaurant, it is
                    your responsibility to notify the Restaurant that you have a
                    reservation. Please note that if you do not notify the
                    Restaurant that you have a reservation, it may register you
                    as a no-show. If you repeatedly fail to honour your
                    reservations or fail to cancel your reservations in
                    accordance with the applicable cancellation policy, we
                    reserve the right to suspend or terminate your account.
                    Please note that all decisions regarding your account will
                    be final and in our sole discretion. 5. Waitlist. If you
                    wish to remove yourself from a waitlist you have joined
                    through the waitlist services, you can do so by managing
                    your place in line through the BookEat Reservations and
                    Online Ordering Sites or by calling the Restaurant. Failure
                    to appear at the Restaurant in a timely manner may result in
                    the Restaurant bypassing your place on the waitlist for
                    other guests or removing you from the waitlist entirely. 6.
                    Online Ordering. BookEat makes available online ordering
                    services through the BookEat Reservations and Online
                    Ordering Sites to users of the Services, for the purpose of
                    enabling you to place online orders for food, beverages and
                    related products and services provided by Restaurants
                    (“Orders”) and to facilitate payments to the Restaurant for
                    those Orders. By using the online ordering services, you
                    agree to receive Order confirmations, updates, modifications
                    and/or cancellations by email or other electronic messages.
                    The Restaurant may use a third-party payment processor
                    (“Payment Processor”) to authorize payment for Orders (each
                    a “Payment”). In cases where a payment authorization is
                    required in order to complete an Order, in addition to these
                    Terms, the Payment Processor’s terms and conditions and
                    privacy policy will govern your payment. You agree that by
                    making an Order, you agree to and will pay all applicable
                    fees in accordance with the terms of the applicable
                    Restaurant and in accordance with the terms and conditions
                    and policies of the Payment Processor. Orders and Payments
                    you submit through the BookEat Reservations and Online
                    Ordering Sites are transactions between yourself and the
                    Restaurant, and not with BookEat. BookEat is not the seller
                    of any product or service offered by Restaurants and is not
                    a party to any Payment transaction facilitated through the
                    BookEat Reservations and Online Ordering Sites. 7. Usage
                    Guidelines. Subject to the terms and conditions of this
                    Agreement, BookEat grants you a non-exclusive,
                    non-transferable, revocable license to use the mobile
                    applications associated with the Services, in object code
                    form only, on your compatible mobile devices, solely to
                    support your permitted use of the Services. You agree to use
                    the Services only to book reservations or join waitlists at
                    Restaurants or to make online orders and then honour those
                    reservations or waitlist requests or online orders by
                    arriving at the Restaurants on time and ordering and paying
                    for meals or completing the purchase of any online orders.
                    Use of the Services requires internet access through your
                    computer or mobile device. You are responsible for all
                    mobile carrier data or text message charges resulting from
                    your use of the Services, including from any notifications
                    provided by the Services. In order to use the text
                    message-based services, you must maintain an active account
                    with a carrier of electronic communications through mobile
                    devices and you may not use a prepaid cellular phone to
                    access such text message services. BookEat does not
                    guarantee that the Services will be compatible with all
                    devices or will be supported by all mobile carriers. You may
                    be required to have JavaScript (or similar technologies)
                    enabled to use the BookEat Reservations and Online Ordering
                    Sites, and some features and portions of the BookEat
                    Reservations and Online Ordering Sites (including, but not
                    limited to, making, modifying, or canceling reservations)
                    may not be accessible with JavaScript disabled. 8. User
                    Submissions. Content Standards. The Services permit users to
                    submit information including, without limitation, personal
                    information and venue reviews to or otherwise through the
                    Services (all such submitted content, material, and other
                    information a user submits, posts, publishes, displays, or
                    transmits through the Services, collectively, “User
                    Submissions”). None of the User Submissions you submit to
                    the Services will be subject to any confidentiality by
                    BookEat and BookEat will have no responsibility or liability
                    for any User Submissions. By submitting any User Submission
                    to the Services, you: a. grant us and our affiliates and
                    service providers, and each of their and our respective
                    licensees, successors, and assigns the right to a
                    world-wide, royalty free, perpetual, irrevocable,
                    non-exclusive, fully sublicensable right to use, reproduce,
                    modify, perform, display, distribute, and otherwise disclose
                    to third parties any such material for any purpose and
                    according to your account settings and/or incorporate such
                    material into any form, medium or technology throughout the
                    world without compensation to you; b. waive any moral rights
                    or other rights of authorship as a condition of submitting
                    any User Submission; and c. represent and warrant that: (i)
                    you own or have the necessary rights to submit the User
                    Submissions and have the right to grant the licence set out
                    above; (ii) your User Submission complies with applicable
                    laws and regulations and these Terms. You agree that you
                    will not and will not permit any other party using your
                    Account to submit User Submissions which are, or contain
                    materials which are, illegal, exploitive, harmful,
                    threatening, abusive, hateful, defamatory, obscene,
                    discriminatory based on race, sex, religion, nationality,
                    disability, sexual orientation, age or other such legally
                    prohibited grounds, infringing of intellectual property
                    rights, infringing of other legal rights (including the
                    rights of publicity and privacy of others) or contain any
                    material that could give rise to any civil or criminal
                    liability under applicable laws or regulations or that
                    otherwise may be in conflict with these Terms and our
                    Privacy Notice. You further agree that you will not submit
                    any User Submissions for which you are being, directly or
                    indirectly, compensated by a third party, and that your User
                    Submissions will not involve, provide or contribute any
                    false, inaccurate or misleading information, including with
                    respect to any venues or the services provided by such
                    venues. You acknowledge that we have no obligation to
                    monitor User Submissions, and User Submissions are not
                    necessarily regularly reviewed. Accordingly, we do not
                    guarantee the timely removal of objectionable materials
                    contained in User Submissions and, subject to applicable
                    laws, we have no liability for any action or inaction by
                    third parties in respect of User Submissions. Without
                    limiting the foregoing, we reserve the right to monitor,
                    remove, or edit User Submissions which, in our sole
                    discretion include or contain any material that is
                    exploitive, obscene, harmful, threatening, abusive,
                    harassing, hateful, defamatory, sexually explicit or
                    pornographic, violent, inflammatory, or discriminatory based
                    on race, sex, religion, nationality, disability, sexual
                    orientation, or age or other such legally prohibited ground
                    or be otherwise objectionable, such determination to be made
                    in BookEat’s sole discretion. 9. Intellectual Property
                    Rights and Ownership. You acknowledge and agree that the
                    Services and the contents, features, and functionality
                    thereof, including, but not limited to, all information,
                    software, code, text, displays, graphics, photographs,
                    video, audio, design, presentation, selection, and
                    arrangement, are owned by BookEat, its licensors, or other
                    providers of such material and are protected in all forms by
                    intellectual property laws including without limitation,
                    copyright, trademark, patent, trade secret, and any other
                    proprietary rights. Except as expressly set out in these
                    Terms, no license is granted to you or any other user for
                    any other purpose. BookEat and its affiliates and licensors
                    retain all rights in the Services and parts thereof,
                    including any associated intellectual property rights. The
                    BookEat name, and all related names, logos, product and
                    service names, designs, images and slogans are trademarks of
                    BookEat or its affiliates or licensors. You must not use
                    such marks without the prior written permission of BookEat.
                    Other names, logos, product and service names, designs,
                    images and slogans mentioned, or which appear on the
                    Services are the trademarks of their respective owners. Use
                    of any such property, except as expressly authorized, shall
                    constitute an infringement or violation of the rights of the
                    property owner and may be a violation of federal or other
                    laws and could subject the infringing party to legal action.
                    10. Restrictions on Use of Services. Your use of the
                    Services is subject to the following restrictions. You may
                    not: • Interfere or attempt to interfere in any manner with
                    the proper workings of the Services, or take any steps that
                    may adversely affects the functionality or performance of
                    the Services; • Use the Services in any manner or for any
                    purpose that violates any law or regulation or the rights of
                    any person, including but not limited to intellectual
                    property rights, rights of privacy, or rights of
                    personality; • Disparage or otherwise negatively represent
                    the Services or do anything that could result in damage or
                    dilution to the goodwill of BookEat and its brand; • Reverse
                    engineer, decompile or otherwise attempt to extract the
                    source code of the Services or any part thereof; •
                    Circumvent or render ineffective any IP address-based
                    functionality or restriction imposed by the Services. •
                    resell or attempt to resell any reservations or waitlist
                    spot. • book more than one reservation for any given time. •
                    provide any other person with access to the Services or
                    portions of it using your username, password, or other
                    security information. • attempt to circumvent the security
                    of the Services, including, without limitation: (a)
                    accessing content and data that is not intended for you; (b)
                    attempting to breach or breaching the security and/or
                    applicable authentication measures; (c) restricting,
                    disrupting or disabling service to users, hosts, servers or
                    networks; (d) using any robot, spider, or other automatic
                    device, process, or means to access the Services for any
                    purpose, including monitoring or copying any of the material
                    on the Services; (e) introducing any viruses, trojan horses,
                    worms, logic bombs, or other material that is malicious or
                    technologically harmful; (f) attacking the Services via a
                    denial-of-service attack, distributed denial-of-service
                    attack, flooding, mailbombing or crashing; and (g) otherwise
                    attempting to interfere with the proper working of the
                    Services and/or BookEat’s ability to monitor the Services.
                    11. Providing a Reliable and Secure Service. We put a great
                    deal of effort into ensuring that the Services operate in a
                    reliable manner and provide a secure environment for your
                    data. We use what we believe to be “best-of-class”
                    infrastructure and hosting services and security
                    technologies and services that we believe provide you with a
                    secure and safe environment. However, no system is perfectly
                    secure or reliable, the internet, hardware, power sources,
                    and local servers and associated technology are inherently
                    unreliable at times and can be an insecure medium, and the
                    reliability of hosting services, internet intermediaries,
                    your internet service provider, servers, databases and other
                    service providers cannot be assured or assumed. When you use
                    the Services, you acknowledge you understand and accept
                    these risks, and you accept sole responsibility for choosing
                    to use a technology that does not provide perfect security
                    or reliability. 12. Advertisements and Promotions. BookEat
                    may run advertisements and promotions from third parties on
                    the BookEat Reservations and Online Ordering Sites or
                    otherwise through the Services. Your business dealings or
                    correspondence with, or participation in promotions of,
                    advertisers other than BookEat, and any terms, conditions,
                    warranties or representations associated with such dealings,
                    are solely between you and such third party. BookEat is not
                    responsible or liable for any loss or damage of any sort
                    incurred as the result of any such dealings or as the result
                    of the presence of third-party advertisers on the BookEat
                    Reservation and Online Ordering Sites. 13. Disclaimer of
                    Warranties. Limitation of Liability. YOU UNDERSTAND AND
                    AGREE THAT YOUR USE OF THE SERVICES, ITS CONTENT, AND ANY
                    SERVICES OR ITEMS FOUND OR ATTAINED THROUGH THE SERVICES IS
                    AT YOUR OWN RISK. THE SERVICES, ITS CONTENT, AND ANY
                    SERVICES OR ITEMS FOUND OR ATTAINED THROUGH THE SERVICES ARE
                    PROVIDED ON AN “AS IS” AND “AS AVAILABLE” BASIS, WITHOUT ANY
                    REPRESENTATIONS, WARRANTIES OR CONDITIONS OF ANY KIND,
                    EITHER EXPRESS OR IMPLIED INCLUDING, BUT NOT LIMITED TO, THE
                    IMPLIED WARRANTIES AND CONDITIONS OF MERCHANTABILITY,
                    FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. THE
                    FOREGOING DOES NOT AFFECT ANY WARRANTIES OR CONDITIONS THAT
                    CANNOT BE EXCLUDED OR LIMITED UNDER APPLICABLE LAW. BookEat
                    PROVIDES NO REPRESENTATIONS, WARRANTIES, CONDITIONS OR
                    ENDORSEMENTS OF ANY KIND WITH RESPECT TO THE COMPLETENESS,
                    SECURITY, RELIABILITY, SUITABILITY, ACCURACY, CURRENCY OR
                    AVAILABILITY OF THE SERVICES OR ITS CONTENTS. WITHOUT
                    LIMITING THE FOREGOING, NEITHER BookEat, NOR ANY OF ITS
                    SERVICE PROVIDERS, CONTRACTORS, LICENSORS, LICENSEES OR
                    SUPPLIERS REPRESENT OR WARRANT THAT THE SERVICES, ITS
                    CONTENT, OR ANY SERVICES OR ITEMS FOUND OR ATTAINED THROUGH
                    THE SERVICES WILL BE ACCURATE, RELIABLE, SECURE ERROR-FREE,
                    OR UNINTERRUPTED, THAT DEFECTS WILL BE CORRECTED, OR THAT
                    THE SERVICES ARE FREE OF VIRUSES OR OTHER HARMFUL
                    COMPONENTS. UNDER NO CIRCUMSTANCE WILL BookEat BE LIABLE FOR
                    DAMAGES OF ANY KIND, UNDER ANY LEGAL THEORY, INCLUDING ANY
                    DIRECT, INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, OR
                    PUNITIVE DAMAGES, INCLUDING LOSS OF USE AND LOSS OF DATA,
                    WHETHER BASED IN CONTRACT, TORT (INCLUDING NEGLIGENCE) OR
                    OTHERWISE, EVEN IF BookEat WAS ALLEGEDLY ADVISED OR HAD
                    REASON TO KNOW OF THE POSSIBILITY OF SUCH DAMAGES, ARISING
                    OUT OF OR IN CONNECTION WITH YOUR USE, OR INABILITY TO USE,
                    OR RELIANCE ON, THE SERVICES, ANY LINKED WEBSITES OR SUCH
                    OTHER THIRD-PARTY WEBSITES, NOR ANY CONTENT, MATERIALS,
                    POSTING OR INFORMATION PROVIDED THROUGH THE SERVICES. TO THE
                    EXTENT THE FOREGOING EXCLUSIONS ARE PROHIBITED BY LAW, YOU
                    EXPRESSLY AGREE THAT BookEat’S LIABILITY TO YOU FOR ANY
                    CAUSE WHATSOEVER AND REGARDLESS OF THE NATURE OF THE CLAIM
                    WILL AT ALL TIMES BE LIMITED TO ONE HUNDRED CANADIAN DOLLARS
                    ($100). 14. Indemnity and Release. To the maximum extent
                    permitted by applicable law, you agree to defend, indemnify,
                    and hold harmless BookEat, its subsidiaries, affiliates or
                    respective directors, officers, employees, agents or
                    successors (collectively with BookEat the BookEat Parties”)
                    from and against any claims, liabilities, damages,
                    judgments, awards, losses, costs, expenses, or fees
                    (including reasonable attorneys’ fees) arising out of or
                    relating to your breach of these Terms or your use of the
                    Services other than as expressly authorized in these Terms.
                    Your interactions with Restaurants and/or any payment
                    processors are solely between you and such party and all
                    claims, injuries, illnesses, damages, liabilities, and costs
                    suffered by you as a result of your interaction with any
                    Restaurant or payment processor or from any promotion,
                    offer, product or service of any Restaurant or payment
                    processor must be resolved directly with Restaurants. You
                    waive and shall not assert any claims or allegations of any
                    nature whatsoever against any BookEat Party arising out of
                    or in any way relating to your use of the BookEat
                    Reservations and Online Ordering Sites or the Services,
                    including, without limitation, any claims or allegations
                    that any BookEat Party should indemnify, defend or hold
                    harmless you or any third party from any claim or allegation
                    arising from your use or other exploitation of the BookEat
                    Reservations and Online Ordering Sites or the Services. To
                    the maximum extent permitted by law, you hereby release the
                    BookEat Parties from any and all claims arising from your
                    interaction with any Restaurant and/or payment processor.
                    You and BookEat understand and agree that the disclaimers,
                    exclusions, and limitations of liability in these Terms are
                    essential elements of this Agreement and that they represent
                    a reasonable allocation of risk. In particular, you
                    understand that BookEat would be unable to make the Services
                    available to you except on these terms and agree that this
                    Agreement will survive and apply even if any limited remedy
                    specified in this Agreement is found to have failed of its
                    essential purpose. 15. Communications. Notices that we give
                    you may be provided in any number of ways, depending on the
                    circumstances. For example, we may email you or telephone
                    you at the contact information you provide in your
                    Registration Data. Or we may post a notice on the BookEat
                    Reservations and Online Ordering Sites. When we post notices
                    on the BookEat Reservations and Online Ordering Sites, we
                    post them in an area suitable to the notice. It is your
                    responsibility to periodically review the BookEat
                    Reservations and Online Ordering Sites for notices. You
                    agree to keep all Registration Data current and up to date.
                    16. Third Party Content. The Services include content
                    provided by third parties, including from Restaurants, other
                    users and third-party licensors. All statements and/or
                    opinions expressed in any such third-party content, other
                    than the content provided by BookEat, are solely the
                    opinions and the responsibility of the person or entity
                    providing those materials. Such materials do not necessarily
                    reflect the opinion of BookEat. Neither BookEat nor its
                    subsidiaries, affiliates, and their respective directors,
                    officers, employees, agents, service providers, contractors,
                    licensors, suppliers, successors, and assigns have any
                    responsibility or liability whatsoever to you, or any third
                    party, for the content or accuracy of any third-party
                    materials. 17. Third-Party Websites, Applications and
                    Services. For your convenience, the Services may provide
                    links or pointers to third-party sites. We make no
                    representations about any other websites that may be
                    accessed from or through the Services. If you choose to
                    access any such sites, you do so at your own risk. We have
                    no control over the contents of any such third-party sites
                    and accept no responsibility for such sites or for any loss
                    or damage that may arise from your use of them. You are
                    subject to any terms and conditions of such third-party
                    sites. The Services allow users to (i) book reservations and
                    make online orders with Restaurants that are not affiliated
                    with BookEat (the BookEat Partners”). By using the Services,
                    you grant BookEat permission to share account information,
                    reservation and order details, and other information that
                    you provide to BookEat with such BookEat Partners for the
                    purpose of booking reservations or making online orders with
                    such BookEat Partners, and agree to receive emails from such
                    BookEat Partners regarding your reservations or online
                    orders. In addition, you acknowledge that BookEat may
                    receive account information, reservation and order details,
                    and other information that you provide to the BookEat
                    Partners when you utilize the Services via the BookEat
                    Partners. You acknowledge that BookEat is not affiliated
                    with the BookEat Partners, is not responsible for their
                    products and services, and makes no representations,
                    warranties, or guarantees with respect to the BookEat
                    Partners. Your use of the BookEat Partners’ services will be
                    governed by each BookEat Partner’s terms and conditions and
                    privacy policy. 18. Applicable Law and Venue BookEat is
                    headquartered in Toronto, Ontario Canada. You and BookEat
                    both benefit from establishing a predictable legal
                    environment in regard to the Services. Therefore, you and
                    BookEat explicitly agree that all disputes, claims or other
                    matters arising from or relating to your use of the Services
                    shall be exclusively governed by the laws of the Province of
                    Ontario and the federal laws of Canada applicable therein
                    and the courts sitting at Toronto, Ontario regardless of
                    your domicile, residence or physical location. The parties
                    hereto waive any right to trial by jury in respect of any
                    dispute arising from or related to this agreement. Except
                    where prohibited by applicable law, any claim, dispute or
                    controversy (whether in contract or tort, pursuant to
                    statute or regulation, or otherwise, and whether
                    pre-existing, present or future) involving BookEat and
                    arising out of or relating to (a) the Terms; (b) the
                    Services; or (c) oral or written statements, advertisements
                    or promotions relating to the Services or any associated
                    third party services (collectively, a “Claim”), will be
                    referred to and determined by individual arbitration by a
                    single arbitrator (to the exclusion of the courts) sitting
                    at Toronto, Canada in accordance with the Arbitrations Act
                    of Ontario. Arbitration can be initiated by either party
                    delivering to the other party a written Notice of
                    Arbitration invoking this provision. The arbitrator’s
                    authority is limited to claims between you and us alone.
                    Claims may not be joined or consolidated unless you and we
                    consent in writing. An arbitration award and any judgment
                    confirming it will apply only to the specific case and
                    cannot be used in any other case except to enforce the
                    award. The arbitrator’s decision will be final and binding.
                    Each party will bear its own expenses under such
                    arbitration, subject to the authority of the arbitrator to
                    make an award of legal costs in accordance with the
                    arbitrator’s authority. Except where prohibited by
                    applicable law, you waive any right you may have to commence
                    or participate in any class action against BookEat related
                    to any Claim and, where applicable, you also agree to opt
                    out of any class proceedings against BookEat. Without
                    limiting the foregoing, you and we will not have the right
                    to participate in a representative capacity or as a member
                    of any class pertaining to any Claim subject to arbitration.
                    If you are a resident in Mexico, you hereby expressly waive
                    any right to exercise a class action before a Mexican court
                    against BookEat, pursuant to the terms of the Federal Code
                    of Civil Procedure (CódigoFederal de ProcedimientosCiviles)
                    and any other applicable Mexican legislation. If you have a
                    Claim, you should give written notice to arbitrate at the
                    e-mail address specified below or by registered mail to
                    BookEat’s head office. If we have a Claim, we will give you
                    notice to arbitrate at your address provided in your
                    Registration Data. To the extent arbitration as described in
                    the immediately preceding paragraph is prohibited by
                    applicable law, you agree that all Claims shall be heard and
                    resolved in a court of competent subject matter jurisdiction
                    located in Toronto, Ontario. You consent to the personal
                    jurisdiction of such courts over you, stipulate to the
                    fairness and convenience of proceeding in such courts and
                    submit to their exclusive jurisdiction, and covenant not to
                    assert any objection to proceeding in such courts.
                    Notwithstanding the foregoing, BookEat shall be entitled, at
                    its election, to apply to a court of competent jurisdiction
                    for interim or permanent injunctive relief, a mandatory
                    order, restraining order, or other like relief to restrain
                    an actual or threatened breach of this Agreement and
                    BookEat’s rights under it by any party and specifically but
                    not limited to, protection of the intellectual property,
                    information technology, brand, trade-marks, and other
                    proprietary material of BookEat or its suppliers or
                    licensors. 19. Termination/Modification of License and Site
                    Offerings. Notwithstanding any provision of the Terms,
                    BookEat reserves the right, without notice and in its sole
                    discretion, without liability to you, to (a) terminate your
                    right to use the Services, or any portion thereof; (b) block
                    or prevent your future access to and use of all or any
                    portion of the Services, (c) change, suspend or discontinue
                    any aspect of the Services; and (d) impose limits on the
                    Services. If you object to any such changes, your sole
                    recourse shall be to cease using the Services. Continued use
                    of the Services following any such changes shall indicate
                    your acknowledgment of and satisfaction with such changes.
                    You agree that BookEat shall not be liable to you for any
                    termination of this Agreement or for any effects of any
                    termination of this Agreement. You are always free to
                    discontinue your use of the Services at any time. You
                    understand that any termination of your account may involve
                    deletion of any content stored in your account for which
                    BookEat will have no liability whatsoever. 20.
                    Miscellaneous. If any term or provision of these Terms is
                    invalid, illegal or unenforceable in any jurisdiction, such
                    invalidity, illegality or unenforceability shall not affect
                    any other term or provision of these Terms or invalidate or
                    render unenforceable such term or provision in any other
                    jurisdiction. BookEat may assign any or all of its rights
                    hereunder to any party without your consent. You are not
                    permitted to assign any of your rights or obligations
                    hereunder, and any such attempted assignment will be void
                    and unenforceable. The Terms and our Privacy Notice
                    constitute the sole and entire agreement between you and
                    BookEat regarding the Services and supersede all prior and
                    contemporaneous understandings, agreements, representations
                    and warranties, both written and oral, regarding such
                    subject matter. No failure to exercise, or delay in
                    exercising, any right, remedy, power or privilege arising
                    from these Terms operates, or may be construed, as a waiver
                    thereof. No single or partial exercise of any right, remedy,
                    power or privilege hereunder precludes any other or further
                    exercise thereof or the exercise of any other right, remedy,
                    power or privilege. The parties confirm that it is their
                    wish that the Terms, as well as any other documents relating
                    to this Terms, including notices, have been and shall be
                    drawn up in the English language only. Les parties
                    reconnaissent avoir convenue que la présente convention
                    ainsi que tous documents, avis et procédures judiciaires qui
                    pourront être exécutés, donnés ou intentées à la suite des
                    présentes ou ayant un rapport, direct ou indirect, avec la
                    présente convention soient rédigée en anglais. 21.
                    Questions, Comments, Notices. Should you become aware of
                    misuse of the Services, including libelous or defamatory
                    conduct, you must report it to BookEat at support
                    BookEat.com. All other feedback, comments, questions,
                    requests for technical support, and other communications
                    relating to the Services should be directed to support
                    BookEat.com.
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={this.handleTerms.bind(this, false)}
                      data-dismiss="modal"
                    >
                      Decline
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={this.handleTerms.bind(this, true)}
                      data-dismiss="modal"
                    >
                      Accept
                    </button>
                  </div>
                </div>
              </div>
            </div>

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
        </div>
      </MainContainer>
    );
  }
}

export default SignUp;
