import React, { useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Currency() {
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("TRY");
  const [result, setResult] = useState(null);
  const [range, setRange] = useState("daily");
   const [date, setDate] = useState(new Date());

  const formatDate = (date) => {
    const d = new Date(date);
    let day = "" + d.getDate();
    let month = "" + (d.getMonth() + 1);
    const year = d.getFullYear();

    if (day.length < 2) day = "0" + day;
    if (month.length < 2) month = "0" + month;

    return [year, month, day].join("-");
  };

  const fetchRatesForDate = async (date) => {
    try {
      const formattedDate = formatDate(date);
      let url = "";
      if (range === "daily") {
        url = "https://exchange.intern.demo.pigasoft.com/api/exchange/today";
      } else {
        url = `https://exchange.intern.demo.pigasoft.com/api/exchange/filter?date=${formattedDate}`;
      }
      const response = await axios.get(url);
      const data = response.data && response.data.data ? response.data.data : {};

      return {
        USD: data.USD ? parseFloat(data.USD.value.replace(",", ".")) : null,
        EUR: data.EUR ? parseFloat(data.EUR.value.replace(",", ".")) : null,
        TRY: 1
      };
    } catch (err) {
      return { USD: null, EUR: null, TRY: 1 };
    }
  };

  const getRate = (code, data) => {
    if (code === "TRY") return 1;
    if (!data[code]) return null;
    return parseFloat(data[code].value.replace(",", "."));
  };

  const exchange = async () => {
    try {
      const rates = await fetchRatesForDate(new Date());
      const fromRate = rates[fromCurrency];
      const toRate = rates[toCurrency];

      if (!fromRate || !toRate) {
        alert("Kur bilgisi alınamadı!");
        return;
      }

      let resultValue;
      if (fromCurrency === "TRY") {
        resultValue = amount / toRate;
      } else if (toCurrency === "TRY") {
        resultValue = amount * fromRate;
      } else {
        resultValue = (amount * fromRate) / toRate;
      }
      setResult(resultValue.toFixed(2));
    } catch (err) {
      alert("Veri alınamadı!");
      setResult("");
    }
  };

  return (
    <div className="currency-div">
      <div className="title">DÖVİZ KURU UYGULAMASI</div>
      <div className="currency-row">
        <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" min="0" className="amount" />
        <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)} className="fromCurrency">
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="TRY">TRY</option>
        </select>
        <span className="material-symbols-outlined">
        swap_horiz
        </span>
        <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)} className="toCurrency">
          <option value="TRY">TRY</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>
        <input value={result ?? ""} readOnly type="number" className="result" />
      </div>
      <div>
        <button onClick={exchange} className="exchange-button">Çevir</button>
      </div>
    </div>
  );
}

export default Currency;
