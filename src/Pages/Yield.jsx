import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Spinner } from 'react-bootstrap';
import moment from 'moment';
import Enum from '../Helpper/Enum';

function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function Yield() {
  const [filteredData, setFilteredData] = useState([]);
  const [farmCode, setFarmCode] = useState('');
  const [inputRawmat, setInputRawmat] = useState([]);
  const [pickRecord, setPickRecord] = useState([]);
  const [fg, setFg] = useState([]);
  const [farms, setFarms] = useState([]);
  const [vegTypeCode, setVegTypeCode] = useState('');
  const [vegTypes, setVegTypes] = useState([]);
  const [startDate, setStartDate] = useState(formatDate(new Date())); // Start date default to today
  const [endDate, setEndDate] = useState(formatDate(new Date())); // End date default to today
  const [loading, setLoading] = useState(false); // State variable for loading indicator
  const apiKeyPick = import.meta.env.VITE_SHEET_PICK_API_KEY;
  const apiKeyProductionVolume = import.meta.env.VITE_SHEET_PRODUCTION_VOLUME_API_KEY;


  useEffect(() => {
    handleInitialLoad();
  }, []);

  const handleInitialLoad = () => {
    setLoading(true);
    Promise.all([handleFarm(), handleVegType()])
      .then(() => {
        setLoading(false);
        // setInitialLoad(false);
      })
      .catch((error) => {
        console.error('Error fetching farm and vegType data:', error);
        setLoading(false);
        // setInitialLoad(false);
      });
  };

  const handleFarm = () => {
    return fetch(`${apiKeyPick}?action=farm`)
      .then((response) => response.json())
      .then((data) => {
        setFarms(data);
      })
      .catch((error) => {
        console.error('Error fetching farm data:', error);
      });
  };

  const handleVegType = () => {
    return fetch(`${apiKeyPick}?action=vegtype`)
      .then((response) => response.json())
      .then((data) => {
        setVegTypes(data);
      })
      .catch((error) => {
        console.error('Error fetching vegetable type data:', error);
      });
  };

  const handleInputRawmat = async () => {
    let params = "?action=inputRawmat";
    params += `&startDate=${encodeURIComponent(startDate.trim())}`;
    params += `&endDate=${encodeURIComponent(endDate.trim())}`;
    params += `&farmName=${encodeURIComponent(farmCode.trim().toUpperCase())}`;
    params += `&vegType=${encodeURIComponent(vegTypeCode.trim().toUpperCase())}`;

    return fetch(`${apiKeyPick}${params}`)
      .then((response) => response.json())
      .then((data) => {
        setInputRawmat(data);
        return data;
      })
      .catch((error) => {
        console.error('Error fetching farm data:', error);
      });
  };

  const handlePickRecord  = async () => {
    let params = "?action=pickRecordYield";
    params += `&startDate=${encodeURIComponent(startDate.trim())}`;
    params += `&endDate=${encodeURIComponent(endDate.trim())}`;
    params += `&farmName=${encodeURIComponent(farmCode.trim().toUpperCase())}`;
    params += `&vegType=${encodeURIComponent(vegTypeCode.trim().toUpperCase())}`;
    
    return fetch(`${apiKeyPick}${params}`)
      .then((response) => response.json())
      .then((data) => {
        setPickRecord(data);
        return data;
      })
      .catch((error) => {
        console.error('Error fetching farm data:', error);
      });
  };

  const handleFG  = async () => {
    let params = "?action=fgYield";
    params += `&startDate=${encodeURIComponent(startDate.trim())}`;
    params += `&endDate=${encodeURIComponent(endDate.trim())}`;
    params += `&farmName=${encodeURIComponent(farmCode.trim().toUpperCase())}`;
    params += `&vegType=${encodeURIComponent(vegTypeCode.trim().toUpperCase())}`;
    
    return fetch(`${apiKeyProductionVolume}${params}`)
      .then((response) => response.json())
      .then((data) => {
        setFg(data);
        return data;
      })
      .catch((error) => {
        console.error('Error fetching farm data:', error);
      });
  };


  const handleFilter = async () => {
    setLoading(true);

    try {
      const [inputRawmatRes, pickRecordRes, fgRes] = await Promise.all([
        handleInputRawmat(),
        handlePickRecord(),
        handleFG()
      ]);
      setLoading(false);

        
        const inputRawmatGroupBy = inputRawmatRes.reduce((acc, item) => {
          const key = `${item["วันที่รับผัก"]}||${item["ชื่อไร่"]}||${item["ประเภทผัก"]}||${item.Code}`;
      
          if (!acc[key]) {
            acc[key] = {
              date: item["วันที่รับผัก"],
              farmName: item["ชื่อไร่"],
              vegType: item["ประเภทผัก"],
              code: item.Code,
              inputRawmatQty: 0
            };
          }
      
          acc[key]['inputRawmatQty'] += parseFloat(item['จำนวน'] || 0);
      
          return acc;
        }, {});
      
        const inputRawmatData = Object.values(inputRawmatGroupBy);

        const pickRecordGroupBy = pickRecordRes.reduce((acc, item) => {
          const key = `${item["วันที่รับผัก"]}||${item["ชื่อไร่"]}||${item["ประเภทผัก"]}||${item.InputRawmatCode}`;
      
          if (!acc[key]) {
            acc[key] = {
              date: item["วันที่รับผัก"],
              farmName: item["ชื่อไร่"],
              vegType: item["ประเภทผัก"],
              code: item.InputRawmatCode,
              pickRecordWeight: 0
            };
          }
      
          acc[key]['pickRecordWeight'] += parseFloat(item['น้ำหนัก'] || 0);
      
          return acc;
        }, {});

        const pickRecordData = Object.values(pickRecordGroupBy);

        const fgGroupBy = fgRes.reduce((acc, item) => {
          const key = `${item["วันที่รับผัก"]}||${item["ชื่อไร่"]}||${item["ประเภทผัก"]}||${item.InputRawmatCode}`;
      
          if (!acc[key]) {
            acc[key] = {
              date: item["วันที่รับผัก"],
              farmName: item["ชื่อไร่"],
              vegType: item["ประเภทผัก"],
              code: item.InputRawmatCode,
              fgWeight: 0
            };
          }
      
          acc[key]['fgWeight'] += parseFloat(item['รวม'] || 0);
      
          return acc;
        }, {});

        const fgData = Object.values(fgGroupBy);
  
        // รวมข้อมูลทั้ง 3 objects โดยใช้ date, farmName, vegType, code เป็น key
        const combinedMap = new Map();
        
        // เพิ่มข้อมูลจาก inputRawmatData
        inputRawmatData.forEach(item => {
          const key = `${item.date}||${item.farmName}||${item.vegType}||${item.code}`;
          combinedMap.set(key, {
            date: item.date,
            farmName: item.farmName,
            vegType: item.vegType,
            code: item.code,
            inputRawmatQty: item.inputRawmatQty,
            pickRecordWeight: 0,
            fgWeight: 0
          });
        });
        
        // เพิ่มข้อมูลจาก pickRecordData
        pickRecordData.forEach(item => {
          const key = `${item.date}||${item.farmName}||${item.vegType}||${item.code}`;
          if (combinedMap.has(key)) {
            const existing = combinedMap.get(key);
            existing.pickRecordWeight = item.pickRecordWeight;
          } else {
            combinedMap.set(key, {
              date: item.date,
              farmName: item.farmName,
              vegType: item.vegType,
              code: item.code,
              inputRawmatQty: 0,
              pickRecordWeight: item.pickRecordWeight,
              fgWeight: 0
            });
          }
        });
        
        // เพิ่มข้อมูลจาก fgData
        fgData.forEach(item => {
          const key = `${item.date}||${item.farmName}||${item.vegType}||${item.code}`;
          if (combinedMap.has(key)) {
            const existing = combinedMap.get(key);
            existing.fgWeight = item.fgWeight;
          } else {
            combinedMap.set(key, {
              date: item.date,
              farmName: item.farmName,
              vegType: item.vegType,
              code: item.code,
              inputRawmatQty: 0,
              pickRecordWeight: 0,
              fgWeight: item.fgWeight
            });
          }
        });
        
        const combinedData = Array.from(combinedMap.values());
        console.log("combinedData", combinedData);
  
        // Group combinedData by code, farmName, vegType และ sum ข้อมูล
        const groupedCombinedData = combinedData.reduce((acc, item) => {
          const groupKey = `${item.code}||${item.farmName}||${item.vegType}`;
          
          if (!acc[groupKey]) {
            acc[groupKey] = {
              date: item.date,
              farmName: item.farmName,
              vegType: item.vegType,
              code: item.code,
              inputRawmatQty: 0,
              pickRecordWeight: 0,
              fgWeight: 0
            };
          }
          
          acc[groupKey].inputRawmatQty += parseFloat(item.inputRawmatQty || 0);
          acc[groupKey].pickRecordWeight += parseFloat(item.pickRecordWeight || 0);
          acc[groupKey].fgWeight += parseFloat(item.fgWeight || 0);
          
          return acc;
        }, {});
        
        const finalData = Object.values(groupedCombinedData);
        console.log("finalData after grouping", finalData);
  
        // Sort combinedData by date
        const sortedCombinedData = finalData.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          
          // Sort by date first
          if (dateA < dateB) return -1;
          if (dateA > dateB) return 1;
          
          // If dates are equal, sort by farmName
          if (a.farmName < b.farmName) return -1;
          if (a.farmName > b.farmName) return 1;
          
          return 0;
        });
  
        setFilteredData(sortedCombinedData);

    } catch (error) {
      console.error('Error fetching farm and vegType data:', error);
      setLoading(false);
    }
  };

  // Function to handle form reset
  const handleReset = () => {
    setStartDate(formatDate(new Date()));
    setEndDate(formatDate(new Date()));
    setFarmCode('');
    setVegTypeCode('');
    setFilteredData([]);
  };

  return (
    <div className="container mt-4">
           <Link to="/home" >
          <img src={Enum.URL_LOGO} alt="Company Logo" className="img-fluid" style={{ maxWidth: '150px' }} />
        </Link>
      <h2 className="text-center">รายการยิว</h2>
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
          value={farmCode}
          onChange={(e) => setFarmCode(e.target.value)}
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
          value={vegTypeCode}
          onChange={(e) => setVegTypeCode(e.target.value)}
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
            <th scope="col">ไร่</th>
            <th scope="col">ประเภทผัก</th>
            <th scope="col">จำนวนที่รับเข้า</th>
            <th scope="col">จำนวนที่เด็ดได้</th>
            <th scope="col">จำนวน FG</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <tr key={index}>
                <td>{moment(item.date).format('DD/MM/YYYY')}</td>
                <td>{item.farmName}</td>
                <td>{item.vegType}</td>
                <td>{item.inputRawmatQty.toFixed(2)}</td>
                <td>{item.pickRecordWeight.toFixed(2)}</td>
                <td>{item.fgWeight.toFixed(2)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">No data available</td>
            </tr>
          )}
        </tbody>
        <tfoot className="table-dark">
          <tr>
            <th scope="row" colSpan="3" className="text-center">รวมทั้งหมด</th>
            <th>{filteredData.reduce((sum, item) => sum + (item.inputWeight || 0), 0).toFixed(2)}</th>
            <th>{filteredData.reduce((sum, item) => sum + (item.pickWeight || 0), 0).toFixed(2)}</th>
            <th>{filteredData.reduce((sum, item) => sum + (item.fgWeight || 0), 0).toFixed(2)}</th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default Yield;
