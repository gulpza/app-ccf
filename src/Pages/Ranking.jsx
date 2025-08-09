import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Spinner } from 'react-bootstrap';
import Enum from '../Helpper/Enum';

function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function Ranking() {
  const [filteredData, setFilteredData] = useState([]);
  const [departmentId, setDepartmentId] = useState('');
  const [departments, setDepartment] = useState([]);
  const [startDate, setStartDate] = useState(formatDate(new Date())); // Start date default to today
  const [endDate, setEndDate] = useState(formatDate(new Date())); // End date default to today
  const [loading, setLoading] = useState(false); // State variable for loading indicator
  const apiKey = import.meta.env.VITE_SHEET_PICK_API_KEY;

  // Fetch employee data when the component mounts
  useEffect(() => {
    handleDepartment();
  }, []);

  const handleDepartment = async () => { 
    setLoading(true);
    try {
      const response = await fetch(`${apiKey}?action=department`);
      const data = await response.json();
      setDepartment(data);
    } catch (error) {
      console.error('Error fetching employee data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Modify each data fetch function to return the fetched data
const handleDataScore = async () => {
    let params = "?action=score";
    params += `&startDate=${encodeURIComponent(startDate.trim())}`;
    params += `&endDate=${encodeURIComponent(endDate.trim())}`;
  
    const response = await fetch(`${apiKey}${params}`);
    const data = await response.json();
    return data; // Return the fetched data
  };
  
  const handleDataRandomTest = async () => {
    let params = "?action=randomTest";
    params += `&startDate=${encodeURIComponent(startDate.trim())}`;
    params += `&endDate=${encodeURIComponent(endDate.trim())}`;
  
    const response = await fetch(`${apiKey}${params}`);
    const data = await response.json();
    return data; // Return the fetched data
  };
  
  const handleDataRandomTestPick = async () => {
    let params = "?action=randomTestPick";
    params += `&startDate=${encodeURIComponent(startDate.trim())}`;
    params += `&endDate=${encodeURIComponent(endDate.trim())}`;
  
    const response = await fetch(`${apiKey}${params}`);
    const data = await response.json();
    // setDataRandomTestPick(data);
    return data; // Return the fetched data
  };
  
  const handleDataHairRolling = async () => {
    let params = "?action=hairRolling";
    params += `&startDate=${encodeURIComponent(startDate.trim())}`;
    params += `&endDate=${encodeURIComponent(endDate.trim())}`;
  
    const response = await fetch(`${apiKey}${params}`);
    const data = await response.json();
    // setDataHairRolling(data);
    return data; // Return the fetched data
  };

  // Function to handle filtering
  const handleFilter = async () => {
    setLoading(true); // Set loading state to true before fetching data

    try {
        let [scoreData, randomTestData, randomTestPickData, hairRollingData] = await Promise.all([
            handleDataScore(),
            handleDataRandomTest(),
            handleDataRandomTestPick(),
            handleDataHairRolling(),
          ]);
     
            scoreData = scoreData.map(e => ({
                "employee": e['ชื่อพนักงาน'],
                "department": e['แผนก'],
                "point": e['รวม']
            })).filter(e => e.point > 0);;

            randomTestData = randomTestData.map(e => ({
                "employee": e['ชื่อพนักงาน'],
                "department": e['แผนก'],
                "point": e['คะแนนรวม']
            })).filter(e => e.point > 0);

            randomTestPickData = randomTestPickData.map(e => ({
                "employee": e['ชื่อพนักงาน'],
                "department": e['แผนก'],
                "point": e['คะแนนรวม']
            })).filter(e => e.point > 0);


            hairRollingData = hairRollingData.map(e => ({
                    "employee": e['ชื่อพนักงาน'],
                    "department": e['แผนก'],
                    "point": e['คะแนนรวม']
            })).filter(e => e.point > 0);

            if(!!departmentId)
            {
                scoreData = scoreData.filter(e => e.department === departmentId);
                randomTestData = randomTestData.filter(e => e.department === departmentId);
                randomTestPickData = randomTestPickData.filter(e => e.department === departmentId);
                hairRollingData = hairRollingData.filter(e => e.department === departmentId);
            }

            const combinedData = [...scoreData, ...randomTestData, ...randomTestPickData, ...hairRollingData];

            const groupedData = combinedData.reduce((acc, curr) => {
              const existingEntry = acc.find(
                entry => entry.employee === curr.employee && entry.department === curr.department
              );
        
              if (existingEntry) {
                existingEntry.point += curr.point;
              } else {
                acc.push({ ...curr }); // Keep the same structure as combinedData
              }
        
              return acc;
            }, []);
        
            const result = groupedData.sort((a, b) => b.point - a.point);
        
            setFilteredData(result);
         
    } finally {
      setLoading(false); // Set loading state to false after fetching data
    }
  };

  // Function to handle form reset
  const handleReset = () => {
    setDepartmentId('');
    setStartDate(formatDate(new Date()));
    setEndDate(formatDate(new Date()));
    setFilteredData([]);
  };

  return (
    <div className="container mt-4">
     <div className="d-flex justify-content-center">
        <Link to="/home" className="d-inline-block">
          <img src={Enum.URL_LOGO} alt="Company Logo" className="img-fluid" style={{ maxWidth: '150px' }} />
        </Link>
      </div>
      <h2 className="text-center">Ranking</h2>
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
        <label htmlFor="empId" className="form-label">แผนก:</label>
        <select
          id="empId"
          className="form-select"
          value={departmentId}
          required
          onChange={(e) => setDepartmentId(e.target.value)}
        >
          <option value="">เลือกแผนก</option>
          {departments.map((department) => (
            <option key={department['ชื่อแผนก']} value={department['ชื่อแผนก']}>
              {department['ชื่อแผนก']}
            </option>
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
            <th scope="col">ชื่อพนักงาน</th>
            <th scope="col">แผนก</th>
            <th scope="col">คะแนนที่โดนหัก</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <tr key={index}>
                 <td>{item.employee}</td>
                <td>{item.department}</td>
                <td>{item.point}</td>
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

export default Ranking;