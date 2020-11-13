import React, { Component } from 'react'
import MainContainer from "../Style/MainContainer";
import ds from "../../Services/dataService"
import $ from "jquery";
import FullscreenError from '../Style/FullscreenError'
import serverAddress from '../../Services/ServerUrl';
import FullScrrenLoading from '../Style/FullscreenLoading';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import ImageNotFound from '../../Image/image-not-available.jpg'


const regExpPrice = RegExp(
    /(\d+\.\d{2,2})/g
);

const formValid = ({ isError, ...rest }) => {
    let isValid = false;

    Object.values(isError).forEach((val) => {
        if (val.length > 0) {
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
            menuType: "",
            isImage: false,
            disabled: true,
            contenteditable: false,

            isError: {
                MenuPicture: '&#160;',
                menuName: '&#160;',
                menuPrice: '&#160;',
                menuDescript: '&#160;'
            },
            resultsErr: false,
            isLoading: false,
            modal: {
                isModalShow: false,
                modalTitle: '',
                modalText: '',
                className: '',
            }
        };
        this.onImageChange = this.onImageChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.renderTableData = this.renderTableData.bind(this);
        this.addMenuWithImage = this.addMenuWithImage.bind(this);
        this.editMenuWithImage = this.editMenuWithImage.bind(this);
        this.menuItemEditButton = this.menuItemEditButton.bind(this);
        this.menuItemDeleteButton = this.menuItemDeleteButton.bind(this);
        this.handleChangeInList = this.handleChangeInList.bind(this);
        this.setModal = this.setModal.bind(this);
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

    onImageChange = (event, index) => {
        if (event.target.files && event.target.files[0]) {
            let img = event.target.files[0];
            if (index !== undefined) {//in menu item  TRY YOUR BEST REWRITE THIS CODE 
                this.state.menus[index].MenuPicture = URL.createObjectURL(img)
                this.state.menus[index].image = img
                this.forceUpdate();
            } else {
                this.setState({
                    image: event.target.files[0],
                    isImage: true
                })
            }

        }
    };


    handleChangeInList(e, index) {
        e.preventDefault();
        const { name, value } = e.target;
        let isError = { ...this.state.isError };
        switch (name) {
            case "menuName":
                isError.menuName =
                    value.length >= 2 && value.length <= 32 ? "&#160;" : "Atleast 2 character required";
                break;
            case "menuPrice":
                isError.menuPrice =
                    regExpPrice.test(value) ? "&#160;" : "Atleast 1 character required";
                break;
            case "menuDescript":
                isError.menuDescript =
                    value.length >= 5 && value.length <= 100 ? "&#160;" : "Atleast 5 character required";
                break;
            default:
                break;
        }
        this.state.menus[index][e.target.name] = e.target.value; //Set state does not allow to set an object inside of an array
        this.forceUpdate(); //forcing udpate the UI
    }

    handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        let isError = { ...this.state.isError };
        switch (name) {
            case "menuName":
                isError.menuName =
                    value.length >= 2 && value.length <= 32 ? "&#160;" : "Atleast 2 character required";
                break;
            case "menuPrice":
                isError.menuPrice =
                    regExpPrice.test(value) ? "&#160;" : "Atleast 1 character required";
                break;
            case "menuDescript":
                isError.menuDescript =
                    value.length >= 5 && value.length <= 100 ? "&#160;" : "Atleast 5 character required";
                break;
            default:
                break;
        }
        this.setState({
            isError,
            [e.target.id]: e.target.value,
        });
    };

    componentWillMount() {
        this.queryMenus();
    }

    async queryMenus() {
        this.setState({ isLoading: true })
        this.setState({ menus: [] })
        let menuContents = await ds.getMenus();
        menuContents = menuContents.menus;

        if (typeof menuContents !== 'undefined') {

            for (var i = 0; i < menuContents.length; i++) {
                if (typeof menuContents[i].menuImageId !== 'undefined') {
                    var imageId = { imageId: menuContents[i].menuImageId };
                    menuContents[i].menuPicture = await ds.getImage(imageId);
                } else {
                    menuContents[i].menuPicture = {
                        isImage: false,
                        file: ''
                    }
                }
            }

            this.setState({
                menus: menuContents
            });
        }

        this.setState({ isLoading: false })
    }

    async addMenuWithImage(state) {
        this.setState({ isLoading: true })
       // var menuImageId = ""

        if (state.isImage) {
            const formData = new FormData();
            formData.append('menuImage', state.image);
            const config = {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }
            var menuImageId = await ds.addMenuImage(formData, config);
            state.menuImageId = menuImageId;
        }

        await ds.addMenu(state).then(() => {

        }).finally(async (res) => {
            await this.queryMenus();
            this.setState({ isLoading: false })
        })
    }

    async editMenuWithImage(state) {
        this.setState({ isLoading: true })


        if (typeof state.image !== 'undefined') {
            ds.deleteImage(state.menuImageId);
            var formData = new FormData();
            formData.append('menuImage', state.image);
            const config = {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }
            var menuImageId = await ds.editMenuImage(formData, config);
            state.menuImageId = menuImageId;
        }

        await ds.editMenu(state).then(() => {
            this.queryMenus();
        }).catch(err => {
            console.log(err)
        }).finally(() => {
            this.setState({ isLoading: true })
        })
    }


    handleSubmit = async (e) => {
        e.preventDefault();
        if (formValid(this.state)) {
            this.addMenuWithImage(this.state).then(()=>{
                this.setModal(true, 'Success', 'Successfully added menu', 'alert alert-success')
            }).catch((err)=>{
                console.log(err)
                this.setModal(true, 'Failed', 'Failed to added menu', 'alert alert-danger')
            })

        } else {
            console.log("Form is invalid!");
        }
    };

    menuItemDeleteButton(index) {
        var menu = this.state.menus[index];
        if (menu.menuPicture.isImage !== false) {
            ds.deleteImage(menu.menuImageId);
        }

        ds.deleteMenu(menu).then((res) => {
            this.queryMenus();
            this.setModal(true, 'Success', 'Successfully deleted menu', 'alert alert-success')

        }).catch(
            err => {
                this.setModal(true, 'Failed', 'Failed to delete menu item', 'alert alert-danger')
            })

    }

    menuItemEditButton(index) {
        this.state.menus[index].contenteditable = !this.state.menus[index].contenteditable;
        if (!this.state.menus[index].contenteditable) {
            this.editMenuWithImage(this.state.menus[index])
        }

        this.callModal(index);
    }

    //Edit profile - button
    callModal(index) {
        this.setState(state =>

            () => {
                if (this.state.menus[index].contenteditable) {
                    $('this.state.menus[index].#save_edit_btn').attr("data-toggle", 'modal').attr("data-target", '#EditResultModal').attr('type', 'button')
                }
                else {
                    $('this.state.menus[index].#save_edit_btn').attr("data-toggle", '').attr("data-target", '').attr("type", '')
                }
            });
    }




    renderTableData() {
        return this.state.menus.map((menu, index) => {
            const { MenuPicture, menuName, menuPrice, menuDescript } = menu
            return (
                <tr key={index} id={'menurow' + index}>

                    <td contentEditable={(this.state.contenteditable)} >
                        <div>

                            <div className="container">
                                <div className="row">
                                    <input type="file" name="MenuPicture" id="MenuPicture" defaultValue={MenuPicture}
                                        onChange={(e) => this.onImageChange(e, index)} disabled={(!this.state.menus[index].contenteditable)} />

                                    {
                                        this.state.menus[index].contenteditable ?

                                            <img id={"MenuPicture" + index} style={{ maxHeight: '100%', maxWidth: '100%' }} src={this.state.menus[index].MenuPicture} alt="Menu" />
                                            :

                                            <div>
                                                <img id={"MenuPicture" + index} style={{ maxHeight: '100%', maxWidth: '100%' }} src={this.state.menus[index].menuImageId ? serverAddress + '/getImage/' + this.state.menus[index].menuImageId : ImageNotFound} alt="Menu" />

                                            </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </td>

                    <td>
                        <div className="container-fluid">
                            <div className="form-inline">
                                <input type="text" id={"menuName" + index} name="menuName" defaultValue={menuName} onChange={(e) => this.handleChangeInList(e, index)}
                                    className="border-none" disabled={(!this.state.menus[index].contenteditable)} />
                            </div>
                            <div className="form-inline">
                                <input type="text" id={"menuPrice" + index} name="menuPrice" defaultValue={menuPrice} onChange={(e) => this.handleChangeInList(e, index)}
                                    className="border-none" disabled={(!this.state.menus[index].contenteditable)} />
                            </div>
                            <div className="form-inline" >
                                <select className="form-conrol"
                                    id="menuType"
                                    name="menuType"
                                    defaultValue={this.state.menus[index].foodType}
                                    onChange={(e) => this.handleChangeInList(e, index)}
                                    disabled={(!this.state.menus[index].contenteditable)}
                                    required
                                >
                                    <option value="">Please select the food type</option>
                                    <option value="Appetizer">Appetizer</option>
                                    <option value="Main"> Main Dish </option>
                                    <option value="Desert"> Desert</option>
                                    <option value="Drint"> Drink</option>
                                </select>
                            </div>
                            <div className="form-inline" >
                                <select className="form-conrol"
                                    id="menuAllergy"
                                    name="menuAllergy"
                                    defaultValue={this.state.menus[index].allergy}
                                    onChange={(e) => this.handleChangeInList(e, index)}
                                    disabled={(!this.state.menus[index].contenteditable)}
                                    required
                                >
                                    <option value="">Please select the allergy alert</option>
                                    <option value="No Nut">No Nut</option>
                                    <option value="Nut">Nut</option>
                                    <option value="Seafood">Seafood</option>
                                    <option value="Dairy">Dairy</option>
                                </select>
                            </div>
                            <div className="form-inline">
                                <textarea row="3" id={"menuDescript" + index} name="menuDescript" defaultValue={menuDescript} onChange={(e) => this.handleChangeInList(e, index)}
                                    className="form-control border-none " disabled={(!this.state.menus[index].contenteditable)} />
                            </div>

                        </div>
                    </td>
                    <td >
                        <div className="form-group row">

                            <button
                                id='save_edit_btn'
                                type="button"
                                className="btn btn-primary btn-sm mr-sm-2"
                                onClick={() => this.menuItemEditButton(index)}
                            >
                                {this.state.menus[index].contenteditable ? "Save Change" : "Edit"}
                            </button>

                        </div>
                    </td>
                    <td >
                        <div className="form-group row">
                            <button
                                id='delete_btn'
                                type="button"
                                className="btn btn-danger btn-sm mr-sm-2"
                                onClick={() => this.menuItemDeleteButton(index)}
                                data-toggle="modal" data-target="#DeleteResultModal"
                            >
                                Delete
                    </button>
                        </div>
                    </td>
                </tr>
            )
        })
    }

    handleClick() {
        this.setState({ disabled: !this.state.disabled })
        this.setState({ contenteditable: !this.state.contenteditable })
        this.changeText();
    }



    render() {
        const { isError } = this.state;
        const modal = this.state.modal
        const handleClose = () =>{
            this.setState({
                modal:{
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
                <form onSubmit={this.handleSubmit} id="addMenu">
                    <div className="form-inline form-group mt-sm-4">
                        <h3> Add Menu </h3>
                        <button type="submit" className="btn btn-info ml-sm-5"
                        > Save </button>
                    </div>

                    {/* add menu */}
                    <div id="menu">
                        <div className="row">
                            <div className="col-sm-3 border">
                                <div className="container">
                                    <div className="row">
                                        <input type="file" name="menuPicture" id="menuPicture" onChange={this.onImageChange} />
                                        <img src={this.state.image ? URL.createObjectURL(this.state.image) : ImageNotFound} style={{ maxHeight: '100%', maxWidth: '100%' }} alt="Menu" />

                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-9 border">
                                <div className="col container-fluid">
                                    <div className="form-inline mb-2" >
                                        <label htmlFor="menuName" className="col-sm-2 border-0">Name </label>
                                        <input type="text" id="menuName" name="menuName" 
                                        //className="form-control col-smd-10 mt-sm-2"
                                         value={this.state.menuName}
                                            className={isError.menuName.length > 6 ? "is-invalid form-control" : "form-control"} onChange={this.handleChange} required
                                        />
                                    </div>
                                    <div className=" form-inline mb-2">
                                        <label htmlFor="menuPrice" className="col-sm-2 border-0">Price</label>
                                        <input type="text" id="menuPrice" name="menuPrice" 
                                       // className="form-control col-sm-10 mt-sm-2" 
                                        placeholder="price format: 12.30" value={this.state.menuPrice}
                                            className={isError.menuPrice.length > 6 ? "is-invalid form-control" : "form-control"} onChange={this.handleChange} required />
                                    </div>
                                    <div className=" form-inline mb-2">
                                        <label htmlFor="menuType" className="col-sm-2 border-0">Menu Type</label>
                                        <select className="form-conrol"
                                            id="menuType"
                                            name="menuType"
                                            value={this.state.menuType}
                                            onChange={this.handleChange}
                                            required
                                        >
                                            <option value="">Please select the food type</option>
                                            <option value="Appetizer">Appetizer</option>
                                            <option value="Main"> Main Dish </option>
                                            <option value="Desert"> Desert</option>
                                            <option value="Drint"> Drink</option>
                                        </select>

                                    </div>
                                    <div className="form-inline" >
                                        <label htmlFor="allergy" className="col-sm-2 border-0">Allergy</label>
                                        <select className="form-conrol"
                                            id="menuAllergy"
                                            name="menuAllergy"
                                            value={this.state.menuAllergy}
                                            onChange={this.handleChange}
                                            required
                                        >
                                            <option value="">Please select the allergy alert</option>
                                            <option value="No Nut">No Nut</option>
                                            <option value="Nut">Nut</option>
                                            <option value="Seafood">Seafood</option>
                                            <option value="Dairy">Dairy</option>
                                        </select>
                                    </div>
                                    <div className="form-inline">
                                        <label htmlFor="menuDescript" className="col-sm-2 border-0">Description</label>
                                        <textarea row="3" required type="text" id="menuDescript" name="menuDescript" 
                                        //className="form-control col-sm-10 mt-sm-2 mb-sm-2" 
                                        value={this.state.menuDescript}
                                            className={isError.menuDescript.length > 6 ? "is-invalid form-control" : "form-control"} onChange={this.handleChange} 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>


                {/* Menu List */}
                <h3><br />
                    <br />Menu List</h3>
                <table id='menus' className="table table-striped col-md-12">
                    <thead>
                        <tr>
                            <th >Image</th>
                            <th className="col-md-5" >Menu Detail</th>
                            <th >Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderTableData()}
                    </tbody>
                </table>


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

                {/* DeleteMenuModal */}


            </MainContainer>
        );
    }
}


export default Menu;