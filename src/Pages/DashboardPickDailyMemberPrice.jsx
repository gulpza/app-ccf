// DashboardPickDailyMemberPrice.jsx
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Spinner } from 'react-bootstrap';
import TableDashboardPickDailyMemberPrice from '../Components/TableDashboardPickDailyMemberPrice';
import Enum from '../Helpper/Enum';

function formatDate(date) {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function DashboardPickDailyMemberPrice() {
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState(formatDate(new Date()));
  const [endDate, setEndDate] = useState(formatDate(new Date()));
  const [loading, setLoading] = useState(false);
  const apiKey = import.meta.env.VITE_SHEET_PICK_API_KEY;

  useEffect(() => {
    handleFilter();
  }, []);

  // Auto-refresh every 7s เฉพาะตอนที่ยังไม่มีข้อมูล
  useEffect(() => {
    const timer = setInterval(() => {
      if (startDate && filteredData.length === 0) {
        console.log('Auto-refresh every 7s (no data found)…');
        handleFilter();
      }
    }, 7 * 1000);
    return () => clearInterval(timer);
  }, [startDate, filteredData.length]);

  const handleFilter = () => {
    setLoading(true);

    let params = '?action=pickrecord';
    // ใช้ค่าจริงได้ตามต้องการ:
    // params += `&startDate=${encodeURIComponent(startDate.trim())}`;
    // params += `&endDate=${encodeURIComponent(endDate.trim())}`;
    params += `&startDate=2025-07-30`;
    params += `&endDate=2025-08-30`;

    fetch(`${apiKey}${params}`)
      .then((r) => r.json())
      .then((data) => setFilteredData(data))
      .catch((err) => console.error('Error fetching data:', err))
      .finally(() => setLoading(false));
  };

  // ให้ Table เรียกใช้เมื่ออยาก refresh อัตโนมัติ (เฉพาะตอนมีข้อมูลแล้ว)
  const handleAutoRefresh = () => {
    if (startDate && filteredData.length > 0) {
      console.log('Auto-refresh on demand…');
      handleFilter();
    }
  };

  return (
    // padding ซ้าย/ขวาแบบ responsive + กัน overflow
    <div className="container-fluid px-2 px-sm-3 px-md-4 py-2" style={{ overflowX: 'hidden' }}>

      {/* ส่ง data + ฟังก์ชันรีเฟรช + โลโก้ไปยังตาราง */}
      <TableDashboardPickDailyMemberPrice
        data={filteredData}
        onRefreshData={handleAutoRefresh}
        isLoading={loading}
        startDate={startDate}
        logoUrl={Enum.URL_LOGO}
      />
    </div>
  );
}

export default DashboardPickDailyMemberPrice;