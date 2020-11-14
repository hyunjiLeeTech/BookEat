import React, {Component} from "react";
import dataService from "../../../Services/dataService";
import MainContainer from "../../Style/MainContainer";
import $ from "jquery";
import Layout from "../../RestaurantLayout/Layout";
import {Animated} from "react-animated-css";
import {withRouter} from "react-router";
import moment from "moment";
import FullScrrenLoading from "../../Style/FullscreenLoading";
import {toast} from "react-toastify";
import {AiOutlinePhone} from "react-icons/ai";
import {RiTimeLine, RiMapPin2Line, RiPercentLine} from "react-icons/ri";
import serverAddress from "../../../Services/ServerUrl";
import "./customerReserve.css";
import ImageNotFound from "../../../Image/image-not-available.jpg";

class Reserve extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numofpeople: this.props.match.params.numOfPeople
        ? this.props.match.params.numOfPeople
        : 0,
      dateTime: new Date(),
      date: this.props.match.params.date
        ? moment(new Date(this.props.match.params.date + " 01:00")).format(
            "YYYY-MM-DD",
          )
        : moment().add(1, "d").format("YYYY-MM-DD"),
      time: this.props.match.params.time
        ? this.props.match.params.time
        : "12:30",
      resId: this.props.match.params.id,
      tablestatus: false,
      tables: [],
      formIsVisible: true,
      tableIsVisible: false,
      resultIsVisible: false,
      selectedtableId: "",
      result: {},
      isReservationSuccess: false,
      reservefailMessage: "",
      menuItems: [],
      selectedMenuItems: new Set(),
      isUpdate: this.props.match.params.isUpdate === "true" ? true : false,
      reservation: {},
      reservationId:
        this.props.match.params.isUpdate === "true"
          ? this.props.match.params.reservationId
          : "",
      isLoading: false,
      seletcedMenuItemsFromReservation: [],
      allowModifyMenuItems: true,
      restaurant: {},
      discount: {},
      isRestaurantLoaded: false,
      comments: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.back = this.back.bind(this);
    this.book = this.book.bind(this);
    this.setTableId = this.setTableId.bind(this);
    this.getMenuInfo = this.getMenuInfo.bind(this);
    this.renderMenuItems = this.renderMenuItems.bind(this);
    this.renderForm = this.renderForm.bind(this);
  }

  componentWillMount() {
    this.setState({isLoading: true});
    dataService
      .getRestaurantWithoutAuth(this.state.resId)
      .then((resp) => {
        this.setState({
          restaurant: resp.restaurant,
          discount: resp.discount,
          isRestaurantLoaded: true,
        });

        if (this.state.isUpdate) {
          dataService
            .getReservationById(this.state.reservationId)
            .then((res) => {
              this.setState({
                comments: res.reservation.comments,
                selectedtableId: res.reservation.table,
              });
              dataService
                .getFoodOrder(res.reservation.FoodOrder)
                .then((res) => {
                  this.setState({seletcedMenuItemsFromReservation: res.menus});
                })
                .catch((err) => {
                  toast(err.errmsg ? err.errmsg : "error", {type: "error"});
                })
                .finally(() => {
                  this.setState({isLoading: false});
                });
            })
            .catch((err) => {
              toast(err.errmsg ? err.errmsg : "error", {type: "error"});
              this.setState({isLoading: false});
            });
        } else {
          this.setState({isLoading: false});
        }
      })
      .catch((err) => {
        toast(err.errmsg ? err.errmsg : "error", {type: "error"});
        this.setState({isLoading: false});
      });
  }

  setTableId(id) {
    this.setState({
      selectedtableId: id,
    });
  }

  componentDidMount() {
    this.getMenuInfo();
  }

  handleSubmit(e) {
    // var react = this;
    e.preventDefault();
    this.setState({
      allowModifyMenuItems: false,
    });
    // this.state.allowModifyMenuItems = false;
    var numofpeople = $("#numofpeople").val();
    var resId = this.state.resId;
    var dateTime = new Date(
      Date.parse(this.state.date + " " + this.state.time),
    );
    this.setState({
      resId: resId,
      dateTime: dateTime,
      numofpeople: numofpeople,
    });
    dataService
      .getTableStatus({
        resId: resId,
        numOfPeople: numofpeople,
        dateTime: dateTime,
      })
      .then((res) => {
        this.setState({
          formIsVisible: false,
          tables: res.tables,
        });
        setTimeout(() => {
          this.setState({
            tableIsVisible: true,
          });
        }, 500);
      })
      .catch((err) => {
        console.log(err);
        toast(
          "Error occured. " + err.errmsg
            ? err.errmsg
            : "Please try again later",
        );
      });
  }
  renderForm() {
    const dateChange = (e) => {
      e.preventDefault();
      var value = e.target.value;
      this.setState({date: value});
    };
    const numofpeopleChange = (e) => {
      e.preventDefault();
      var value = e.target.value;
      this.setState({numofpeople: value});
    };
    const comments = (e) => {
      var value = e.target.value;
      this.setState({comments: value});
    };
    return (
      <form
        onSubmit={this.handleSubmit}
        className="needs-validation"
        noValidate
      >
        <div className="page-header text-left" style={{marginTop: "10%"}}>
          <Animated
            animationIn="fadeIn"
            animationOut="fadeOut"
            isVisible={true}
          >
            {this.state.isUpdate ? (
              <h3>Update your reservation</h3>
            ) : (
              <h3>Please provide your information to reserve</h3>
            )}
          </Animated>
        </div>
        <div className="col-xs-12 col-md-12 ">
          <div className="form-group row">
            <label htmlFor="numofpeople" className="col-sm-3 col-form-label">
              {" "}
              Number of people{" "}
            </label>
            <div className="col-sm-6">
              <select
                className="custom-select"
                id="numofpeople"
                name="numofpeople"
                onChange={numofpeopleChange}
                value={this.state.numofpeople}
                required
              >
                <option value=""># Of People</option>
                <option value="1">1 People</option>
                <option value="2">2 People</option>
                <option value="3">3 People</option>
                <option value="4">4 People</option>
                <option value="5">5 People</option>
                <option value="6">6 People</option>
                <option value="7">7 People</option>
                <option value="8">8 People</option>
                <option value="9">9 People</option>
                <option value="10">10 People</option>
                <option value="11">11 People</option>
                <option value="12">12 People</option>
                <option value="13">13 People</option>
                <option value="14">14 People</option>
              </select>
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="date" className="col-sm-3 col-form-label">
              {" "}
              Date{" "}
            </label>
            <div className="col-sm-6">
              <input
                type="date"
                id="date"
                name="date"
                placeholder="date"
                value={this.state.date}
                onChange={dateChange}
                className="form-control"
                required
              />
            </div>
          </div>

          <div className="form-group row">
            <label htmlFor="time" className="col-sm-3 col-form-label">
              {" "}
              Time{" "}
            </label>
            <div className="col-sm-6">
              {this.renderTimeOption(this.state.date)}
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="comments" className="col-sm-3 col-form-label">
              {" "}
              Comments{" "}
            </label>
            <div className="col-sm-6">
              <textarea
                className="col-sm-12"
                rows="4"
                id="comments"
                name="comments"
                value={this.state.comments}
                onChange={comments}
              ></textarea>
            </div>
          </div>
          {this.renderMenuItems(
            this.state.menuItems,
            this.state.seletcedMenuItemsFromReservation,
          )}
          <button
            type="submit"
            className="btn btn-primary"
            data-toggle="modal"
            data-target="#signResultModal"
          >
            Next
          </button>
        </div>
      </form>
    );
  }

  back() {
    //this.state.allowModifyMenuItems = true;
    this.setState({
      formIsVisible: true,
      tableIsVisible: false,
      allowModifyMenuItems: true,
    });
    setTimeout(() => {
      this.setState({
        tablestatus: false,
      });

      while (this.state.tables.length > 0) {
        this.state.tables.pop();
      }
    }, 500);
  }

  book() {
    if (this.state.isUpdate) {
      dataService
        .updateReservation({
          reservationId: this.state.reservationId,
          numOfPeople: this.state.numofpeople,
          dateTime: this.state.dateTime,
          tableId: this.state.selectedtableId,
          comments: this.state.comments,
          menuItems: Array.from(this.state.selectedMenuItems),
        })
        .then((res) => {
          if (res.errcode === 0) {
            this.setState({
              tableIsVisible: false,
              isReservationSuccess: true,
              tablestatus: false,
            });
            setTimeout(() => {
              this.setState({
                resultIsVisible: true,
                result: res.reservation,
              });
            }, 500);
          } else {
            this.setState({
              tableIsVisible: false,
              tablestatus: false,
              isReservationSuccess: false,
              reservefailMessage: res.errmsg,
            });
            setTimeout(() => {
              this.setState({
                resultIsVisible: true,
              });
            }, 500);
          }
        })
        .catch((err) => {
          this.setState({
            tableIsVisible: false,
            tablestatus: false,
            isReservationSuccess: false,
            reservefailMessage: err.errmsg,
          });
          setTimeout(() => {
            this.setState({
              resultIsVisible: true,
            });
          }, 500);
        });
    } else {
      dataService
        .customersReserve({
          numOfPeople: this.state.numofpeople,
          dateTime: this.state.dateTime,
          tableId: this.state.selectedtableId,
          comments: this.state.comments,
          menuItems: Array.from(this.state.selectedMenuItems),
        })
        .then((res) => {
          if (res.errcode === 0) {
            this.setState({
              tableIsVisible: false,
              isReservationSuccess: true,
              tablestatus: false,
            });
            setTimeout(() => {
              this.setState({
                resultIsVisible: true,
                result: res.reservation,
              });
            }, 500);
          } else {
            this.setState({
              tableIsVisible: false,
              tablestatus: false,
              isReservationSuccess: false,
              reservefailMessage: res.errmsg,
            });
            setTimeout(() => {
              this.setState({
                resultIsVisible: true,
              });
            }, 500);
          }
        })
        .catch((err) => {
          this.setState({
            tableIsVisible: false,
            tablestatus: false,
            isReservationSuccess: false,
            reservefailMessage: err.errmsg,
          });
          setTimeout(() => {
            this.setState({
              resultIsVisible: true,
            });
          }, 500);
        });
    }
  }

  getMenuInfo() {
    var id = this.state.resId;
    dataService
      .getMenusCustomer(id)
      .then((res) => {
        this.setState({
          menuItems: res.menus,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  renderTimeOption(date) {
    var options = [
      <option
        key="1"
        {...(new Date(date + " 0:00") < new Date() ? {disabled: true} : {})}
        value="00:00"
      >
        12:00 AM
      </option>,
      <option
        key="2"
        {...(new Date(date + " 0:30") < new Date() ? {disabled: true} : {})}
        value="00:30"
      >
        12:30 AM
      </option>,
      <option
        key="3"
        {...(new Date(date + " 1:00") < new Date() ? {disabled: true} : {})}
        value="01:00"
      >
        1:00 AM
      </option>,
      <option
        key="4"
        {...(new Date(date + " 1:30") < new Date() ? {disabled: true} : {})}
        value="01:30"
      >
        1:30 AM
      </option>,

      <option
        key="5"
        {...(new Date(date + " 7:00") < new Date() ? {disabled: true} : {})}
        value="07:00"
      >
        7:00 AM
      </option>,
      <option
        key="6"
        {...(new Date(date + " 7:30") < new Date() ? {disabled: true} : {})}
        value="07:30"
      >
        7:30 AM
      </option>,
      <option
        key="7"
        {...(new Date(date + " 8:00") < new Date() ? {disabled: true} : {})}
        value="08:00"
      >
        8:00 AM
      </option>,
      <option
        key="8"
        {...(new Date(date + " 8:30") < new Date() ? {disabled: true} : {})}
        value="08:30"
      >
        8:30 AM
      </option>,
      <option
        key="9"
        {...(new Date(date + " 9:00") < new Date() ? {disabled: true} : {})}
        value="09:00"
      >
        9:00 AM
      </option>,
      <option
        key="10"
        {...(new Date(date + " 9:30") < new Date() ? {disabled: true} : {})}
        value="09:30"
      >
        9:30 AM
      </option>,
      <option
        key="11"
        {...(new Date(date + " 10:00") < new Date() ? {disabled: true} : {})}
        value="10:00"
      >
        10:00 AM
      </option>,
      <option
        key="12"
        {...(new Date(date + " 10:30") < new Date() ? {disabled: true} : {})}
        value="10:30"
      >
        10:30 AM
      </option>,
      <option
        key="13"
        {...(new Date(date + " 11:00") < new Date() ? {disabled: true} : {})}
        value="11:00"
      >
        11:00 AM
      </option>,
      <option
        key="14"
        {...(new Date(date + " 11:30") < new Date() ? {disabled: true} : {})}
        value="11:30"
      >
        11:30 AM
      </option>,
      <option
        key="15"
        {...(new Date(date + " 12:00") < new Date() ? {disabled: true} : {})}
        value="12:00"
      >
        12:00 PM
      </option>,
      <option
        key="16"
        {...(new Date(date + " 12:30") < new Date() ? {disabled: true} : {})}
        value="12:30"
      >
        12:30 PM
      </option>,
      <option
        key="17"
        {...(new Date(date + " 13:00") < new Date() ? {disabled: true} : {})}
        value="13:00"
      >
        1:00 PM
      </option>,
      <option
        key="18"
        {...(new Date(date + " 13:30") < new Date() ? {disabled: true} : {})}
        value="13:30"
      >
        1:30 PM
      </option>,
      <option
        key="19"
        {...(new Date(date + " 14:00") < new Date() ? {disabled: true} : {})}
        value="14:00"
      >
        2:00 PM
      </option>,
      <option
        key="20"
        {...(new Date(date + " 14:30") < new Date() ? {disabled: true} : {})}
        value="14:30"
      >
        2:30 PM
      </option>,
      <option
        key="21"
        {...(new Date(date + " 15:00") < new Date() ? {disabled: true} : {})}
        value="15:00"
      >
        3:00 PM
      </option>,
      <option
        key="22"
        {...(new Date(date + " 15:30") < new Date() ? {disabled: true} : {})}
        value="15:30"
      >
        3:30 PM
      </option>,
      <option
        key="23"
        {...(new Date(date + " 16:00") < new Date() ? {disabled: true} : {})}
        value="16:00"
      >
        4:00 PM
      </option>,
      <option
        key="24"
        {...(new Date(date + " 16:30") < new Date() ? {disabled: true} : {})}
        value="16:30"
      >
        4:30 PM
      </option>,
      <option
        key="25"
        {...(new Date(date + " 17:00") < new Date() ? {disabled: true} : {})}
        value="17:00"
      >
        5:00 PM
      </option>,
      <option
        key="26"
        {...(new Date(date + " 17:30") < new Date() ? {disabled: true} : {})}
        value="17:30"
      >
        5:30 PM
      </option>,
      <option
        key="27"
        {...(new Date(date + " 18:00") < new Date() ? {disabled: true} : {})}
        value="18:00"
      >
        6:00 PM
      </option>,
      <option
        key="28"
        {...(new Date(date + " 18:30") < new Date() ? {disabled: true} : {})}
        value="18:30"
      >
        6:30 PM
      </option>,
      <option
        key="29"
        {...(new Date(date + " 19:00") < new Date() ? {disabled: true} : {})}
        value="19:00"
      >
        7:00 PM
      </option>,
      <option
        key="30"
        {...(new Date(date + " 19:30") < new Date() ? {disabled: true} : {})}
        value="19:30"
      >
        7:30 PM
      </option>,
      <option
        key="31"
        {...(new Date(date + " 20:00") < new Date() ? {disabled: true} : {})}
        value="20:00"
      >
        8:00 PM
      </option>,
      <option
        key="32"
        {...(new Date(date + " 20:30") < new Date() ? {disabled: true} : {})}
        value="20:30"
      >
        8:30 PM
      </option>,
      <option
        key="33"
        {...(new Date(date + " 21:00") < new Date() ? {disabled: true} : {})}
        value="21:00"
      >
        9:00 PM
      </option>,
      <option
        key="34"
        {...(new Date(date + " 21:30") < new Date() ? {disabled: true} : {})}
        value="21:30"
      >
        9:30 PM
      </option>,
      <option
        key="35"
        {...(new Date(date + " 22:00") < new Date() ? {disabled: true} : {})}
        value="22:00"
      >
        10:00 PM
      </option>,
      <option
        key="36"
        {...(new Date(date + " 22:30") < new Date() ? {disabled: true} : {})}
        value="22:30"
      >
        10:30 PM
      </option>,
      <option
        key="37"
        {...(new Date(date + " 23:00") < new Date() ? {disabled: true} : {})}
        value="23:00"
      >
        11:00 PM
      </option>,
      <option
        key="38"
        {...(new Date(date + " 23:30") < new Date() ? {disabled: true} : {})}
        value="23:30"
      >
        11:30 PM
      </option>,
    ];

    const timeChange = (e) => {
      e.preventDefault();
      const value = e.target.value;
      this.setState({time: value});
    };

    return (
      <select
        className="custom-select"
        id="time"
        name="time"
        value={this.state.time}
        onChange={timeChange}
        required
      >
        <option value="">Time</option>
        {options}
      </select>
    );
  }

  renderMenuItems(items, checked) {
    var tr = [];
    var reactThis = this;
    var handler = (e) => {
      if (e.target.checked) {
        this.state.selectedMenuItems.add(e.target.value);
      } else {
        this.state.selectedMenuItems.delete(e.target.value);
      }
    };
    for (var item of items) {
      if (checked) {
        var flag = false;
        for (var id of checked) {
          if (
            id._id.toString() === item._id.toString() &&
            this.state.allowModifyMenuItems
          ) {
            tr.push(
              <tr key={id._id + "_m"}>
                <td>
                  <input
                    type="checkbox"
                    id={"menu" + item._id}
                    name={"menu" + item._id}
                    defaultChecked
                    value={item._id}
                    onChange={handler}
                  />
                  <label className="menuItemLable" htmlFor={"menu" + item._id}>
                    {item.menuName}
                  </label>
                </td>
                <td>${item.menuPrice}</td>
                <td>
                  <div style={{height: "4rem", maxWidth: "100%"}}>
                    <img
                      style={{maxHeight: "100%", maxWidth: "100%"}}
                      src={
                        item.menuImageId
                          ? serverAddress + "/getimage/" + item.menuImageId
                          : ImageNotFound
                      }
                      alt="Menu"
                    ></img>
                  </div>
                </td>
              </tr>,
            );
            reactThis.state.selectedMenuItems.add(item._id);
            flag = true;
            break;
          }
        }
        if (flag) continue;
        tr.push(
          <tr key={tr}>
            <td>
              <input
                type="checkbox"
                id={"menu" + item._id}
                name={"menu" + item._id}
                value={item._id}
                onChange={handler}
              />
              <label className="menuItemLable" htmlFor={"menu" + item._id}>
                {item.menuName}
              </label>
            </td>
            <td>${item.menuPrice}</td>
            <td>
              <div style={{height: "4rem", maxWidth: "100%"}}>
                <img
                  style={{maxHeight: "100%", maxWidth: "100%"}}
                  src={
                    item.menuImageId
                      ? serverAddress + "/getimage/" + item.menuImageId
                      : ImageNotFound
                  }
                  alt="mENU"
                ></img>
              </div>
            </td>
          </tr>,
        );
      } else {
        tr.push(
          <tr>
            <td>
              <input
                type="checkbox"
                id={"menu" + item._id}
                name={"menu" + item._id}
                value={item._id}
                onChange={handler}
              />
              <label className="menuItemLable" htmlFor={"menu" + item._id}>
                {item.menuName}
              </label>
            </td>
            <td>${item.menuPrice}</td>
            <td>
              <div style={{height: "4rem", maxWidth: "100%"}}>
                <img
                  style={{maxHeight: "100%", maxWidth: "100%"}}
                  src={
                    item.menuImageId
                      ? serverAddress + "/getimage/" + item.menuImageId
                      : ImageNotFound
                  }
                  alt="Menu"
                ></img>
              </div>
            </td>
          </tr>,
        );
      }
    }

    return (
      <div className="menuItemWrapper">
        <hr />
        <h2>Menu Items</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Picture</th>
            </tr>
          </thead>
          <tbody>{tr}</tbody>
        </table>
      </div>
    );
  }

  render() {
    return (
      //partial code from https://tobiasahlin.com/spinkit/, modified.
      <MainContainer>
        {this.state.isLoading
          ? FullScrrenLoading({type: "balls", color: "#000"})
          : null}
        <div className="row">
          {this.state.formIsVisible ? (
            <div className="row">
              <div className="col-md-8">{this.renderForm()}</div>
              {this.state.isRestaurantLoaded ? (
                <div className="col-md-4">
                  <br />
                  <img
                    src={
                      serverAddress +
                      "/getimage/" +
                      this.state.restaurant.pictures[0].toString()
                    }
                    style={{marginTop: "5%"}}
                    className="col-md-12"
                    alt="Restaurant"
                  />
                  <br />
                  <h4 className="text-center">
                    {this.state.restaurant.resName}
                  </h4>
                  <p>{this.state.restaurant.restaurantDescription}</p>
                  <hr />
                  <h6>
                    <RiMapPin2Line /> Address
                  </h6>
                  <p>
                    {this.state.restaurant.addressId?.streetNum}{" "}
                    {this.state.restaurant.addressId?.streetName}{" "}
                    {this.state.restaurant.addressId?.city}{" "}
                    {this.state.restaurant.addressId?.province}{" "}
                    {this.state.restaurant.addressId?.postalCode}
                  </p>
                  <hr />
                  <h6>
                    <AiOutlinePhone /> Phone Number
                  </h6>
                  <p>{this.state.restaurant.phoneNumber}</p>
                  <hr />
                  <h6>
                    <RiPercentLine /> Promotions
                  </h6>
                  <p>
                    {this.state.discount === null
                      ? "No Promotions at the momemnt"
                      : this.state.discount.isActive
                      ? this.state.discount.percent +
                        "% Off " +
                        this.state.discount.description
                      : "No Promotions at the moment"}
                  </p>
                  <hr />
                  <h6>
                    <RiTimeLine /> Store Time
                  </h6>
                  <p>
                    Monday{" "}
                    {this.state.restaurant.monIsClose
                      ? "Close"
                      : this.state.restaurant.monOpenTimeId.storeTimeName}{" "}
                    -{" "}
                    {this.state.restaurant.monIsClose
                      ? "Close"
                      : this.state.restaurant.monOpenTimeId.storeTimeName}
                  </p>
                  <p>
                    Tuesday{" "}
                    {this.state.restaurant.tueIsClose
                      ? "Close"
                      : this.state.restaurant.tueOpenTimeId.storeTimeName}{" "}
                    -{" "}
                    {this.state.restaurant.tueIsClose
                      ? "Close"
                      : this.state.restaurant.tueOpenTimeId.storeTimeName}
                  </p>
                  <p>
                    Wednesday{" "}
                    {this.state.restaurant.wedIsClose
                      ? "Close"
                      : this.state.restaurant.wedOpenTimeId.storeTimeName}{" "}
                    -{" "}
                    {this.state.restaurant.wedIsClose
                      ? "Close"
                      : this.state.restaurant.wedOpenTimeId.storeTimeName}
                  </p>
                  <p>
                    Thursday{" "}
                    {this.state.restaurant.thuIsClose
                      ? "Close"
                      : this.state.restaurant.thuOpenTimeId.storeTimeName}{" "}
                    -{" "}
                    {this.state.restaurant.thuIsClose
                      ? "Close"
                      : this.state.restaurant.thuCloseTimeId.storeTimeName}
                  </p>
                  <p>
                    Friday{" "}
                    {this.state.restaurant.friIsClose
                      ? "Close"
                      : this.state.restaurant.friOpenTimeId.storeTimeName}{" "}
                    -{" "}
                    {this.state.restaurant.friIsClose
                      ? "Close"
                      : this.state.restaurant.friCloseTimeId.storeTimeName}
                  </p>
                  <p>
                    Saturday{" "}
                    {this.state.restaurant.satIsClose
                      ? "Close"
                      : this.state.restaurant.satOpenTimeId.storeTimeName}{" "}
                    -{" "}
                    {this.state.restaurant.satIsClose
                      ? "Close"
                      : this.state.restaurant.satCloseTimeId.storeTimeName}
                  </p>
                  <p>
                    Sunday{" "}
                    {this.state.restaurant.sunIsClose
                      ? "Close"
                      : this.state.restaurant.sunOpenTimeId.storeTimeName}{" "}
                    -{" "}
                    {this.state.restaurant.sunIsClose
                      ? "Close"
                      : this.state.restaurant.sunCloseTimeId.storeTimeName}
                  </p>
                </div>
              ) : (
                <div className="col-md-4"></div>
              )}
            </div>
          ) : null}

          {this.state.tableIsVisible ? (
            <div className="col-xs-12 col-md-12">
              <div className="page-header text-left" style={{marginTop: "5%"}}>
                <h3>Please Select a table</h3>
              </div>
              <Layout tables={this.state.tables} setTableId={this.setTableId} />
              <div className="row">
                <div className="col-md-3">
                  <button className="btn btn-warning" onClick={this.back}>
                    Back
                  </button>
                </div>

                <div className="col-md-6"></div>

                <div className="col-md-3">
                  <button
                    className="btn btn-primary"
                    disabled={this.state.selectedtableId === "" ? true : false}
                    onClick={this.book}
                  >
                    Book
                  </button>
                </div>
              </div>
            </div>
          ) : null}
          {this.state.resultIsVisible ? (
            <div className="page-header text-left" style={{marginTop: "5%"}}>
              {this.state.isReservationSuccess ? (
                <div>
                  <h3>Thanks for reserving</h3>
                  <h4>This is your reservation:</h4>
                  <p>
                    Customer Name:{" "}
                    {this.state.result.customer.firstName +
                      " " +
                      this.state.result.customer.lastName}
                  </p>
                  <p>Time: {new Date(this.state.result.dateTime).toString()}</p>
                  <p>Restaurant: {this.state.result.restaurant.resName}</p>
                  <p>Number of People: {this.state.result.numOfPeople}</p>
                  <p>
                    Restaurant Phone Number:{" "}
                    {this.state.result.restaurant.businessNum}
                  </p>
                </div>
              ) : (
                <div>
                  <h3>Reservation failed</h3>

                  <p>{this.state.reservefailMessage}</p>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </MainContainer>
    );
  }
}

export default withRouter(Reserve);
