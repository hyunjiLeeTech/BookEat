import React, { Component } from 'react'
import './star.css'
class Star extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isClickAble: this.props.isClickAble,
            type: this.props.type,
            stars: Number.parseFloat(this.props.stars),
            modified: false,
        }
    }
    componentWillReceiveProps(props){
        if(!props.isClickAble && this.props !== props){
            this.setState({
                isClickAble: props.isClickAble,
                type: props.type,
                stars: Number.parseFloat(props.stars),
            })
        }
    }

    mrender = (isClickAble, type, star, clickedCallback) => {

        var bar = (p, width) => {
            return (
                <div key={Math.random()+Math.random()+Math.random} className="progress" style={{ width: width }}>
                    <div className="progress-bar" role="progressbar" aria-valuenow="60"
                        aria-valuemin="0" aria-valuemax="100" style={{ width: p + '%', background: '#ffc107' }}>
                        <span className="sr-only">{p}</span>
                    </div>
                </div>)
        }

        var starClick = (e, cb) => {
            if (isClickAble) {
                this.setState({ stars: e + 1, modified: true })
                cb(e + 1);
            }
        }

        var starBtn = (isOpen, c, nonBtn, i) => {
            var cn = isOpen ? 'btn btn-xs  ' : 'btn btn-xs btn-grey '
            cn+='mstarbtn '
            if (isOpen) {
                if (this.state.modified) {
                    cn += 'btn-primary '
                } else {
                    cn += 'btn-warning '
                }
            }

            return (<button type="button"
                className={cn} aria-label="Left Align" id={i}
                style={{width:'20%'}}
                onClick={(e) => starClick(i, clickedCallback)}
                key={i}
                disabled={!nonBtn}>
                <span className="glyphicon glyphicon-star" aria-hidden="true">

                    {isOpen ? c : c}

                </span>
            </button>
            )
        }

        var bars = [];
        var btns = [];
        var tr = '';
        switch (type) {
            default:
            case 'bar':
                return bar(star * 20, '100%')
            case 'splitedBar':
                for (let i = 0; i < 5; i++) {
                    if (star >= 1) {
                        bars.push(bar(100, '20%'));
                        star--;
                    } else if (star > 0) {
                        bars.push(bar(star * 100, '20%'))
                        star--;
                    } else {
                        bars.push(bar(0, '20%'))
                    }
                }

                 tr = <div className="row">
                    {bars}
                </div>

                return tr;
            case 'star':
                for (let i = 0; i < 5; i++) {
                    if (star >= 1) {
                        btns.push(starBtn(true, '⭐', isClickAble, i));
                        star--;
                    } else {
                        btns.push(starBtn(false, '⭐', isClickAble, i))
                    }
                }
                 tr = <div className="row">
                    {btns}
                </div>
                return tr;
            case 'btns':
                for (var i = 0; i < 5; i++) {
                    if (star >= 1) {
                        btns.push(starBtn(true, '', isClickAble, i));
                        star--;
                    } else {
                        btns.push(starBtn(false, '', isClickAble, i))
                    }
                }
                 tr = <div className="row">
                    {btns}
                </div>
                return tr;



        }


    }
    render() {
        return this.mrender(this.state.isClickAble, this.state.type, this.state.stars, this.props.callback)
    }
}


export default Star;