import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import EmployeeTable from './EmployeeTable'// Adjust the import path as needed


function App() {
  const [count, setCount] = useState(0)

  return (
    
       <div>
      <h1>รายการเด็ด</h1>
      <EmployeeTable/>
    </div>
    
  )
}

export default App
