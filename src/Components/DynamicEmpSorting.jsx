import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { Checkbox } from 'antd';

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

const CustomYAxisTick = ({ x, y, payload, onClick }) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="end"
        fill="#666"
        onClick={() => onClick(payload.value)}
        style={{ cursor: 'pointer' }}
      >
        {payload.value}
      </text>
    </g>
  );
};

const DynamicEmpSorting = ({ data }) => {
  const { pivot, shifts, employees, totals } = pivotData(data);
  const [visibleShifts, setVisibleShifts] = useState(shifts.reduce((acc, shift) => ({ ...acc, [shift]: true }), {}));

  const handleCheckboxChange = (shift) => {
    setVisibleShifts(prevState => ({ ...prevState, [shift]: !prevState[shift] }));
  };

  // Define a color palette for shifts
  const shiftColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#ff85c0', '#0088FE', '#00C49F', '#FFBB28'];

  // Prepare data for the chart
  const chartData = employees.map(emp => {
    const empData = { name: emp };
    shifts.forEach(shift => {
      empData[shift] = pivot[emp][shift];
    });
    return empData;
  });

  return (
    <div className="container">
      <div className="table-responsive">
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
      </div>



      <ResponsiveContainer width="100%" height={600}>
        <BarChart layout="vertical" data={chartData} margin={{ top: 20, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis 
            type="category" 
            dataKey="name" 
            width={120}
            interval={0}
            tickMargin={5}
            tick={{ angle: 0, textAnchor: 'end' }} 
          />
          <Tooltip />
          <Legend />
          {shifts.map((shift, index) => (
            (
              <Bar key={shift} dataKey={shift} stackId="a" fill={shiftColors[index % shiftColors.length]}>
              </Bar>
            )
          ))}
        </BarChart>
        {/* <div className="checkbox-container">
          <span> เบรค</span>
        {shifts.map(shift => (
          <Checkbox
            key={shift}
            checked={visibleShifts[shift]}
            onChange={() => handleCheckboxChange(shift)}
          >
            {shift}
          </Checkbox>
        ))}
      </div> */}
      </ResponsiveContainer>
    </div>
  );
};

export default DynamicEmpSorting;
