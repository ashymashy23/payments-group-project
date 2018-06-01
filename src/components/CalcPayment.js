import React, { Component } from "react";
import Button from "./Button";
import "./CalcPayment.css";

class Payment extends Component {
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
        this.setState({ amount: (this.state.input * pound).toFixed(2) });
      });
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
          </div>
        </div>
      </div>
    );
  }
}

export default Payment;
