import React from "react";
import Button from "../components/Button";
import "./Payments.css";
import payments from "../data/payments";

function Payments(props) {
  const paymentData = props.paymentsData.map(payment => {
    return (
      <tr>
        <td>{payment.date}</td>
        <td>{payment.currency}</td>
        <td>{payment.amount}</td>
        <td className="Payments-description">{payment.description}</td>
        <td>{payment.status}</td>
        <td>{payment.action}</td>
      </tr>
    );
  });
  return (
    <table className="Payments">
      <thead>
        <tr>
          <th>Date</th>
          <th>currency</th>
          <th>Amount</th>
          <th>Description</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>{paymentData}</tbody>
      <tfoot>
        <tr>
          <td />
          <td />
          <td>???</td>
          <td>Total (GBP)</td>
          <td />
          <td />
        </tr>
      </tfoot>
    </table>
  );
}

export default Payments;
