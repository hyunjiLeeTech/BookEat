import React, {Component} from "react";
import {Link} from "react-router-dom";
import Maincontainer from "../../Style/MainContainer";
import FullscreenError from "../../Style/FullscreenError";
import DataService from "../../../Services/dataService";
import moment from "moment";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import dataService from "../../../Services/dataService";
import {toast} from "react-toastify";

class CustomerReservationHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reservations: [],
      resultsErr: false,
      isModalShow: false,
      modalText: "Loading",
      modalTitle: "Food Order Details",
    };
    DataService.getCustomerReservations()
      .then((res) => {
        for (var r of res.reservations) r.buttonDisabled = false;
        this.setState({reservations: res.reservations});
      })
      .catch((err) => {
        console.log(err);
      });
    this.renderTable = this.renderTable.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    // console.log("saved")
    // if (formValid(this.state)) {
    //     console.log(this.state)
    //     ds.addMenu(this.state);
    // } else {
    //     console.log("Form is invalid!");
    // }
  };

  renderTable() {
    const btnclick = (foodOrderId) => {
      console.log(foodOrderId);
      this.setState({
        isModalShow: true,
        modalText: "Loading",
        modalTitle: "Food order details",
      });
      DataService.getFoodOrder(foodOrderId).then((res) => {
        var tr = [];
        var totalPrice = 0;
        for (var i of res.menus) {
          tr.push(
            <p>
              {i.menuName} - ${i.menuPrice}
            </p>,
          );
          totalPrice += Number.parseFloat(i.menuPrice);
        }
        tr.push(<hr />);
        tr.push(<p>Total: ${totalPrice}</p>);
        this.setState({
          modalText: tr,
        });
      });
    };

    const renderStatus = (status) => {
      switch (status) {
        case 0:
          return <td>Finished</td>;
        case 1:
          return <td>Not Attend</td>;
        case 2:
          return <td>Scheduled</td>;
        case 3:
          return <td>Customer Cancelled</td>;
        case 4:
          return <td>Restaurant Cancelled</td>;
        default:
          return <td>Unknown</td>;
      }
    };
    const renderStatusClassName = (status) => {
      switch (status) {
        case 0:
          return "alert alert-success";
        case 1:
          return "alert alert-error";
        case 2:
          return "alert alert-info";
        case 3:
        case 4:
          return "alert alert-warning";
        default:
          return "";
      }
    };

    const renderTooltip = (props) => (
      <Tooltip id="button-tooltip" {...props}>
        This reservation comes in 12 hours. Please contact the restaurant to
        cancel it.
      </Tooltip>
    );

    const btnCancel = (resv) => {
      resv.buttonDisabled = true;
      this.forceUpdate();
      dataService
        .customerCancelReservation(resv._id)
        .then((res) => {
          toast("Reservation successfully cancelled", {
            type: "success",
            autoClose: 3000,
          });
          resv.status = 3;
        })
        .catch((err) => {
          toast("Error", {type: "error", autoClose: 3000});
        })
        .finally(() => {
          resv.buttonDisabled = false;
          this.forceUpdate();
        });
    };

    var notUpcoming = new Set(this.state.reservations);
    var upcoming = new Set();
    for (var resv of notUpcoming) {
      if (resv.status === 2) {
        upcoming.add(resv);
        notUpcoming.delete(resv);
      }
    }
    const renderCancelButton = (resv) => {
      const {dateTime} = resv;
      if (resv.status === 2)
        return moment(new Date(dateTime)).diff(new Date(), "h") < 12 ? (
          <OverlayTrigger
            placement="top"
            delay={{show: 0, hide: 1000}}
            overlay={renderTooltip}
          >
            <Button className="btn btn-grey disabled" aria-disabled="true">
              Cancel
            </Button>
          </OverlayTrigger>
        ) : (
          <Button className="btn btn-danger" onClick={() => btnCancel(resv)}>
            Cancel
          </Button>
        );
      else return null;
    };

    this.state.reservations = [...upcoming, ...notUpcoming];
    return this.state.reservations.map((reservation, index, reservations) => {
      const {
        _id,
        dateTime,
        status,
        reserveTime,
        numOfPeople,
        restaurant,
        comments,
      } = reservation;
      return (
        <tr key={_id} className={renderStatusClassName(status)}>
          {renderStatus(status)}

          <td>{moment(dateTime).format("YYYY-MM-DD HH:mm")}</td>
          <td>
            <Link to={"/restaurant/" + restaurant._id}>
              {restaurant.resName}
            </Link>{" "}
          </td>
          <td>{numOfPeople}</td>
          <td>{comments}</td>

          {reservations[index].buttonDisabled ? (
            <td>
              <Button className="btn btn-info">Please Wait...</Button>
            </td>
          ) : (
            <td>
              {renderCancelButton(reservations[index])}
              {reservations[index].status === 2 ? <span>&nbsp;</span> : null}
              {reservations[index].status === 2 ? (
                <Link
                  className="btn btn-warning"
                  to={
                    "customerreserve/" +
                    restaurant._id +
                    "/" +
                    moment(dateTime).format("YYYY-MM-DD") +
                    "/" +
                    moment(dateTime).format("HH:mm") +
                    "/" +
                    numOfPeople +
                    "/true/" +
                    _id
                  }
                >
                  Edit
                </Link>
              ) : null}
              <span>&nbsp;</span>
              {reservations[index].FoodOrder ? (
                <Button
                  className="btn btn-primary"
                  onClick={() => btnclick(reservations[index].FoodOrder)}
                >
                  View Food Order
                </Button>
              ) : null}
            </td>
          )}

          <td>{moment(reserveTime).format("YYYY-MM-DD HH:mm")}</td>
        </tr>
      );
    });
  }

  render() {
    const handleClose = () => {
      this.setState({isModalShow: false, modalText: "", modalTitle: ""});
    };
    return (
      <Maincontainer>
        {this.state.resultsErr
          ? FullscreenError("An error occured, please try again later")
          : null}
        <form id="reservationhistory" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <br />
            <br />
            <h3> Reservation History</h3>
            <p>
              Thank you for loving BookEat. <br />
              Here is your BookEat history.{" "}
            </p>
            <table className="table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Restaurant</th>
                  <th># of Visitor</th>
                  <th>Comments</th>
                  <th>Operation</th>
                  <th>Reserve date</th>
                </tr>
              </thead>
              <tbody>{this.renderTable()}</tbody>
            </table>
          </div>
        </form>

        <Modal show={this.state.isModalShow} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{this.state.modalTitle} </Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.state.modalText}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Maincontainer>
    );
  }
}

export default CustomerReservationHistory;
