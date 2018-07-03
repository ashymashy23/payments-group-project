import React from "react";
import Button from "../components/Button";
import "./Payments.css";
import payments from "../data/payments";

function Payments(props) {
  return <table className="Payments">
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
      <tbody>
        {props.completePayments.map((payment, index) => {
          return <tr key={index}>
              <td>{payment.date}</td>
              <td>{payment.currency}</td>
              <td>{payment.amount}</td>
              <td className="Payments-description">{payment.description}</td>
              <td>{payment.status}</td>
              <td>
                {payment.status === "Pending" ? (
                  <Button onClick={() => props.cancelPending(index)}>
                    Cancel
                  </Button>
                ) : (
                  ""
                )}
              </td>
            </tr>;
        })}
      </tbody>
      <tfoot>
        <tr>
          <td />
          <td />
          <td>{props.total.toFixed(2)}</td>
          <td>Total (GBP)</td>
          <td />
          <td />
        </tr>
      </tfoot>
    </table>;
}

export default Payments;
