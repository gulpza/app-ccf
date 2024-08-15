import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';

const DynamicHairRolling = ({ data }) => {
  const dataLength = data.length;
  const chartHeight = dataLength * (dataLength < 10 ? 60 : 30);
  // Calculate total count per employee
  const aggregatedData = data.reduce((acc, curr) => {
    const employeeName = `${curr['ชื่อพนักงาน']}`;
    
    if (!acc[employeeName]) {
      acc[employeeName] = 0;
    }
    
    acc[employeeName] += curr['จำนวน'];
    
    return acc;
  }, {});

  // Convert aggregated data to an array of objects
  const tableData = Object.keys(aggregatedData).map(employeeName => ({
    employeeName,
    'จำนวนรวม': aggregatedData[employeeName]
  }));

  // Calculate the total sum of all counts
  const totalSum = tableData.reduce((acc, curr) => acc + curr['จำนวนรวม'], 0);

  return (
    <div className="container">
      <div className="table-responsive">
        <table className="table table-striped">
          <thead className="thead-light">
            <tr>
              <th>พนักงาน</th>
              <th>จำนวนรวม</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>
                <td>{row.employeeName}</td>
                <td>{row['จำนวนรวม']}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th>รวม</th>
              <th>{totalSum}</th>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="chart-container mt-4">
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart
            data={tableData}
            layout="vertical"
            margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis 
              type="category" 
              dataKey="employeeName" 
              width={100}
              interval={0}
              tickMargin={10}
              tick={{ angle: 0, textAnchor: 'end' }} 
            />
            <Tooltip />
            <Legend />
            <Bar dataKey="จำนวนรวม" fill="#00C49F" barSize={20}>
              <LabelList dataKey="จำนวนรวม" position="right" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DynamicHairRolling;