import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './Home';
import PickRecord from './PickRecord';
import PickDaily from './PickDaily';
import PickMember from './PickMember';
import PickFarm from './PickFarm';
import '@fortawesome/fontawesome-free/css/all.min.css';


function App() {
  const [count, setCount] = useState(0);
  const logoUrl = 'https://chaicharoenfresh.com/wp-content/uploads/2024/03/cropped-logo-ccf-300x300.png';

  return (
    <Router>
      <div className="container mt-10 mb-10">
        <div className="text-center mb-8">
          <img src={logoUrl} alt="Company Logo" className="img-fluid" style={{ maxWidth: '150px' }} />
        </div>
        <Routes>
          <Route path="/" element={<PickRecord />} />
          <Route path="/home" element={<Home />} />
          <Route path="/pick-record" element={<PickRecord />} />
          <Route path="/pick-daily" element={<PickDaily />} />
          <Route path="/pick-member" element={<PickMember />} />
          <Route path="/pick-farm" element={<PickFarm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
