import React, { Component } from 'react'
import MainContainer from '../Style/MainContainer'
import SearchBox from './SearchBox';
import './SearchResult.css'
import dataService from '../../Services/dataService';
import FullscreenLoading from '../Style/FullscreenLoading'
import { Link } from 'react-router-dom';
import FullscreenError from '../Style/FullscreenError'
import { GiKnifeFork } from "react-icons/gi";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { AiOutlineShop } from "react-icons/ai";
import serverAddress from '../../Services/ServerUrl';
import moment from 'moment'

class SearchResult extends Component {

    constructor(props) {
        super(props)
        this.state = {
            numberOfPeople: 8,
            dateTime: new Date('2020-07-21 23:00'),
            restaurants: [],
            filters: {
                priceRange: new Set(),
                cuisine: new Set(),
                category: new Set(),
            },
            categoriesReady: false,
            cuisinesReady: false,
            priceRangesReady: false,
            resultsReady: false,
            resultsErr: false,
            keyword: '',
            times: [],
            errmsg: null,
        }
        this.querySearchResults = this.querySearchResults.bind(this);
        this.handleCheck = this.handleCheck.bind(this);

    }
    componentWillMount() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        var dt = new Date(urlParams.get('dateTime'))
        var numberOfPeople = urlParams.get('numOfPeople')
        var keyword = urlParams.get('keyword')

        //var restopentime = this.state.restaurants[0].monOpenTime; //ID
        //find this ID in times array 
        // for(var time of this.state.times){
        //     if(restopentime === time._id){
        //         restopentime = time.storeTimeName; // 7:00AM
        //     }
        // }
        if (this.state.keyword != null)
            this.state.keyword = keyword;

        if (Object.prototype.toString.call(dt) === "[object Date]") {
            // it is a date
            if (isNaN(dt.getTime())) {  // d.valueOf() could also work
                this.state.resultsErr = true
                this.state.errmsg ='Date and time are required, please go back and search again.'
                this.forceUpdate();
            } else {
                //set state is an async function. we need sync set date time here
                this.state.dateTime = urlParams.get('dateTime')
            }
        } else {
            // not a date
        }


        if (!isNaN(Number.parseInt(numberOfPeople))) {
            this.state.numberOfPeople = Number.parseInt(numberOfPeople)
        } else {
            this.state.resultsErr = true
            this.state.errmsg ='Number of people is required, please go back and search again.'
            this.forceUpdate();
        }

        if (!this.state.resultsErr) {
            dataService.getCategories().then(res => {
                this.categories = res;
                this.setState({ categoriesReady: true })
            })

            dataService.getCuisines().then(res => {
                this.cuisines = res;
                this.setState({ cuisinesReady: true })
            })

            dataService.getPriceRanges().then(res => {
                this.priceRanges = res;
                this.setState({ priceRangesReady: true })
            })

            this.querySearchResults();
        }
    }

    querySearchResults() {
        this.setState({
            resultsReady: false
        })
        dataService.search({
            numberOfPeople: this.state.numberOfPeople,
            dateTime: this.state.dateTime,
            filters: {
                priceRanges: Array.from(this.state.filters.priceRange),
                cuisines: Array.from(this.state.filters.cuisine),
                categories: Array.from(this.state.filters.category)
            },
            keyword: this.state.keyword,
        })
            .then(res => {
                this.setState({
                    restaurants: res.restaurants,
                    resultsReady: true
                });

            }).catch(err => {
                this.setState({
                    resultsErr: true
                });
            })

    }

    handleCheck(e) {
        const checked = e.target.checked
        const name = e.target.name
        switch (name) {
            case 'priceRange':
                if (checked) {
                    this.state.filters.priceRange.add(e.target.value)
                } else {
                    this.state.filters.priceRange.delete(e.target.value)
                }
                break;
            case 'categories':
                if (checked) {
                    this.state.filters.category.add(e.target.value)
                } else {
                    this.state.filters.category.delete(e.target.value)
                }
                break;
            case 'cuisines':
                if (checked) {
                    this.state.filters.cuisine.add(e.target.value)
                } else {
                    this.state.filters.cuisine.delete(e.target.value)
                }
                break;
            default:
                break;
        }

    }

    renderPriceRange(priceRanges) {
        var tr = [];
        var renderPriceRangeText = function (name) {
            switch (name) {
                case 'low':
                    return '$ ($0-$50)'
                case 'medium':
                    return '$$ ($50-$100)'
                case 'high':
                    return '$$$ ($100+)'
                default:
                    return ''
            }
        }

        for (var pr of priceRanges) {
            if (pr.priceRangeName !== '')
                tr.push(
                    <div className="form-check" key={'pr' + pr._id}>
                        <input name='priceRange' className="form-check-input" type="checkbox" value={pr._id} id={pr.priceRangeName} onChange={this.handleCheck} />
                        <label className="form-check-label" htmlFor={pr.priceRangeName}>
                            {
                                renderPriceRangeText(pr.priceRangeName)
                            }
                        </label>
                    </div>
                )
        }
        return tr;
    }


    renderCategory(categories) {
        var tr = [];
        for (var c of categories) {
            if (c.categoryVal !== '')
                tr.push(
                    <div className="form-check" key={'category' + c._id}>
                        <input name='categories' className="form-check-input" type="checkbox" value={c._id} id={c.categoryVal} onChange={this.handleCheck} />
                        <label className="form-check-label" htmlFor={c.categoryVal}>
                            {c.categoryName}
                        </label>
                    </div>
                )
        }
        return tr;
    }


    renderCuisineFirst5(cuisines) {
        var tr = [];
        var m = [];
        var len = cuisines.length;
        if (len > 5) len = 5
        for (var i = 0; i < len; i++) {
            m.push(cuisines[i]);
        }
        for (var c of m) {
            if (c.cuisineVal !== '')
                tr.push(
                    <div className="form-check" key={'cuisine' + c._id}>
                        <input name='cuisines' className="form-check-input" type="checkbox" value={c._id} id={c.cuisineVal} onChange={this.handleCheck} />
                        <label className="form-check-label" htmlFor={c.cuisineVal}>
                            {c.cuisineName}
                        </label>
                    </div>
                )
        }
        return tr
    }

    renderCuisineAfter5(cuisines) {
        var tr = [];
        var m = [];
        if (cuisines.length < 5) return [];
        for (var i = 5; i < cuisines.length; i++) {
            m.push(cuisines[i]);
        }
        for (var c of m) {
            if (c.cuisineVal !== '')
                tr.push(
                    <div className="form-check" key={'cuisine' + c._id}>
                        <input className="form-check-input" type="checkbox" value={c._id} id={c.cuisineVal} />
                        <label className="form-check-label" htmlFor={c.cuisineVal}>
                            {c.cuisineName}
                        </label>
                    </div>
                )
        }
        return tr
    }

    getCuisineNameById(id) {
        try {
            for (var c of this.cuisines) {
                if (c._id === id) return c.cuisineName;
            }
        } catch (err) {
            return null
        }

        return null;
    }

    getCategoryNameById(id) {
        try {
            for (var c of this.categories) {
                if (c._id === id) return c.categoryName;
            }
        } catch (err) {
            return null
        }

        return null;
    }

    getPriceRnageById(id) {
        var renderPriceRangeText = function (name) {
            switch (name) {
                case 'low':
                    return '$ ($0-$50)'
                case 'medium':
                    return '$$ ($50-$100)'
                case 'high':
                    return '$$$ ($100+)'
                default:
                    return ''
            }
        }
        try {
            for (var c of this.priceRanges) {
                if (c._id === id) return renderPriceRangeText(c.priceRangeName)
            }
        } catch (err) {
            return null
        }

        return null;
    }

    renderRestaurants(restaurants) {
        var tr = []
        for (var r of restaurants) {
            tr.push(
                <div className="card" key={"restaurant" + r._id}>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="card-block">
                                <Link to={'/restaurant/' + r._id + '/' + moment(new Date(this.state.dateTime)).format('YYYY-MM-DD/HH:mm')+'/'+this.state.numberOfPeople}><h6 className="card-title">{r.resName ? r.resName : 'unknown'}</h6> </Link>
                                <p className="card-text">{this.getPriceRnageById(r.priceRangeId)} {this.getCuisineNameById(r.cuisineStyleId)} {this.getCategoryNameById(r.categoryId)}</p>
                                <p className="card-text">{r.restaurantDescription}</p>
                                <Link to={'/customerreserve/' + r._id + '/' + moment(new Date(this.state.dateTime)).format('YYYY-MM-DD/HH:mm')+'/'+this.state.numberOfPeople} className="btn btn-primary">Reserve</Link>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <img className="card-img-bottom" src={serverAddress + '/getimage/' + r.pictures[0].toString()} alt="Restaurant"/>
                        </div>
                    </div>
                </div>
            )
        }
        return tr;


    }

    render() {
        return (
            <MainContainer>

                {this.state.resultsErr
                    ?
                    FullscreenError(this.state.errmsg ? this.state.errmsg : "An error occured, please try again later")
                    :
                    null
                }


                {(!this.state.categoriesReady || !this.state.priceRangesReady || !this.state.cuisinesReady || !this.state.resultsReady) && !this.state.resultsErr
                    ?
                    FullscreenLoading({ type: 'cylon', color: '#000' })
                    :
                    null
                }

                <div className="container">
                    <div className="card text-center">
                        <SearchBox />
                    </div>


                    {/* Filter Side of the Page */}
                    <div className="row">
                        <div className="col-sm-4">
                            <div >
                                <br />
                                <p><FaRegMoneyBillAlt />  Price Range</p>
                                <hr />
                                {this.state.priceRangesReady ? this.renderPriceRange(this.priceRanges) : null}

                            </div>

                            <div>
                                <br />
                                <p><GiKnifeFork />  Cuisine Style</p>
                                <hr />
                                {this.state.cuisinesReady ? this.renderCuisineFirst5(this.cuisines) : null}

                                <a href="#pageSubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">More</a>


                                <div className="collapse list-unstyled" id="pageSubmenu">
                                    {this.state.cuisinesReady ? this.renderCuisineAfter5(this.cuisines) : null}

                                </div>
                            </div>


                            <div>
                                <br />
                                <p><AiOutlineShop />  Category</p>
                                <hr />
                                {this.state.categoriesReady ? this.renderCategory(this.categories) : null}
                            </div>
                            <hr />
                            <button className='btn btn-primary' onClick={this.querySearchResults}>Apply filters</button>
                        </div>

                        {/* Results  */}
                        <div className="col-sm-8">
                            <br />
                            <h4>You search for "{this.state.keyword}"</h4>
                            <p> Restaurants availables</p>
                            <hr />

                            <section>
                                <div className="container">
                                    {this.renderRestaurants(this.state.restaurants)}
                                </div>
                            </section>

                        </div>
                    </div>

                </div>
            </MainContainer>


        )
    }
}

export default SearchResult;