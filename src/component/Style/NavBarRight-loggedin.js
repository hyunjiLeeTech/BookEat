import React from 'react'
import { NavLink } from 'react-router-dom'
import authService from '../../Services/AuthService';

export default function () {
    const user = authService.getCurrentUser();
    var renderProfileButtom = function () {
        //console.log(user);
        if (user !== null) {
            switch (user.user.userTypeId) {
                case 1:
                    return (<NavLink to="/viewcustomerprofile" className="nav-link">{ user === null ? "Unknown user " : user.user.email}</NavLink>)
                case 2:
                    return (<NavLink to="/restaurantprofile" className="nav-link">{ user === null ? "Unknown user " : user.user.email}</NavLink>)
                case 3:
                    return (<NavLink to="/managerprofile" className="nav-link">{ user === null ? "Unknown user " : user.user.email}</NavLink>)
                default:
                    return (null)
            }
        } else {
            return (null)
        }
    }

    return (
        <ul className="navbar-nav navbar-right">
            <li className="nav-item">
                <label className="nav-link disabled" id="user-status-indicator"></label>
            </li>
            <li className="nav-item">
                {renderProfileButtom()}
            </li>
            <li className="nav-item">
                <NavLink to="/logout" className="nav-link">logout</NavLink>
            </li>
        </ul>
    )
}