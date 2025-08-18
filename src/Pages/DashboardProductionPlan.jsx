import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import TableDashboardProductionPlan from '../Components/Tables/TableDashboardProductionPlan';
import Enum from '../Helpper/Enum';

function formatDate(date) {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function DashboardProductionPlan() {
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState(formatDate(new Date()));
  const [endDate, setEndDate] = useState(formatDate(new Date()));
  const [loading, setLoading] = useState(false);
  const [lastApiCallTime, setLastApiCallTime] = useState(null);
  const apiKey = import.meta.env.VITE_SHEET_PRODUCTION_VOLUME_API_KEY;

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
      // ดึงข้อมูล orderPlan
      const paramsOrderPlan =
        `?action=orderPlan` +
        `&startDate=${encodeURIComponent(start)}` +
        `&endDate=${encodeURIComponent(end)}`;

      const orderPlanResponse = await fetch(`${apiKey}${paramsOrderPlan}`);
      const orderPlanData = await orderPlanResponse.json();

      // ดึงข้อมูล fg
      const paramsFg =
        `?action=fg` +
        `&startDate=${encodeURIComponent(start)}` +
        `&endDate=${encodeURIComponent(end)}`;

      const fgResponse = await fetch(`${apiKey}${paramsFg}`);
      const fgData = await fgResponse.json();

      // Sum และ group by GenOrderId จากข้อมูล fg
      const fgSummary = {};
      fgData.forEach(item => {
        const genOrderId = item.GenOrderId;
        if (genOrderId) {
          if (!fgSummary[genOrderId]) {
            fgSummary[genOrderId] = {
              total: 0
            };
          }
          fgSummary[genOrderId].total += Number(item['รวม'] || 0);
        }
      });


      // รวมข้อมูl fg summary เข้าไปกับ orderPlan
      const combinedData = orderPlanData
        .filter(orderItem => orderItem.GenOrderId && orderItem.GenOrderId.trim() !== '') // กรองเฉพาะที่มี GenOrderId
        .map(orderItem => {
          const genOrderId = orderItem.GenOrderId;
          const fgSummaryData = fgSummary[genOrderId] || { total: 0 };
          
          return {
            ...orderItem,
            total: fgSummaryData.total
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
      <TableDashboardProductionPlan
        data={filteredData}
        onRefreshData={handleAutoRefresh}
        isLoading={loading}
        startDate={startDate}
        logoUrl={Enum.URL_LOGO}
      />
    </div>
  );
}

export default DashboardProductionPlan;