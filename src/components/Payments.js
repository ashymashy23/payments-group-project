import React from "react";
import Button from "../components/Button";
import "./Payments.css";
import payments from "../data/payments.js";

function Payments(props) {
  return (
      <table className="Payments">
          <thead>
              <tr>
                  <th>Date</th>
                  <th>Cur</th>
                  <th>Amount</th>
                  <th className="Payments-description">Description</th>
                  <th>Status</th>
                  <th>Action</th>
              </tr>
          </thead>
          <tbody>
              <tr>
                  <td>2018-05-12</td>
                  <td>GBP</td>
                  <td>6.89</td>
                  <td>Dinner with friends at a local restaurant</td>
                  <td>Pending</td>
                  <td>
                      <Button>Cancel</Button>
                  </td>
              </tr>
              <tr>
                  <td>2018-02-24</td>
                  <td>USD</td>
                  <td>12.23</td>
                  <td>New headphones purchased from Amazon with free delivery</td>
                  <td>Complete</td>
                  <td></td>
              </tr>
              <tr>
                  <td>2017-12-30</td>
                  <td>AUD</td>
                  <td>28.74</td>
                  <td>Groceries for the week</td>
                  <td>Complete</td>
                  <td></td>
              </tr>
              <tr>
                  <td>2017-10-17</td>
                  <td>GBP</td>
                  <td>2.06</td>
                  <td>Coffee with luke at iCafe</td>
                  <td>complete</td>
                  <td></td>
              </tr>

          </tbody>
          <tfoot>
            <tr>
              <td>???</td>
              <td>Total(GBP)</td>
            </tr>
          </tfoot>
      </table>
  )
}
export default Payments;
