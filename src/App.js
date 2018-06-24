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
      balanceInAlternateCurrency: 0,
      currencies: currencies,
      balance: 87.43,
      total: 0,
      totalPending: 0,
      paymentsData: payments.filter(payment => payment.status === "Complete"),
      pendingPaymentData: payments.filter(payment => payment.status === "Pending")
    }; // This is the current balance in GBP
  }

  updatePaymentData = payment => {
    const updatedData = this.state.pendingPaymentData;
    updatedData.push(payment);
    this.setState({ pendingPaymentData: updatedData, totalPending: 0 });
    this.calculatePendingTotal();
  };

  changingAlternateCurrencyToGBP(payment) {
    fetch("https://exchangeratesapi.io/api/latest?base=" + payment.currency)
      .then(data => data.json())
      .then(response => {
        const pound = response.rates.GBP;
        let amount = payment.amount;
        amount = (amount*pound);
        this.setState({ balance: (this.state.balance - amount).toFixed(2) });
      });
  }

  undoCurrencyToGBPcurrency(payment) {
    fetch("https://exchangeratesapi.io/api/latest?base=" + payment.currency)
      .then(data => data.json())
      .then(response => {
        const pound = response.rates.GBP;
        let amount = payment.amount;
        amount = pound * amount;
        let newBalance = parseFloat(this.state.balance) + parseFloat(amount);
        // newBalance = newBalance.toFixed(2);
        this.setState({ balance: newBalance });
      });
  }

  updateAccountBalance = payment => {
    this.changingAlternateCurrencyToGBP(payment);
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
    for (let i = 0; i < this.state.pendingPaymentData.length; i++) {
      //console.log(this.state.payments);
      fetch(
        "https://exchangeratesapi.io/api/latest?base=" +
          this.state.pendingPaymentData[i].currency
      )
        .then(data => data.json())
        .then(response => {
          const pound = response.rates.GBP;
          const sum = this.state.pendingPaymentData[i].amount * pound;
          this.setState({
            totalPending: this.state.totalPending + sum
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

  cancelPending = (index, payment) => {
    const pendingPaymentData = this.state.pendingPaymentData;
    //const updatePendingTotal= this.state.totalPending;
    this.updateTotalAndBalance(
      pendingPaymentData[index].currency,
      pendingPaymentData[index].amount
    );
    pendingPaymentData.splice(index, 1);
    this.setState({ pendingPaymentData: pendingPaymentData });

    this.undoCurrencyToGBPcurrency(payment);
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
          updateAccountBalance={this.updateAccountBalance}
        />
        <CalcPayment
          currencies={this.state.currencies}
          updatePaymentData={this.updatePaymentData}
          updateAccountBalance={this.updateAccountBalance}
        />
        <h2>Payments</h2>
        <Payments
          paymentsData={this.state.paymentsData}
          total={this.state.total}
        />
        <Payments
          paymentsData={this.state.pendingPaymentData}
          total={this.state.totalPending}
          cancelPending={this.cancelPending}
        />
      </div>
    );
  }
}

export default App;
