import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function EmployeeTable() {
  const [filteredData, setFilteredData] = useState([]);
  const [empId, setEmpId] = useState('');
  const [filterDate, setFilterDate] = useState(formatDate(new Date())); // Set default date to today
  const [loading, setLoading] = useState(false); // State variable for loading indicator

  useEffect(() => {
    // Automatically filter data when the component mounts if needed
  }, []); // Empty dependency array to run the effect only once when the component mounts

  // Function to handle filtering
  const handleFilter = () => {
    setLoading(true); // Set loading state to true before fetching data

    // Construct the API URL with parameters
    let apiUrl = 'https://script.google.com/macros/s/AKfycby9Ghx-4BZ0aiFLwDQu95H-tebWhzGf_P8nH1iy_2-X0Vp9rG5bGuq3CeVJwxGohNdy/exec';
    apiUrl += `?empId=${encodeURIComponent(empId.trim().toUpperCase())}`;
    apiUrl += `&startDate=${encodeURIComponent(filterDate.trim())}`;
    apiUrl += `&endDate=${encodeURIComponent(filterDate.trim())}`;

    // Make a fetch request to the API
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        // Update the filtered data state with the response data
        const result = data.map((e, i) => {
          return {
            no: i + 1,
            farmName: e['ชื่อไร่'],
            vegetable: e['ประเภทผัก'],
            qty: e['น้ำหนัก']
          }
        });
        setFilteredData(result);
        setLoading(false); // Set loading state to false after fetching data
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false); // Set loading state to false in case of an error
      });
  };

  // Function to handle form reset
  const handleReset = () => {
    setEmpId('');
    setFilterDate(formatDate(new Date()));
    setFilteredData([]);
  };

  return (
    <div className="container mt-4">
      <div className="mb-3">
        <label htmlFor="empId" className="form-label">รหัสพนักงาน:</label>
        <input
          type="text"
          id="empId"
          className="form-control"
          value={empId}
          required
          onChange={(e) => setEmpId(e.target.value)}
        />
        <label htmlFor="filterDate" className="form-label mt-3">วันที่เด็ด:</label>
        <input
          type="date"
          id="filterDate"
          className="form-control"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
        <button
          className="btn btn-primary mt-3 me-2"
          onClick={handleFilter}
          disabled={!empId || !filterDate}
        >
          ค้นหา
        </button>
        <button className="btn btn-secondary mt-3" onClick={handleReset}>รีเซ็ต</button>
      </div>
      {/* Display loading indicator if loading state is true */}
      {loading && (
        <div className="d-flex justify-content-center my-3">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
      <table className="table table-bordered">
        <thead className="thead-light">
          <tr>
            <th>ลำดับ</th>
            <th>ไร่</th>
            <th>ผัก</th>
            <th>จำนวน</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <tr key={index}>
                <td>{item.no}</td>
                <td>{item.farmName}</td>
                <td>{item.vegetable}</td>
                <td>{item.qty}</td>
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

export default EmployeeTable;
