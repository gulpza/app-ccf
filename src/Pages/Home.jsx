import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container">
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
      </div>
    </div>
  );
};

export default Home;
