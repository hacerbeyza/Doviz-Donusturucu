import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const currencies = [
  "USD",
  "EUR",
  "AUD",
  "DKK",
  "GBP",
  "CHF",
  "SEK",
  "CAD",
  "KWD",
  "NOK",
  "SAR",
  "JPY",
  "BGN",
  "RON",
  "RUB",
  "CNY",
  "PKR",
  "QAR",
  "KRW",
  "AZN",
  "AED",
  "XDR",
];

// Döviz kurlarını grafik olarak gösteren bileşen
const ChartComponent = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const [range, setRange] = useState("week");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tarih aralığını değiştirme fonksiyonu
  const generateDates = () => {
    const today = new Date();
    let count = 7;
    if (range === "daily") count = 1;
    if (range === "month") count = 30;
    if (range === "year") count = 365;
    const dates = [];
    for (let i = 0; i < count; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      dates.push(new Date(date));
    }
    return dates.reverse();
  };

  // Tarihi formatlama fonksiyonu. Gün, ay ve yıl bilgilerini alır.
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`; 
  };

  // API'den USD/EUR/TRY axios ile veri çekme fonksiyonu. Range günlük ise bugünün verisini, diğer durumlarda seçilen tarihe göre veriyi çeker.
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

      // Her kur için value'yu çek
      const rates = {};
      currencies.forEach((cur) => {
        if (data[cur] && data[cur].value)
          rates[cur] = parseFloat(data[cur].value.replace(",", "."));
        else rates[cur] = null;
      });
      return rates;
    } catch (err) {
      // Tüm kurlar için null dön
      const rates = {};
      currencies.forEach((cur) => {
        rates[cur] = null;
      });
      return rates;
    }
  };

  // Grafik verilerini API'den çekme fonksiyonu
  const fetchChartData = async () => {
    setLoading(true);
    setError(null);

    try {
      const dates = generateDates();
      const labels = [];
      const usdValues = [];
      const eurValues = [];
      const audValues = [];
      const dkkValues = [];
      const gbpValues = [];
      const chfValues = [];
      const sekValues = [];
      const cadValues = [];
      const kwdValues = [];
      const nokValues = [];
      const sarValues = [];
      const jpyValues = [];
      const bgnValues = [];
      const ronValues = [];
      const rubValues = [];
      const cnyValues = [];
      const pkrValues = [];
      const qarValues = [];
      const krwValues = [];
      const aznValues = [];
      const aedValues = [];
      const xdrValues = [];

      // Tüm tarihler için döviz kurlarını çekiyoruz
      for (const date of dates) {
        const rates = await fetchRatesForDate(date);
        const label = formatDate(date);
        labels.push(label);

        if (rates.USD !== null && rates.USD !== undefined)
          usdValues.push(rates.USD);
        else if (usdValues.length > 0)
          usdValues.push(usdValues[usdValues.length - 1]);
        else usdValues.push(null);

  
        if (rates.EUR !== null && rates.EUR !== undefined)
          eurValues.push(rates.EUR);
        else if (eurValues.length > 0)
          eurValues.push(eurValues[eurValues.length - 1]);
        else eurValues.push(null);

        
        if (rates.AUD !== null && rates.AUD !== undefined)
          audValues.push(rates.AUD);
        else if (audValues.length > 0)
          audValues.push(audValues[audValues.length - 1]);
        else audValues.push(null);

        
        if (rates.DKK !== null && rates.DKK !== undefined)
          dkkValues.push(rates.DKK);
        else if (dkkValues.length > 0)
          dkkValues.push(dkkValues[dkkValues.length - 1]);
        else dkkValues.push(null);

        
        if (rates.GBP !== null && rates.GBP !== undefined)
          gbpValues.push(rates.GBP);
        else if (gbpValues.length > 0)
          gbpValues.push(gbpValues[gbpValues.length - 1]);
        else gbpValues.push(null);

        
        if (rates.CHF !== null && rates.CHF !== undefined)
          chfValues.push(rates.CHF);
        else if (chfValues.length > 0)
          chfValues.push(chfValues[chfValues.length - 1]);
        else chfValues.push(null);

        
        if (rates.SEK !== null && rates.SEK !== undefined)
          sekValues.push(rates.SEK);
        else if (sekValues.length > 0)
          sekValues.push(sekValues[sekValues.length - 1]);
        else sekValues.push(null);

       
        if (rates.CAD !== null && rates.CAD !== undefined)
          cadValues.push(rates.CAD);
        else if (cadValues.length > 0)
          cadValues.push(cadValues[cadValues.length - 1]);
        else cadValues.push(null);

        
        if (rates.KWD !== null && rates.KWD !== undefined)
          kwdValues.push(rates.KWD);
        else if (kwdValues.length > 0)
          kwdValues.push(kwdValues[kwdValues.length - 1]);
        else kwdValues.push(null);

        
        if (rates.NOK !== null && rates.NOK !== undefined)
          nokValues.push(rates.NOK);
        else if (nokValues.length > 0)
          nokValues.push(nokValues[nokValues.length - 1]);
        else nokValues.push(null);

        
        if (rates.SAR !== null && rates.SAR !== undefined)
          sarValues.push(rates.SAR);
        else if (sarValues.length > 0)
          sarValues.push(sarValues[sarValues.length - 1]);
        else sarValues.push(null);

        
        if (rates.JPY !== null && rates.JPY !== undefined)
          jpyValues.push(rates.JPY);
        else if (jpyValues.length > 0)
          jpyValues.push(jpyValues[jpyValues.length - 1]);
        else jpyValues.push(null);

        
        if (rates.BGN !== null && rates.BGN !== undefined)
          bgnValues.push(rates.BGN);
        else if (bgnValues.length > 0)
          bgnValues.push(bgnValues[bgnValues.length - 1]);
        else bgnValues.push(null);

       
        if (rates.RON !== null && rates.RON !== undefined)
          ronValues.push(rates.RON);
        else if (ronValues.length > 0)
          ronValues.push(ronValues[ronValues.length - 1]);
        else ronValues.push(null);

        
        if (rates.RUB !== null && rates.RUB !== undefined)
          rubValues.push(rates.RUB);
        else if (rubValues.length > 0)
          rubValues.push(rubValues[rubValues.length - 1]);
        else rubValues.push(null);

        
        if (rates.CNY !== null && rates.CNY !== undefined)
          cnyValues.push(rates.CNY);
        else if (cnyValues.length > 0)
          cnyValues.push(cnyValues[cnyValues.length - 1]);
        else cnyValues.push(null);

       
        if (rates.PKR !== null && rates.PKR !== undefined)
          pkrValues.push(rates.PKR);
        else if (pkrValues.length > 0)
          pkrValues.push(pkrValues[pkrValues.length - 1]);
        else pkrValues.push(null);

        
        if (rates.QAR !== null && rates.QAR !== undefined)
          qarValues.push(rates.QAR);
        else if (qarValues.length > 0)
          qarValues.push(qarValues[qarValues.length - 1]);
        else qarValues.push(null);

       
        if (rates.KRW !== null && rates.KRW !== undefined)
          krwValues.push(rates.KRW);
        else if (krwValues.length > 0)
          krwValues.push(krwValues[krwValues.length - 1]);
        else krwValues.push(null);

        
        if (rates.AZN !== null && rates.AZN !== undefined)
          aznValues.push(rates.AZN);
        else if (aznValues.length > 0)
          aznValues.push(aznValues[aznValues.length - 1]);
        else aznValues.push(null);

        
        if (rates.AED !== null && rates.AED !== undefined)
          aedValues.push(rates.AED);
        else if (aedValues.length > 0)
          aedValues.push(aedValues[aedValues.length - 1]);
        else aedValues.push(null);

        
        if (rates.XDR !== null && rates.XDR !== undefined)
          xdrValues.push(rates.XDR);
        else if (xdrValues.length > 0)
          xdrValues.push(xdrValues[xdrValues.length - 1]);
        else xdrValues.push(null);

        await new Promise((res) => setTimeout(res, 50));
      }

      // Chart.js için veri seti oluştur
      setChartData({
        labels,
        datasets: [
          {
            label: "USD",
            data: usdValues,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.1)",
            fill: false,
            tension: 0.3,
          },
          {
            label: "EUR",
            data: eurValues,
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.1)",
            fill: false,
            tension: 0.3,
          },
          {
            label: "AUD",
            data: audValues,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.1)",
            fill: false,
            tension: 0.3,
          },
          {
            label: "DKK",
            data: dkkValues,
            borderColor: "rgba(255, 159, 64, 1)",
            backgroundColor: "rgba(255, 159, 64, 0.1)",
            fill: false,
            tension: 0.3,
          },
          {
            label: "GBP",
            data: gbpValues,
            borderColor: "rgba(153, 102, 255, 1)",
            backgroundColor: "rgba(153, 102, 255, 0.1)",
            fill: false,
            tension: 0.3,
          },
          {
            label: "CHF",
            data: chfValues,
            borderColor: "rgba(255, 205, 86, 1)",
            backgroundColor: "rgba(255, 205, 86, 0.1)",
            fill: false,
            tension: 0.3,
          },
          {
            label: "SEK",
            data: sekValues,
            borderColor: "rgba(54, 162, 235, 1)",
            backgroundColor: "rgba(54, 162, 235, 0.1)",
            fill: false,
            tension: 0.3,
          },
          {
            label: "CAD",
            data: cadValues,
            borderColor: "rgba(201, 203, 207, 1)",
            backgroundColor: "rgba(201, 203, 207, 0.1)",
            fill: false,
            tension: 0.3,
          },
          {
            label: "KWD",
            data: kwdValues,
            borderColor: "rgba(255,99,132)",
            backgroundColor: "rgba(255,99,132,.2)",
            fill: false,
            tension: 0.3,
          },
          {
            label: "NOK",
            data: nokValues,
            borderColor: "#36a2eb",
            backgroundColor: "#36a2eb20",
            fill: false,
            tension: 0.3,
          },
          {
            label: "SAR",
            data: sarValues,
            borderColor: "#ff6384",
            backgroundColor: "#ff638420",
            fill: false,
            tension: 0.3,
          },
          {
            label: "JPY",
            data: jpyValues,
            borderColor: "#ff9f40",
            backgroundColor: "#ff9f4020",
            fill: false,
            tension: 0.3,
          },
          {
            label: "BGN",
            data: bgnValues,
            borderColor: "#4bc0c0",
            backgroundColor: "#4bc0c020",
            fill: false,
            tension: 0.3,
          },
          {
            label: "RON",
            data: ronValues,
            borderColor: "#9966ff",
            backgroundColor: "#9966ff20",
            fill: false,
            tension: 0.3,
          },
          {
            label: "RUB",
            data: rubValues,
            borderColor: "#c9cbcf",
            backgroundColor: "#c9cbcf20",
            fill: false,
            tension: 0.3,
          },
          {
            label: "CNY",
            data: cnyValues,
            borderColor: "#ffcd56",
            backgroundColor: "#ffcd5620",
            fill: false,
            tension: 0.3,
          },
          {
            label: "PKR",
            data: pkrValues,
            borderColor: "#4bc0c0",
            backgroundColor: "#4bc0c020",
            fill: false,
            tension: 0.3,
          },
          {
            label: "QAR",
            data: qarValues,
            borderColor: "#9966ff",
            backgroundColor: "#9966ff20",
            fill: false,
            tension: 0.3,
          },
          {
            label: "KRW",
            data: krwValues,
            borderColor: "#ff6384",
            backgroundColor: "#ff638420",
            fill: false,
            tension: 0.3,
          },
          {
            label: "AZN",
            data: aznValues,
            borderColor: "#36a2eb",
            backgroundColor: "#36a2eb20",
            fill: false,
            tension: 0.3,
          },
          {
            label: "AED",
            data: aedValues,
            borderColor: "#ff9f40",
            backgroundColor: "#ff9f4020",
            fill: false,
            tension: 0.3,
          },
          {
            label: "XDR",
            data: xdrValues,
            borderColor: "#c9cbcf",
            backgroundColor: "#c9cbcf20",
            fill: false,
            tension: 0.3,
          },
        ],
      });
    } catch (err) {
      setError("Veriler alınamadı!");
    } finally {
      setLoading(false);
    }
  };

  // İlk veri çekiminde ve range değiştiğinde verileri çek
  useEffect(() => {
    fetchChartData();
  }, [range]);

  return (
    <div className="chart-container">
      <h2>Döviz Kurları Grafiği</h2>
      <div className="range-select">
        <select value={range} onChange={(e) => setRange(e.target.value)}>
          <option value="daily">Günlük</option>
          <option value="week">Haftalık</option>
          <option value="month">Aylık</option>
          <option value="year">Yıllık</option>
        </select>
      </div>

      
      {loading ? (
        <p className="loading">Veriler yükleniyor...</p>
      ) : error ? (
        <p className="error">Hata: {error}</p>
      ) : (
        <Line data={chartData} />
      )}
    </div>
  );
};

export default ChartComponent;
