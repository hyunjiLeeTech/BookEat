import React, { Component } from 'react'
import MainContainer from "../component/Style/MainContainer";
import "./EditMenu.js"
import ds from "../Services/dataService"



class Menu extends Component {
    constructor(props) {
        super(props)
        this.state = {
            //Oringin
            menus: [{
            }],

            menuPicture: "",
            menuName: "",
            menuPrice: "",
            menuDescript: "",
           

        };
   
        this.renderMenuInfo = this.renderMenuInfo.bind(this);
    
    }


    componentWillMount() {
        this.queryMenus();
    }

    queryMenus() {
        ds.getMenus().then((res) => {
            console.log(res.menus);
            this.setState({
                menus: res.menus
            })
        })
    }

    renderMenuInfo() {
        var rows = [];
        console.log("this is state menu: " + this.state.menus);
        if (typeof this.state.menus != "undefined") {

            for (var menu of this.state.menus) {
                rows.push(
                    <tr key={rows}>
                        <td>{menu.menuPicture}</td>
                        <td>{menu.menuName}</td>
                         <td>{menu.menuDescript}</td>
                        <td>{menu.menuPrice}</td>
                       
                    </tr>
                )
            }
        }
    }

    render() {
        return (
            <MainContainer>
                <table id='menus' className="table table-striped col-md-12">
                    <thead>
                        <tr>
                            <th></th>
                            <th >Name</th> 
                            <th className="col-md-5" >Description</th>
                            <th >Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderMenuInfo()}
                    </tbody>
                </table>

            </MainContainer>
        );
    }
}




export default Menu;
