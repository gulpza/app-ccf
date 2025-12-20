import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// แปลงข้อมูลให้แสดงตามรูปแบบใหม่: วันที่ส่ง, สถานที่ส่ง, รอบส่ง, Show ประเภทผัก, แผน, ผลิต, Process Bar
const processData = (data) => {
  return data
    .map(item => {
      const planAmount = Number(item['แผน'] || 0); // แผนที่กำหนด
      const actualAmount = Number(item['ส่งจริง'] || 0); // ส่งจริง

      return {
        farmName: item['สถานที่ส่ง'] || '',
        vegType: item['Show ประเภทผัก'] || '',
        planAmount: planAmount,
        actualAmount: actualAmount,
        status: item['สถานะการส่ง']
      };
    });
};


const TableDashboardVegDailyPlan = ({ data, onRefreshData, isLoading, startDate, logoUrl }) => {
  // console.log(data)
  const processedData = processData(data);
  const [currentPage, setCurrentPage] = useState(0);
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date().toLocaleTimeString('th-TH'));
  const [lastFetchDate, setLastFetchDate] = useState(new Date());
  const rowsPerPage = 7;

  const totalPages = Math.ceil(processedData.length / rowsPerPage);
  const getCurrentPageData = () => {
    const startIndex = currentPage * rowsPerPage;
    return processedData.slice(startIndex, startIndex + rowsPerPage);
  };

  useEffect(() => {
    if (totalPages > 0) {
      const interval = setInterval(() => {
        // console.log('Process Status Page change interval: ', new Date().toLocaleTimeString('th-TH'));
        setCurrentPage(prev => {
          const next = (prev + 1) % totalPages;
          // เช็คว่าจะกลับไปหน้าแรกหรือไม่ (หมายถึงอยู่หน้าสุดท้าย)
          const isLastPage = prev === totalPages - 1;
          if (next === 0 && onRefreshData) {
            setLastFetchDate(new Date());
            onRefreshData(isLastPage); // ส่งข้อมูลว่าอยู่หน้าสุดท้ายหรือไม่
          }
          return next;
        });
      }, 30000);
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
        <div className="d-flex align-items-center" style={{ gap: '1rem', flexWrap: 'wrap' }}>
          {/* โลโก้ซ้ายมือ */}
          {logoUrl && (
            <Link to="/home">
              <img
                src={logoUrl}
                alt="Company Logo"
                className="img-fluid"
                style={{ maxWidth: 'clamp(50px, 8vw, 100px)', height: 'auto' }}
              />
            </Link>
          )}

          {/* ข้อความ 2 บรรทัด: บน=หัวข้อ, ล่าง=วันที่/เวลา */}
          <div className="d-flex flex-column align-items-start text-start" style={{ rowGap: '.25rem' }}>
            <div className="d-flex align-items-center flex-wrap" style={{ columnGap: '.5rem' }}>
              <h1 className="mb-0 fw-bold" style={{ fontSize: 'clamp(1rem, 1vw, 2.2rem)' }}>
                แผนผักประจำวัน
              </h1>
       
            </div>

            <div className="d-flex align-items-center flex-wrap" style={{ columnGap: '.5rem' }}>
              <span className="text-success fw-bold" style={{ fontSize: 'clamp(0.8rem, 1vw, 1rem)' }}>
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
              <span className="text-muted" style={{ fontSize: 'clamp(0.8rem, 1vw, 1rem)' }}>
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
      <div className="w-100"
     style={{ overflow:'auto' }}>
        <div className="table-responsive">
           <table className="table table-striped w-100" style={{ 
             tableLayout: 'auto', 
             fontSize: 'clamp(1rem, 2.2vw, 1.4rem)',
             border: '3px solid #228B22',
             borderCollapse: 'separate',
             borderSpacing: 0,
             borderRadius: '8px',
             overflow: 'hidden',
             boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
           }}>
            <thead style={{ backgroundColor: '#228B22', color: '#ffffff' }}>
              <tr>
                <th className="text-center fw-bold sticky-top" style={{ 
                  position: 'sticky', 
                  top: 0, 
                  fontSize: 'clamp(1rem, 1.6vw, 1.2rem)',
                  border: '2px solid #ffffff',
                  backgroundColor: '#228B22',
                  color: '#ffffff',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                }}>
                  <i className="fas fa-home me-1" />
                  ชื่อไร่
                </th>
                <th className="text-center fw-bold sticky-top" style={{ 
                  position: 'sticky', 
                  top: 0, 
                  fontSize: 'clamp(1rem, 1.6vw, 1.2rem)',
                  border: '2px solid #ffffff',
                  backgroundColor: '#228B22',
                  color: '#ffffff',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                }}>
                  <i className="fas fa-leaf me-1" />
                  ประเภทผัก
                </th>
                <th className="text-center fw-bold sticky-top" style={{ 
                  position: 'sticky', 
                  top: 0, 
                  fontSize: 'clamp(1rem, 1.6vw, 1.2rem)',
                  border: '2px solid #ffffff',
                  backgroundColor: '#228B22',
                  color: '#ffffff',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                }}>
                  <i className="fas fa-clipboard-list me-1" />
                  แผน
                </th>
                <th className="text-center fw-bold sticky-top" style={{ 
                  position: 'sticky', 
                  top: 0, 
                  fontSize: 'clamp(1rem, 1.6vw, 1.2rem)',
                  border: '2px solid #ffffff',
                  backgroundColor: '#228B22',
                  color: '#ffffff',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                }}>
                  <i className="fas fa-check-circle me-1" />
                  รับจริง
                </th>
                <th className="text-center fw-bold sticky-top" style={{ 
                  position: 'sticky', 
                  top: 0, 
                  fontSize: 'clamp(1rem, 1.6vw, 1.2rem)',
                  border: '2px solid #ffffff',
                  backgroundColor: '#228B22',
                  color: '#ffffff',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                }}>
                  <i className="fas fa-truck me-1" />
                  สถานะการส่ง
                </th>
              </tr>
            </thead>

            <tbody>
              {currentPageData.map((item, index) => (
                <tr key={index} style={{ 
                  backgroundColor: index % 2 === 0 ? '#f8f9fa' : '#ffffff',
                  borderBottom: '2px solid #dee2e6'
                }}>
                  <td className="text-center fw-bold" style={{ 
                    wordBreak: 'break-word', 
                    fontSize: 'clamp(1rem, 1.6vw, 1.2rem)',
                    border: '1px solid #dee2e6',
                    padding: '0.6rem 0.4rem'
                  }}>
                    {item.farmName || '-'}
                  </td>
                  <td className="text-center fw-bold" style={{ 
                    wordBreak: 'break-word', 
                    fontSize: 'clamp(1rem, 1.6vw, 1.2rem)',
                    border: '1px solid #dee2e6',
                    padding: '0.6rem 0.4rem'
                  }}>
                    {item.vegType || '-'}
                  </td>
                  <td className="text-center fw-bold" style={{ 
                    fontSize: 'clamp(1rem, 1.6vw, 1.2rem)',
                    border: '1px solid #dee2e6',
                    padding: '0.6rem 0.4rem'
                  }}>
                      {item.planAmount.toLocaleString()}
                  </td>
                  <td className="text-center fw-bold" style={{ 
                    fontSize: 'clamp(1rem, 1.6vw, 1.2rem)',
                    border: '1px solid #dee2e6',
                    padding: '0.6rem 0.4rem'
                  }}>
                     {item.actualAmount.toLocaleString()}
                  </td>
                  <td className="text-center fw-bold" style={{ 
                    wordBreak: 'break-word', 
                    fontSize: 'clamp(1rem, 1.6vw, 1.2rem)',
                    border: '1px solid #dee2e6',
                    padding: '0.6rem 0.4rem'
                  }}>
                    <span
                      className="fw-bold px-3 py-1 rounded"
                      style={{
                        backgroundColor: (() => {
                          switch(item.status) {
                            case 'รอส่ง': return '#ffc107'; // สีเหลือง
                            case 'ส่งแล้ว': return '#007bff'; // สีน้ำเงิน
                            case 'รับแล้ว': return '#28a745'; // สีเขียว
                            case 'ยกเลิก': return '#dc3545'; // สีแดง
                            default: return '#6c757d'; // สีเทา (ถ้าไม่มีสถานะ)
                          }
                        })(),
                        color: '#ffffff',
                        display: 'inline-block',
                        textAlign: 'center',
                        border: '2px solid #ffffff',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                        fontSize: 'clamp(0.9rem, 1.4vw, 1.1rem)'
                      }}
                    >
                      {item.status || 'รอส่ง'}
                    </span>
                  </td>
                </tr>
              ))}

              {currentPageData.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-5" style={{ 
                    border: '1px solid #dee2e6',
                    fontSize: 'clamp(1rem, 1.6vw, 1.2rem)',
                    padding: '2rem'
                  }}>
                    <i className="fas fa-inbox text-muted mb-3" style={{ fontSize: '4rem' }} />
                    <div className="text-muted fw-bold">ไม่พบข้อมูล</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {processedData.length > 0 && totalPages > 1 && (
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
                    padding: '2px 10px',
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

export default TableDashboardVegDailyPlan;