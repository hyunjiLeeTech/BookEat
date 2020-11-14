import React, {Component} from "react";
import MainContainer from "../../Style/MainContainer";
import Parser from "html-react-parser";
import $ from "jquery";
import ChangePassword from "../../Forms/Customer/ChangePassword";
import RestaurantReservation from "../../Reservation/Restaurant/RestaurantReservation";
import Menu from "../../Menu/Menu";
import ds from "../../../Services/dataService";
import FullscreenError from "../../Style/FullscreenError";
import ViewReview from "../../Review/Restaurant/ViewReview";

//Validation
const regExpEmail = RegExp(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/);

const regExpPhone = RegExp(
  /^\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})$/,
);

const formValid = ({isError, ...rest}) => {
  let isValid = false;

  Object.values(isError).forEach((val) => {
    if (val.length !== "&#160;") {
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

class ManagerProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phonenumber: "",
      email: "",
      firstName: "",
      lastName: "",
      isError: {
        phonenumber: "&#160;",
        email: "&#160;",
        firstName: "&#160;",
        lastName: "&#160;",
      },
      resultsErr: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    e.preventDefault();
    const {name, value} = e.target;
    let isError = this.state.isError;
    switch (name) {
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
      case "firstName":
        isError.firstName =
          value.length >= 2 && value.length <= 32
            ? "&#160;"
            : "Atleast 2 character required";

        break;
      case "lastName":
        isError.lastName =
          value.length >= 2 && value.length <= 32
            ? "&#160;"
            : "Atleast 2 character required";
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
      ds.editManagerProfile(this.state);
    } else {
      console.log("Form is invalid!");
    }
    try {
      $("#manProfileResultText")
        .text("Profiled is edited")
        .removeClass("alert-warning")
        .removeClass("alert-danger")
        .removeClass("alert-success")
        .addClass("alert-success");
    } catch (err) {
      $("#manProfileResultText")
        .text("Sorry, " + err)
        .removeClass("alert-warning")
        .removeClass("alert-danger")
        .removeClass("alert-success")
        .addClass("alert-danger");
    }
  };

  async componentDidMount() {
    //for displaying customer profile
    const manager = await ds.getManagerInformation();

    if (manager) {
      this.setState((state, props) => {
        return {
          firstName:
            typeof manager.firstname != "undefined" ? manager.firstname : "",
          lastName:
            typeof manager.lastname != "undefined" ? manager.lastname : "",
          phonenumber:
            typeof manager.phonenumber != "undefined"
              ? manager.phonenumber
              : "",
          email:
            typeof manager.accountId != "undefined"
              ? manager.accountId.email
              : "",
        };
      });
    }

    //Avoid spacing on the form

    var t2 = document.getElementById("email");
    t2.onkeypress = function (e) {
      if (e.keyCode === 32) return false;
    };

    var t6 = document.getElementById("phonenumber");
    t6.onkeypress = function (e) {
      if (e.keyCode === 32) return false;
    };

    var t1 = document.getElementById("firstName");
    t1.onkeypress = function (e) {
      if (e.keyCode === 32) return false;
    };

    //Disable Button
    $(document).ready(function () {
      //Form Disable
      if ($("#manForm :input").prop("disabled", true)) {
        $("#editButton").click(function () {
          $("#manForm :input").prop("disabled", false);
          //Disable Email
          $("#email").prop("disabled", true);
        });
      }
    });
  }

  //  Edit profile disable button
  handleEdit() {
    this.setState({
      disabled: !this.state.disabled,
    });
    this.changeText();
  }

  //Edit profile - button
  changeText() {
    this.setState(
      (state) => {
        return {
          edit: !state.edit,
        };
      },
      () => {
        if (this.state.edit) {
          $("#save_edit_btn")
            .attr("data-toggle", "modal")
            .attr("data-target", "#manProfileResultModal")
            .attr("type", "button");
        } else {
          $("#save_edit_btn")
            .attr("data-toggle", "")
            .attr("data-target", "")
            .attr("type", "");
        }
      },
    );
  }

  render() {
    const {isError} = this.state;
    return (
      <MainContainer>
        {this.state.resultsErr
          ? FullscreenError("An error occured, please try again later")
          : null}
        <div className="card">
          <div className="card-header">
            <ul className="nav nav-tabs card-header-tabs">
              <li className="nav-item">
                <a
                  className="nav-link active"
                  data-toggle="tab"
                  role="tab"
                  href="#managerProfile"
                  aria-controls="managerProfile"
                  aria-selected="true"
                >
                  My Profile
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  data-toggle="tab"
                  role="tab"
                  href="#menu"
                  aria-controls="menu"
                  aria-selected="false"
                >
                  Menu
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  data-toggle="tab"
                  role="tab"
                  href="#reservation"
                  aria-controls="reservation"
                  aria-selected="false"
                >
                  Reservation
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  data-toggle="tab"
                  role="tab"
                  href="#manReview"
                  aria-controls="manReview"
                  aria-selected="false"
                >
                  Review
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  data-toggle="tab"
                  role="tab"
                  href="#changePassword"
                  aria-controls="changePassword"
                  aria-selected="false"
                >
                  Password
                </a>
              </li>
            </ul>
          </div>

          <div className="card-body">
            <div className="tab-content">
              {/* Start Manager profile */}
              <div
                id="managerProfile"
                className="tab-pane fade show active"
                role="tabpanel"
                aria-labelledby="managerProfile"
              >
                <form onSubmit={this.handleSubmit} noValidate>
                  <div id="manForm">
                    <div className="form-group row">
                      <label
                        htmlFor="streetnumber"
                        className="col-sm-2 col-form-label"
                      >
                        {" "}
                        First Name
                      </label>
                      <div className="col-sm-4">
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={this.state.firstName}
                          placeholder="First Name"
                          className={
                            isError.firstName.length > 6
                              ? "is-invalid form-control"
                              : "form-control"
                          }
                          onChange={this.handleChange}
                          disabled={!this.state.disabled}
                          required
                        />
                        <span className="invalid-feedback">
                          {Parser(isError.firstName)}
                        </span>
                      </div>

                      <label
                        htmlFor="streetname"
                        className="col-sm-2 col-form-label"
                      >
                        {" "}
                        Last Name
                      </label>
                      <div className="col-sm-4">
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={this.state.lastName}
                          placeholder="Last Name"
                          className={
                            isError.lastName.length > 6
                              ? "is-invalid form-control"
                              : "form-control"
                          }
                          onChange={this.handleChange}
                          disabled={!this.state.disabled}
                          required
                        />
                        <span className="invalid-feedback">
                          {Parser(isError.lastName)}
                        </span>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        htmlFor="phonenumber"
                        className="col-sm-2 col-form-label"
                      >
                        {" "}
                        Phone Number
                      </label>
                      <div className="col-md-4">
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
                          disabled={!this.state.disabled}
                          required
                        />
                        <span className="invalid-feedback">
                          {Parser(isError.phonenumber)}
                        </span>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        htmlFor="email"
                        className="col-sm-2 col-form-label"
                      >
                        {" "}
                        Email
                      </label>
                      <div className="col-md-10">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={this.state.email}
                          placeholder="Email"
                          className={
                            isError.email.length > 6
                              ? "is-invalid form-control"
                              : "form-control"
                          }
                          onChange={this.handleChange}
                          disabled={true}
                          required
                        />
                        <span className="invalid-feedback">
                          {Parser(isError.email)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="form-inline">
                    <div className="form-group text-center ">
                      <button
                        id="save_edit_btn"
                        onClick={this.handleEdit.bind(this)}
                        type="button"
                        className="btn btn-primary mr-sm-4 "
                      >
                        {this.state.edit ? "Save Change" : "Edit"}
                      </button>
                    </div>
                  </div>

                  {/* Restaurant profile result Modal */}
                  <div
                    className="modal fade"
                    id="manProfileResultModal"
                    tabIndex="-1"
                    role="dialog"
                    aria-labelledby="manProfileResultModalLabel"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog" role="document">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5
                            className="modal-title"
                            id="manProfileResultModalLabel"
                          >
                            Manager Profile
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
                          <p
                            className="alert alert-warning"
                            id="manProfileResultText"
                          >
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
                </form>
              </div>
              {/* End Manager Profile */}

              {/* Start Password */}
              <div
                id="changePassword"
                className="tab-pane fade"
                role="tabpanel"
                aria-labelledby="changePassword"
              >
                <ChangePassword />
              </div>
              {/* End Password */}

              {/* Start Reservation */}
              <div
                id="reservation"
                className="tab-pane fade"
                role="tabpanel"
                aria-labelledby="reservation"
              >
                <RestaurantReservation />
              </div>
              {/* End Reservation */}

              {/* Start menu */}
              <div
                id="menu"
                className="tab-pane fade"
                role="tabpanel"
                aria-labelledby="menu"
              >
                <Menu />
              </div>
              {/* End mENU */}

              {/* Start of Review*/}

              <div
                id="manReview"
                className="tab-pane fade"
                role="tabpanel"
                aria-labelledby="manReview"
              >
                <ViewReview />
              </div>

              {/* End of Review Account */}
            </div>
          </div>
        </div>
      </MainContainer>
    );
  }
}

export default ManagerProfile;
