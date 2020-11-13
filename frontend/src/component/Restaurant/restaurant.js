import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import MainContainer from '../../component/Style/MainContainer';
import { withRouter } from "react-router";
import './RestaurantDetails.css'
import ResReview from '../Review/Restaurant/ResReview';
import ViewMenu from '../Menu/ViewMenu';
import FullscreenError from '../../component/Style/FullscreenError'
import FullScrrenLoading from '../../component/Style/FullscreenLoading';
import { GiKnifeFork } from "react-icons/gi";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { AiOutlineShop, AiOutlinePhone } from "react-icons/ai";
import { RiTimeLine, RiMapPin2Line, RiPercentLine } from "react-icons/ri";
import serverAddress from '../../Services/ServerUrl';
import dataService from '../../Services/dataService';

class Restaurant extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: this.props.match.params.id,
            date: this.props.match.params.date,
            time: this.props.match.params.time,
            numOfPeople: this.props.match.params.numOfPeople,
            res: [],
            resultsErr: false,
            isResLoaded: false,
            discount: {},
            discountIsAtLeastOneActive: false,
        }
    }


    async componentWillMount() {
        dataService.getRestaurantWithoutAuth(this.state.id)
            .then(res => {
                console.log(res.discount)
                for(var dis of res.discount) {
                    if(dis.isActive){
                        this.setState({discountIsAtLeastOneActive: true})
                        break;
                    }
                }
                this.setState({
                    res: res.restaurant,
                    isResLoaded: true,
                    discount: res.discount,
                })
            })
    }

    render() {
        return (

            <MainContainer>

                {this.state.resultsErr
                    ?
                    FullscreenError("An error occured, please try again later")
                    :
                    null
                }


                {!this.state.isResLoaded
                    ?
                    FullScrrenLoading({ type: 'cubes', color: '#000' })
                    :
                    null
                }

                <div className="card mb-3">
                    <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
                        <ol className="carousel-indicators" id="indicator">
                            {this.state.res.pictures ? this.state.res.pictures.map((v, i, array) => {
                                return <li key={v} data-target="#carouselExampleIndicators" data-slide-to={i.toString()} className={i === 0 ? 'active' : ''}></li>
                            }) : null}
                        </ol>
                        <div className="carousel-inner">
                            {this.state.res.pictures ? this.state.res.pictures.map((v, i, array) => {
                                return <div key={v} className={i === 0 ? 'active carousel-item' : 'carousel-item'}>
                                    <img id="carousel_pictures" className="d-inline-block" src={serverAddress + '/getImage/' + v} alt="Restaurant" />
                                </div>
                            }) : null}
                        </div>
                    </div>


                    <div className="card-body">
                        <h5 className="card-title">{this.state.res.resName}</h5>
                        <hr />
                        <p className="card-text">{this.state.res.restaurantDescription}</p>
                        <br />
                        <br />
                        <div className="row">
                            <div className="col-sm-8">
                                <h5>Menu</h5>
                                <hr />
                                <ViewMenu resId={this.state.id} />
                                <br />
                                <h5>Reviews</h5>
                                <hr />
                                <ResReview resId={this.state.id} />

                            </div>
                            <div className="col-sm-4">
                                <h5>Make a reservation</h5>
                                <hr />
                                <p>Click the button to make a reservation</p>
                                <Link to={() => {
                                    var tr = '/customerreserve/' + this.state.id
                                    if (this.state.date) tr += ('/' + this.state.date)
                                    if (this.state.time) tr += ('/' + this.state.time)
                                    if (this.state.numOfPeople) tr += ('/' + this.state.numOfPeople)
                                    return tr;
                                }} className="btn btn-primary">Reserve Here</Link>
                                <br />
                                <br />
                                <h5>Restaurant Information</h5>
                                <hr />
                                <h6><RiMapPin2Line />  Address</h6>
                                <p>{this.state.isResLoaded ? this.state.res.addressId.streetNum : null} {this.state.isResLoaded ? this.state.res.addressId.streetName : null} {this.state.isResLoaded ? this.state.res.addressId.city : null}  {this.state.isResLoaded ? this.state.res.addressId.province : null} {this.state.isResLoaded ? this.state.res.addressId.postalCode : null}</p>
                                <hr />
                                <h6><AiOutlinePhone /> Phone Number</h6>
                                <p>{this.state.isResLoaded ? this.state.res.phoneNumber : null}</p>
                                <hr />
                                <h6><RiTimeLine />  Store Time</h6>
                                <p>Monday {this.state.isResLoaded ? (this.state.res.monIsClose ? "Close" : this.state.res.monOpenTimeId.storeTimeName) : null} - {this.state.isResLoaded ? (this.state.res.monIsClose ? "Close" : this.state.res.monOpenTimeId.storeTimeName) : null}</p>
                                <p>Tuesday {this.state.isResLoaded ? (this.state.res.tueIsClose ? "Close" : this.state.res.tueOpenTimeId.storeTimeName) : null} - {this.state.isResLoaded ? (this.state.res.tueIsClose ? "Close" : this.state.res.tueOpenTimeId.storeTimeName) : null}</p>
                                <p>Wednesday {this.state.isResLoaded ? (this.state.res.wedIsClose ? "Close" : this.state.res.wedOpenTimeId.storeTimeName) : null} - {this.state.isResLoaded ? (this.state.res.wedIsClose ? "Close" : this.state.res.wedOpenTimeId.storeTimeName) : null}</p>
                                <p>Thursday {this.state.isResLoaded ? (this.state.res.thuIsClose ? "Close" : this.state.res.thuOpenTimeId.storeTimeName) : null} - {this.state.isResLoaded ? (this.state.res.thuIsClose ? "Close" : this.state.res.thuCloseTimeId.storeTimeName) : null}</p>
                                <p>Friday {this.state.isResLoaded ? (this.state.res.friIsClose ? "Close" : this.state.res.friOpenTimeId.storeTimeName) : null} - {this.state.isResLoaded ? (this.state.res.friIsClose ? "Close" : this.state.res.friCloseTimeId.storeTimeName) : null}</p>
                                <p>Saturday {this.state.isResLoaded ? (this.state.res.satIsClose ? "Close" : this.state.res.satOpenTimeId.storeTimeName) : null} - {this.state.isResLoaded ? (this.state.res.satIsClose ? "Close" : this.state.res.satCloseTimeId.storeTimeName) : null}</p>
                                <p>Sunday {this.state.isResLoaded ? (this.state.res.sunIsClose ? "Close" : this.state.res.sunOpenTimeId.storeTimeName) : null} - {this.state.isResLoaded ? (this.state.res.sunIsClose ? "Close" : this.state.res.sunCloseTimeId.storeTimeName) : null}</p>

                                <hr />
                                <h6><GiKnifeFork />  Cuisine Style</h6>
                                <p>{this.state.isResLoaded ? this.state.res.cuisineStyleId.cuisineName : null}</p>
                                <hr />
                                <h6><AiOutlineShop />  Category</h6>
                                <p>{this.state.isResLoaded ? this.state.res.categoryId.categoryName : null}</p>
                                <hr />
                                <h6><FaRegMoneyBillAlt />  Price Range</h6>
                                <p>{this.state.isResLoaded ? this.state.res.priceRangeId.priceRangeName : null} </p>
                                <hr />
                                <h5><RiPercentLine />  Promotions</h5>
                                {this.state.isResLoaded ? (this.state.discountIsAtLeastOneActive ? this.state.discount.map((v, i, discounts) => {
                                    return v.isActive ? <p key={'disc_'+v._id}>{v.percent + "% Off " + (v.description ? v.description : '')}</p> : null
                                }) : "No Promotions at the momemnt") : null}
                            </div>
                        </div>
                    </div>
                </div>

            </MainContainer>

        )
    }

}

export default withRouter(Restaurant)