import React from 'react';
import { Link } from 'react-router-dom';
import Enum from '../Helpper/Enum';

const Home = () => {
  return (
    <div className="container">
      <Link >
          <img src={Enum.URL_LOGO} alt="Company Logo" className="img-fluid" style={{ maxWidth: '150px' }} />
        </Link>
      <h2 className="text-center mb-4">เลือกรีพอต</h2>
      <div className="row">
        <div className="col-md-6">
          <Link to="/pick-daily-member-record" className="card text-center">
            <div className="card-body">
              <i className="fas fa-clipboard-list fa-3x mb-3"></i>
              <h5 className="card-title">จำนวนการเด็ดตามพนักงาน</h5>
            </div>
          </Link>
        </div>
        <div className="col-md-6">
          <Link to="/pick-daily-farm" className="card text-center ">
            <div className="card-body">
              <i className="fas fa-calendar-day fa-3x mb-3"></i>
              <h5 className="card-title">จำนวนการเด็ดแต่ละวัน</h5>
            </div>
          </Link>
        </div>
        <div className="col-md-6">
          <Link to="/pick-daily-member-price" className="card text-center">
            <div className="card-body">
              <i className="fas fa-user fa-3x mb-3"></i>
              <h5 className="card-title">จำนวนการเด็ดแต่ละคนในแต่ละวัน</h5>
            </div>
          </Link>
        </div>
        <div className="col-md-6">
          <Link to="/pick-daily-farm-veg" className="card text-center">
            <div className="card-body">
              <i className="fa-solid fa-seedling fa-3x mb-3"></i>
              <h5 className="card-title">จำนวนของแต่ละไร่</h5>
            </div>
          </Link>
        </div> 
        <div className="col-md-6">
          <Link to="/daily-shipping" className="card text-center">
            <div className="card-body">
              <i className="fa-solid fa-truck-fast fa-3x mb-3"></i>
              <h5 className="card-title">รายการส่งสินค้าประจำวัน</h5>
            </div>
          </Link>
        </div>
        <div className="col-md-6">
          <Link to="/emp-sorting" className="card text-center">
            <div className="card-body">
              <i className="fa-solid fa-chart-gantt fa-3x mb-3"></i>
              <h5 className="card-title">บันทึกพนักงานคัด</h5>
            </div>
          </Link>
        </div>
        <div className="col-md-6">
          <Link to="/hair-rolling" className="card text-center">
            <div className="card-body">
              <i className="fa-solid fas fa-wind fa-3x mb-3"></i>
              <h5 className="card-title">Hair Rolling</h5>
            </div>
          </Link>
        </div>
        <div className="col-md-6">
          <Link to="/random-test" className="card text-center">
            <div className="card-body">
              <i className="fa-solid fas fa-shuffle fa-3x mb-3"></i>
              <h5 className="card-title">สุ่มพนักงาน</h5>
            </div>
          </Link>
        </div>
        <div className="col-md-6">
          <Link to="/random-test-pick" className="card text-center">
            <div className="card-body">
              <i className="fa-solid fas fa-paper-plane fa-3x mb-3"></i>
              <h5 className="card-title">สุ่มพนักงานเด็ด</h5>
            </div>
          </Link>
        </div>
        <div className="col-md-6">
          <Link to="/ranking" className="card text-center">
            <div className="card-body">
              <i className="fa-solid fas fa-trophy fa-3x mb-3"></i>
              <h5 className="card-title">Ranking</h5>
            </div>
          </Link>
        </div>
        <div className="col-md-6">
          <Link to="/yield" className="card text-center">
            <div className="card-body">
              <i className="fa-solid fas fa-seedling fa-3x mb-3"></i>
              <h5 className="card-title">Yield</h5>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
