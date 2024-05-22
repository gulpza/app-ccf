import { useState } from 'react';
import './App.css';
import VegetableResultReport from './VegetableResultReport'; // Adjust the import path as needed

function App() {
  const [count, setCount] = useState(0);
  const logoUrl = 'https://chaicharoenfresh.com/wp-content/uploads/2024/03/cropped-logo-ccf-300x300.png';

  return (
    <div className="container mt-8">
      <div className="text-center mb-8">
        <img src={logoUrl} alt="Company Logo" className="img-fluid" style={{ maxWidth: '150px' }} />
      </div>
      <h2 className="text-center">รายงานเด็ด</h2>
      <VegetableResultReport />
    </div>
  );
}

export default App;
