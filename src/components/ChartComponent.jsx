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
  "USD","EUR","AUD","DKK","GBP","CHF","SEK","CAD","KWD","NOK","SAR",
  "JPY","BGN","RON","RUB","CNY","PKR","QAR","KRW","AZN","AED","XDR"
];

const ChartComponent = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [range, setRange] = useState("week");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Seçilen aralığa göre tarih listesi oluşturur
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

  // Tarihi gün-ay-yıl formatına çevirir
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // API'den verilen tarih için döviz kurlarını çeker
  const fetchRatesForDate = async (date) => {
    try {
      const formattedDate = formatDate(date);
      const url =
        range === "daily"
          ? "https://exchange.intern.demo.pigasoft.com/api/exchange/today"
          : `https://exchange.intern.demo.pigasoft.com/api/exchange/filter?date=${formattedDate}`;

      const response = await axios.get(url);
      const data = response.data?.data || {};

      // forEach ile her kur için veriyi obje halinde döndür
      const rates = {};
      currencies.forEach((cur) => {
        rates[cur] = data[cur]?.value
          ? parseFloat(data[cur].value.replace(",", "."))
          : null;
      });
      return rates;
    } catch {
      // Hata olursa tüm kurları null döndürecek
      const rates = {};
      currencies.forEach((cur) => (rates[cur] = null));
      return rates;
    }
  };

  // Grafik verilerini API'den çeker ve state'e kaydeder
  const fetchChartData = async () => {
    setLoading(true);
    setError(null);

    try {
      const dates = generateDates();
      const labels = [];
      const currencyData = Object.fromEntries(currencies.map((c) => [c, []])); 
      // Her kur için dizi oluştur

      // Tüm tarihler için döviz kurlarını al
      for (const date of dates) {
        const rates = await fetchRatesForDate(date);
        const label = formatDate(date);
        labels.push(label);

        // Her kur için veriyi diziye ekle, eksikse son değeri tekrar et
        currencies.forEach((cur) => {
          const arr = currencyData[cur];
          if (rates[cur] !== null && rates[cur] !== undefined) {
            arr.push(rates[cur]);
          } else if (arr.length > 0) {
            arr.push(arr[arr.length - 1]);
          } else {
            arr.push(null);
          }
        });

        // Yükleme aşamasında kısa gecikme sağla 
        await new Promise((res) => setTimeout(res, 50));
      }

      // Grafik datasetlerini hazırla
      setChartData({
        labels,
        datasets: currencies.map((cur, index) => ({
          label: cur,
          data: currencyData[cur],
          borderColor: [
            "rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)",
            "rgba(255, 159, 64, 1)", "rgba(153, 102, 255, 1)", "rgba(255, 205, 86, 1)",
            "rgba(54, 162, 235, 1)", "rgba(201, 203, 207, 1)", "rgba(255,99,132,1)",
            "#36a2eb", "#ff6384", "#ff9f40", "#4bc0c0", "#9966ff", "#c9cbcf",
            "#ffcd56", "#4bc0c0", "#9966ff", "#ff6384", "#36a2eb", "#ff9f40", "#c9cbcf"
          ][index],
          backgroundColor: "rgba(0,0,0,0.05)",
          fill: false,
          tension: 0.3,
        })),
      });
    } catch (err) {
      setError("Veriler alınamadı!");
    } finally {
      setLoading(false);
    }
  };

  // Range değişince verileri yeniden çeker
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
