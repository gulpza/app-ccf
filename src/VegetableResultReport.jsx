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

function VegetableResultReport() {
  const [filteredData, setFilteredData] = useState([]);
  const [empId, setEmpId] = useState('');
  const [employees, setEmployees] = useState([]);
  // const [filterDate, setFilterDate] = useState(formatDate(new Date())); // Set default date to today
  const [startDate, setStartDate] = useState(formatDate(new Date())); // Start date default to today
  const [endDate, setEndDate] = useState(formatDate(new Date())); // End date default to today
  const [loading, setLoading] = useState(false); // State variable for loading indicator

  // Fetch employee data when the component mounts
  useEffect(() => {
    handleEmployees();
  }, []);

  const handleEmployees = () => { 
    setLoading(true);
    fetch('https://script.google.com/macros/s/AKfycbxONu0P-iT_NyQzh_-MMEdSFQBKzFhKAoZuHNeYpBv7xHwkhSU2fBfLLI37tOZ6H4hI/exec')
      .then(response => response.json())
      .then(data => {
        setEmployees(data);
      })
      .catch(error => {
        console.error('Error fetching employee data:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Function to handle filtering
  const handleFilter = () => {
    setLoading(true); // Set loading state to true before fetching data

    // Construct the API URL with parameters
    let apiUrl = 'https://script.google.com/macros/s/AKfycby9Ghx-4BZ0aiFLwDQu95H-tebWhzGf_P8nH1iy_2-X0Vp9rG5bGuq3CeVJwxGohNdy/exec';
    apiUrl += `?empId=${encodeURIComponent(empId.trim().toUpperCase())}`;
    apiUrl += `&startDate=${encodeURIComponent(startDate.trim())}`;
    apiUrl += `&endDate=${encodeURIComponent(endDate.trim())}`;

    // Make a fetch request to the API
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {

        const reduceData = data.reduce((acc, item) => {
          const { วันที่เด็ด, ประเภทผัก, น้ำหนัก } = item;
          const key = `${วันที่เด็ด}_${ประเภทผัก}`;
          
          if (!acc[key]) {
              acc[key] = {
                  วันที่เด็ด,
                  ประเภทผัก,
                  totalWeight: 0
              };
          }
          
          acc[key].totalWeight += น้ำหนัก;
          
          return acc;
      }, {});

        data = Object.values(reduceData);
        
        const result = data.map((e, i) => {
          return {
            date: e['วันที่เด็ด'],
            vegetable: e['ประเภทผัก'],
            totalWeight: e.totalWeight.toFixed(2)
          }
        });

        result.sort((a, b) => new Date(a.date) - new Date(b.date));

        setFilteredData(result);

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
    setEmpId('');
    setFilterDate(formatDate(new Date()));
    setFilteredData([]);
  };

  return (
    <div className="container mt-4">
      <div className="mb-6">
        <label htmlFor="empId" className="form-label">พนักงาน:</label>
        <select
          id="empId"
          className="form-select"
          value={empId}
          required
          onChange={(e) => setEmpId(e.target.value)}
        >
          <option value="">เลือกพนักงาน</option>
          {employees.map((employee) => (
            <option key={employee['รหัสพนักงาน']} value={employee['รหัสพนักงาน']}>
              {employee['ชื่อพนักงาน']} {employee['นามสกุล']}  {'('}{employee['ชื่อเล่น']}{')'}
            </option>
          ))}
        </select>
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
        <button
          className="btn btn-primary mt-3 mb-3 btn-lg btn-block me-3"
          onClick={handleFilter}
          disabled={!empId || !startDate || !endDate}
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
            <th scope="col">วันที่</th>
            <th scope="col">ประเภทผัก</th>
            <th scope="col">น้ำหนัก</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <tr key={index}>
                <td>{moment(item.date).format('DD/MM/YYYY')}</td>
                <td>{item.vegetable}</td>
                <td>{item.totalWeight}</td>
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

export default VegetableResultReport;
