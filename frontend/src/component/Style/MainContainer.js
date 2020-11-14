import React, {Component} from "react";

class MainContainer extends Component {
  render() {
    return (
      <div>
        <div className="body">
          <div className="container">{this.props.children}</div>
        </div>
      </div>
    );
  }
}

export default MainContainer;
