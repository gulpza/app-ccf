import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { VerifyNumber } from '../Helpper/index';

const DynamicRandomTest = ({ data }) => {
  const chartHeight = data.length * (data.length < 10 ? 80 : 50);

  // Convert the original data into the format needed for the table and chart
  const tableData = data.map((item) => ({
    employeeName: `${item['ชื่อพนักงาน']} ${item['นามสกุล']}`.trim(),
    quantity: VerifyNumber(item['จำนวน']),
    insect: VerifyNumber(item['หนอน/แมลง']),
    wormNest: VerifyNumber(item['รังหนอน']),
    ovary: VerifyNumber(item['รังไข่']),
    yarn: VerifyNumber(item['เส้นด้าย']),
    grass: VerifyNumber(item['หญ้า']),
    hair: VerifyNumber(item['เส้นผม']),
    lineHair: VerifyNumber(item['เส้นขน']),
    wool: VerifyNumber(item['ขนสัตว์']),
    plastic: VerifyNumber(item['พลาสติก']),
    other: VerifyNumber(item['อื่น ๆ']),
    note: item['หมายเหตุ'] || '-',
  }));

  // Calculate the totals for each category
  const totals = tableData.reduce(
    (acc, row) => {
      acc.quantity += row.quantity;
      acc.insect += row.insect;
      acc.wormNest += row.wormNest;
      acc.ovary += row.ovary;
      acc.yarn += row.yarn;
      acc.grass += row.grass;
      acc.hair += row.hair;
      acc.lineHair += row.lineHair;
      acc.wool += row.wool;
      acc.plastic += row.plastic;
      acc.other += row.other;
      return acc;
    },
    {
      quantity: 0,
      insect: 0,
      wormNest: 0,
      ovary: 0,
      yarn: 0,
      grass: 0,
      hair: 0,
      lineHair: 0,
      wool: 0,
      plastic: 0,
      other: 0,
    }
  );

  console.log({totals})

  // Prepare data for the chart
  const chartData = tableData.map((row) => ({
    employeeName: row.employeeName,
    insect: row.insect,
    wormNest: row.wormNest,
    ovary: row.ovary,
    yarn: row.yarn,
    grass: row.grass,
    hair: row.hair,
    lineHair: row.lineHair,
    wool: row.wool,
    plastic: row.plastic,
  }));

  return (
    <div className="container">
      <div className="table-responsive">
        <table className="table table-striped">
          <thead className="thead-light">
            <tr>
              <th>พนักงาน</th>
              <th>จำนวน</th>
              <th>หนอน/แมลง</th>
              <th>รังหนอน</th>
              <th>รังไข่</th>
              <th>เส้นด้าย</th>
              <th>หญ้า</th>
              <th>เส้นผม</th>
              <th>เส้นขน</th>
              <th>ขนสัตว์</th>
              <th>พลาสติก</th>
              <th>อื่น ๆ</th>
              <th>หมายเหตุ</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>
                <td style={{ textAlign: 'left' }}>{row.employeeName}</td>
                <td>{row.quantity}</td>
                <td>{row.insect}</td>
                <td>{row.wormNest}</td>
                <td>{row.ovary}</td>
                <td>{row.yarn}</td>
                <td>{row.grass}</td>
                <td>{row.hair}</td>
                <td>{row.lineHair}</td>
                <td>{row.wool}</td>
                <td>{row.plastic}</td>
                <td>{row.other}</td>
                <td style={{ textAlign: 'left' }}>{row.note}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th>รวม</th>
              <th>{totals.quantity.toFixed(2)}</th>
              <th>{totals.insect.toFixed(2)}</th>
              <th>{totals.wormNest.toFixed(2)}</th>
              <th>{totals.ovary.toFixed(2)}</th>
              <th>{totals.yarn.toFixed(2)}</th>
              <th>{totals.grass.toFixed(2)}</th>
              <th>{totals.hair.toFixed(2)}</th>
              <th>{totals.lineHair.toFixed(2)}</th>
              <th>{totals.wool.toFixed(2)}</th>
              <th>{totals.plastic.toFixed(2)}</th>
              <th>{totals.other.toFixed(2)}</th>
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
            <Bar dataKey="insect" fill="#8884d8" name="หนอน/แมลง" />
            <Bar dataKey="wormNest" fill="#82ca9d" name="รังหนอน" />
            <Bar dataKey="ovary" fill="#ffc658" name="รังไข่" />
            <Bar dataKey="yarn" fill="#d0ed57" name="เส้นด้าย" />
            <Bar dataKey="grass" fill="#ff7300" name="หญ้า" />
            <Bar dataKey="hair" fill="#00C49F" name="เส้นผม" />
            <Bar dataKey="lineHair" fill="#ffbb28" name="เส้นขน" />
            <Bar dataKey="wool" fill="#0088FE" name="ขนสัตว์" />
            <Bar dataKey="plastic" fill="#FF8042" name="พลาสติก" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DynamicRandomTest;