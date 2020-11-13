import React, { Component } from "react";
import ds from "../../Services/dataService";
import Parser from "html-react-parser";
import $ from "jquery";
import MainContainer from "../Style/MainContainer";
import FullscreenError from '../Style/FullscreenError'
import FullScrrenLoading from '../Style/FullscreenLoading';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

const regExpNumbers = RegExp(/^[0-9]*$/);

const formValid = ({ isError, ...rest }) => {
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

class Discount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            discdescription: '',
            promdescription: '',
            discounts: [],
            contentTable: false,
            resultsErr: false,
            isResLoaded: false,
            isLoading: false,
            isActive: false,
            isError: {
                discdescription: "&#160;",
                promdescription: "&#160;"
            },
            modal: {
                isModalShow: false,
                modalTitle: '',
                modalText: '',
                className: '',
            }
        };
        this.handleAddDiscount = this.handleAddDiscount.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeInList = this.handleChangeInList.bind(this);
        this.discountEditButton = this.discountEditButton.bind(this);
        this.setModal = this.setModal.bind(this);
        this.handleActive = this.handleActive.bind(this);
    }

    handleChange(e) {
        e.preventDefault();
        const { name, value } = e.target;
        let isError = this.state.isError;
        switch (name) {
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

    setModal(isShown, title, text, className) {
        this.setState({
            modal: {
                isModalShow: isShown,
                modalTitle: title,
                modalText: text,
                className: className ? className : '',
            }
        })
    }

    handleChangeInList(e, index) {
        e.preventDefault();
        const { name, value } = e.target;
        let isError = { ...this.state.isError };
        switch (name) {
            case "discdescription":
                isError.discdescription = regExpNumbers.test(value)
                    ? "&#160;"
                    : "Please put some promotional numbers";
                this.state.discounts[index]['percent'] = e.target.value;
                break;
            case "promdescription":
                isError.promdescription =
                    value.length >= 1 && value.length <= 255
                        ? "&#160;"
                        : "Atleast write something";
                this.state.discounts[index]['description'] = e.target.value;
                break;
            default:
                break;
        }
        this.forceUpdate();
    }

    handleAddDiscount = (e) => {
        e.preventDefault();
        var discount = {
            percent: this.state.discdescription,
            descript: this.state.promdescription
        }


        ds.addDiscount(discount).then(() => {
            this.queryDiscounts();
            this.setModal(true, 'Success', 'Discount added', 'alert alert-success');
        }).catch((err) => {
            this.setModal(true, 'Failed', err.errmsg && typeof err.errmsg === 'string' ? err.errmsg : 'Error, failed to add discount', 'alert alert-danger');
            console.log(err);
        });

    }

    componentWillMount() {
        this.queryDiscounts();
    }

    queryDiscounts() {
        this.setState({
            isLoading: true
        })
        ds.getDiscounts().then((res) => {

            this.setState({
                discounts: res.discounts
            })
            for (var discount of this.state.discounts) {
                discount.contentTable = false;
            }
        }).catch(err => {
            throw err;
        })

        this.setState({
            isLoading: false
        })
    }

    discountEditButton(index) {
        this.state.discounts[index].contentTable = !this.state.discounts[index].contentTable;
        if (!this.state.discounts[index].contentTable) {
            this.setModal(true, 'Please Wait', 'Please Wait..', 'alert alert-warning')
            ds.editDiscount(this.state.discounts[index]).then((res) => {
                this.setModal(true, 'Success', 'Discount edited', 'alert alert-success')
            }).catch(err => {
                this.setModal(true, 'Error', err.errmsg ? err.errmsg : 'Error', 'alert alert-danger')
                console.log(err)
            })
        }

        this.callModal(index);
    }

    discountDeleteButton(index) {
        ds.deleteDiscount(this.state.discounts[index]).then(() => {
            this.queryDiscounts();
            this.setModal(true, 'Success', 'Discount deleted', 'alert alert-success')
        }).catch((err) => {
            this.setModal(true, 'Error', err.errmsg ? err.errmsg : 'Error', 'alert alert-danger')
        })
    }

    callModal(index) {
        this.setState(state => {
            return {
                discount: !state.discounts
            };
        },
            () => {
                if (this.state.discounts[index].contentTable) {
                    $('#save_edit_disc_btn').attr("data-toggle", 'modal').attr("data-target", '#DiscountEditResultModal').attr('type', 'button')
                }
                else {
                    $('#save_edit_disc_btn').attr("data-toggle", '').attr("data-target", '').attr("type", '')
                }

            });

    }

    handleActive = (promotion) => {
        promotion.isActive = !promotion.isActive
        this.forceUpdate();
    }

    renderDataDiscount() {
        return this.state.discounts.map((discount, index) => {
            return (
                <tr key={index}>
                    <th>

                        <input type="text" id="discdescription" name="discdescription"
                            value={this.state.discounts[index].percent}
                            disabled={(!this.state.discounts[index].contentTable) || !this.state.discounts[index].isActive}
                            onChange={(e) => this.handleChangeInList(e, index)} />
                    </th>
                    <th>
                        <textarea
                            rows="5"
                            id="promdescription"
                            name="promdescription"
                            value={this.state.discounts[index].description}
                            disabled={(!this.state.discounts[index].contentTable) || !this.state.discounts[index].isActive}
                            onChange={(e) => this.handleChangeInList(e, index)}
                        ></textarea>


                    </th>
                    <th>
                        <button id="active"
                            className={this.state.discounts[index].isActive ? 'btn btn-primary' : "btn btn-grey"}
                            onClick={() => this.handleActive(this.state.discounts[index])}
                            disabled={(!this.state.discounts[index].contentTable)}
                            value={this.state.discounts[index].isActive}
                        >
                            {this.state.discounts[index].isActive ? 'On' : 'Off'}
                        </button>
                    </th>
                    <th>
                        <button id='save_edit_disc_btn'
                            onClick={() => { this.discountEditButton(index) }
                            }
                            type="button" className="btn btn-primary mr-sm-4 "
                            data-target="#DiscountEditResultModal">
                            {this.state.discounts[index].contentTable ? "Save Change" : "Edit"}

                        </button>
                    </th>
                    <th>
                        <button
                            id='delete_btn'
                            type="button"
                            className="btn btn-danger btn-sm mr-sm-2"
                            onClick={() => { this.discountDeleteButton(index) }}
                            data-toggle="modal"
                            data-target="#DiscountDDeleteResultModal"
                        >
                            Delete
                        </button>
                    </th>
                </tr>
            )
        })
    }

    render() {
        const { isError } = this.state;
        const modal = this.state.modal
        const handleClose = () => {
            this.setState({
                modal: {
                    isModalShow: false,
                    modalTitle: modal.modalTitle,
                    modalText: modal.modalText,
                    className: modal.className,
                }
            })
        }
        return (
            <MainContainer>
                {this.state.resultsErr
                    ?
                    FullscreenError("An error occured, please try again later")
                    :
                    null
                }
                {this.state.isLoading ?
                    FullScrrenLoading({ type: 'balls', color: '#000' }) : null
                }



                <div className="container">
                    <div>
                        <br />
                        <h4>Discount Promotion</h4>
                        <hr />
                        <p>Add discounts or promotions here</p>
                        <div className="form-group row">
                            <label
                                htmlFor="discdescription"
                                className="col-sm-3 col-form-label"
                            >
                                Discount/Promotion
                      </label>
                            <div className="col-sm-2">
                                <input
                                    className={
                                        isError.discdescription.length > 6
                                            ? "is-invalid form-control"
                                            : "form-control"
                                    }
                                    rows="1"
                                    id="discdescription"
                                    name="discdescription"
                                    value={this.state.discdescription}
                                    onChange={this.handleChange}

                                ></input>
                                <span className="invalid-feedback">
                                    {Parser(isError.discdescription)}
                                </span>
                            </div>
                            <label
                                htmlFor="discdescription"
                                className="col-sm-2 col-form-label"
                            >
                                %
                      </label>
                        </div>

                        <div className="form-group row">
                            <label
                                htmlFor="promdescription"
                                className="col-sm-3 col-form-label"
                            >
                                Discount/Promotion Description
                      </label>
                            <div className="col-md-8">
                                <textarea
                                    className={
                                        isError.promdescription.length > 6
                                            ? "is-invalid form-control"
                                            : "form-control"
                                    }
                                    rows="5"
                                    id="promdescription"
                                    name="promdescription"
                                    value={this.state.promdescription}
                                    onChange={this.handleChange}

                                ></textarea>
                                <span className="invalid-feedback">
                                    {Parser(isError.promdescription)}
                                </span>
                            </div>
                        </div>

                        <button type="button"
                            onClick={this.handleAddDiscount}
                            className="btn btn-info"
                            data-toggle="modal"
                            data-target="#addDiscountResultModal">
                            Add Discount
                    </button>

                    </div>

                    <br />
                    <br />
                    <div>
                        <h4>Discount/Promotion List</h4>
                        <hr />
                        <table id="discount" className="table table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">%</th>
                                    <th scope="col">Description</th>
                                    <th>Activate</th>
                                    <th scope="col"></th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.renderDataDiscount()}
                            </tbody>


                        </table>

                    </div>

                </div>

                <Modal show={modal.isModalShow} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{modal.modalTitle} </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className={modal.className}>{modal.modalText}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

            </MainContainer>
        )
    }



}

export default Discount;