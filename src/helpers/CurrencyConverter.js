const convertAmount = (
  amount,
  currency,
  alternativeCurrency,
  exchangeDate = "latest"
) => {
  return fetch(
    `https://exchangeratesapi.io/api/${exchangeDate}?base=${currency}`
  )
    .then(data => data.json())
    .then(response => {
      const exchangeRate = response.rates[alternativeCurrency];
      return exchangeRate * amount;
    });
};

export default convertAmount;
