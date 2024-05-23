import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Spinner } from 'react-bootstrap';
import moment from 'moment';

function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function PickFarm() {
  const [filteredData, setFilteredData] = useState([]);
  const [farmCode, setFarmCode] = useState('');
  const [farms, setFarms] = useState([]);
  const [vegTypeCode, setVegTypeCode] = useState('');
  const [vegTypes, setVegTypes] = useState([]);
  const [startDate, setStartDate] = useState(formatDate(new Date())); // Start date default to today
  const [endDate, setEndDate] = useState(formatDate(new Date())); // End date default to today
  const [loading, setLoading] = useState(false); // State variable for loading indicator
  const apiKey = import.meta.env.VITE_API_KEY;


  useEffect(() => {
    handleInitialLoad();
  }, []);

  const handleInitialLoad = () => {
    setLoading(true);
    Promise.all([handleFarm(), handleVegType()])
      .then(() => {
        setLoading(false);
        setInitialLoad(false);
      })
      .catch((error) => {
        console.error('Error fetching farm and vegType data:', error);
        setLoading(false);
        setInitialLoad(false);
      });
  };

  const handleFarm = () => {
    return fetch(`${apiKey}?action=farm`)
      .then((response) => response.json())
      .then((data) => {
        setFarms(data);
      })
      .catch((error) => {
        console.error('Error fetching farm data:', error);
      });
  };

  const handleVegType = () => {
    return fetch(`${apiKey}?action=vegtype`)
      .then((response) => response.json())
      .then((data) => {
        setVegTypes(data);
      })
      .catch((error) => {
        console.error('Error fetching vegetable type data:', error);
      });
  };

  const handleFilter = () => {
    setLoading(true); // Set loading state to true before fetching data

    // Construct the API URL with parameters
    let params = "?action=pickfarm";
    params += `&startDate=${encodeURIComponent(startDate.trim())}`;
    params += `&endDate=${encodeURIComponent(endDate.trim())}`;
    params += `&farmName=${encodeURIComponent(farmCode.trim().toUpperCase())}`;
    params += `&vegType=${encodeURIComponent(vegTypeCode.trim().toUpperCase())}`;

    // Make a fetch request to the API
    fetch(`${apiKey}${params}`)
      .then(response => response.json())
      .then(data => {

        const result = {};

        data.forEach(entry => {
          const { วันที่รับผัก, ชื่อไร่, ประเภทผัก, น้ำหนัก } = entry;
          const dateKey = new Date(วันที่รับผัก).toISOString().split('T')[0];
          const farmTypeKey = `${ชื่อไร่}-${ประเภทผัก}`;

          if (!result[dateKey]) {
            result[dateKey] = {};
          }

          if (!result[dateKey][farmTypeKey]) {
            result[dateKey][farmTypeKey] = {
              "date": dateKey,
              "farmName": ชื่อไร่,
              "vegType": ประเภทผัก,
              "weight": 0
            };
          }

          result[dateKey][farmTypeKey]["weight"] += น้ำหนัก;
        });

        // Flatten the result object to an array
        const res = Object.values(result).flatMap(dateGroup => Object.values(dateGroup));
        res.sort((a, b) => new Date(a.date) - new Date(b.date));
        setFilteredData(res);

      })
      .catch(error => {
        console.error('Error fetching data:', error);
      })
      .finally(() => {
        setLoading(false); // Set loading state to false after fetching data
      });
  };

  // Function to handle form reset
  const handleReset = () => {
    setStartDate(formatDate(new Date()));
    setEndDate(formatDate(new Date()));
    setFilteredData([]);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">รายงานจำนวนของแต่ละไร่</h2>
      <div className="mb-6">
        <label htmlFor="startDate" className="form-label mt-3 me-3">วันที่เริ่ม:</label>
        <input
          type="date"
          id="startDate"
          className="form-control me-3"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <label htmlFor="endDate" className="form-label mt-3 me-3">สิ้นสุด:</label>
        <input
          type="date"
          id="endDate"
          className="form-control me-3"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <label htmlFor="farmSelect" className="form-label mt-3 me-3">ไร่:</label>
          <select
            id="farmSelect"
            className="form-select me-3"
            onChange={(e) => setFarmCode(e.target.value)} // Handle farm selection
          >
            <option value="">เลือกไร่</option>
            {farms.map((farm) => (
              <option key={farm['Code']} value={farm['FarmName']}>{farm['FarmName']}</option>
            ))}
          </select>

          <label htmlFor="vegTypeSelect" className="form-label mt-3 me-3">ประเภทผัก:</label>
          <select
            id="vegTypeSelect"
            className="form-select me-3"
            onChange={(e) => setVegTypeCode(e.target.value)} // Handle farm selection
          >
            <option value="">เลือกประเภทผัก</option>
            {vegTypes.map((vegType) => (
              <option key={vegType['Code']} value={vegType['TypeName']}>{vegType['TypeName']}</option>
            ))}
          </select>
        <button
          className="btn btn-primary mt-3 mb-3 btn-lg btn-block me-3"
          onClick={handleFilter}
          disabled={!startDate || !endDate}
        >
          ค้นหา
        </button>
        <button className="btn btn-secondary mt-3 mb-3 ml-3 btn-lg btn-block" onClick={handleReset}>รีเซ็ต</button>
      </div>
      <Modal show={loading} centered>
        <Modal.Body className="text-center">
          <Spinner animation="border" role="status">
            <span className="sr-only"></span>
          </Spinner>
          <p>Loading...</p>
        </Modal.Body>
      </Modal>
      <table className="table table-striped">
        <thead className="thead-light">
          <tr>
            <th scope="col">วันที่รับผัก</th>
            <th scope="col">ชื่อไร่</th>
            <th scope="col">ประเภทผัก</th>
            <th scope="col">น้ำหนักรวม</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <tr key={index}>
                <td>{moment(item["date"]).format('DD/MM/YYYY')}</td>
                <td>{item["farmName"]}</td>
                <td>{item["vegType"]}</td>
                <td>{item["weight"].toFixed(2)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PickFarm;
