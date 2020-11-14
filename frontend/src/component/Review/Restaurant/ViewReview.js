import React, {Component} from "react";
import Star from "../../Style/Stars";
import ds from "../../../Services/dataService";
import moment from "moment";

class ViewReview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: "",
      food: "",
      service: "",
      enviroment: "",
      satisfaction: "",
      reviews: [],
      resId: this.props.resId,
      disabled: true,
      contenteditable: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.renderReviewList = this.renderReviewList.bind(this);
  }

  async componentWillMount() {
    var resId = this.state.resId;
    await this.queryReviews(resId);
  }

  async queryReviews(resId) {
    var reviews = await ds.getReviewsResManProfile(resId);
    this.setState({
      reviews: reviews,
    });
  }

  handleChange(e) {
    e.preventDefault();
  }

  renderReviewList() {
    var rows = [];
    if (typeof this.state.reviews != "undefined") {
      for (var review of this.state.reviews) {
        rows.push(
          <tr key={rows} className="tableReview">
            <td>{moment(review.updatedAt).format("YYYY-MM-DD hh:mm")}</td>
            <td>
              {review.customerId.firstName + " " + review.customerId.lastName}
            </td>

            <td>
              <Star type="star" stars={review.food} />
            </td>

            <td>
              <Star type="star" stars={review.service} />
            </td>

            <td>
              <Star type="star" stars={review.satisfaction} />
            </td>

            <td>
              <Star type="star" stars={review.environment} />
            </td>

            <td>{review.comment}</td>
          </tr>,
        );
      }
    }
    return rows;
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <h3>Reviews</h3>
          <br />
          <hr />
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>Date</th>
                <th>Customer</th>
                <th>Food</th>
                <th>Service</th>
                <th>Satisfaction</th>
                <th>Environment</th>
                <th>Comment</th>
              </tr>
            </thead>
            <tbody>{this.renderReviewList()}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default ViewReview;
