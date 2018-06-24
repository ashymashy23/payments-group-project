import React, { Component } from "react";
import Button from "./Button";
import "./CalcPayment.css";

class CalcPayment extends Component {
  constructor() {
    super();
    this.state = {
      selectedCurrency: "USD",
      amount: 0,
      input: 0
    };
  }

  selectCurrency = event => {
    const currency = event.target.value;
    this.setState({
      selectedCurrency: currency
    });
  };

  handleChange = event => {
    const inputAmount = event.target.value;
    this.setState({
      input: inputAmount
    });
  };
  onClickHandlingButton = () => {
    // const currency = this.state.selectedCurrency;
    fetch(
      "https://exchangeratesapi.io/api/latest?base=" +
        this.state.selectedCurrency
    )
      .then(data => data.json())
      .then(response => {
        const pound = response.rates.GBP;
        this.setState({
          amount: (this.state.input * pound).toFixed(2)
        });
      });
  };
  getTodaysDate = () => {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
      dd = "0" + dd;
    }

    if (mm < 10) {
      mm = "0" + mm;
    }

    return yyyy + "-" + mm + "-" + dd;
  };

  makePayment = () => {
    const newPayment = {
      date: this.getTodaysDate(),
      currency: this.state.selectedCurrency,
      amount: Number(this.state.input),
      description: "",
      status: "Complete"
    };
    this.props.updatePaymentData(newPayment);
  };

  render() {
    return (
      <div className="CalcPayment">
        <h2 className="CalcPayment-label">Calculate Payment in GBP</h2>
        <div className="CalcPayment-control">
          <select
            onChange={this.selectCurrency}
            defaultValue={this.state.selectedCurrency}
          >
            {this.props.currencies.map((currency, index) => (
              <option key={index}>{currency}</option>
            ))}
          </select>
          <input
            onChange={this.handleChange}
            className="CalcPayment-amount"
            type="text"
            defaultValue="0.00"
          />
          is worth{" "}
          <span className="CalcPayment-result">{this.state.amount}</span> in
          GBP.
          <div className="CalcPayment-calculate">
            <Button onClick={this.onClickHandlingButton}>Calculate</Button>

            <Button onClick={this.makePayment}>Make Payment</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default CalcPayment;
