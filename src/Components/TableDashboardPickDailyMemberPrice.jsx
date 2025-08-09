import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const pivotData = (data) => {
  const pivot = {};
  const prices = [...new Set(data.map(item => item['Price']))]
    .filter(price => price > 0)
    .sort((a, b) => a - b);

  const employees = [...new Set(data.map(item => item['รหัสพนักงาน']))].sort((a, b) => {
    const m = (id) => {
      const mm = id?.match(/^([A-Za-z]+)(\d+)$/);
      return mm ? { prefix: mm[1], number: parseInt(mm[2]) } : { prefix: id || '', number: 0 };
    };
    const A = m(a), B = m(b);
    if (A.prefix !== B.prefix) return A.prefix.localeCompare(B.prefix);
    return A.number - B.number;
  });

  employees.forEach(emp => {
    pivot[emp] = {};
    prices.forEach(p => (pivot[emp][p] = 0));
  });

  data.forEach(item => {
    const emp = item['รหัสพนักงาน'];
    const price = item['Price'];
    const weight = item['น้ำหนัก'];
    if (!emp || price <= 0) return;
    if (pivot[emp][price] === undefined) return;
    pivot[emp][price] += weight;
  });

  return { pivot, prices, employees };
};

// แปลงชื่อคอลัมน์ตามราคา
const getPriceLabel = (p) => {
  const v = Number(p);
  if (v === 29) {
    return (
      <span style={{ display: 'inline-block', lineHeight: 1.1 }}>
        โหระพา<br />กะเพราเกษตร
      </span>
    );
  }
  if (v === 34) {
    return (
      <span style={{ display: 'inline-block', lineHeight: 1.1 }}>
        กะเพราป่า<br />แมงลัก
      </span>
    );
  }
  return p; // ค่าอื่นๆ แสดงเป็นตัวเลขเดิม
};

// กำหนดสี badge ตามราคา (29=เขียว, 34=เหลือง)
const getPriceBadgeStyle = (p) => {
  const v = Number(p);
  if (v === 34) return { backgroundColor: '#ffc107', color: '#212529' }; // เหลือง ตัวอักษรเข้ม
  // ค่า 29 และอื่นๆ ใช้เขียวเป็นค่าเริ่มต้น
  return { backgroundColor: '#198754', color: '#ffffff' };
};

const TableDashboardPickDailyMemberPrice = ({ data, onRefreshData, isLoading, startDate, logoUrl }) => {
  const { pivot, prices, employees } = pivotData(data);
  const [currentPage, setCurrentPage] = useState(0);
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date().toLocaleTimeString('th-TH'));
  const [lastFetchDate, setLastFetchDate] = useState(new Date());
  const cardsPerPage = 10;

  const employeeTotals = employees.map(emp =>
    prices.reduce((sum, price) => sum + pivot[emp][price], 0).toFixed(2)
  );

  const cardData = employees.map((emp, idx) => ({
    employee: emp,
    prices: prices.map(price => ({ price, weight: pivot[emp][price].toFixed(2) })),
    total: employeeTotals[idx]
  }));

  const totalPages = Math.ceil(cardData.length / cardsPerPage);
  const getCurrentPageData = () => {
    const startIndex = currentPage * cardsPerPage;
    return cardData.slice(startIndex, startIndex + cardsPerPage);
  };

  useEffect(() => {
    if (totalPages > 0) {
      const interval = setInterval(() => {
        setCurrentPage(prev => {
          const next = (prev + 1) % totalPages;
          if (next === 0 && onRefreshData) {
            setLastFetchDate(new Date());
            onRefreshData();
          }
          return next;
        });
      }, 7000);
      return () => clearInterval(interval);
    }
  }, [totalPages, onRefreshData]);

  useEffect(() => {
    setCurrentPage(0);
    if (data.length > 0) {
      setLastUpdateTime(new Date().toLocaleTimeString('th-TH'));
      setLastFetchDate(new Date());
    }
  }, [data]);

  const currentPageData = getCurrentPageData();

  return (
    // ✅ เต็มจอจริง: ไม่มี margin/padding, กว้าง 100vw, สูง min-vh-100
    <div className="container-fluid p-0 m-0"
     style={{ width:'100vw', minHeight:'100vh', display:'flex', flexDirection:'column', overflow:'hidden' }}>
      {/* Header bar เต็มความกว้าง */}
      <div
        className="d-flex align-items-center justify-content-center w-100"
        style={{
          flex: '0 0 auto',
          padding: '0.5rem 1rem',
          width: '100%'
        }}
      >
        <div className="d-flex align-items-center" style={{ gap: '.75rem', flexWrap: 'wrap' }}>
          {/* โลโก้ซ้ายมือ */}
          {logoUrl && (
            <Link to="/home">
              <img
                src={logoUrl}
                alt="Company Logo"
                className="img-fluid"
                style={{ maxWidth: 'clamp(96px, 10vw, 140px)', height: 'auto' }}
              />
            </Link>
          )}

          {/* ข้อความ 2 บรรทัด: บน=หัวข้อ, ล่าง=วันที่/เวลา */}
          <div className="d-flex flex-column align-items-start text-start" style={{ rowGap: '.25rem' }}>
            <div className="d-flex align-items-center flex-wrap" style={{ columnGap: '.5rem' }}>
              <h1 className="mb-0 fw-bold" style={{ fontSize: 'clamp(1.25rem, 3.5vw, 2.2rem)' }}>
                รายงานคนเด็ดประจำวัน
              </h1>
       
            </div>

            <div className="d-flex align-items-center flex-wrap" style={{ columnGap: '.5rem' }}>
              <span className="text-success fw-bold" style={{ fontSize: 'clamp(1rem, 1.8vw, 1rem)' }}>
                <i className="fas fa-calendar-alt me-1" />
                ข้อมูลล่าสุด: วันที่{' '}
                {(() => {
                  const d = lastFetchDate || (startDate ? new Date(startDate) : new Date());
                  const dd = d.getDate().toString().padStart(2, '0');
                  const mm = (d.getMonth() + 1).toString().padStart(2, '0');
                  const yyyy = (d.getFullYear() + 543).toString();
                  return `${dd}-${mm}-${yyyy}`;
                })()}
              </span>
                </div>
                 <div className="d-flex align-items-center flex-wrap" style={{ columnGap: '.5rem' }}>
              <span className="text-muted" style={{ fontSize: 'clamp(0.9rem, 1.4vw, 0.9rem)' }}>
                <i className="fas fa-clock me-1" />
                อัพเดท:{' '}
                {isLoading ? (
                  <span className="spinner-border spinner-border-sm me-1" role="status" style={{ width: '0.6rem', height: '0.6rem' }}>
                    <span className="visually-hidden">Loading...</span>
                  </span>
                ) : (
                  lastUpdateTime
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ พื้นที่ตาราง “เต็มกว้างเต็มสูง” ของส่วนที่เหลือ: scroll ได้ */}
      <div className="flex-grow-1 w-100"
     style={{ overflow:'auto' }}>
        <div className="table-responsive">
           <table className="table table-striped w-100" style={{ tableLayout: 'auto', fontSize: 'clamp(1rem, 2.2vw, 1.4rem)' }}>
            <thead style={{ backgroundColor: '#0a8b4eff', color: 'white' }}>
              <tr>
                <th className="text-center fw-bold sticky-top" style={{ position: 'sticky', top: 0, fontSize: 'clamp(1.1rem, 2.4vw, 1.6rem)' }}>
                  <i className="fas fa-user me-1" />
                  รหัสพนักงาน
                </th>
                {prices.map((price) => (
                  <th
                    key={price}
                    className="text-center fw-bold sticky-top"
                    style={{ position: 'sticky', top: 0, fontSize: 'clamp(1.1rem, 2.4vw, 1.6rem)' }}
                  >
                    {getPriceLabel(price)}
                  </th>
                ))}
                <th className="text-center fw-bold sticky-top" style={{ position: 'sticky', top: 0, fontSize: 'clamp(1.1rem, 2.4vw, 1.6rem)' }}>
                  <i className="fas fa-weight me-1" />
                  รวม (kg)
                </th>
              </tr>
            </thead>

            <tbody>
              {currentPageData.map((item, index) => (
                <tr key={item.employee} style={{ backgroundColor: index % 2 === 0 ? '#f8f9fa' : '#ffffff' }}>
                  <td className="text-center fw-bold" style={{ wordBreak: 'break-word', fontSize: 'clamp(1rem, 2.2vw, 1.4rem)' }}>
                    {item.employee}
                  </td>

                  {item.prices.map((p) => (
                    <td key={p.price} className="text-center" style={{ fontSize: 'clamp(1rem, 2.2vw, 1.4rem)' }}>
                      {p.weight > 0 ? (
                        <span
                          className="fw-bold px-1 py-1 rounded"
                          style={{
                            ...getPriceBadgeStyle(p.price),
                            display: 'inline-block',
                            minWidth: '2.75rem',
                            fontSize: 'clamp(1rem, 2.2vw, 1.4rem)'
                          }}
                        >
                          {p.weight}
                        </span>
                      ) : (
                        <span className="text-muted" style={{ fontSize: 'clamp(1rem, 2.2vw, 1.4rem)' }}></span>
                      )}
                    </td>
                  ))}

                  <td
                    className="text-center fw-bold"
                    style={{ color: '#0d6efd', backgroundColor: '#e7f3ff', fontSize: 'clamp(1.1rem, 2.4vw, 1.6rem)' }}
                  >
                    {item.total}
                  </td>
                </tr>
              ))}

              {currentPageData.length === 0 && (
                <tr>
                  <td colSpan={prices.length + 2} className="text-center py-5">
                    <i className="fas fa-inbox text-muted mb-3" style={{ fontSize: '3.5rem' }} />
                    <div className="text-muted">ไม่พบข้อมูล</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {cardData.length > 0 && totalPages > 1 && (
        <div
          className="w-100"
          style={{
            flex: '0 0 auto',
            position: 'sticky',
            bottom: 0,
            background: '#fff',
            borderTop: '1px solid #e9ecef',
            padding: '.5rem'
          }}
        >
          <div className="container-fluid px-0">
            <div className="progress mb-2" style={{ height: 4 }}>
              <div
                className="progress-bar bg-primary"
                role="progressbar"
                style={{
                  width: `${((currentPage + 1) / totalPages) * 100}%`,
                  transition: 'width .3s ease'
                }}
              />
            </div>

            <div className="d-flex justify-content-center flex-wrap">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`btn me-2 mb-2 ${i === currentPage ? 'btn-primary' : 'btn-outline-primary'} fw-bold`}
                  onClick={() => setCurrentPage(i)}
                  style={{
                    minWidth: 'clamp(40px, 4vw, 56px)',
                    height: 'clamp(40px, 4vw, 56px)',
                    padding: '4px 10px',
                    fontSize: 'clamp(1rem, 2.2vw, 1.25rem)',
                    lineHeight: 1
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableDashboardPickDailyMemberPrice;