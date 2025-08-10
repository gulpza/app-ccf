// DashboardPickDailyMemberPrice.jsx
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Spinner } from 'react-bootstrap';
import TableDashboardPickDailyMemberPrice from '../Components/Tables/TableDashboardPickDailyMemberPrice';
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
  const [lastApiCallTime, setLastApiCallTime] = useState(null);
  const apiKey = import.meta.env.VITE_SHEET_PICK_API_KEY;

  // โหลดครั้งแรก
  useEffect(() => {
    handleFilter();
  }, []);

  // ถ้ายังไม่มีข้อมูล ให้ลองดึงซ้ำทุก 7 วินาที
  useEffect(() => {
    const timer = setInterval(() => {
      if (filteredData.length === 0) {
        console.log('Auto-refresh every 7s (no data found)…');
        handleFilter();
      }
    }, 7 * 1000);
    return () => clearInterval(timer);
  }, [filteredData.length]);

  // อัปเดตวันอัตโนมัติเมื่อข้ามวัน + ดึงข้อมูลใหม่
  useEffect(() => {
    const tick = setInterval(() => {
      const today = formatDate(new Date());
      if (today !== startDate || today !== endDate) {
        setStartDate(today);
        setEndDate(today);
        console.log('Date changed (new day) → refresh data for today');
        // ดึงข้อมูลของวันใหม่อัตโนมัติ
        handleFilter(today);
      }
    }, 60 * 1000); // เช็คทุก 1 นาที
    return () => clearInterval(tick);
    // ใส่ startDate/endDate ใน deps เพื่อให้รู้วันล่าสุด
  }, [startDate, endDate]);

  // ดึงข้อมูล (บังคับใช้ "วันนี้" เสมอ)
  const handleFilter = (overrideToday) => {
    const today = overrideToday ?? formatDate(new Date());

    // sync state ให้เป็นวันนี้ก่อน
    if (today !== startDate) setStartDate(today);
    if (today !== endDate) setEndDate(today);

    setLoading(true);
    setLastApiCallTime(new Date()); // บันทึกเวลาที่ call API

    const params =
      `?action=pickrecord` +
      `&startDate=${encodeURIComponent(today)}` +
      `&endDate=${encodeURIComponent(today)}`;

    fetch(`${apiKey}${params}`)
      .then((r) => r.json())
      .then((data) => setFilteredData(data))
      .catch((err) => console.error('Error fetching data:', err))
      .finally(() => setLoading(false));
  };

  // ให้ Table เรียกเมื่ออยาก refresh อัตโนมัติ (เฉพาะเมื่ออยู่หน้าสุดท้ายและเกิน 1 นาที)
  const handleAutoRefresh = (isLastPage = false) => {
    if (!isLastPage) {
      console.log('Not on last page, skipping auto-refresh');
      return;
    }

    if (!lastApiCallTime) {
      console.log('No previous API call time, proceeding with refresh');
      handleFilter();
      return;
    }

    const now = new Date();
    const timeDiff = (now - lastApiCallTime) / 1000 / 60; // ความต่างเป็นนาที

    if (timeDiff >= 1) {
      console.log(`Auto-refresh on last page after ${timeDiff.toFixed(1)} minutes`);
      handleFilter();
    } else {
      console.log(`Skipping auto-refresh, only ${timeDiff.toFixed(1)} minutes since last call (need 1 minute)`);
    }
  };

  return (
    <div className="container-fluid px-2 px-sm-3 px-md-4" style={{ overflowX: 'hidden' }}>
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