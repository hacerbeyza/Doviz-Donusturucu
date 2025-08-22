import React, { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Verilerin tutulduğu tablo bileşeni
function Table() {
  const [date, setDate] = useState(new Date());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

// Tarihi gün-ay-yıl formatına çeviren fonksiyon
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Veriyi seçilen tarihe göre alıyoruz
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const formattedDate = formatDate(date);
        const response = await axios.get(
          `https://exchange.intern.demo.pigasoft.com/api/exchange/filter?date=${formattedDate}`
        );
        setData(response.data.data);
      } catch (err) {
        setError("Veri alınamadı!");
        setData(null);
      }
      setLoading(false);
    };

    fetchData();
  }, [date]);

  return (
    <div className="table-container">
      <div className="date-picker">
        <DatePicker
          selected={date}
          onChange={(date) => setDate(date)}
          dateFormat="dd-MM-yyyy"
        />
      </div>
      {loading && <p>Yükleniyor...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {data && ( 
        // Tablo yapısı
        <table>
          <thead>
            <tr>
              <th>Döviz</th>
              <th>Ad</th>
              <th>Kur</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(data).map((item) => (
              <tr key={item.code}>
                <td>{item.code}</td>
                <td>{item.title}</td>
                <td>{item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Table;
