import React, { Component } from "react";
import Balance from "./components/Balance";
import CalcPayment from "./components/CalcPayment";
import Payments from "./components/Payments";
import currencies from "./data/currencies";
import "./App.css";
import payments from "./data/payments"

class App extends Component {
  constructor() {
    super();
    this.state = {
      currencies: currencies,
      balance: 87.43, // This is the current balance in GBP
      total: 0,
      payments: payments
    };
  }

  calculateTotal = () => {
    for (let i = 0; i < this.state.payments.length; i++) {
      //console.log(this.state.payments);
      fetch(
        "https://exchangeratesapi.io/api/latest?base=" +
          this.state.payments[i].currency
      )
        .then(data => data.json())
        .then(response => {
          const pound = response.rates.GBP;
          const sum = this.state.payments[i].amount * pound;
          this.setState({
            total: this.state.total + sum
          });
        });
    }
  };

  componentDidMount() {
    this.calculateTotal();
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Payments</h1>
        </header>
        <Balance
          total={this.state.balance}
          currencies={this.state.currencies}
        />
        <CalcPayment currencies={this.state.currencies} />
        <h2>Payments</h2>
        <Payments total={this.state.total} />
      </div>
    );
  }
}

export default App;
