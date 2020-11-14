import React, {Component} from "react";
import MainContainer from "../../Style/MainContainer";
import "./RestaurantProfile.css";
import Parser from "html-react-parser";
import $ from "jquery";
import authService from "../../../Services/AuthService";
import ds from "../../../Services/dataService";
import Manager from "../Manager/Manager";
import ChangePassword from "../../Forms/Customer/ChangePassword";
import Menu from "../../Menu/Menu";
import RestaurantReservation from "../../Reservation/Restaurant/RestaurantReservation";
import RestaurantLayout from "../../RestaurantLayout/RestaurantLayout";
import FullscreenError from "../../Style/FullscreenError";
import ViewReview from "../../Review/Restaurant/ViewReview";
import serverAddress from "../../../Services/ServerUrl";
import Discount from "../../Restaurant/Discount";
import dataService from "../../../Services/dataService";

//Validation
const regExpEmail = RegExp(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/);

const regExpPhone = RegExp(
  /^\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})$/,
);

const regExpPostal = RegExp(
  /^(?!.*[DFIOQU])[A-VXY][0-9][A-Z] ?[0-9][A-Z][0-9]$/,
);

const regExpNumbers = RegExp(/^[0-9]*$/);

const formValid = ({isError, ...rest}) => {
  let isValid = false;
  Object.values(isError).forEach((val) => {
    if (val !== "&#160;") {
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

class RestaurantProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //user
      email: "",
      phonenumber: "",
      businessnumber: "",

      resname: "",

      //address
      streetnumber: "",
      streetname: "",
      province: "",
      city: "",
      postalcode: "",

      //cuisine style
      cuisineStyle: "",

      //category
      category: "",

      //price range
      priceRange: "",

      // eating time
      eatingTime: "",

      // open or close
      monIsClose: false,
      tueIsClose: false,
      wedIsClose: false,
      thuIsClose: false,
      friIsClose: false,
      satIsClose: false,
      sunIsClose: false,

      // open and close time
      monOpenTime: "",
      monCloseTime: "",
      tueOpenTime: "",
      tueCloseTime: "",
      wedOpenTime: "",
      wedCloseTime: "",
      thuOpenTime: "",
      thuCloseTime: "",
      friOpenTime: "",
      friCloseTime: "",
      satOpenTime: "",
      satCloseTime: "",
      sunOpenTime: "",
      sunCloseTime: "",
      description: "",
      picture: "",
      pictures: "",
      resPictures: [],
      isPicture: false,

      //Discount
      contentTable: false,
      resultsErr: false,
      isResLoaded: false,
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
        cuisineStyle: "&#160;",
        category: "&#160;",
        priceRange: "&#160;",
        description: "&#160;",
        picture: "&#160;",
        eatingTime: "&#160;",
      },
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmitResProfile = this.handleSubmitResProfile.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onImageChange = this.onImageChange.bind(this);
    this.handleDeletePicture = this.handleDeletePicture.bind(this);
    this.editResProfileWithPictures = this.editResProfileWithPictures.bind(
      this,
    );
    this.handleNotOpen = this.handleNotOpen.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.picture !== this.state.picture) {
      // this.state.isPicture = true;
      this.setState({
        isPicture: true,
      });
    }
  }

  async editResProfileWithPictures(state) {
    var formData = new FormData();
    Array.from(state.pictures).forEach((f) => {
      formData.append("pictures[]", f);
    });
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    let pictureIds = await ds.addPictures(formData, config);
    var resPictureIds = [];
    for (var i = 0; i < pictureIds.length; i++) {
      resPictureIds.push(pictureIds[i].filename);
    }
    state.isPicture = true;
    state.resPictures = resPictureIds;
    await ds.editRestaurantProfile(state);
  }

  async handleDeletePicture(imageId) {
    await ds
      .updateResPictures({id: imageId})
      .then((pictures) => {
        this.setState({
          resPictures: pictures,
        });
        $("#deletePictureModalText")
          .text("Picture is deleted")
          .removeClass("alert-warning")
          .removeClass("alert-danger")
          .removeClass("alert-success")
          .addClass("alert-success");
      })
      .catch((err) => {
        $("#deletePictureModalText")
          .text("Sorry, " + err.errmsg)
          .removeClass("alert-warning")
          .removeClass("alert-danger")
          .removeClass("alert-success")
          .addClass("alert-danger");
      });
  }

  onImageChange = (event, index) => {
    let arrayImage = [];
    Array.from(event.target.files).forEach((data) => {
      let url = URL.createObjectURL(data);
      arrayImage.push(url);
    });
    if (event.target.files && event.target.files[0]) {
      this.setState({
        ...this.state,
        picture: arrayImage,
        pictures: event.target.files,
      });
    } else {
      console.log("Something Wrong!");
    }
  };

  handleChange(e) {
    e.preventDefault();
    const {name, value} = e.target;
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
      case "description":
        isError.description =
          value.length >= 1 && value.length <= 255
            ? "&#160;"
            : "Atleast write something";
        break;
      case "discdescription":
        isError.discdescription = regExpNumbers.test(value)
          ? "&#160;"
          : "Please put some promotional numbers";
        break;
      case "promdescription":
        isError.promdescription =
          value.length >= 1 && value.length <= 255
            ? "&#160;"
            : "Atleast write something";
        break;
      default:
        break;
    }
    this.setState({
      [e.target.id]: e.target.value,
    });
  }

  handleSubmitResProfile = async (e) => {
    e.preventDefault();
    if (formValid(this.state)) {
      if (this.state.isPicture) {
        this.editResProfileWithPictures(this.state).then((result) => {
          try {
            $("#resProfileResultText")
              .text("Profiled is edited")
              .removeClass("alert-warning")
              .removeClass("alert-danger")
              .removeClass("alert-success")
              .addClass("alert-success");
          } catch (err) {
            $("#resProfileResultText")
              .text("Sorry, " + err.errmsg)
              .removeClass("alert-warning")
              .removeClass("alert-danger")
              .removeClass("alert-success")
              .addClass("alert-danger");
          }
        });
      } else {
        ds.editRestaurantProfile(this.state).then((result) => {
          try {
            $("#resProfileResultText")
              .text("Profiled is edited")
              .removeClass("alert-warning")
              .removeClass("alert-danger")
              .removeClass("alert-success")
              .addClass("alert-success");
          } catch (err) {
            $("#resProfileResultText")
              .text("Sorry, " + err.errmsg)
              .removeClass("alert-warning")
              .removeClass("alert-danger")
              .removeClass("alert-success")
              .addClass("alert-danger");
          }
        });
      }
    } else {
      console.log("Form is invalid!");
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (formValid(this.state)) {
      ds.createManagerAccount(this.state);
    } else {
      console.log("Form is invalid!");
    }
  };

  async componentDidMount() {
    const usr = authService.getCurrentUser();
    const restaurant = await ds.getRestaurantInformation();

    this.setState((state, props) => {
      return {
        resname:
          typeof restaurant.resName != "undefined" ? restaurant.resName : "",
        phonenumber:
          typeof restaurant.phoneNumber != "undefined"
            ? restaurant.phoneNumber
            : "",
        email: typeof usr.user.email != "undefined" ? usr.user.email : "",
        businessnumber:
          typeof restaurant.businessNum != "undefined"
            ? restaurant.businessNum
            : "",
        postalcode:
          typeof restaurant.addressId != "undefined"
            ? restaurant.addressId.postalCode
            : "",
        streetname:
          typeof restaurant.addressId != "undefined"
            ? restaurant.addressId.streetName
            : "",
        streetnumber:
          typeof restaurant.addressId != "undefined"
            ? restaurant.addressId.streetNum
            : "",
        city:
          typeof restaurant.addressId != "undefined"
            ? restaurant.addressId.city
            : "",
        province:
          typeof restaurant.addressId != "undefined"
            ? restaurant.addressId.province
            : "",
        description:
          typeof restaurant.restaurantDescription != "undefined"
            ? restaurant.restaurantDescription
            : "",
        eatingTime: restaurant.eatingTime ? restaurant.eatingTime : "",
        cuisineStyle:
          typeof restaurant.cuisineStyleId != "undefined"
            ? restaurant.cuisineStyleId.cuisineVal
            : "",
        category:
          typeof restaurant.categoryId != "undefined"
            ? restaurant.categoryId.categoryVal
            : "",
        priceRange:
          typeof restaurant.priceRangeId != "undefined"
            ? restaurant.priceRangeId.priceRangeName
            : "",
        monOpenTime:
          typeof restaurant.monOpenTimeId != "undefined"
            ? restaurant.monOpenTimeId.storeTimeVal
            : "",
        tueOpenTime:
          typeof restaurant.tueOpenTimeId != "undefined"
            ? restaurant.tueOpenTimeId.storeTimeVal
            : "",
        wedOpenTime:
          typeof restaurant.wedOpenTimeId != "undefined"
            ? restaurant.wedOpenTimeId.storeTimeVal
            : "",
        thuOpenTime:
          typeof restaurant.thuOpenTimeId != "undefined"
            ? restaurant.thuOpenTimeId.storeTimeVal
            : "",
        friOpenTime:
          typeof restaurant.friOpenTimeId != "undefined"
            ? restaurant.friOpenTimeId.storeTimeVal
            : "",
        satOpenTime:
          typeof restaurant.satOpenTimeId != "undefined"
            ? restaurant.satOpenTimeId.storeTimeVal
            : "",
        sunOpenTime:
          typeof restaurant.sunOpenTimeId != "undefined"
            ? restaurant.sunOpenTimeId.storeTimeVal
            : "",
        monCloseTime:
          typeof restaurant.monCloseTimeId != "undefined"
            ? restaurant.monCloseTimeId.storeTimeVal
            : "",
        tueCloseTime:
          typeof restaurant.tueCloseTimeId != "undefined"
            ? restaurant.tueCloseTimeId.storeTimeVal
            : "",
        wedCloseTime:
          typeof restaurant.wedCloseTimeId != "undefined"
            ? restaurant.wedCloseTimeId.storeTimeVal
            : "",
        thuCloseTime:
          typeof restaurant.thuCloseTimeId != "undefined"
            ? restaurant.thuCloseTimeId.storeTimeVal
            : "",
        friCloseTime:
          typeof restaurant.friCloseTimeId != "undefined"
            ? restaurant.friCloseTimeId.storeTimeVal
            : "",
        satCloseTime:
          typeof restaurant.satCloseTimeId != "undefined"
            ? restaurant.satCloseTimeId.storeTimeVal
            : "",
        sunCloseTime:
          typeof restaurant.sunCloseTimeId != "undefined"
            ? restaurant.sunCloseTimeId.storeTimeVal
            : "",
        resPictures:
          typeof restaurant.pictures != "undefined" ? restaurant.pictures : "",
        monIsClose: restaurant.monIsClose ? true : false,
        tueIsClose: restaurant.tueIsClose ? true : false,
        wedIsClose: restaurant.wedIsClose ? true : false,
        thuIsClose: restaurant.thuIsClose ? true : false,
        friIsClose: restaurant.friIsClose ? true : false,
        satIsClose: restaurant.satIsClose ? true : false,
        sunIsClose: restaurant.sunIsClose ? true : false,
      };
    });

    // Avoid spacing on the form
    var t1 = document.getElementById("streetnumber");
    t1.onkeypress = function (event) {
      if (event.keyCode === 32) return false;
    };
    var t2 = document.getElementById("email");
    t2.onkeypress = function (e) {
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

    //Disable Button
    $(document).ready(function () {
      $("#mondisablebutton").click(function () {
        if ($("#monOpenTime").prop("disabled")) {
          $("#monOpenTime").prop("disabled", false);
          $("#monCloseTime").prop("disabled", false);
        } else {
          $("#monOpenTime").prop("disabled", true);
          $("#monCloseTime").prop("disabled", true);
        }
      });
      $("#tuedisablebutton").click(function () {
        if ($("#tueOpenTime").prop("disabled")) {
          $("#tueOpenTime").prop("disabled", false);
          $("#tueCloseTime").prop("disabled", false);
        } else {
          $("#tueOpenTime").prop("disabled", true);
          $("#tueCloseTime").prop("disabled", true);
        }
      });

      $("#weddisablebutton").click(function () {
        if ($("#wedOpenTime").prop("disabled")) {
          $("#wedOpenTime").prop("disabled", false);
          $("#wedCloseTime").prop("disabled", false);
        } else {
          $("#wedOpenTime").prop("disabled", true);
          $("#wedCloseTime").prop("disabled", true);
        }
      });

      $("#thudisablebutton").click(function () {
        if ($("#thuOpenTime").prop("disabled")) {
          $("#thuOpenTime").prop("disabled", false);
          $("#thuCloseTime").prop("disabled", false);
        } else {
          $("#thuOpenTime").prop("disabled", true);
          $("#thuCloseTime").prop("disabled", true);
        }
      });

      $("#fridisablebutton").click(function () {
        if ($("#friOpenTime").prop("disabled")) {
          $("#friOpenTime").prop("disabled", false);
          $("#friCloseTime").prop("disabled", false);
        } else {
          $("#friOpenTime").prop("disabled", true);
          $("#friCloseTime").prop("disabled", true);
        }
      });

      $("#satdisablebutton").click(function () {
        if ($("#satOpenTime").prop("disabled")) {
          $("#satOpenTime").prop("disabled", false);
          $("#satCloseTime").prop("disabled", false);
        } else {
          $("#satOpenTime").prop("disabled", true);
          $("#satCloseTime").prop("disabled", true);
        }
      });

      $("#sundisablebutton").click(function () {
        if ($("#sunOpenTime").prop("disabled")) {
          $("#sunOpenTime").prop("disabled", false);
          $("#sunCloseTime").prop("disabled", false);
        } else {
          $("#sunOpenTime").prop("disabled", true);
          $("#sunCloseTime").prop("disabled", true);
        }
      });
    });
  }

  //Manager Create Button Form

  onClick() {
    const usr = authService.getCurrentUser();
    this.setState({
      accountId: usr.user._id,
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
            .attr("data-target", "#resProfileResultModal")
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

  openTime() {
    var open = [
      <option key="7am" value="7am">
        7:00 AM
      </option>,
      <option key="730am" value="730am">
        7:30 AM
      </option>,
      <option key="8am" value="8am">
        8:00 AM
      </option>,
      <option key="830am" value="830am">
        8:30 AM
      </option>,
      <option key="9am" value="9am">
        9:00 AM
      </option>,
      <option key="930am" value="930am">
        9:30 AM
      </option>,
      <option key="10am" value="10am">
        10:00 AM
      </option>,
      <option key="1030am" value="1030am">
        10:30 AM
      </option>,
      <option key="11am" value="11am">
        11:00 AM
      </option>,
      <option key="1130am" value="1130am">
        11:30 AM
      </option>,
      <option key="12pm" value="12pm">
        12:00 PM
      </option>,
      <option key="1230pm" value="1230pm">
        12:30 PM
      </option>,
      <option key="1pm" value="1pm">
        1:00 PM
      </option>,
      <option key="130pm" value="130pm">
        1:30 PM
      </option>,
      <option key="2pm" value="2pm">
        2:00 PM
      </option>,
      <option key="230pm" value="230pm">
        2:30 PM
      </option>,
      <option key="3pm" value="3pm">
        3:00 PM
      </option>,
      <option key="330pm" value="330pm">
        3:30 PM
      </option>,
      <option key="4pm" value="4pm">
        4:00 PM
      </option>,
      <option key="430pm" value="430pm">
        4:30 PM
      </option>,
      <option key="5pm" value="5pm">
        5:00 PM
      </option>,
      <option key="530pm" value="530pm">
        5:30 PM
      </option>,
      <option key="6pm" value="6pm">
        6:00 PM
      </option>,
      <option key="630pm" value="630pm">
        6:30 PM
      </option>,
      <option key="7pm" value="7pm">
        7:00 PM
      </option>,
      <option key="730pm" value="730pm">
        7:30 PM
      </option>,
      <option key="8pm" value="8pm">
        8:00 PM
      </option>,
      <option key="830pm" value="830pm">
        8:30 PM
      </option>,
    ];

    return open;
  }

  closeTime() {
    var close = [
      <option key="9a" value="9am">
        9:00 AM
      </option>,
      <option key="930a" value="930am">
        9:30 AM
      </option>,
      <option key="10a" value="10am">
        {" "}
        10:00 AM
      </option>,
      <option key="1030a" value="1030am">
        10:30 AM
      </option>,
      <option key="11a" value="11am">
        11:00 AM
      </option>,
      <option key="113a" value="1130am">
        11:30 AM
      </option>,
      <option key="12a" value="12pm">
        12:00 PM
      </option>,
      <option key="123a" value="1230pm">
        12:30 PM
      </option>,
      <option key="1p" value="1pm">
        1:00 PM
      </option>,
      <option key="13p" value="130pm">
        1:30 PM
      </option>,
      <option key="2q" value="2pm">
        2:00 PM
      </option>,
      <option key="23q" value="230pm">
        2:30 PM
      </option>,
      <option key="3q" value="3pm">
        3:00 PM
      </option>,
      <option key="333q" value="330pm">
        3:30 PM
      </option>,
      <option key="4q" value="4pm">
        4:00 PM
      </option>,
      <option key="43q" value="430pm">
        4:30 PM
      </option>,
      <option key="5q" value="5pm">
        5:00 PM
      </option>,
      <option key="53a" value="530pm">
        5:30 PM
      </option>,
      <option key="6q" value="6pm">
        6:00 PM
      </option>,
      <option key="332q" value="630pm">
        6:30 PM
      </option>,
      <option key="7q" value="7pm">
        7:00 PM
      </option>,
      <option key="39q" value="730pm">
        7:30 PM
      </option>,
      <option key="8q" value="8pm">
        8:00 PM
      </option>,
      <option key="83q" value="830pm">
        8:30 PM
      </option>,
      <option key="9p" value="9pm">
        9:00 PM
      </option>,
      <option key="93p" value="930pm">
        9:30 PM
      </option>,
      <option key="10p" value="10pm">
        10:00 PM
      </option>,
      <option key="103p" value="1030pm">
        10:30 PM
      </option>,
      <option key="11m" value="11pm">
        11:00 PM
      </option>,
      <option key="1130p" value="1130pm">
        11:30 PM
      </option>,
      <option key="12p" value="12am">
        12:00 AM
      </option>,
      <option key="1230p" value="1230am">
        12:30 AM
      </option>,
      <option key="1kp" value="1am">
        1:00 AM
      </option>,
      <option key="130kp" value="130am">
        1:30 AM
      </option>,
    ];
    return close;
  }

  handleNotOpen = (day) => {
    if (day === "mon") {
      if (this.state.monIsClose === true) {
        //this.state.monIsClose = false;
        this.setState({
          monIsClose: false,
        });
        $("#monOpenTime").prop("disabled", false);
        $("#monCloseTime").prop("disabled", false);
      } else {
        //this.state.monIsClose = true;
        this.setState({
          monIsClose: true,
        });
        $("#monOpenTime").prop("disabled", true);
        $("#monCloseTime").prop("disabled", true);
      }
    } else if (day === "tue") {
      if (this.state.tueIsClose === true) {
        //this.state.tueIsClose = false;
        this.setState({
          tueIsClose: false,
        });
        $("#tueOpenTime").prop("disabled", false);
        $("#tueCloseTime").prop("disabled", false);
      } else {
        // this.state.tueIsClose = true;
        this.setState({
          tueIsClose: true,
        });
        $("#tueOpenTime").prop("disabled", true);
        $("#tueCloseTime").prop("disabled", true);
      }
    } else if (day === "wed") {
      if (this.state.wedIsClose === true) {
        // this.state.wedIsClose = false;
        this.setState({
          wedIsClose: false,
        });
        $("#wedOpenTime").prop("disabled", false);
        $("#wedCloseTime").prop("disabled", false);
      } else {
        //this.state.wedIsClose = true;
        this.setState({
          wedIsClose: true,
        });
        $("#wedOpenTime").prop("disabled", true);
        $("#wedCloseTime").prop("disabled", true);
      }
    } else if (day === "thu") {
      if (this.state.thuIsClose === true) {
        // this.state.thuIsClose = false;
        this.setState({
          thuIsClose: false,
        });
        $("#thuOpenTime").prop("disabled", false);
        $("#thuCloseTime").prop("disabled", false);
      } else {
        //this.state.thuIsClose = true;
        this.setState({
          thuIsClose: true,
        });
        $("#thuOpenTime").prop("disabled", true);
        $("#thuCloseTime").prop("disabled", true);
      }
    } else if (day === "fri") {
      if (this.state.friIsClose === true) {
        //this.state.friIsClose = false;
        this.setState({
          friIsClose: false,
        });
        $("#friOpenTime").prop("disabled", false);
        $("#friCloseTime").prop("disabled", false);
      } else {
        //this.state.friIsClose = true;
        this.setState({
          friIsClose: true,
        });
        $("#friOpenTime").prop("disabled", true);
        $("#friCloseTime").prop("disabled", true);
      }
    } else if (day === "sat") {
      if (this.state.satIsClose === true) {
        //this.state.satIsClose = false;
        this.setState({
          satIsClose: false,
        });
        $("#satOpenTime").prop("disabled", false);
        $("#satCloseTime").prop("disabled", false);
      } else {
        //this.state.satIsClose = true;
        this.setState({
          satIsClose: true,
        });
        $("#satOpenTime").prop("disabled", true);
        $("#satCloseTime").prop("disabled", true);
      }
    } else if (day === "sun") {
      if (this.state.sunIsClose === true) {
        //this.state.sunIsClose = false;
        this.setState({
          sunIsClose: false,
        });
        $("#sunOpenTime").prop("disabled", false);
        $("#sunCloseTime").prop("disabled", false);
      } else {
        // this.state.sunIsClose = true;
        this.setState({
          sunIsClose: true,
        });
        $("#sunOpenTime").prop("disabled", true);
        $("#sunCloseTime").prop("disabled", true);
      }
    }
    this.forceUpdate();
  };

  render() {
    const deleteRoAccount = () => {
      dataService
        .deleteAccountRestaurantOwner()
        .then((res) => {
          $("#deleteResModalText")
            .text("Profile is deleted")
            .removeClass("alert-warning")
            .removeClass("alert-danger")
            .removeClass("alert-success")
            .addClass("alert-success");
        })
        .catch((err) => {
          $("#deleteResModalText")
            .text("Sorry, " + err.errmsg)
            .removeClass("alert-warning")
            .removeClass("alert-danger")
            .removeClass("alert-success")
            .addClass("alert-danger");
        });
    };
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
                  href="#restaurantProfile"
                  aria-controls="restaurantProfile"
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
                  href="#layout"
                  aria-controls="layout"
                  aria-selected="false"
                >
                  Restaurant Layout
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  data-toggle="tab"
                  role="tab"
                  href="#discount"
                  aria-controls="discount"
                  aria-selected="false"
                >
                  Discount
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  data-toggle="tab"
                  role="tab"
                  href="#managerAccount"
                  aria-controls="managerAccount"
                  aria-selected="false"
                >
                  Manager
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
                  Reservations
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  data-toggle="tab"
                  role="tab"
                  href="#review"
                  aria-controls="review"
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
            {/* Start of Restaurant Profile */}
            <div className="tab-content">
              <div
                id="restaurantProfile"
                className="tab-pane fade show active"
                role="tabpanel"
                aria-labelledby="restaurantProfile"
              >
                <form
                  id="resFormTag"
                  onSubmit={this.handleSubmitResProfile}
                  noValidate
                >
                  <div id="resForm">
                    <div className="form-group row">
                      <label
                        htmlFor="resname"
                        className="col-sm-2 col-form-label"
                      >
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
                          disabled={!this.state.disabled}
                          required
                        />
                        <span className="invalid-feedback">
                          {Parser(isError.resname)}
                        </span>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        htmlFor="streetnumber"
                        className="col-sm-2 col-form-label"
                      >
                        {" "}
                        Street Number
                      </label>
                      <div className="col-sm-3">
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
                          disabled={!this.state.disabled}
                          required
                        />
                        <span className="invalid-feedback">
                          {Parser(isError.streetnumber)}
                        </span>
                      </div>

                      <label
                        htmlFor="streetname"
                        className="col-sm-2 col-form-label"
                      >
                        {" "}
                        Street Name
                      </label>
                      <div className="col-sm-5">
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
                          disabled={!this.state.disabled}
                          required
                        />
                        <span className="invalid-feedback">
                          {Parser(isError.streetname)}
                        </span>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label htmlFor="city" className="col-sm-2 col-form-label">
                        {" "}
                        City
                      </label>
                      <div className="col-md-3">
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
                          disabled={!this.state.disabled}
                          required
                        />
                        <span className="invalid-feedback">
                          {Parser(isError.city)}
                        </span>
                      </div>

                      <label
                        htmlFor="province"
                        className="col-sm-2 col-form-label"
                      >
                        {" "}
                        Province
                      </label>
                      <div className="col-md-5">
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
                          disabled={!this.state.disabled}
                          required
                        />
                        <span className="invalid-feedback">
                          {Parser(isError.province)}
                        </span>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        htmlFor="postalcode"
                        className="col-sm-2 col-form-label"
                      >
                        {" "}
                        Postal Code
                      </label>
                      <div className="col-md-3">
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
                          disabled={!this.state.disabled}
                          required
                        />
                        <span className="invalid-feedback">
                          {Parser(isError.postalcode)}
                        </span>
                      </div>
                      <label
                        htmlFor="phonenumber"
                        className="col-sm-2 col-form-label"
                      >
                        {" "}
                        Phone Number
                      </label>
                      <div className="col-md-5">
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

                    <div className="form-group row">
                      <label
                        htmlFor="businessnumber"
                        className="col-sm-2 col-form-label"
                      >
                        {" "}
                        Business Number
                      </label>
                      <div className="col-md-10">
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
                          disabled={true}
                          required
                        />
                        <span className="invalid-feedback">
                          {Parser(isError.businessnumber)}
                        </span>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        htmlFor="eatingTime"
                        className="col-sm-2 col-form-label"
                      >
                        Eating Time
                      </label>

                      <div className="col-md-10 row">
                        <select
                          className="custom-select col-md-5"
                          id="eatingTime"
                          name="eatingTime"
                          value={this.state.eatingTime}
                          onChange={this.handleChange}
                          disabled={!this.state.disabled}
                          required
                        >
                          <option value="">Choose Max Eating Time</option>
                          <option value="1">1 hour</option>
                          <option value="2">2 hour</option>
                          <option value="3">3 hour</option>
                        </select>
                        <p className="text-right">
                          *This is the max hour customers can dine in
                        </p>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        htmlFor="cuisineStyle"
                        className="col-sm-2 col-form-label"
                      >
                        Cuisine Style
                      </label>
                      <div className="col-md-10">
                        <select
                          className="custom-select "
                          id="cuisineStyle"
                          name="cuisineStyle"
                          value={this.state.cuisineStyle}
                          onChange={this.handleChange}
                          disabled={!this.state.disabled}
                          required
                        >
                          <option value="">Choose Style</option>
                          <option value="american">American</option>
                          <option value="italian">Italian</option>
                          <option value="steakhouse">Steak House</option>
                          <option value="seafood">Seafood</option>
                          <option value="french">French</option>
                          <option value="indian">Indian</option>
                          <option value="japanese">Japanese</option>
                          <option value="british">British</option>
                          <option value="barbecue">Barbecue</option>
                          <option value="tapas">Tapas</option>
                          <option value="grill">Grill</option>
                          <option value="conformfood">Conform Food</option>
                          <option value="afternoontea">Afternoon Tea</option>
                          <option value="burgers">Burgers</option>
                          <option value="canadian">Canadian</option>
                          <option value="vegan">Vegan</option>
                          <option value="vegiterian">Vegetarian</option>
                          <option value="asian">Asian</option>
                          <option value="european">European</option>
                          <option value="continental">Continental</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        htmlFor="category"
                        className="col-sm-2 col-form-label"
                      >
                        Category
                      </label>
                      <div className="col-md-10">
                        <select
                          className="custom-select "
                          id="category"
                          name="category"
                          value={this.state.category}
                          onChange={this.handleChange}
                          disabled={!this.state.disabled}
                          required
                        >
                          <option value="">Choose Category</option>
                          <option value="ethinic">Ethinic</option>
                          <option value="fastfood">Fast Food</option>
                          <option value="fastcasual">Fast Casual</option>
                          <option value="casualdining">Casual Dining</option>
                          <option value="premiumdining">Premium Dining</option>
                          <option value="familydining">Family Dining</option>
                          <option value="finedining">Fine Dining</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        htmlFor="priceRange"
                        className="col-sm-2 col-form-label"
                      >
                        Price Range
                      </label>
                      <div className="col-md-10">
                        <select
                          className="custom-select "
                          id="priceRange"
                          name="priceRange"
                          value={this.state.priceRange}
                          onChange={this.handleChange}
                          disabled={!this.state.disabled}
                          required
                        >
                          <option value="">Choose Range</option>
                          <option value="low">$0-$50</option>
                          <option value="medium">$50-$100</option>
                          <option value="high">$100+</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        htmlFor="openHours"
                        className="col-sm-2 col-form-label"
                      >
                        Open Hours
                      </label>
                      <div className="col-md-10">
                        <label
                          htmlFor="monday"
                          className="col-sm-2 col-form-label"
                        >
                          Monday
                        </label>
                        <select
                          className="custom-select col-md-3"
                          id="monOpenTime"
                          name="monOpenTime"
                          value={this.state.monOpenTime}
                          onChange={this.handleChange}
                          disabled={
                            !this.state.disabled || this.state.monIsClose
                          }
                          required
                        >
                          <option value="">Choose Open Time</option>
                          {this.openTime()}
                        </select>
                        ~
                        <select
                          className="custom-select col-md-3"
                          id="monCloseTime"
                          name="monCloseTime"
                          value={this.state.monCloseTime}
                          onChange={this.handleChange}
                          disabled={
                            !this.state.disabled || this.state.monIsClose
                          }
                          required
                        >
                          <option value="">Choose Close Time</option>
                          {this.closeTime()}
                        </select>
                        <label className="col-sm-1 col-form-label"></label>
                        <button
                          type="button"
                          className="btn btn-outline-dark col-sm-2"
                          id="mondisablebutton"
                          disabled={!this.state.disabled}
                          onClick={() => this.handleNotOpen("mon")}
                          value={this.state.monIsClose}
                        >
                          {" "}
                          Not Open{" "}
                        </button>
                      </div>

                      <label className="col-sm-2 col-form-label"></label>
                      <div className="col-md-10">
                        <label
                          htmlFor="tuesday"
                          className="col-sm-2 col-form-label"
                        >
                          Tuesday
                        </label>
                        <select
                          className="custom-select col-md-3"
                          id="tueOpenTime"
                          name="tueOpenTime"
                          value={this.state.tueOpenTime}
                          onChange={this.handleChange}
                          disabled={
                            !this.state.disabled || this.state.tueIsClose
                          }
                          required
                        >
                          <option value="">Choose Open Time</option>
                          {this.openTime()}
                        </select>
                        ~
                        <select
                          className="custom-select col-md-3"
                          id="tueCloseTime"
                          name="tueCloseTime"
                          value={this.state.tueCloseTime}
                          onChange={this.handleChange}
                          disabled={
                            !this.state.disabled || this.state.tueIsClose
                          }
                          required
                        >
                          <option value="">Choose Close Time</option>
                          {this.closeTime()}
                        </select>
                        <label className="col-sm-1 col-form-label"></label>
                        <button
                          type="button"
                          className="btn btn-outline-dark col-sm-2"
                          id="tuedisablebutton"
                          disabled={!this.state.disabled}
                          onClick={() => this.handleNotOpen("tue")}
                          value={this.state.tueIsClose}
                        >
                          {" "}
                          Not Open{" "}
                        </button>
                      </div>

                      <label className="col-sm-2 col-form-label"></label>
                      <div className="col-md-10">
                        <label
                          htmlFor="wednesday"
                          className="col-sm-2 col-form-label"
                        >
                          Wednesday
                        </label>
                        <select
                          className="custom-select col-md-3"
                          id="wedOpenTime"
                          name="wedOpenTime"
                          value={this.state.wedOpenTime}
                          onChange={this.handleChange}
                          disabled={
                            !this.state.disabled || this.state.wedIsClose
                          }
                          required
                        >
                          <option value="">Choose Open Time</option>
                          {this.openTime()}
                        </select>
                        ~
                        <select
                          className="custom-select col-md-3"
                          id="wedCloseTime"
                          name="wedCloseTime"
                          value={this.state.wedCloseTime}
                          onChange={this.handleChange}
                          disabled={
                            !this.state.disabled || this.state.wedIsClose
                          }
                          required
                        >
                          <option value="">Choose Close Time</option>
                          {this.closeTime()}
                        </select>
                        <label className="col-sm-1 col-form-label"></label>
                        <button
                          type="button"
                          className="btn btn-outline-dark col-sm-2"
                          id="weddisablebutton"
                          disabled={!this.state.disabled}
                          onClick={() => this.handleNotOpen("wed")}
                          value={this.state.wedIsClose}
                        >
                          {" "}
                          Not Open{" "}
                        </button>
                      </div>

                      <label className="col-sm-2 col-form-label"></label>
                      <div className="col-md-10">
                        <label
                          htmlFor="thursday"
                          className="col-sm-2 col-form-label"
                        >
                          Thursday
                        </label>
                        <select
                          className="custom-select col-md-3"
                          id="thuOpenTime"
                          name="thuOpenTime"
                          value={this.state.thuOpenTime}
                          onChange={this.handleChange}
                          disabled={
                            !this.state.disabled || this.state.thuIsClose
                          }
                          required
                        >
                          <option value="">Choose Open Time</option>
                          {this.openTime()}
                        </select>
                        ~
                        <select
                          className="custom-select col-md-3"
                          id="thuCloseTime"
                          name="thuCloseTime"
                          value={this.state.thuCloseTime}
                          onChange={this.handleChange}
                          disabled={
                            !this.state.disabled || this.state.thuIsClose
                          }
                          required
                        >
                          <option value="">Choose Close Time</option>
                          {this.closeTime()}
                        </select>
                        <label className="col-sm-1 col-form-label"></label>
                        <button
                          type="button"
                          className="btn btn-outline-dark col-sm-2"
                          id="thudisablebutton"
                          disabled={!this.state.disabled}
                          onClick={() => this.handleNotOpen("thu")}
                          value={this.state.thuIsClose}
                        >
                          {" "}
                          Not Open{" "}
                        </button>
                      </div>

                      <label className="col-sm-2 col-form-label"></label>
                      <div className="col-md-10">
                        <label
                          htmlFor="friday"
                          className="col-sm-2 col-form-label"
                        >
                          Friday
                        </label>
                        <select
                          className="custom-select col-md-3"
                          id="friOpenTime"
                          name="friOpenTime"
                          value={this.state.friOpenTime}
                          onChange={this.handleChange}
                          disabled={
                            !this.state.disabled || this.state.friIsClose
                          }
                          required
                        >
                          <option value="">Choose Open Time</option>
                          {this.openTime()}
                        </select>
                        ~
                        <select
                          className="custom-select col-md-3"
                          id="friCloseTime"
                          name="friCloseTime"
                          value={this.state.friCloseTime}
                          onChange={this.handleChange}
                          disabled={
                            !this.state.disabled || this.state.friIsClose
                          }
                          required
                        >
                          <option value="">Choose Close Time</option>
                          {this.closeTime()}
                        </select>
                        <label className="col-sm-1 col-form-label"></label>
                        <button
                          type="button"
                          className="btn btn-outline-dark col-sm-2"
                          id="fridisablebutton"
                          disabled={!this.state.disabled}
                          onClick={() => this.handleNotOpen("fri")}
                          value={this.state.friIsClose}
                        >
                          {" "}
                          Not Open{" "}
                        </button>
                      </div>

                      <label className="col-sm-2 col-form-label"></label>
                      <div className="col-md-10">
                        <label
                          htmlFor="saturday"
                          className="col-sm-2 col-form-label"
                        >
                          Saturday
                        </label>
                        <select
                          className="custom-select col-md-3"
                          id="satOpenTime"
                          name="satOpenTime"
                          value={this.state.satOpenTime}
                          onChange={this.handleChange}
                          disabled={
                            !this.state.disabled || this.state.satIsClose
                          }
                          required
                        >
                          <option value="">Choose Open Time</option>
                          {this.openTime()}
                        </select>
                        ~
                        <select
                          className="custom-select col-md-3"
                          id="satCloseTime"
                          name="satCloseTime"
                          value={this.state.satCloseTime}
                          onChange={this.handleChange}
                          disabled={
                            !this.state.disabled || this.state.satIsClose
                          }
                          required
                        >
                          <option value="">Choose Close Time</option>
                          {this.closeTime()}
                        </select>
                        <label className="col-sm-1 col-form-label"></label>
                        <button
                          type="button"
                          className="btn btn-outline-dark col-sm-2"
                          id="satdisablebutton"
                          disabled={!this.state.disabled}
                          onClick={() => this.handleNotOpen("sat")}
                          value={this.state.satIsClose}
                        >
                          {" "}
                          Not Open{" "}
                        </button>
                      </div>

                      <label className="col-sm-2 col-form-label"></label>
                      <div className="col-md-10">
                        <label
                          htmlFor="sunday"
                          className="col-sm-2 col-form-label"
                        >
                          Sunday
                        </label>
                        <select
                          className="custom-select col-md-3"
                          id="sunOpenTime"
                          name="sunOpenTime"
                          value={this.state.sunOpenTime}
                          onChange={this.handleChange}
                          disabled={
                            !this.state.disabled || this.state.sunIsClose
                          }
                          required
                        >
                          <option value="">Choose Open Time</option>
                          {this.openTime()}
                        </select>
                        ~
                        <select
                          className="custom-select col-md-3"
                          id="sunCloseTime"
                          name="sunCloseTime"
                          value={this.state.sunCloseTime}
                          onChange={this.handleChange}
                          disabled={
                            !this.state.disabled || this.state.sunIsClose
                          }
                          required
                        >
                          <option value="">Choose Close Time</option>
                          {this.closeTime()}
                        </select>
                        <label className="col-sm-1 col-form-label"></label>
                        <button
                          type="button"
                          className="btn btn-outline-dark col-sm-2"
                          id="sundisablebutton"
                          disabled={!this.state.disabled}
                          onClick={() => this.handleNotOpen("sun")}
                          value={this.state.sunIsClose}
                        >
                          {" "}
                          Not Open{" "}
                        </button>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        htmlFor="picture"
                        className="col-sm-2 col-form-label"
                      >
                        Restaurant Picture
                      </label>

                      <input
                        type="file"
                        name="picture"
                        id="picture"
                        onChange={this.onImageChange}
                        disabled={!this.state.disabled}
                        multiple
                        required
                      />

                      {this.state.resPictures.length > 0 &&
                        this.state.resPictures.map((currValue, index) => {
                          return (
                            <div key={index + "Images1"} id="Images1">
                              <img
                                key={index}
                                className="previewImage"
                                src={serverAddress + "/getImage/" + currValue}
                                alt="Restaurant"
                              />
                              <button
                                type="button"
                                className="btn mr-sm-4 btn-danger"
                                data-toggle="modal"
                                data-target="#deletePictureModal"
                                onClick={() =>
                                  this.handleDeletePicture(currValue)
                                }
                                disabled={!this.state.disabled}
                              >
                                Delete
                              </button>
                            </div>
                          );
                        })}
                      {this.state.picture.length > 0 &&
                        this.state.picture.map((url, index) => {
                          return (
                            <div id="Images" key={index + "Images"}>
                              <img
                                key={index}
                                className="previewImage"
                                src={url}
                                value={index}
                                onClick={() => this.onSelectImage(index)}
                                alt="Restaurant"
                              />
                            </div>
                          );
                        })}
                    </div>

                    <div className="form-group row">
                      <label
                        htmlFor="description"
                        className="col-sm-2 col-form-label"
                      >
                        Restaurant Description
                      </label>
                      <div className="col-md-10">
                        <textarea
                          className={
                            isError.description.length > 6
                              ? "is-invalid form-control"
                              : "form-control"
                          }
                          rows="5"
                          id="description"
                          name="description"
                          value={this.state.description}
                          onChange={this.handleChange}
                          disabled={!this.state.disabled}
                        ></textarea>
                        <span className="invalid-feedback">
                          {Parser(isError.description)}
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
                    <div className="form-group text-center ">
                      <button
                        type="button"
                        className="btn btn-danger mr-sm-4 "
                        data-toggle="modal"
                        data-target="#deleteResModal"
                        onClick={deleteRoAccount}
                      >
                        {/* When the user click the delete button, their account will be deleted and redirect to homepage as log out status. */}
                        Delete
                      </button>
                      {/* Delete Modal */}
                      {/* <div
                        className="modal fade"
                        id="deleteRestaurantModal"
                        tabIndex="-1"
                        role="dialog"
                        aria-labelledby="deleteRestaurantLabel"
                        aria-hidden="true"
                      >
                        <div className="modal-dialog" role="document">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h5 className="modal-title" id="deleteRestaurantLabel">
                                Delete Restaurant Profile
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
                              <p className="alert alert-warning" id="deleteRestaurantText">
                                Are you sure?
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
                      </div>*/}
                    </div>
                  </div>

                  {/* Restaurant profile result Modal */}
                  <div
                    className="modal fade"
                    id="resProfileResultModal"
                    tabIndex="-1"
                    role="dialog"
                    aria-labelledby="resProfileResultModalLabel"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog" role="document">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5
                            className="modal-title"
                            id="resProfileResultModalLabel"
                          >
                            Restaurant profile
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
                            id="resProfileResultText"
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

              {/* End of Restaurant Profile */}

              {/* Start of Manager Account*/}

              <div
                id="managerAccount"
                className="tab-pane fade"
                role="tabpanel"
                aria-labelledby="managerAccount"
              >
                <Manager />
              </div>

              {/* End of Manager Account */}

              {/* Start of Review*/}

              <div
                id="review"
                className="tab-pane fade"
                role="tabpanel"
                aria-labelledby="review"
              >
                <ViewReview />
              </div>

              {/* End of Review Account */}

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

              {/* Start Menu */}
              <div
                id="menu"
                className="tab-pane fade"
                role="tabpanel"
                aria-labelledby="menu"
              >
                <Menu />
              </div>
              {/* End Menu */}

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

              {/* Start Restaurant Layout */}
              <div
                id="layout"
                className="tab-pane fade"
                role="tabpanel"
                aria-labelledby="layout"
              >
                <RestaurantLayout />
              </div>
              {/* End Restaurant Layout */}

              {/* Start Discount */}
              <div
                id="discount"
                className="tab-pane fade"
                role="tabpanel"
                aria-labelledby="discount"
              >
                <Discount />
              </div>
              {/* End Discount */}

              {/* Delete Picture */}

              <div
                className="modal fade"
                id="deletePictureModal"
                tabIndex="-1"
                role="dialog"
                aria-labelledby="deletePictureModalLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="deletePictureModalLabel">
                        Delete Picture Profile
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
                        id="deletePictureModalText"
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

              {/* Delete Picture */}

              <div
                className="modal fade"
                id="deleteResModal"
                tabIndex="-1"
                role="dialog"
                aria-labelledby="deletePictureModalLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="deleteResModalLabel">
                        Delete Restaurant Profile
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
                        id="deleteResModalText"
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
          </div>
        </div>
        {/* <Modal show={this.state.isModalShow} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{this.state.modalTitle} </Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.state.modalBody}</Modal.Body>
          <Modal.Footer>
            {this.state.modalButtons}
          </Modal.Footer>
          </Modal> */}
      </MainContainer>
    );
  }
}

export default RestaurantProfile;
