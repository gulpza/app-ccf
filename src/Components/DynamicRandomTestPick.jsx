import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import moment from 'moment';

const DynamicRandomTestPick = ({ data }) => {
  const chartHeight = data.length * (data.length < 10 ? 80 : 50);

  // Convert the original data into the format needed for the table and chart
  const tableData = data.map((item) => ({
    employeeName: `${item['ชื่อพนักงาน']} ${item['นามสกุล']}`.trim(),
    randomDate:  moment(item['วันที่สุ่ม']).format('DD-MM-YYYY'),
    cluster: item['เป็นช่อ'] == true ? 1 : 0,
    longStemmed: item['ก้านยาว'] == true ? 1 : 0,
    tornLeaves: item['ใบขาด'] == true ? 1 : 0,
    stickTok: item['ติดตอก'] == true ? 1 : 0,
    other: item['อื่น ๆ'] == true ? 1 : 0
  }));

    // Sort the tableData by employeeName
  tableData.sort((a, b) => a.employeeName.localeCompare(b.employeeName));


  // Calculate the totals for each category
  const totals = tableData.reduce(
    (acc, row) => {
      acc.cluster += row.cluster;
      acc.longStemmed += row.longStemmed;
      acc.tornLeaves += row.tornLeaves;
      acc.stickTok += row.stickTok;
      acc.other += row.other;
      return acc;
    },
    {
      cluster: 0,
      longStemmed: 0,
      tornLeaves: 0,
      stickTok: 0,
      other: 0,
    }
  );

  // Prepare data for the chart

  const groupChartData = tableData.reduce((acc, row) => {
    const { employeeName, cluster, longStemmed, tornLeaves, stickTok } = row;
    
    if (!acc[employeeName]) {
      acc[employeeName] = { cluster: 0, longStemmed: 0, tornLeaves: 0, stickTok: 0 };
    }
    
    acc[employeeName].cluster += cluster;
    acc[employeeName].longStemmed += longStemmed;
    acc[employeeName].tornLeaves += tornLeaves;
    acc[employeeName].stickTok += stickTok;
    
    return acc;
  }, {});
  
  // Convert the result to an array
  const chartData = Object.keys(groupChartData).map(employeeName => ({
    employeeName,
    ...groupChartData[employeeName]
  }));


  return (
    <div className="container">
      <div className="table-responsive">
        <table className="table table-striped">
          <thead className="thead-light">
            <tr>
              <th>พนักงาน</th>
              <th>วันที่สุ่ม</th>
              <th>เป็นช่อ</th>
              <th>ก้านยาว</th>
              <th>ใบขาด</th>
              <th>ติดตอก</th>
              <th>อื่น ๆ</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>
                <td style={{ textAlign: 'left' }}>{row.employeeName}</td>
                <td>{row.randomDate}</td>
                <td>{row.cluster}</td>
                <td>{row.longStemmed}</td>
                <td>{row.tornLeaves}</td>
                <td>{row.stickTok}</td>
                <td>{row.other}</td>
                <td style={{ textAlign: 'left' }}>{row.note}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th></th>
              <th>รวม</th>
              <th>{totals.cluster}</th>
              <th>{totals.longStemmed}</th>
              <th>{totals.tornLeaves}</th>
              <th>{totals.stickTok}</th>
              <th>{totals.other}</th>
              <th></th>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="chart-container mt-4">
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
            barCategoryGap="20%"
            barSize={15}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis
              type="category"
              dataKey="employeeName"
              width={150}
              interval={0}
              tickMargin={10}
            />
            <Tooltip />
            <Legend />
            <Bar dataKey="cluster" fill="#0088FE" name="เป็นช่อ" />
            <Bar dataKey="longStemmed" fill="#ff7300" name="ก้านยาว" />
            <Bar dataKey="tornLeaves" fill="#00C49F" name="ใบขาด" />
            <Bar dataKey="stickTok" fill="#ffbb28" name="ติดตอก" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DynamicRandomTestPick;