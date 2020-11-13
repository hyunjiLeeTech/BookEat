import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import ScrollMenu from 'react-horizontal-scrolling-menu';
import dataService from '../../Services/dataService';
import { toast } from 'react-toastify';
import serverAddress from '../../Services/ServerUrl';


class Favorite extends Component {
    constructor(props) {
        super(props)
        this.state = {
            restaruants: [
            ]
        }
        dataService.getFavorite().then(res=>{
            this.setState({restaruants: res.restaruants})
        }).catch(err=>{
            toast('error', {type: 'error'})
        })
    }



    renderRestaurant(r) {
        return (
            <div key={'favorite'+r._id} style={{ margin: '2rem', border: '1px solid #000', width: '15rem', height: '15rem' }}>
                <img src={ serverAddress + '/getImage/'+r.pictures[0]} height='100%' width='100%' alt="Restaurant"/>
                <Link to={'/restaurant/' + r._id}>{r.resName} </Link>
            </div>
        )

    }

    renderRestaurants() {
        var tr = [];
        for (var r of this.state.restaruants) {
            tr.push(this.renderRestaurant(r))
        }
        return tr;
    }


    render() {
        // const Arrow = ({ text, className }) => {
        //     return (
        //         <div style={{ fontSize: '3rem' }}
        //             className={className}
        //         >{text}</div>
        //     );
        // };
        // const ArrowLeft = Arrow({ text: '<', className: 'arrow-prev' });
        // const ArrowRight = Arrow({ text: '>', className: 'arrow-next' });

        // const ArrowLeft = Arrow({ text: '<', className: 'arrow-prev' });
        // const ArrowRight = Arrow({ text: '>', className: 'arrow-next' });

        return (
            <ScrollMenu
                // arrowLeft={ArrowLeft}
                // arrowRight={ArrowRight}
                data={this.renderRestaurants()}
            />
        )
    }
}

export default Favorite;