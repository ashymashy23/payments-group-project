import React, { Component } from "react";
import Balance from "./components/Balance";
import CalcPayment from "./components/CalcPayment";
import Payments from "./components/Payments";
import currencies from "./data/currencies";
import "./App.css";
import payments from "./data/payments";

class App extends Component {
  constructor() {
    super();
    this.state = {
      currencies: currencies,
      balance: this.totalAmount(payments),
      paymentsData: payments
    }; // This is the current balance in GBP
  }

  totalAmount = payments => {
    let sumAmount = 0;
    for (let i = 0; i < payments.length; i++) {
      sumAmount += payments[i].amount;
    }
    return sumAmount;
  };

  updateData = payment => {
    const updatedData = this.state.paymentsData;
    updatedData.push(payment);
    console.log(updatedData);
    this.setState({
      paymentsData: updatedData,
      balance: this.totalAmount(updatedData)
    });
  };

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
        <CalcPayment
          currencies={this.state.currencies}
          updateData={this.updateData}
        />
        <h2>Payments</h2>
        <Payments paymentsData={this.state.paymentsData} />
      </div>
    );
  }
}

export default App;
