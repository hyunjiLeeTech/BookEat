import React, { Component } from 'react'
import authService from '../../Services/AuthService';
import './Logout.css'
import MainContainer from '../Style/MainContainer';
import $ from 'jquery';

class Logout extends Component {
    componentDidMount() {
        //const user = authService.getCurrentUser();
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        if(urlParams.has("message")){
            $("#LogoutMessage").text(urlParams.get("message"));
        }
        authService.logout().then(res=>{
            $("#LogoutMessage").text(res.data.errmsg);
            $("#LogoutHint").text("We will redirect for you soon");
            setTimeout(function () {
                if (urlParams.has("redirectUrl")) {
                    window.location.href = urlParams.get("redirectUrl");
                }else{
                    window.location.href = '/'
                }
            }, 2000)
        }).catch(err => {
            console.log(err);
            $("#LogoutMessage").text("You are logged out");
            $("#LogoutHint").text("We will redirect for you soon");
            setTimeout(function () {
                if (urlParams.has("redirectUrl")) {
                    window.location.href = urlParams.get("redirectUrl");
                }else{
                    window.location.href = '/'
                }
            }, 2000)
        })



    }

    render() {
        return (
            //partial code from https://tobiasahlin.com/spinkit/, modified.
            <MainContainer>
                <div>
                    <div className="sk-folding-cube">
                        <div className="sk-cube1 sk-cube"></div>
                        <div className="sk-cube2 sk-cube"></div>
                        <div className="sk-cube4 sk-cube"></div>
                        <div className="sk-cube3 sk-cube"></div>
                    </div>
                    <div id="LogoutMessageWrapper">
                        <p id="LogoutMessage">Signing you out</p>

                        <p id="LogoutHint">Please wait for Signing out.</p>
                    </div>
                </div>
            </MainContainer>
        )
    }

}


export default Logout;