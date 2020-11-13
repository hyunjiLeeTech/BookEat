import React, { Component } from 'react'
import $ from "jquery";
import dataService from '../../../Services/dataService';
import { toast } from 'react-toastify';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

class RestaurantReservation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            upcoming: [],
            past: [],
            isModalShow: false,
            modalTitle: '',
            modalText: '',
            timer: null,
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.querypast = this.querypast.bind(this);
        this.renderPast = this.renderPast.bind(this);
        this.queryPresent = this.queryPresent.bind(this);
        this.renderPresent = this.renderPresent.bind(this);
        this.viewFoodOrder = this.viewFoodOrder.bind(this);
    }

    notAttend(reservationId) {
        const infoToast = toast("Please Wait", { autoClose: false })
        dataService.notAttendReservation(reservationId).then(res => {
            toast.update(infoToast, { render: "Not attend reported, thanks!", type: toast.TYPE.SUCCESS, autoClose: 5000, className: 'pulse animated' })
            $("#" + reservationId + "btnNotAttend").attr('disabled', 'true').text("Reported Not Attend")
        }).catch(err => {
            if (err.errcode) {
                toast.update(infoToast, { render: err.errmsg, type: toast.TYPE.ERROR, autoClose: 5000, className: 'pulse animated' })
            } else {
                toast.update(infoToast, { render: "error occured", type: toast.TYPE.ERROR, autoClose: 5000, className: 'pulse animated' })
            }
        })
    }

    cancelReservation(reservationId) {
        const infoToast = toast("Please Wait", { autoClose: false })
        dataService.restaurantCancelReservation(reservationId).then(res => {
            toast.update(infoToast, { render: "Reservation cancelled", type: toast.TYPE.SUCCESS, autoClose: 5000, className: 'pulse animated' })
            $("#" + reservationId + "btnCancel").attr('disabled', 'true').text("Cancelled")
        }).catch(err => {
            if (err.errcode) {
                toast.update(infoToast, { render: err.errmsg, type: toast.TYPE.ERROR, autoClose: 5000, className: 'pulse animated' })
            } else {
                toast.update(infoToast, { render: "error occured", type: toast.TYPE.ERROR, autoClose: 5000, className: 'pulse animated' })
            }
        })
    }

    confirmAttandance(reservationId) {
        const infoToast = toast("Please Wait", { autoClose: false })
        dataService.restaurantConfirmReservation(reservationId).then(res => {
            toast.update(infoToast, { render: "Reservation confirm", type: toast.TYPE.SUCCESS, autoClose: 5000, className: 'pulse animated' })
            $("#" + reservationId + "btnConfirm").attr('disabled', 'true').text("Confirm")
        }).catch(err => {
            if (err.errcode) {
                toast.update(infoToast, { render: err.errmsg, type: toast.TYPE.ERROR, autoClose: 5000, className: 'pulse animated' })
            } else {
                toast.update(infoToast, { render: "error occured", type: toast.TYPE.ERROR, autoClose: 5000, className: 'pulse animated' })
            }
        })

    }

    viewFoodOrder(foodOrderId) {
        this.setState({ isModalShow: true, modalText: "Loading", modalTitle: 'Food order details' })
        dataService.getFoodOrder(foodOrderId).then((res) => {
            var tr = [];
            var totalPrice = 0;
            for (var i of res.menus) {
                tr.push(<p key={tr}>
                    {i.menuName} -
                    ${i.menuPrice}
                </p>)
                totalPrice += Number.parseFloat(i.menuPrice)
            }
            tr.push(<hr key={tr + 1} />)
            tr.push(<p key={tr + 2}>Total: ${totalPrice}</p>)
            this.setState({
                modalText: tr
            })
        })
    }

    renderPresent() {
        var rows = this.state.upcoming.map((ro, index) =>
            <tr key={index} id={ro._id}>
                <td>
                    {ro.customer.firstName + " " + ro.customer.lastName}
                </td>

                <td >
                    {ro.table.rid}
                </td>

                <td >
                    {ro.dateTime}
                </td>

                <td >
                    {ro.numOfPeople}
                </td>

                <td >
                    {ro.comments}
                </td>

                <td>
                    {
                        ro.FoodOrder ?

                            <button type="button" className="btn btn-primary btn-sm"
                                id={ro._id + 'btn'}
                                value={ro.FoodOrder}
                                onClick={() => this.viewFoodOrder(this.state.upcoming[index].FoodOrder)}>
                                View Order
                                </button> : null
                    }



                </td>

                <td>
                    <button type="button" className="btn btn-success btn-sm"
                        id={ro._id + 'btnConfirm'}
                        onClick={() => this.confirmAttandance(this.state.upcoming[index]._id)}>
                        Confirm Attandance
                        </button>
                </td>

                <td>
                    <button type="button" className="btn btn-danger btn-sm"
                        id={ro._id + 'btnCancel'}
                        onClick={() => this.cancelReservation(this.state.upcoming[index]._id)}
                    >
                        Cancel Reservation </button>
                </td>
                <td>
                    <button type="button" className="btn btn-danger btn-sm"
                        id={ro._id + 'btnNotAttend'}
                        onClick={() => this.notAttend(this.state.upcoming[index]._id)}
                    >
                        Report Not Attend </button>
                </td>

            </tr>
        )

        return rows;
    }

    queryPresent() {
        dataService.getRestaurantUpcomingReservation().then(res => {
            this.setState({
                upcoming: res.reservations,
            })
        })
    }

    renderPast() {
        const renderStatusClassName = (status) => {
            switch (status) {
                case 0: return 'alert alert-success'
                case 1: return 'alert alert-danger'
                case 2: return 'alert alert-info'
                case 3:
                case 4: return 'alert alert-warning'
                default: return ''
            }
        }
        var row = this.state.past.map((r, index) =>
            <tr key={index} className={renderStatusClassName(r.status)}>
                <td >
                    {r.customer.firstName + " " + r.customer.lastName}
                </td>

                <td >
                    {r.table.rid}
                </td>

                <td >
                    {r.dateTime}
                </td>

                <td >
                    {r.numOfPeople}
                </td>

                <td >
                    {r.comments}
                </td>
                <td>
                    {


                        r.FoodOrder ?

                            <button type="button" className="btn btn-primary btn-sm"
                                id={r._id + 'btn'}
                                onClick={() => this.viewFoodOrder(this.state.past[index].FoodOrder)}>
                                View Order
                </button> : null
                    }</td>
            </tr>)
        return row;
    }

    querypast() {
        dataService.getRestaurantPastReservation().then(res => {
            this.setState({
                past: res.reservations,
            })
        })
    }

    handleChange(e) {
        e.preventDefault();
    }

    handleSubmit = (e) => {
        e.preventDefault();
    }

    queryItemsInfinite() {
        this.setState({
            timer: setTimeout(() => {
                this.querypast();
                this.queryPresent();
                this.queryItemsInfinite();
            }, 10000)
        })

    }
    componentWillUnmount(){
        clearTimeout(this.state.timer)
    }

    componentWillMount() {
        this.querypast();
        this.queryPresent();
        this.queryItemsInfinite();
    }

    render() {
        const handleClose = () => {
            this.setState({ isModalShow: false, modalText: '', modalTitle: '' })
        }
        return (
            <div className="card">
                <div className="card-header">
                    <ul className="nav nav-tabs card-header-tabs">
                        <li className="nav-item">
                            <a className="nav-link active" data-toggle="tab" role="tab" href="#upcomingRes" aria-controls="upcomingRes" aria-selected="true">
                                Upcoming Reservation
                                </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" data-toggle="tab" role="tab" href="#pastRes" aria-controls="pastRes" aria-selected="false">
                                Past Reservation
                                </a>

                        </li>
                    </ul>
                </div>

                <div className="card-body">
                    <div className="tab-content">
                        {/* Start Upcoming Reservation */}
                        <div id="upcomingRes" className="tab-pane fade show active" role="tabpanel" aria-labelledby="upcomingRes">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th scope="col">Customer</th>
                                        <th scope="col">Table</th>
                                        <th scope="col">Date</th>
                                        <th scope="col"># of People</th>
                                        <th scope="col">Comments</th>
                                        <th scope="col">Food Order</th>
                                        <th scope="col"></th>
                                        <th scope="col"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.renderPresent()}

                                </tbody>
                            </table>
                        </div>
                        {/* End Upcoming Reservation */}

                        {/* Start Past Reservations */}
                        <div id="pastRes" className="tab-pane fade " role="tabpanel" aria-labelledby="pastRes">
                        <p className='alert alert-success'>Finished Reservation</p>
                        <p className='alert alert-danger'>Not Attend Reservation</p>
                        <p className='alert alert-warning'>Cancelled Reservation</p>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Customer</th>
                                        <th scope="col">Table</th>
                                        <th scope="col">Date</th>
                                        <th scope="col"># of People</th>
                                        <th scope="col">Comments</th>
                                        <th scope="col">Operation</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {this.renderPast()}


                                </tbody>
                            </table>
                        </div>
                        {/* End Past Reservations */}


                    </div>
                </div>
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
            </div>
        )
    }

}

export default RestaurantReservation;