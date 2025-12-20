import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import TableDashboardVegDailyPlan from '../Components/Tables/TableDashboardVegDailyPlan';
import Enum from '../Helpper/Enum';

function formatDate(date) {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function DashboardVegDailyPlan() {
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState(formatDate(new Date()));
  const [endDate, setEndDate] = useState(formatDate(new Date()));
  const [loading, setLoading] = useState(false);
  const [lastApiCallTime, setLastApiCallTime] = useState(null);
  const pickApiKey = import.meta.env.VITE_SHEET_PICK_API_KEY;
  const farmLineOaApiKey = import.meta.env.VITE_SHEET_FARM_LINEOA_API_KEY;

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


  useEffect(() => {
    const tick = setInterval(() => {
      const base = new Date();
      const start = formatDate(base); // วันเริ่มต้น = วันปัจจุบัน
      
      const endObj = new Date(base);
      endObj.setDate(base.getDate() + 1); // วันสิ้นสุด = วันปัจจุบัน + 1
      const end = formatDate(endObj);

      if (start !== startDate || end !== endDate) {
        setStartDate(start);
        setEndDate(end);
        handleFilter(base); 
      }
    }, 60 * 5000); // เช็คทุก 5 นาที
    return () => clearInterval(tick);
  }, [startDate, endDate]);

  // ดึงข้อมูลตั้งแต่วันปัจจุบันถึงวันถัดไป
  const handleFilter = async (overrideBaseDate) => {
    const base = overrideBaseDate ? new Date(overrideBaseDate) : new Date();
    const start = formatDate(base); // วันเริ่มต้น = วันปัจจุบัน
    
    const endObj = new Date(base);
    endObj.setDate(base.getDate() + 1); // วันสิ้นสุด = วันปัจจุบัน + 1
    const end = formatDate(endObj);

    // sync state
    if (start !== startDate) setStartDate(start);
    if (end !== endDate) setEndDate(end);

    setLoading(true);
    setLastApiCallTime(new Date()); // บันทึกเวลาที่ call API

    try {
      // ดึงข้อมูล Veg Daily Plan
      const paramsVegDailyPlan =
        `?action=dashboard-veg-daily-plan` +
        `&startDate=${encodeURIComponent(start)}` +
        `&endDate=${encodeURIComponent(end)}`;

      const vegDailyPlanResponse = await fetch(`${farmLineOaApiKey}${paramsVegDailyPlan}`);
      const vegDailyPlanData = await vegDailyPlanResponse.json();

      // ดึงข้อมูล Farm
      const paramsFarm = `?action=farm`;
      const farmResponse = await fetch(`${pickApiKey}${paramsFarm}`);
      const farmData = await farmResponse.json();

            // ดึงข้อมูล Veg Type
      const paramsVegType = `?action=vegType`;
      const vegTypeResponse = await fetch(`${pickApiKey}${paramsVegType}`);
      const vegTypeData = await vegTypeResponse.json();

      // สร้าง lookup object สำหรับ farmData และ vegTypeData
      const farmLookup = {};
      farmData.forEach(farm => {
        if (farm.Code) {
          farmLookup[farm.Code] = farm.FarmName || '';
        }
      });

      const vegTypeLookup = {};
      vegTypeData.forEach(vegType => {
        if (vegType.Code) {
          vegTypeLookup[vegType.Code] = vegType.ShowName || '';
        }
      });

      // รวมข้อมูล Farm, VegType เข้าไปกับ Veg Daily Plan
      const combinedData = vegDailyPlanData
        .filter(orderItem => orderItem['สถานะการส่ง'] !== 'ยกเลิก') // กรองข้อมูลที่สถานะไม่ใช่ "ยกเลิก"
        .map(orderItem => {
          // Join กับ farmData
          const farmCode = orderItem['รหัสไร่'];
          const farmName = farmLookup[farmCode] || orderItem['สถานที่ส่ง'] || '';
          
          // Join กับ vegTypeData
          const vegTypeCode = orderItem['รหัสประเภทผัก'];
          const vegTypeShowName = vegTypeLookup[vegTypeCode] || orderItem['Show ประเภทผัก'] || '';
          
          return {
            ...orderItem,
            'สถานที่ส่ง': farmName,
            'Show ประเภทผัก': vegTypeShowName,
            total: orderItem['จำนวนที่ส่ง'] || 0
          };
        }).sort((a, b) => {
          // เรียงข้อมูลตาม วันที่ส่ง → รอบส่ง → สถานที่ส่ง
          const dateA = new Date(a['วันที่ส่ง'] || '');
          const dateB = new Date(b['วันที่ส่ง'] || '');
          
          // เรียงตามวันที่ส่งก่อน
          if (dateA.getTime() !== dateB.getTime()) {
            return dateA - dateB;
          }
          
          // ถ้าวันที่เท่ากัน เรียงตามรอบส่ง
          const roundA = a['รอบส่ง'] || '';
          const roundB = b['รอบส่ง'] || '';
          if (roundA !== roundB) {
            return roundA.localeCompare(roundB, 'th');
          }
          
          // ถ้าวันที่และรอบส่งเท่ากัน เรียงตามสถานที่ส่ง
          const locationA = a['สถานที่ส่ง'] || '';
          const locationB = b['สถานที่ส่ง'] || '';
          return locationA.localeCompare(locationB, 'th');
        });

      setFilteredData(combinedData);
      
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // ให้ Table เรียกเมื่ออยาก refresh อัตโนมัติ (เฉพาะเมื่ออยู่หน้าสุดท้ายและเกิน 5 นาที)
  const handleAutoRefresh = (isLastPage = false) => {
    if (!isLastPage) {
      return;
    }

    if (!lastApiCallTime) {
      handleFilter();
      return;
    }

    const now = new Date();
    const timeDiff = (now - lastApiCallTime) / 5000 / 60; // ความต่างเป็นนาที

    if (timeDiff >= 1) {
      handleFilter();
    }
  };

  return (
    <div className="container-fluid px-2 px-sm-3 px-md-4" style={{ overflowX: 'hidden' }}>
      <TableDashboardVegDailyPlan
        data={filteredData}
        onRefreshData={handleAutoRefresh}
        isLoading={loading}
        startDate={startDate}
        logoUrl={Enum.URL_LOGO}
      />
    </div>
  );
}

export default DashboardVegDailyPlan;