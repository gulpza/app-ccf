import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import TableDashboardProductionProcessStatus from '../Components/Tables/TableDashboardProductionProcessStatus';
import Enum from '../Helpper/Enum';

function formatDate(date) {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function DashboardProductionProcessStatus() {
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState(formatDate(new Date()));
  const [endDate, setEndDate] = useState(formatDate(new Date()));
  const [loading, setLoading] = useState(false);
  const [lastApiCallTime, setLastApiCallTime] = useState(null);
  const [masterFarm, setMasterFarm] = useState([]);
  const [masterVegType, setMasterVegType] = useState([]);
  const [masterVegStatus, setMasterVegStatus] = useState([]);
  const apiKey = import.meta.env.VITE_SHEET_PICK_API_KEY;

  // โหลดครั้งแรก
  useEffect(() => {
    handleFilter();
  }, []);

  // ถ้ายังไม่มีข้อมูล ให้ลองดึงซ้ำทุก 30 วินาที
  useEffect(() => {
    const timer = setInterval(() => {
      if (filteredData.length === 0) {
        handleFilter();
      }
    }, 30 * 1000);
    return () => clearInterval(timer);
  }, [filteredData.length]);

  // อัปเดตช่วงวันอัตโนมัติเมื่อข้ามวัน → ย้อนหลัง 7 วัน (รวมวันนี้)
  useEffect(() => {
    const tick = setInterval(() => {
      const base = new Date();
      const end = formatDate(base);
      const startObj = new Date(base);
      startObj.setDate(base.getDate() - 7); // รวมวันนี้ + ย้อนหลังอีก 7 วัน = 7 วัน
      const start = formatDate(startObj);

      if (start !== startDate || end !== endDate) {
        setStartDate(start);
        setEndDate(end);
        handleFilter(end); // ใช้ end เป็นฐานคำนวณช่วง 7 วัน
      }
    }, 60 * 1000); // เช็คทุก 1 นาที
    return () => clearInterval(tick);
  }, [startDate, endDate]);

  // ดึงข้อมูลช่วง 3 วันล่าสุด (รวมวันนี้)
  const handleFilter = async (overrideBaseDate) => {
    const base = overrideBaseDate ? new Date(overrideBaseDate) : new Date();
    const end = formatDate(base);
    const startObj = new Date(base);
    startObj.setDate(base.getDate() - 6); // 7 วันย้อนหลังรวมวันนี้
    const start = formatDate(startObj);

    // sync state ให้เป็นช่วง 3 วันล่าสุด
    if (start !== startDate) setStartDate(start);
    if (end !== endDate) setEndDate(end);

    setLoading(true);
    setLastApiCallTime(new Date()); // บันทึกเวลาที่ call API

    try {
      // ดึงข้อมูล inputRawmat
      const paramsInputRawmat =
        `?action=inputRawmat` +
        `&startDate=${encodeURIComponent(start)}` +
        `&endDate=${encodeURIComponent(end)}`;

      const inputRawmatResponse = await fetch(`${apiKey}${paramsInputRawmat}`);
      const inputRawmatData = await inputRawmatResponse.json();

      // ดึงข้อมูล farm
      const paramsFarm = `?action=farm`;
      const farmResponse = await fetch(`${apiKey}${paramsFarm}`);
      const farmData = await farmResponse.json();
      setMasterFarm(farmData);

      // เพิ่มข้อมูล Name จาก farmData เข้าไปใน inputRawmatData
      const enrichedInputRawmatData = inputRawmatData.map(inputItem => {
        const matchedFarm = farmData.find(farm => farm.FarmName === inputItem['ชื่อไร่']);
        return {
          ...inputItem,
          'ชื่อไร่พม่า': matchedFarm ? matchedFarm.Name : ''
        };
      });


      // ดึงข้อมูล vegType
      const paramsVegType = `?action=vegType`;
      const vegTypeResponse = await fetch(`${apiKey}${paramsVegType}`);
      const vegTypeData = await vegTypeResponse.json();
      setMasterVegType(vegTypeData);

      // เพิ่มข้อมูล TypeVegName จาก vegTypeData เข้าไปใน enrichedInputRawmatData
      const finalEnrichedData = enrichedInputRawmatData.map(inputItem => {
        const matchedVegType = vegTypeData.find(vegType => vegType.ShowName === inputItem['Show ประเภทผัก']);
        return {
          ...inputItem,
          'Show ประเภทผักพม่า': matchedVegType ? matchedVegType.TypeVegName : ''
        };
      });

      console.log(finalEnrichedData)

      // ดึงข้อมูล vegStatus
      const paramsVegStatus = `?action=vegStatus`;
      const vegStatusResponse = await fetch(`${apiKey}${paramsVegStatus}`);
      const vegStatusData = await vegStatusResponse.json();
      setMasterVegStatus(vegStatusData);

      // เพิ่มข้อมูล StatusName จาก vegStatusData เข้าไปใน finalEnrichedData
      const completeEnrichedData = finalEnrichedData.map(inputItem => {
        const matchedVegStatus = vegStatusData.find(vegStatus => vegStatus['สถานะ'] === inputItem['สถานะผัก']);
        return {
          ...inputItem,
          'สถานะผักพม่า': matchedVegStatus ? matchedVegStatus.StatusName : ''
        };
      });

      // ตั้งค่าข้อมูลสุดท้ายที่ผ่านการ enrich ทั้งหมดแล้ว
      setFilteredData(completeEnrichedData);

    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };


    
  


  // ให้ Table เรียกเมื่ออยาก refresh อัตโนมัติ (เฉพาะเมื่ออยู่หน้าสุดท้ายและเกิน 1 นาที)
  const handleAutoRefresh = (isLastPage = false) => {
    if (!isLastPage) {
      return;
    }

    if (!lastApiCallTime) {
      handleFilter();
      return;
    }

    const now = new Date();
    const timeDiff = (now - lastApiCallTime) / 1000 / 60; // ความต่างเป็นนาที

    if (timeDiff >= 1) {
      handleFilter();
    }
  };

  return (
    <div className="container-fluid px-2 px-sm-3 px-md-4" style={{ overflowX: 'hidden' }}>
      <TableDashboardProductionProcessStatus
        data={filteredData}
        onRefreshData={handleAutoRefresh}
        isLoading={loading}
        startDate={startDate}
        logoUrl={Enum.URL_LOGO}
      />
    </div>
  );
}

export default DashboardProductionProcessStatus;