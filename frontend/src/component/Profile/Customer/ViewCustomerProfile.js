import React, {Component} from "react";
import MainContainer from "../../Style/MainContainer";
import Parser from "html-react-parser";
import $ from "jquery";
import "./ViewCustomerProfile.css";
import ChangePassword from "../../../component/Forms/Customer/ChangePassword";
import CustomerReservationHistory from "../../Reservation/Customer/CustomerReservationHistory";
import CustomerReviewHistory from "../../Review/Customer/CustomerReviewHistory";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import dataService from "../../../Services/dataService";
import ds from "../../../Services/dataService";
import FullscreenError from "../../Style/FullscreenError";
const regExpPhone = RegExp(
  /^\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})$/,
);

const formValid = ({isError, ...customer}) => {
  let isValid = false;

  Object.values(isError).forEach((val) => {
    if (val.length > 0) {
      isValid = false;
    } else {
      isValid = true;
    }
  });

  Object.values(customer).forEach((val) => {
    if (val === null) {
      isValid = false;
    } else {
      isValid = true;
    }
  });

  return isValid;
};

class ViewCustomerProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: "",
      lastname: "",
      email: "",
      phonenumber: "",
      isError: {
        firstname: "&#160;",
        lastname: "&#160;",
        phonenumber: "&#160;",
      },
      disabled: true,
      resultsErr: false,
      isResLoaded: false,
      emailConfirm: "",
      isModalShow: false,
      modalTitle: "",
      modalBody: "",
      modalButtons: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmitCustomerProfile = this.handleSubmitCustomerProfile.bind(
      this,
    );
    this.deleteAccountModal = this.deleteAccountModal.bind(this);
  }

  deleteAccountModal() {
    var handleFinish = () => {
      var body3 = [<p>Please Wait</p>];
      this.setState({
        isModalShow: true,
        modalTitle: "Delete your account",
        modalBody: body3,
        modalButtons: null,
      });
      dataService
        .deleteAccountCustomer()
        .then((res) => {
          this.setState({
            isDeleted: true,
            isModalShow: true,
            modalTitle: "Delete your account",
            modalBody: <p>You account is deleted.</p>,
            modalButtons: (
              <Button
                variant="primary"
                onClick={() => {
                  window.location.href = "/logout";
                }}
              >
                Finsihed
              </Button>
            ),
          });
        })
        .catch((err) => {
          this.setState({
            isDeleted: true,
            isModalShow: true,
            modalTitle: "Delete your account",
            modalBody: (
              <p>
                Sorry,
                {err.errmsg ? err.errmsg : "We cannot delete your account"}
              </p>
            ),
            modalButtons: (
              <Button
                variant="primary"
                onClick={() => {
                  window.location.href = "/logout";
                }}
              >
                Finsihed
              </Button>
            ),
          });
        });
    };
    var handleNext = () => {
      console.log("Next");
      var body2 = [
        <p>Please explain why do you want to leave BookEat(Optional): </p>,
        <input type="text" id="delemailconfirm" className="form-control" />,
      ];
      var buttons2 = [
        <Button variant="danger" onClick={handleFinish}>
          Delete Account
        </Button>,
      ];
      this.setState({
        isModalShow: true,
        modalTitle: "Delete your account",
        modalBody: body2,
        modalButtons: buttons2,
      });
    };
    var cn =
      this.state.emailConfirm === this.state.email
        ? "form-control is-valid"
        : "form-control is-invalid";
    var body = [
      <p>Please enter your email first: </p>,
      <input
        type="text"
        onChange={(e) => {
          this.setState({emailConfirm: e.target.value}, () => {
            cn =
              this.state.emailConfirm === this.state.email
                ? "form-control is-valid"
                : "form-control is-invalid";
            $("#delemailconfirm")
              .removeClass("form-control is-valid is-invalid")
              .addClass(cn);
            $("#delmailconfirmbtn").prop(
              "disabled",
              this.state.emailConfirm === this.state.email ? "" : "disabled",
            );
          });
        }}
        id="delemailconfirm"
        className="form-control is-invalid"
      />,
    ];
    var buttons = [
      <Button variant="primary" onClick={handleNext} id="delmailconfirmbtn">
        Next
      </Button>,
    ];
    this.setState(
      {
        isModalShow: true,
        modalTitle: "Delete your account",
        modalBody: body,
        modalButtons: buttons,
      },
      () => {
        $("#delmailconfirmbtn").prop(
          "disabled",
          this.state.emailConfirm === this.state.email ? "" : "disabled",
        );
      },
    );
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
      case "phonenumber":
        isError.phonenumber = regExpPhone.test(value)
          ? "&#160;"
          : "Phone Number is invalid";
        break;
      default:
        break;
    }
    this.setState({
      isError,
      [e.target.id]: e.target.value,
    });
  };

  handleSubmitCustomerProfile = (e) => {
    e.preventDefault();
    console.log("submit customer profile");
    if (formValid(this.state)) {
      ds.editCustomerProfile(this.state)
        .then(() => {
          $("#customerProfileResultText")
            .text("Customer profile is edited")
            .removeClass("alert-warning")
            .removeClass("alert-danger")
            .removeClass("alert-success")
            .addClass("alert-success");
        })
        .catch((err) => {
          $("#customerProfileResultText")
            .text("Sorry, " + err)
            .removeClass("alert-warning")
            .removeClass("alert-danger")
            .removeClass("alert-success")
            .addClass("alert-danger");
        });
    } else {
      console.log("Form is invalid!");
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (formValid(this.state)) {
      ds.updateCustomerInformation(this.state).then((customer) => {
        if (customer.data.errcode === 0) {
          $("#updateResultText")
            .text("Profile update is finished.")
            .removeClass("alert-warning")
            .removeClass("alert-danger")
            .removeClass("alert-success")
            .addClass("alert-success");
        } else {
          $("#updateResultText")
            .text("Sorry, " + customer.data.errmsg)
            .removeClass("alert-warning")
            .removeClass("alert-danger")
            .removeClass("alert-success");
        }
      });
    } else {
      console.log("Form is invalid!");
    }
  };

  async componentDidMount() {
    const customer = await ds.getCustomerInformation();
    if (customer) {
      this.setState((state, props) => {
        return {
          firstname:
            typeof customer.firstName != "undefined" ? customer.firstName : "",
          lastname:
            typeof customer.lastName != "undefined" ? customer.lastName : "",
          phonenumber:
            typeof customer.phoneNumber != "undefined"
              ? customer.phoneNumber
              : "",
          email:
            typeof customer.account != "undefined"
              ? customer.account.email
              : "",
        };
      });
    }
    // Avoid spacing on the form
    var t4 = document.getElementById("firstname");
    t4.onkeypress = function (event) {
      if (event.keyCode === 32) return false;
    };
  }

  // Edit profile - disable
  handleClick() {
    this.setState({disabled: !this.state.disabled});
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
            .attr("data-target", "#signResultModal")
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
    const deleteAccount = () => {
      this.deleteAccountModal();
    };

    const handleClose = () => {
      if (this.state.idDeleted) window.location.href = "/logout";
      this.setState({isModalShow: false});
    };
    return (
      <MainContainer>
        {this.state.resultsErr
          ? FullscreenError("An error occured, please try again later")
          : null}
        <div className="container mt-3">
          <div className="card">
            <ul className="nav nav-tabs">
              <li className="nav-item">
                <a
                  className="nav-link active"
                  data-toggle="tab"
                  href="#myProfile"
                >
                  My profile
                </a>
              </li>

              <li className="nav-item">
                <a className="nav-link" data-toggle="tab" href="#myReservation">
                  My reservation
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" data-toggle="tab" href="#myReview">
                  My review
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" data-toggle="tab" href="#password">
                  Password
                </a>
              </li>
            </ul>
          </div>

          <div className="tab-content">
            <div id="myProfile" className="container tab-pane active card">
              <form
                onSubmit={this.handleSubmitCustomerProfile}
                id="profile"
                className="card-body"
                noValidate
              >
                <br />
                <h3>My profile</h3>
                <br />
                <div className="form-group row">
                  <label
                    htmlFor="firstname"
                    className="col-sm-2 col-form-label"
                  >
                    {" "}
                    First Name
                  </label>
                  <div className="col-sm-10">
                    <input
                      type="text"
                      id="firstname"
                      name="firstname"
                      value={this.state.firstname}
                      disabled={this.state.disabled}
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
                  </div>
                </div>
                <div className="form-group row">
                  <label htmlFor="lastname" className="col-md-2 col-form-label">
                    {" "}
                    Last Name
                  </label>
                  <div className="col-md-10">
                    <input
                      type="text"
                      id="lastname"
                      name="lastname"
                      value={this.state.lastname}
                      disabled={this.state.disabled}
                      className={
                        isError.lastname.length > 6
                          ? "is-invalid form-control"
                          : "form-control"
                      }
                      onChange={this.handleChange}
                      required
                    />
                    <span className="invalid-feedback">
                      {Parser(isError.firstname)}
                    </span>
                  </div>
                </div>
                <div className="form-group row">
                  <label
                    htmlFor="phonenumber"
                    className="col-md-2 col-form-label"
                  >
                    {" "}
                    Phone number
                  </label>
                  <div className="col-md-10">
                    <input
                      type="text"
                      id="phonenumber"
                      name="phonenumber"
                      value={this.state.phonenumber}
                      disabled={this.state.disabled}
                      className={
                        isError.phonenumber.length > 6
                          ? "is-invalid form-control"
                          : "form-control"
                      }
                      placeholder="Phone Number"
                      onChange={this.handleChange}
                      required
                    />
                    <span className="invalid-feedback">
                      {Parser(isError.phonenumber)}
                    </span>
                  </div>
                </div>
                <div className="form-group row">
                  <label htmlFor="email" className="col-md-2 col-form-label">
                    {" "}
                    Email
                  </label>
                  <div className="col-md-10">
                    <input
                      type="text"
                      id="email"
                      name="email"
                      value={this.state.email}
                      className="form-control"
                      disabled={true}
                    />
                  </div>
                </div>

                <div className="form-inline">
                  <div className="form-group text-center ">
                    <button
                      id="save_edit_btn"
                      onClick={this.handleClick.bind(this)}
                      type="button"
                      className="btn btn-primary mr-sm-4 "
                    >
                      {this.state.edit ? "Save Change" : "Edit"}
                    </button>
                  </div>
                  <div className="form-group text-center ">
                    {/* <Link to="/"> */}
                    <button
                      type="button"
                      className="btn btn-primary mr-sm-4 "
                      onClick={deleteAccount}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <div id="password" className=" tab-pane card-body">
              <ChangePassword />
            </div>

            <div id="myReservation" className="container tab-pane fade ">
              <CustomerReservationHistory />
            </div>

            <div id="myReview" className="container tab-pane fade">
              <CustomerReviewHistory />
            </div>
          </div>

          {/* edit modal */}
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
                    Edit Profile
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
                    id="customerProfileResultText"
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
        </div>

        <Modal show={this.state.isModalShow} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{this.state.modalTitle} </Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.state.modalBody}</Modal.Body>
          <Modal.Footer>{this.state.modalButtons}</Modal.Footer>
        </Modal>
      </MainContainer>
    );
  }
}

export default ViewCustomerProfile;
