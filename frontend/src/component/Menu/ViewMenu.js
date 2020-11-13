import React, { Component } from 'react'
import MainContainer from "../Style/MainContainer";
import ds from "../../Services/dataService"
import serverAddress from '../../Services/ServerUrl';
import $ from "jquery";
import DataTable from 'datatables.net';
import ImageNotFound from '../../Image/image-not-available.jpg'
$.DataTable = DataTable

class Menu extends Component {
    constructor(props) {
        super(props)
        this.state = {
            menus: [{
            }],
            resId: props.resId,
            menuPicture: "",
            menuName: "",
            menuPrice: "",
            menuDescript: "",
            foodType: "",
        };
        this.renderMenuInfo = this.renderMenuInfo.bind(this);
    }

    componentDidMount() {
        $(document).ready(function () {
            $('#menus').DataTable({
                "scrollY": "200px",
                "scrollCollapse": true,
                "paging": false,
                "sDom": 'lrtip',
                "bInfo": false,
            });
        });
    }

    componentWillMount() {
        this.queryMenus();
    }

    queryMenus() {
        ds.getMenusCustomer(this.state.resId).then((res) => {
            this.setState({
                menus: res.menus
            })
        })
    }

    renderMenuInfo() {
        var rows = [];
        if (typeof this.state.menus != "undefined") {
            for (var menu of this.state.menus) {
                rows.push(
                    <tr key={rows}>
                        <td>  <img src={menu.menuImageId ? serverAddress + '/getImage/' + menu.menuImageId : ImageNotFound} style={{ maxHeight: '100%', maxWidth: '100%' }} alt="Menu" /></td>
                        <td>{menu.menuName}</td>
                        <td> {menu.foodType}</td>
                        <td>{menu.allergy}</td>
                        <td>{menu.menuDescript}</td>
                        <td>{menu.menuPrice}</td>
                    </tr>
                )
            }
        }
        return rows;
    }

    render() {
        return (
            <MainContainer>
                <table id='menus' className="table table-striped col-md-12">
                    <thead>
                        <tr>
                            <th>Picture</th>
                            <th >Name</th>
                            <th>Type</th>
                            <th>Allergy</th>
                            <th>Description</th>
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