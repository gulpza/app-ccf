import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const pivotData = (data) => {
  const pivot = {};
  const allShifts = [...new Set(data.map(item => item['เบรค']))].sort((a, b) => a - b);
  const allEmployees = [...new Set(data.map(item => item['ชื่อพนักงาน']))];
  const totals = { total: 0 };

  allShifts.forEach(shift => totals[shift] = 0);

  data.forEach(item => {
    const emp = item['ชื่อพนักงาน'];
    const shift = item['เบรค'];
    const weight = item['จำนวน'];

    if (!pivot[emp]) {
      pivot[emp] = { total: 0 };
      allShifts.forEach(shift => pivot[emp][shift] = 0);
    }

    pivot[emp][shift] += weight;
    pivot[emp].total += weight;
    totals[shift] += weight;
    totals.total += weight;
  });

  return { pivot, shifts: allShifts, employees: allEmployees, totals };
};

const DynamicEmpSorting = ({ data }) => {
  const [showChart, setShowChart] = useState(false);
  const { pivot, shifts, employees, totals } = pivotData(data);

  // Define a color palette for employees
  const employeeColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#ff85c0', '#0088FE', '#00C49F', '#FFBB28'];

  // Prepare data for the chart
  const chartData = employees.map((emp, index) => {
    const empData = { name: emp };
    shifts.forEach(shift => {
      empData[shift] = pivot[emp][shift];
    });
    return { ...empData, fill: employeeColors[index % employeeColors.length] }; // Assign color from the palette
  });

  return (
    <div className="container">
      <table className="table table-striped">
        <thead className="thead-light">
          <tr>
            <th>พนักงาน / เบรค</th>
            {shifts.map(shift => (
              <th key={shift}>{shift}</th>
            ))}
            <th>รวม</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp}>
              <td>{emp}</td>
              {shifts.map(shift => (
                <td key={shift}>{pivot[emp][shift].toFixed(2)}</td>
              ))}
              <td>{pivot[emp].total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th>รวม</th>
            {shifts.map(shift => (
              <th key={shift}>{totals[shift].toFixed(2)}</th>
            ))}
            <th>{totals.total.toFixed(2)}</th>
          </tr>
        </tfoot>
      </table>

      {(
        <ResponsiveContainer width="100%" height={400}>
          <BarChart layout="vertical" data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" />
            <Tooltip />
            <Legend />
            {shifts.map((shift, index) => (
              <Bar key={shift} dataKey={shift} stackId="a" fill={employeeColors[index % employeeColors.length]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default DynamicEmpSorting;
