import React, {Component} from "react";
import MainContainer from "../component/Style/MainContainer";
import Daily from "../component/Home/Daily";

class NotFound extends Component {
  render() {
    return (
      <MainContainer>
        <div className="container">
          <div className="text-center">
            <br />
            <br />
            <h1>Upss Somethings Wrong!</h1>
            <p>
              It seems we cannot find what you are looking for... Maybe try some
              of this restaurants:
            </p>
            <br />
            <Daily />
          </div>
        </div>
      </MainContainer>
    );
  }
}

export default NotFound;
