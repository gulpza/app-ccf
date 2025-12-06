import { Link } from 'react-router-dom';
import Enum from '../Helpper/Enum';

const Home = () => {
  return (
    <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)' }}>
      <div className="container py-5">
        <div className="text-center mb-4">
          <img src={Enum.URL_LOGO} alt="Company Logo" className="img-fluid d-block mx-auto mb-2" style={{ maxWidth: '120px' }} />
          <h1 className="fw-bold">ยินดีต้อนรับสู่ระบบรายงาน</h1>
          <p className="text-muted">เลือกรีพอร์ตที่ต้องการดูข้อมูล</p>
        </div>
        <div className="row g-4">
          {/* <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <Link to="/pick-daily-member-record" className="text-decoration-none">
              <div className="card h-100 shadow-sm border-0 rounded-4 hover-shadow">
                <div className="card-body text-center">
                  <i className="fas fa-clipboard-list fa-3x mb-3 text-primary"></i>
                  <h5 className="card-title fw-semibold">จำนวนการเด็ดตามพนักงาน</h5>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <Link to="/pick-daily-farm" className="text-decoration-none">
              <div className="card h-100 shadow-sm border-0 rounded-4 hover-shadow">
                <div className="card-body text-center">
                  <i className="fas fa-calendar-day fa-3x mb-3 text-primary"></i>
                  <h5 className="card-title fw-semibold">จำนวนการเด็ดแต่ละวัน</h5>
                </div>
              </div>
            </Link>
          </div> */}
          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <Link to="/pick-daily-member-price" className="text-decoration-none">
              <div className="card h-100 shadow-sm border-0 rounded-4 hover-shadow">
                <div className="card-body text-center">
                  <i className="fas fa-user fa-3x mb-3 text-primary"></i>
                  <h5 className="card-title fw-semibold">จำนวนการเด็ดแต่ละคนในแต่ละวัน</h5>
                </div>
              </div>
            </Link>
          </div>
          {/* <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <Link to="/pick-daily-farm-veg" className="text-decoration-none">
              <div className="card h-100 shadow-sm border-0 rounded-4 hover-shadow">
                <div className="card-body text-center">
                  <i className="fa-solid fa-seedling fa-3x mb-3 text-primary"></i>
                  <h5 className="card-title fw-semibold">จำนวนของแต่ละไร่</h5>
                </div>
              </div>
            </Link>
          </div> */}
          {/* <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <Link to="/daily-shipping" className="text-decoration-none">
              <div className="card h-100 shadow-sm border-0 rounded-4 hover-shadow">
                <div className="card-body text-center">
                  <i className="fa-solid fa-truck-fast fa-3x mb-3 text-primary"></i>
                  <h5 className="card-title fw-semibold">รายการส่งสินค้าประจำวัน</h5>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <Link to="/emp-sorting" className="text-decoration-none">
              <div className="card h-100 shadow-sm border-0 rounded-4 hover-shadow">
                <div className="card-body text-center">
                  <i className="fa-solid fa-chart-gantt fa-3x mb-3 text-primary"></i>
                  <h5 className="card-title fw-semibold">บันทึกพนักงานคัด</h5>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <Link to="/hair-rolling" className="text-decoration-none">
              <div className="card h-100 shadow-sm border-0 rounded-4 hover-shadow">
                <div className="card-body text-center">
                  <i className="fa-solid fas fa-wind fa-3x mb-3 text-primary"></i>
                  <h5 className="card-title fw-semibold">Hair Rolling</h5>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <Link to="/random-test" className="text-decoration-none">
              <div className="card h-100 shadow-sm border-0 rounded-4 hover-shadow">
                <div className="card-body text-center">
                  <i className="fa-solid fas fa-shuffle fa-3x mb-3 text-primary"></i>
                  <h5 className="card-title fw-semibold">สุ่มพนักงาน</h5>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <Link to="/random-test-pick" className="text-decoration-none">
              <div className="card h-100 shadow-sm border-0 rounded-4 hover-shadow">
                <div className="card-body text-center">
                  <i className="fa-solid fas fa-paper-plane fa-3x mb-3 text-primary"></i>
                  <h5 className="card-title fw-semibold">สุ่มพนักงานเด็ด</h5>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <Link to="/ranking" className="text-decoration-none">
              <div className="card h-100 shadow-sm border-0 rounded-4 hover-shadow">
                <div className="card-body text-center">
                  <i className="fa-solid fas fa-trophy fa-3x mb-3 text-primary"></i>
                  <h5 className="card-title fw-semibold">Ranking</h5>
                </div>
              </div>
            </Link>
          </div> */}
          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <Link to="/yield" className="text-decoration-none">
              <div className="card h-100 shadow-sm border-0 rounded-4 hover-shadow">
                <div className="card-body text-center">
                  <i className="fa-solid fas fa-seedling fa-3x mb-3 text-primary"></i>
                  <h5 className="card-title fw-semibold">Yield</h5>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <Link to="/dashboard-pick-daily-member-price" className="text-decoration-none">
              <div className="card h-100 shadow-sm border-0 rounded-4 hover-shadow">
                <div className="card-body text-center">
                  <i className="fa-solid fas fa-money-bill-wave fa-3x mb-3 text-primary"></i>
                  <h5 className="card-title fw-semibold">Dashboard <br/>รายงานคนเด็ดประจำวัน</h5>
                </div>
              </div>
            </Link>
          </div>  
          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <Link to="/dashboard-production-process-status" className="text-decoration-none">
              <div className="card h-100 shadow-sm border-0 rounded-4 hover-shadow">
                <div className="card-body text-center">
                  <i className="fa-solid fas fa-cogs fa-3x mb-3 text-primary"></i>
                  <h5 className="card-title fw-semibold">Dashboard <br/>รายงานสถานะผัก</h5>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <Link to="/dashboard-production-plan" className="text-decoration-none">
              <div className="card h-100 shadow-sm border-0 rounded-4 hover-shadow">
                <div className="card-body text-center">
                  <i className="fa-solid fas fa-calendar-check fa-3x mb-3 text-primary"></i>
                  <h5 className="card-title fw-semibold">Dashboard <br/>แผนการผลิต</h5>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <Link to="/farm-weight-report" className="text-decoration-none">
              <div className="card h-100 shadow-sm border-0 rounded-4 hover-shadow">
                <div className="card-body text-center">
                  <i className="fa-solid fas fa-truck fa-3x mb-3 text-primary"></i>
                  <h5 className="card-title fw-semibold">การจัดส่งผักจากไร่</h5>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
      <style>
        {`
          .hover-shadow:hover {
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15) !important;
            transform: translateY(-4px) scale(1.03);
            transition: all 0.2s;
          }
        `}
      </style>
    </div>
  );
};

export default Home;
