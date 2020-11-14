import React, {Component} from "react";
import MainContainer from "../component/Style/MainContainer";
import {withRouter} from "react-router";
import {Link} from "react-router-dom";
import ds from "../Services/dataService";

class EmailConfirmation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.id,
    };
  }

  emailConfirmation(id) {
    ds.confirmEmail(id).then(() => {
      this.setState({
        id: id,
      });
    });
  }

  componentWillMount() {
    var _id = this.state.id;
    this.emailConfirmation(_id);
    console.log("mount" + this.props.match.params.id);
  }

  render() {
    return (
      <MainContainer>
        <div className="container">
          <div className=" card-body text-center">
            <br />
            <br />
            <br />
            <h3>Success email verification</h3>
            <p>
              Click the following button to log in to your account and start
              exploring
            </p>
            <Link to="/Login" className="btn btn-primary">
              {" "}
              Log In{" "}
            </Link>
            <br />
            <br />
            <p>Thank you for choosing BookEat!</p>
          </div>
        </div>
      </MainContainer>
    );
  }
}

export default withRouter(EmailConfirmation);
