import React, {Component} from "react";
import $ from "jquery";
import moment from "moment";

class SearchBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numberOfPeople: "4",
      dateTime: new Date(),
      date: moment().add(1, "d").format("YYYY-MM-DD"),
      time: "12:30",
      keyword: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    e.preventDefault();
    const {name, value} = e.target;
    switch (name) {
      case "date":
        this.setState({date: value});
        break;
      case "numberOfPeople":
        this.setState({numberOfPeople: value});
        break;
      case "time":
        this.setState({time: value});
        break;
      case "keyword":
        this.setState({keyword: value});
        break;
      default:
        break;
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    var numofpeople = this.state.numberOfPeople;
    var date = $("#date").val();
    var time = $("#time").val();
    var resId = "5efa8fc9dd9918ba08ac9ade";
    var dateTime = moment(new Date(Date.parse(date + " " + time))).format(
      "YYYY-MM-DD HH:mm",
    );
    console.log(date);
    console.log(time);
    console.log(numofpeople);
    this.setState({
      resId: resId,
      dateTime: dateTime,
      numofpeople: numofpeople,
    });
    if (this.state.keyword === null) {
      // this.state.keyword = ''
      this.setState({
        keyword: "",
      });
    }
    window.location.href =
      "/searchResult?dateTime=" +
      dateTime +
      "&numOfPeople=" +
      numofpeople +
      "&keyword=" +
      this.state.keyword;
  }

  componentDidMount() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    var keyword = urlParams.get("keyword");
    this.setState({keyword: keyword ? keyword : ""});
    //this.state.keyword = keyword;
    //console.log(this.state.keyword)
    if (
      urlParams.get("dateTime") != null &&
      urlParams.get("numOfPeople") != null
    ) {
      var date = new Date(urlParams.get("dateTime"));
      var numOfPeople = urlParams.get("numOfPeople");
      if (numOfPeople !== "undefined")
        this.setState({numberOfPeople: numOfPeople});
      if (Object.prototype.toString.call(date) === "[object Date]") {
        // it is a date
        if (isNaN(date.getTime())) {
          // d.valueOf() could also work
          // date is not valid
        } else {
          this.setState({
            date: moment(date).format("YYYY-MM-DD").toString(),
            time: moment(date).format("HH:mm"),
          });
        }
      } else {
        // not a date
      }
    }
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
    // console.log(new Date())

    // for (var o of options) {
    //     console.log(new Date(date + ' ' + o.props['value']))
    //     if (new Date(date + ' ' + o.props['value']) < new Date()) {
    //         console.log(new Date(date + ' ' + o.props['value']).toString() + ' disabled')
    //     }
    // }

    return (
      <select
        className="custom-select"
        id="time"
        name="time"
        value={this.state.time}
        onChange={this.handleChange}
        required
      >
        <option value="">Time</option>
        {options}
      </select>
    );
  }

  render() {
    return (
      <div className="row justify-content-start card-body">
        <div className=" row col-sm-3">
          <input
            type="date"
            id="date"
            name="date"
            value={this.state.date}
            placeholder="Date"
            onChange={this.handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="row col-sm-2">
          {this.renderTimeOption(this.state.date)}
        </div>

        <div className="row col-md-2">
          <select
            className="custom-select"
            id="numberOfPeopleSelection"
            name="numberOfPeople"
            onChange={this.handleChange}
            value={this.state.numberOfPeople}
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

        <div className="col-sm-4 form-group has-search">
          <span className="fa fa-search form-control-feedback"></span>
          <input
            className="form-control"
            name="keyword"
            value={this.state.keyword}
            onChange={this.handleChange}
            type="text"
            placeholder="Search"
            aria-label="Search"
          />
        </div>
        <div className="col-sm-2">
          <button
            type="button"
            className="btn btn-primary mr-sm-4"
            onClick={this.handleSubmit}
          >
            {" "}
            Find
          </button>
        </div>
      </div>
    );
  }
}

export default SearchBox;
