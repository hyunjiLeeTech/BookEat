import React, {Component} from "react";
import DataService from "../../Services/dataService";
import Layout from "./Layout";
import Button from "react-bootstrap/Button";
import {toast} from "react-toastify";
import dataService from "../../Services/dataService";
import FullScrrenLoading from "../Style/FullscreenLoading";

class RestaurantLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tables: [],
      newTable: {
        isOpen: false,
        size: 0,
        isNearWindow: false,
        buttonDisabled: false,
      },
      isLoading: false,
    };
    DataService.getTables()
      .then((res) => {
        for (var t of res.tables) {
          t.isOpen = t.status;
          t.buttonDisabled = false;
          t.isEdited = false;
        }
        this.setState({tables: res.tables}, () => {});
      })
      .catch((err) => {
        console.log(err);
      });
    this.addTable = this.addTable.bind(this);
    this.delTable = this.delTable.bind(this);
    this.renderTablesTable = this.renderTablesTable.bind(this);
  }

  addTable() {
    this.state.tables.push(this.state.tables[0]);
    this.forceUpdate();
  }
  delTable() {
    this.state.tables.pop();
    this.forceUpdate();
  }
  renderTablesTable(tables) {
    var tr = [];
    var btnClick = (e, t) => {
      //e.preventDefault()
      switch (e.target.name) {
        case "update":
          t.buttonDisabled = true;
          this.forceUpdate();
          dataService
            .updateTable(t)
            .then((res) => {
              t.isEdited = false;
              toast("Table Update", {type: "success", autoClose: 3000});
              this.forceUpdate();
            })
            .catch((err) => {
              console.log(err);
              toast("Error", {type: "error", autoClose: 3000});
            })
            .finally(() => {
              t.buttonDisabled = false;
              this.forceUpdate();
            });
          break;
        case "delete":
          t.buttonDisabled = true;
          this.setState({isLoading: true});
          this.forceUpdate();
          dataService
            .deleteTable(t._id)
            .then((res) => {
              toast("Table Deleted", {type: "success", autoClose: 3000});
              this.forceUpdate();
            })
            .catch((err) => {
              console.log(err);
              toast("Error", {type: "error", autoClose: 3000});
            })
            .finally(() => {
              DataService.getTables()
                .then((res) => {
                  this.setState({tables: []});
                  for (var t of res.tables) {
                    t.isOpen = t.status;
                    t.buttonDisabled = false;
                  }
                  this.setState({tables: res.tables});
                })
                .catch((err) => {
                  console.log(err);
                })
                .finally(() => {
                  this.setState({isLoading: false});
                  t.buttonDisabled = false;
                  this.forceUpdate();
                });
            });
          break;
        case "open":
          t.isEdited = true;
          t.status = e.target.checked;
          t.isOpen = e.target.checked;

          break;
        case "window":
          t.isEdited = true;
          t.isNearWindow = e.target.checked;

          break;
        case "size":
          t.isEdited = true;
          t.size = e.target.value;

          break;
        default:
          break;
      }
      this.forceUpdate();
    };

    tr = tables.map((table, index, tables) => {
      var trr = (
        <tr key={index}>
          <td>{tables[index].rid}</td>
          <td>
            <input
              type="checkbox"
              name="open"
              onChange={(e) => btnClick(e, tables[index])}
              checked={tables[index].status ? "checked" : ""}
            ></input>
          </td>
          <td>
            <input
              type="number"
              name="size"
              onChange={(e) => btnClick(e, tables[index])}
              value={tables[index].size}
            />
          </td>
          <td>
            {
              <input
                type="checkbox"
                name="window"
                onChange={(e) => btnClick(e, tables[index])}
                checked={tables[index].isNearWindow ? "checked" : ""}
              ></input>
            }
          </td>
          {tables[index].buttonDisabled ? (
            <td>
              <Button disabled className="btn btn-warning">
                Please Wait
              </Button>
            </td>
          ) : (
            <td>
              <Button
                name="update"
                onClick={(e) => btnClick(e, tables[index])}
                value={tables[index]._id}
                className={
                  tables[index].isEdited ? "btn btn-warning" : "btn btn-primary"
                }
                disabled={tables[index].buttonDisabled ? "disabled" : ""}
              >
                {tables[index].buttonDisabled ? "Please Wait" : "Update"}
              </Button>{" "}
              |{" "}
              <Button
                name="delete"
                onClick={(e) => btnClick(e, tables[index])}
                value={tables[index]._id}
                className="btn btn-danger"
                disabled={tables[index].buttonDisabled ? "disabled" : ""}
              >
                {tables[index].buttonDisabled ? "Please Wait" : "Delete"}
              </Button>
            </td>
          )}
        </tr>
      );
      return trr;
    });
    return tr;
  }

  render() {
    var t = this.state.newTable;
    var click = (e) => {
      switch (e.target.name) {
        case "add":
          t.buttonDisabled = true;
          this.forceUpdate();
          DataService.addTable(t)
            .then((res) => {
              var nt = res.table;
              nt.isOpen = nt.status;
              nt.restaurant = nt.restaurant._id
                ? nt.restaurant._id
                : nt.restaurant;
              nt.buttonDisabled = false;
              nt.isEdited = false;
              this.state.tables.push(nt);
              this.setState({
                newTable: {
                  isOpen: false,
                  size: 0,
                  isNearWindow: false,
                  buttonDisabled: false,
                },
              });
              toast("Table Added", {type: "success", autoClose: 3000});
            })
            .catch((err) => {
              console.log(err);
              toast("Error", {type: "error", autoClose: 3000});
            })
            .finally(() => {
              t.buttonDisabled = false;
            });

          break;
        case "open":
          t.status = e.target.checked;
          t.isOpen = e.target.checked;
          break;
        case "window":
          t.isNearWindow = e.target.checked;
          break;
        case "size":
          t.size = e.target.value;
          break;
        default:
          break;
      }
      this.forceUpdate();
    };
    return (
      <div>
        {this.state.isLoading
          ? FullScrrenLoading({type: "balls", color: "#000"})
          : null}
        {this.state.tables.length > 0 ? (
          <Layout
            tables={this.state.tables}
            selectedTableId={(id) => console.log(id)}
          />
        ) : null}

        <table className="table table table-striped">
          <thead>
            <tr>
              <th>Id</th>
              <th>Is Open</th>
              <th>Table Size</th>
              <th>Near Window</th>
              <th>Operation</th>
            </tr>
          </thead>
          <tbody>
            {this.renderTablesTable(this.state.tables)}

            <tr>
              <td>-</td>
              <td>
                <input
                  type="checkbox"
                  onChange={click}
                  name="open"
                  checked={t.isOpen ? "checked" : ""}
                ></input>
              </td>
              <td>
                <input
                  type="number"
                  onChange={click}
                  name="size"
                  value={t.size}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  onChange={click}
                  name="window"
                  checked={t.isNearWindow ? "checked" : ""}
                ></input>
              </td>
              <td>
                <Button
                  className="btn btn-Primary"
                  onClick={click}
                  name="add"
                  disabled={t.buttonDisabled ? "disabled" : ""}
                >
                  {t.buttonDisabled ? "Please Wiat" : "Add"}
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default RestaurantLayout;
