import React from 'react'
import { NavLink } from 'react-router-dom'
import NavBarRightLoggedin from './NavBarRight-loggedin';
import NavBarRightLoggedOut from './NavBarRight-loggedout';
import authService from '../../Services/AuthService';
import BookEat_logo from '../../Image/BookEat_logo-03.png';
import BookEat_logo_r from '../../Image/BookEat_logo-04.png';

const NavBar = () => {
    const user = authService.getCurrentUser();

    var renderProfileButtom = function () {
        //console.log(user);
        if (user !== null) {
            switch (user.user.userTypeId) {
                case 1:
                    return (<NavLink to="/viewcustomerprofile" className="nav-link">Profile</NavLink>)
                case 2:
                    return (<NavLink to="/restaurantprofile" className="nav-link">Profile</NavLink>)
                case 3:
                    return (<NavLink to="/managerprofile" className="nav-link">Profile</NavLink>)
                default:
                    return (null)
            }
        } else {
            return (null)
        }
    }

    if(user !== null){
        switch (user.user.userTypeId) {
            case 1:
                return (
                    <nav className="navbar navbar-expand-lg navbar-dark bg-info">
                        <NavLink to="/" className="nav-link"> 
                        <img src={BookEat_logo} alt="BookEat" height="28"/>
                        </NavLink>
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
            
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav mr-auto">
                                <li className="nav-item">
                                    <NavLink to="/" className="nav-link">Home</NavLink>
                                </li>
                                <li className="nav-item">
                                    {renderProfileButtom()}
                                </li>
                            </ul>
            
                            {user === null ? <NavBarRightLoggedOut /> : <NavBarRightLoggedin />}
            
                        </div>
                    </nav>
                )
            case 2:
                return (
                    <nav className="navbar navbar-expand-lg navbar-light bg-danger">
                        <NavLink to="/" className="nav-link"> 
                        <img src={BookEat_logo_r} alt="BookEat" height="28"/>
                        </NavLink>
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
        
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav mr-auto">
                                <li className="nav-item">
                                    <NavLink to="/" className="nav-link">Home</NavLink>
                                </li>
                                <li className="nav-item">
                                    {renderProfileButtom()}
                                </li>
                            </ul>
        
                            {user === null ? <NavBarRightLoggedOut /> : <NavBarRightLoggedin />}
        
                        </div>
                    </nav>
                )
            case 3:
                return (
                    <nav className="navbar navbar-expand-lg navbar-light bg-danger">
                        <NavLink to="/" className="nav-link"> 
                        <img src={BookEat_logo_r} alt="BookEat" height="28"/>
                        </NavLink>
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
        
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav mr-auto">
                                <li className="nav-item">
                                    <NavLink to="/" className="nav-link">Home</NavLink>
                                </li>
                                <li className="nav-item">
                                    {renderProfileButtom()}
                                </li>
                            </ul>
        
                            {user === null ? <NavBarRightLoggedOut /> : <NavBarRightLoggedin />}
        
                        </div>
                    </nav>
                )
            default:
                return (
                    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                        <NavLink to="/" className="nav-link"> 
                        <img src={BookEat_logo} alt="BookEat" height="28"/>
                        </NavLink>
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
        
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav mr-auto">
                                <li className="nav-item">
                                    <NavLink to="/" className="nav-link">Home</NavLink>
                                </li>
                                <li className="nav-item">
                                    {renderProfileButtom()}
                                </li>
                            </ul>
        
                            {user === null ? <NavBarRightLoggedOut /> : <NavBarRightLoggedin />}
        
                        </div>
                    </nav>
                )

        }
    }else{
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <NavLink to="/" className="nav-link"> 
                <img src={BookEat_logo} alt="BookEat" height="28"/>
                </NavLink>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <NavLink to="/" className="nav-link">Home</NavLink>
                        </li>
                        <li className="nav-item">
                            {renderProfileButtom()}
                        </li>
                    </ul>

                    {user === null ? <NavBarRightLoggedOut /> : <NavBarRightLoggedin />}

                </div>
            </nav>
        )
    }

}

export default NavBar;
