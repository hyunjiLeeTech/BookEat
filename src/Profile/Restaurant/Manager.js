import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import MainContainer from '../../component/Style/MainContainer'
import Parser from 'html-react-parser'

//Validation 
const regExpEmail = RegExp(
    /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/
);

const regExpPhone = RegExp(
    /^\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})$/
);


const formValid = ({ isError, ...rest }) => {
    let isValid = false;

    Object.values(isError).forEach(val => {
        if (val.length > 0) {
            isValid = false
        } else {
            isValid = true
        }
    });

    Object.values(rest).forEach(val => {
        if (val === null) {
            isValid = false
        } else {
            isValid = true
        }
    });

    return isValid;
};

class RestaurantProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            phonenumber: '',
            email: '',
            firstName: '',
            lastName: '',
            isError: {
                phonenumber: '&#160;',
                email: '&#160;',
                firstName: '&#160;',
                lastName: '&#160;'

            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    handleChange(e) {
        e.preventDefault();
        const { name, value } = e.target;
        let isError = this.state.isError;
        switch (name) {
            case "email":
                isError.email = regExpEmail.test(value)
                    ? "&#160;"
                    : "Invalid email address";
                break;
            case "phonenumber":
                isError.phonenumber = regExpPhone.test(value)
                    ? "&#160;" : "Phone Number is invalid";
                break;
            case "firstName":
                isError.firstName =
                    value.length >= 2 && value.length <= 32 ? "&#160;" : "Atleast 2 character required";

                break;
            case "lastName":
                isError.lastName =
                    value.length >= 2 && value.length <= 32 ? "&#160;" : "Atleast 2 character required";
                break;
            default:
                break;
        }
        this.setState({
            [e.target.id]: e.target.value
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if (formValid(this.state)) {
            console.log(this.state)
        } else {
            console.log("Form is invalid!");
        }

    }

    onClick() {
        // On click we change our state – this will trigger our `render` method
        this.setState({ showForm: true });
    }

    componentDidMount() {
        // Avoid spacing on the form

        // var t2 = document.getElementById("email");
        // t2.onkeypress = function (e) {
        //     if (e.keyCode === 32) return false;
        // }

        // var t6 = document.getElementById("phonenumber");
        // t6.onkeypress = function (e) {
        //     if (e.keyCode === 32) return false;
        // }

    }

    renderForm() {
        const { isError } = this.state;
        return (
            <form onSubmit={this.handleSubmit} noValidate>

                <div className="form-group row">
                    <label htmlFor="streetnumber" className="col-sm-2 col-form-label"> First Name</label>
                    <div className="col-sm-4">
                        <input type="text" id="firstName" name="firstName" value={this.state.firstName} placeholder="First Name"
                            className={isError.firstName.length > 6 ? "is-invalid form-control" : "form-control"} onChange={this.handleChange} required />
                        <span className="invalid-feedback">{Parser(isError.firstName)}</span>
                    </div>

                    <label htmlFor="streetname" className="col-sm-2 col-form-label"> Last Name</label>
                    <div className="col-sm-4">
                        <input type="text" id="lastName" name="lastName" value={this.state.lastName} placeholder="Last Name"
                            className={isError.lastName.length > 6 ? "is-invalid form-control" : "form-control"} onChange={this.handleChange} required />
                        <span className="invalid-feedback">{Parser(isError.lastName)}</span>
                    </div>
                </div>

                <div className="form-group row">

                    <label htmlFor="phonenumber" className="col-sm-2 col-form-label"> Phone Number</label>
                    <div className="col-md-4">
                        <input type="text" id="phonenumber" name="phonenumber" value={this.state.phonenumber} placeholder="Phone Number"
                            className={isError.phonenumber.length > 6 ? "is-invalid form-control" : "form-control"} onChange={this.handleChange} required />
                        <span className="invalid-feedback">{Parser(isError.phonenumber)}</span>
                    </div>
                </div>

                <div className="form-group row">
                    <label htmlFor="email" className="col-sm-2 col-form-label"> Email</label>
                    <div className="col-md-10">
                        <input type="email" id="email" name="email" value={this.state.email} placeholder="Email"
                            className={isError.email.length > 6 ? "is-invalid form-control" : "form-control"} onChange={this.handleChange} required />
                        <span className="invalid-feedback">{Parser(isError.email)}</span>
                    </div>
                </div>
                <button className="btn btn-danger">Submit</button>
            </form>
        );
    }

    renderView () {
        return(
            <button className="btn btn-danger"> Delete</button>
        )
    }

    render() {
        const { showForm } = this.state;
        return (
            <MainContainer>

                <div className="card">
                    <div className="card-header">
                        <ul className="nav nav-tabs card-header-tabs">
                            <li className="nav-item">
                                <Link to='/RestaurantProfile'>
                                    <button className="nav-link"> My Profile</button>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to='/'>
                                    <button className="nav-link" >Menu</button>
                                </Link>

                            </li>
                            <li className="nav-item">
                                <Link to='/Manager'>
                                    <button className="nav-link active" >Manager</button>
                                </Link>

                            </li>
                            <li className="nav-item">
                                <Link to='/ChangePassword'>
                                    <button className="nav-link">Password</button>
                                </Link>

                            </li>
                        </ul>
                    </div>
                    <div className="card-body">
                        <div className="panel-footer row ">
                            <div className="col-sm-6 text-left">
                                <button id="create" className="btn btn-primary" onClick={this.onClick}>Create New Manager</button>
                            </div>

                            <div className="col-sm-6 text-right">
                                <button id="view" className="btn btn-primary" onClick={this.onClick}>View Manager</button>
                            </div>

                        </div>
                        <br />
                       
                        {showForm && this.renderForm() }
                            { showForm && this.renderView() }
                    </div>
                </div>

            </MainContainer>
        )
    }

}

export default RestaurantProfile;