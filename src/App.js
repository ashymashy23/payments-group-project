import React, { Component } from "react";
import Balance from "./components/Balance";
import CalcPayment from "./components/CalcPayment";
import Payments from "./components/Payments";
import currencies from "./data/currencies";
import "./App.css";
import payments from "./data/payments";
import convertAmount from "./helpers/CurrencyConverter";

class App extends Component {
  constructor() {
    super();
    console.log("Constructor");
    this.state = {
      currencies: currencies,
      alternateCurrency: "USD",
      balance: 87.43,
      balanceInAlternateCurrency: 0,
      totalCompleted: 0,
      totalPending: 0,
      completePayments: payments.filter(
        payment => payment.status === "Complete"
      ),
      pendingPayments: payments.filter(payment => payment.status === "Pending")
    }; // This is the current balance in GBP
  }

  updatePaymentData = payment => {
    const updatedData = this.state.pendingPayments;
    updatedData.push(payment);
    this.setState({ pendingPayments: updatedData, totalPending: 0 });
    this.calculatePendingTotal();
  };

  changingCurrencyToGBP(payment) {
    convertAmount(payment.amount, payment.currency, "GBP").then(
      convertedAmount => {
        this.setState({
          balance: this.toFixedToNumber(this.state.balance - convertedAmount)
        });
      }
    );

    convertAmount(payment.amount, payment.currency, "GBP").then(
      convertedAmount => {
        this.setState({
          balanceInAlternateCurrency: this.toFixedToNumber(convertedAmount)
        });
      }
    );

    // fetch("https://exchangeratesapi.io/api/latest?base=" + payment.currency)
    //   .then(data => data.json())
    //   .then(response => {
    //     const poundExchangeRate = response.rates.GBP;
    //     let amount = payment.amount;
    //     amount = poundExchangeRate * amount;
    //     this.setState({
    //       balance: this.toFixedToNumber(this.state.balance - amount),
    //       balanceInAlternateCurrency: this.toFixedToNumber(
    //         this.state.total * poundExchangeRate
    //       )
    //     });
    //   });
  }

  toFixedToNumber = value => {
    return Number(value.toFixed(2));
  };

  updateAccountBalance = payment => {
    console.log("balance", this.state.balance);
    convertAmount(payment.amount, payment.currency, "GBP").then(
      convertedAmount => {
        console.log(convertedAmount);
        if (convertedAmount <= this.state.balance) {
          this.changingCurrencyToGBP(payment);
        }
      }
    );
  };
  
  calculateCompleteTotal = () => {
    for (let i = 0; i < this.state.completePayments.length; i++) {
      //console.log(this.state.payments);
      fetch(
        "https://exchangeratesapi.io/api/latest?base=" +
          this.state.completePayments[i].currency
      )
        .then(data => data.json())
        .then(response => {
          const poundExchangeRate = response.rates.GBP;
          const sum = this.state.completePayments[i].amount * poundExchangeRate;
          this.setState({
            totalCompleted: this.state.totalCompleted + sum
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
          const poundExchangeRate = response.rates.GBP;
          const sum = this.state.pendingPayments[i].amount * poundExchangeRate;
          console.log("type of total", typeof this.state.totalPending);
          console.log("type of sum", typeof sum);
          this.setState({
            totalPending: this.state.totalPending + sum
          });
        });
    }
  };

  componentDidMount() {
    this.calculateCompleteTotal();
    this.calculatePendingTotal();
    console.log("Did mount!");
  }

  updateTotalAndBalance = (currency, amount, transactionDate = "latest") => {
    fetch(`https://exchangeratesapi.io/api/${transactionDate}?base=${currency}`)
      .then(response => response.json())
      .then(data => {
        let poundExchangeRate = data.rates.GBP;
        console.log("type of balane", typeof this.state.balance);
        console.log(this.state.balance + poundExchangeRate * amount);
        this.setState({
          balance: this.toFixedToNumber(
            this.state.balance + poundExchangeRate * amount
          ),
          totalPending: this.state.totalPending - poundExchangeRate * amount
        });
      });
  };

  cancelPending = index => {
    const pendingPayments = this.state.pendingPayments;
    //const updatePendingTotal= this.state.totalPending;
    console.log(pendingPayments[index]);
    this.updateTotalAndBalance(
      pendingPayments[index].currency,
      pendingPayments[index].amount,
      pendingPayments[index].date
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
          // updateAccountBalance={this.updateAccountBalance}
        />
        <CalcPayment
          currencies={this.state.currencies}
          updatePaymentData={this.updatePaymentData}
          updateAccountBalance={this.updateAccountBalance}
        />
        <h2>Payments</h2>
        <Payments
          completePayments={this.state.completePayments}
          total={this.state.totalCompleted}
        />
        <Payments
          completePayments={this.state.pendingPayments}
          total={this.state.totalPending}
          cancelPending={this.cancelPending}
        />
      </div>
    );
  }
}

export default App;
