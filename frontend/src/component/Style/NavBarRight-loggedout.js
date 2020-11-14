import React from "react";
import {NavLink} from "react-router-dom";
export default function () {
  return (
    <ul className="navbar-nav navbar-right">
      <li className="nav-item">
        {/* <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a> */}
        <NavLink to="/signup" className="nav-link">
          Sign up
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/login" className="nav-link">
          Login
        </NavLink>
      </li>
    </ul>
  );
}
