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
      balance: this.totalAmount(payments).toFixed(2),
      paymentsData: payments
    }; // This is the current balance in GBP
  }

  // convertInGBP = (amount, currency) => {
  //   fetch("https://exchangeratesapi.io/api/latest?base=" + currency)
  //     .then(data => data.json())
  //     .then(response => {
  //       const pound = response.rates.GBP;

  //       amountInGBP = amount * pound;
        
  //       this.setState({
  //         amountInGBP: this.state.amount 
  //       });
  //     });
  // };

  totalAmount = payments => {
    let sumAmount = 0;
    for (let i = 0; i < payments.length; i++) {
      // const amount = payments[i].amount;
      // const currency = payments[i].currency;

      // const amountInGBP = this.convertInGBP(amount, currency);
      // sumAmount += amountInGBP;

      sumAmount += payments[i].amount;
    }
    return sumAmount;
  };

  updatePaymentData = payment => {
    const updatedData = this.state.paymentsData;
    updatedData.push(payment);
    // console.log(updatedData);
    this.setState({
      paymentsData: updatedData,
      balance: this.totalAmount(updatedData).toFixed(2)
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
          updatePaymentData={this.updatePaymentData}
        />
        <h2>Payments</h2>
        <Payments paymentsData={this.state.paymentsData} />
      </div>
    );
  }
}

export default App;
