import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Spinner } from 'react-bootstrap';
import DynamicMemberPrice from '../Components/DynamicMemberPrice';

function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function PickDailyMemberPrice() {
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState(formatDate(new Date())); // Start date default to today
  const [endDate, setEndDate] = useState(formatDate(new Date())); // End date default to today
  const [loading, setLoading] = useState(false); // State variable for loading indicator
  const apiKey = import.meta.env.VITE_API_KEY;

  // Fetch employee data when the component mounts
  useEffect(() => {
  }, []);

  // Function to handle filtering
  const handleFilter = () => {
    setLoading(true); // Set loading state to true before fetching data

    // Construct the API URL with parameters
    let params = "?action=pickrecord";
    params += `&startDate=${encodeURIComponent(startDate.trim())}`;
    params += `&endDate=${encodeURIComponent(startDate.trim())}`;
  
    // Make a fetch request to the API
    fetch(`${apiKey}${params}`)
      .then(response => response.json())
      .then(data => {

       setFilteredData(data);

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
    setFilterDate(formatDate(new Date()));
    setFilteredData([]);
  };

  return (
    <div className="container mt-4">
       <h2 className="text-center">จำนวนการเด็ดแต่ละคนในแต่ละวัน</h2>
      <div className="mb-6">
        <label htmlFor="startDate" className="form-label mt-3 me-3">วันที่เด็ด:</label>
<input
  type="date"
  id="startDate"
  className="form-control me-3"
  value={startDate}
  onChange={(e) => setStartDate(e.target.value)}
/>
        <button
          className="btn btn-primary mt-3 mb-3 btn-lg btn-block me-3"
          onClick={handleFilter}
          disabled={!startDate}
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

      <DynamicMemberPrice data={filteredData} />
     
    </div>
  );
}

export default PickDailyMemberPrice;
