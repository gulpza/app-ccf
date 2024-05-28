import { HashRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Home from './Pages/Home';
import PickDailyMemberRecord from './Pages/PickDailyMemberRecord';
import PickDailyFarm from './Pages/PickDailyFarm';
import PickDailyMemberPrice from './Pages/PickDailyMemberPrice';
import PickDailyFarmVeg from './Pages/PickDailyFarmVeg';
import '@fortawesome/fontawesome-free/css/all.min.css';
import DailyShipping from './Pages/DailyShipping';

function App() {
  const logoUrl = 'https://chaicharoenfresh.com/wp-content/uploads/2024/03/cropped-logo-ccf-300x300.png';

  return (
    <Router>
      <div className="container mt-10 mb-10">
        <div className="text-center mb-8">
        <Link to="/" className="text-center">
          <img src={logoUrl} alt="Company Logo" className="img-fluid" style={{ maxWidth: '150px' }} />
        </Link>
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pick-daily-member-record" element={<PickDailyMemberRecord />} />
          <Route path="/pick-daily-farm" element={<PickDailyFarm />} />
          <Route path="/pick-daily-member-price" element={<PickDailyMemberPrice />} />
          <Route path="/pick-daily-farm-veg" element={<PickDailyFarmVeg />} />
          <Route path="/daily-shipping" element={<DailyShipping />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
