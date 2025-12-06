import { useState, useEffect } from 'react';
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

function FarmWeightReport() {
  const [filteredData, setFilteredData] = useState([]);
  const [farmName, setFarmName] = useState('');
  const [inputRawmat, setInputRawmat] = useState([]);
  const [fg, setFg] = useState([]);
  const [farms, setFarms] = useState([]);
  const [vegTypeCode, setVegTypeCode] = useState('');
  const [vegTypes, setVegTypes] = useState([]);
  const [orderPlans, setOrderPlans] = useState([]);
  const [remark, setRemark] = useState('');
  const [startDate, setStartDate] = useState(formatDate(new Date())); // Start date default to today
  const [endDate, setEndDate] = useState(formatDate(new Date())); // End date default to today
  const [loading, setLoading] = useState(false); // State variable for loading indicator
  const apiKeyPick = import.meta.env.VITE_SHEET_PICK_API_KEY;

  useEffect(() => {
    handleInitialLoad();
  }, []);

  const handleInitialLoad = () => {
    setLoading(true);
    Promise.all([handleFarm(), handleVegType(), handleOrderPlan()])
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
    return fetch(`${apiKeyPick}?action=vegType`)
      .then((response) => response.json())
      .then((data) => {
        setVegTypes(data);
      })
      .catch((error) => {
        console.error('Error fetching vegetable type data:', error);
      });
  };

    const handleOrderPlan = () => {
    return fetch(`${apiKeyPick}?action=order-plan`)
      .then((response) => response.json())
      .then((data) => {
        setOrderPlans(data);
      })
      .catch((error) => {
        console.error('Error fetching vegetable type data:', error);
      });
  };

  const handleFarmWeightReport = async () => {
    let params = "?action=get-farm-weight-report";
    params += `&startDate=${encodeURIComponent(startDate.trim())}`;
    params += `&endDate=${encodeURIComponent(endDate.trim())}`;
    params += `&farmName=${encodeURIComponent(farmName.trim().toUpperCase())}`;
    params += `&typeName=${encodeURIComponent(vegTypeCode.trim().toUpperCase())}`;
    params += `&remark=${encodeURIComponent(remark.trim().toUpperCase())}`;    
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


  const handleFilter = async () => {
    setLoading(true);

    try {
      let result = await handleFarmWeightReport();
      
      result = result.map(item => ({
        genId: item['GenId'] || '',
        farmCode: item['รหัสไร่'] || '',
        farmName: item['ชื่อไร่'] || '',
        vegTypeCode: item['รหัสประเภทผัก'] || '',
        typeName: item['TypeName'] || '',
        vegType: item['ประเภทผัก'] || '',
        deliveryDate: item['วันที่สั่ง'],
        plan: parseFloat(item['แผน']) || 0,
        farmWeight: item['ยอดชั่งหน้าสวน'] ? parseFloat(item['ยอดชั่งหน้าสวน']) : 0,
        actualDelivery: item['ส่งจริง'] ? parseFloat(item['ส่งจริง']) : 0,
        email: item['e-mail'] || '',
        deliveryStatus: item['สถานะการส่ง'] || '',
        remark: item['หมายเหตุ'] || ''
      }));

      console.log("Processed result:", result);

      // Sort by delivery date and farm name
      const sortedData = result.sort((a, b) => {
        const dateA = new Date(a.deliveryDate);
        const dateB = new Date(b.deliveryDate);
        
        if (dateA < dateB) return -1;
        if (dateA > dateB) return 1;
        
        if (a.farmName < b.farmName) return -1;
        if (a.farmName > b.farmName) return 1;
        
        return 0;
      });

      setFilteredData(sortedData);
      setLoading(false);

    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  // Function to handle form reset
  const handleReset = () => {
    setStartDate(formatDate(new Date()));
    setEndDate(formatDate(new Date()));
    setFarmName('');
    setVegTypeCode('');
    setOrderPlanCode('');
    setFilteredData([]);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-center">
        <Link to="/home" className="d-inline-block">
          <img src={Enum.URL_LOGO} alt="Company Logo" className="img-fluid" style={{ maxWidth: '150px' }} />
        </Link>
      </div>
      <h2 className="text-center">รายงานการจัดส่งผักจากไร่</h2>
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
          value={farmName}
          onChange={(e) => setFarmName(e.target.value)}
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

        <label htmlFor="orderPlanSelect" className="form-label mt-3 me-3">สถานที่ส่ง:</label>
        <select
          id="orderPlanSelect"
          className="form-select me-3"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
        >
          <option value="">เลือกสถานที่ส่ง</option>
          {orderPlans.map((plan) => (
            <option key={plan['ชื่อสถานที่']} value={plan['ชื่อสถานที่']}>{plan['ชื่อสถานที่']}</option>
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
            <th scope="col">วันที่สั่ง</th>
            <th scope="col">ชื่อไร่</th>
            <th scope="col">ประเภทผัก</th>
            <th scope="col">แผน</th>
            <th scope="col">ยอดชั่งหน้าสวน</th>
            <th scope="col">ส่งจริง</th>
            {/* <th scope="col">สถานะการส่ง</th> */}
            <th scope="col">หมายเหตุ</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <tr key={index}>
                <td>{moment(item.deliveryDate).format('DD/MM/YYYY')}</td>
                <td>{item.farmName}</td>
                <td>{item.typeName}</td>
                <td>{item.plan.toFixed(2)}</td>
                <td>{item.farmWeight > 0 ? item.farmWeight.toFixed(2) : '-'}</td>
                <td>{item.actualDelivery > 0 ? item.actualDelivery.toFixed(2) : '-'}</td>
                {/* <td>
                  <span className={`badge ${
                    item.deliveryStatus === 'ส่งแล้ว' ? 'bg-success' : 
                    item.deliveryStatus === 'ยกเลิก' ? 'bg-danger' : 
                    'bg-warning'
                  }`}>
                    {item.deliveryStatus}
                  </span>
                </td> */}
                <td>{item.remark || '-'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default FarmWeightReport;
