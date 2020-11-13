import React, { Component } from "react";
import table_s from '../../Image/table-s.png'
import table_m from '../../Image/table-m.png' 
import table_l from '../../Image/table-l.png' 
import './Layout.css'
import $ from 'jquery';
import Carousel from 'react-bootstrap/Carousel'

class Layout extends Component {
    constructor(props) {
        super(props);
        if (props.tables) {
            this.tables = props.tables;
            this.state = {
                carouselIndex: 0,
                tables: props.tables,
            }
        }
        this.genCarousel = this.genCarousel.bind(this);
    }

    componentWillReceiveProps(nextProps){
        if(this.state.tables!==nextProps.tables){
            this.setState({tables: nextProps.tables})
        }
    }
    
    componentWillUpdate(){
        var tables = this.state.tables
        var row = [];
        for (var i in tables) {
            var theTable = tables[i];
            var cn = theTable.prefers + " r-table col-md-4 hovereffect animated bounce" + (theTable.isOpen ? " open" : " close");
            var tableImg = table_s;
            if (theTable.capacity <= 4) tableImg = table_s;
            else if (theTable.capacity <= 7) tableImg = table_m;
            else if (theTable.capacity <= 10) tableImg = table_l;
            row.push(
                <div key={theTable._id} className={cn + " r-table-s"} id={i}>
                    <img src={tableImg} className={theTable.isOpen ? " img-responsive" : ""} alt="Table"/>
                    {theTable.isOpen ?
                        <div className="overlay">
                            <h2>Click to Reserve</h2>
                        </div> : <div>
                            <div className="overlay">
                                <p className="info">Unavalible</p>
                            </div>
                        </div>}
                </div>
            )
        }

        this.rows = row;
    }

    componentDidUpdate(){

    }


    componentWillMount() {
        var tables = [];
        if (!this.state.tables)
            this.state.tables = tables;
        else {
            tables = this.state.tables;
        }
        var row = [];
        for (var i in tables) {
            var theTable = tables[i];
            var cn = theTable.prefers + " r-table col-md-4 hovereffect animated bounce" + (theTable.isOpen ? " open" : " close");
            var tableImg = table_s;
            if (theTable.capacity <= 4) tableImg = table_s;
            else if (theTable.capacity <= 7) tableImg = table_m;
            else if (theTable.capacity <= 10) tableImg = table_l;
            row.push(
                <div key={theTable._id} className={cn + " r-table-s"} id={i}>
                    <img src={tableImg} className={theTable.isOpen ? " img-responsive" : ""} alt="Table"/>
                    {theTable.isOpen ?
                        <div className="overlay">
                            <h2>Click to Reserve</h2>
                        </div> : <div>
                            <div className="overlay">
                                <p className="info">Unavalible</p>
                            </div>
                        </div>}
                </div>
            )
        }

     
        this.rows = row;
    }

    genCarousel(htmls) {
        const handleSelect = (selectedIndex, e) => {
            this.setState({ carouselIndex: selectedIndex });
        };
        var rows = []; //a list of row that contains 3 itmes 
        var tempItems = []; // a list of items. usually no more than 3;         
        for (var i in htmls) { //generate row
            i = Number.parseInt(i)

            if (i !== 0 && i % 3 === 0) {
                rows.push(<div key={"r" + rows.length} className="row">
                    {tempItems}
                </div>)
                tempItems = [];
            }
            tempItems.push(htmls[i])
        }
        if (tempItems.length !== 0) {
            rows.push(<div key={"r" + rows.length} className="row">
                {tempItems}
            </div>)
            tempItems = [];
        }



        var slides = [];
        var tempRows = [];


        for (var j in rows) { //generate slides
            j = Number.parseInt(j)
            if (j !== 0 && j % 3 === 0) {
                slides.push(<Carousel.Item key={'slide'+slides.length}>
                    <div style={{marginLeft: '15%', marginRight: '15%'}}>
                        {tempRows}
                    </div>
                </Carousel.Item>)
                tempRows = new Array();
            }
            tempRows.push(rows[j])
        }


        if (tempRows.length !== 0) {
            slides.push(<Carousel.Item  key={'slide'+slides.length}>
                <div style={{marginLeft: '15%', marginRight: '15%'}} >
                    {tempRows}
                </div>
            </Carousel.Item>)
            tempRows = [];
        }

        return (
            <Carousel activeIndex={this.state.carouselIndex} indicators={true} interval={null} onSelect={handleSelect}>
                {slides}
            </Carousel>
        );
    }

    componentDidMount() { 
        var reactThis = this; //get react reference.
        $(".r-table.open").on("click", function () {
            $('.r-table').css("background-color", "")
            var id = parseInt($(this).attr("id"));
            $(this).css("background-color", "red")
            reactThis.props.setTableId(reactThis.tables[id]._id);
            this.selectedTable = reactThis.tables[id];
        })
        var row = $('.carousel-item div.row img');
        row.first().one('load', function(){
            $('.carousel-item').css('min-height', $(this).height()*3+'px');
        })

    }

    render() {
        return (
            <div className="layoutwrapper" style={{background:'#aaaaaa'}}>
                {this.genCarousel(this.rows)}
            </div>
        )
    }
}

export default Layout