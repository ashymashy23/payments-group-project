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
    console.log("Constructor");
    this.state = {
      currencies: currencies,
      balance: 87.43,
      total: 0,
      totalPending: 0,
      paymentsData: payments.filter(payment => payment.status === "Complete"),
      pendingPayments: payments.filter(payment => payment.status === "Pending")
    }; // This is the current balance in GBP
  }

  updatePaymentData = payment => {
    const updatedData = this.state.pendingPayments;
    updatedData.push(payment);
    // console.log(updatedData);
    this.setState({ pendingPayments: updatedData, totalPending: 0 });
    this.calculatePendingTotal();
  };

  calculateTotal = () => {
    for (let i = 0; i < this.state.paymentsData.length; i++) {
      //console.log(this.state.payments);
      fetch(
        "https://exchangeratesapi.io/api/latest?base=" +
          this.state.paymentsData[i].currency
      )
        .then(data => data.json())
        .then(response => {
          const pound = response.rates.GBP;
          const sum = this.state.paymentsData[i].amount * pound;
          this.setState({
            total: this.state.total + sum
          });
        });
    }
  };

  calculatePendingTotal = () => {
    for (let i = 0; i < this.state.pendingPayments.length; i++) {
      //console.log(this.state.payments);
      fetch(
        "https://exchangeratesapi.io/api/latest?base=" +
          this.state.pendingPayments[i].currency
      )
        .then(data => data.json())
        .then(response => {
          const pound = response.rates.GBP;
          const sum = this.state.pendingPayments[i].amount * pound;
          this.setState({
            totalPending: this.state.totalPending + sum,
          });
        });
    }
  };

  componentDidMount() {
    this.calculateTotal();
    this.calculatePendingTotal();
    console.log("Did mount!");
  }

  updateTotalAndBalance = (currency, amount) => {
    fetch(`https://exchangeratesapi.io/api/latest?base=${currency}`)
      .then(response => response.json())
      .then(data => {
        let pound = data.rates.GBP;
        this.setState({
          balance: this.state.balance + pound * amount,
          totalPending: this.state.totalPending - pound * amount
        });
      });
  };

  cancelPending = index => {
    const pendingPayments = this.state.pendingPayments;
    //const updatePendingTotal= this.state.totalPending;
    this.updateTotalAndBalance(
      pendingPayments[index].currency,
      pendingPayments[index].amount
    );
    pendingPayments.splice(index, 1);
    this.setState({ pendingPayments: pendingPayments });
  };

  render() {
    return (
      <div className="App">
        {console.log("Render")}
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
        <Payments
          paymentsData={this.state.paymentsData}
          total={this.state.total}
        />
        <Payments
          paymentsData={this.state.pendingPayments}
          total={this.state.totalPending}
          cancelPending={this.cancelPending}
        />
      </div>
    );
  }
}

export default App;
