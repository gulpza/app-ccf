import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const pivotData = (data) => {
  const pivot = {};
  const prices = [...new Set(data.map(item => item['Price']))].sort((a, b) => a - b);
  const employees = [...new Set(data.map(item => `${item['ชื่อพนักงาน']} ${item['นามสกุล']}`))].sort((a, b) => a.localeCompare(b));

  employees.forEach(employee => {
    pivot[employee] = {};
    prices.forEach(price => {
      pivot[employee][price] = 0; // Initialize with 0
    });
  });

  data.forEach(item => {
    const employee = `${item['ชื่อพนักงาน']} ${item['นามสกุล']}`;
    const price = item['Price'];
    const weight = item['น้ำหนัก'];

    if (pivot[employee][price] === undefined) {
      pivot[employee][price] = 0;
    }

    pivot[employee][price] += weight;
  });

  return { pivot, prices, employees };
};

const DynamicMemberPrice = ({ data }) => {
  const { pivot, prices, employees } = pivotData(data);

  // Calculate the total for each price
  const totals = prices.map(price => 
    employees.reduce((sum, employee) => sum + pivot[employee][price], 0).toFixed(2)
  );

  return (
    <div className="container">
      <table className="table table-striped">
        <thead className="thead-light">
          <tr>
            <th>พนักงาน / ราคา</th>
            {prices.map(price => (
              <th key={price}>{price}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {employees.map(employee => (
            <tr key={employee}>
              <td>{employee}</td>
              {prices.map(price => (
                <td key={price} className="text-right">{pivot[employee][price].toFixed(2)}</td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td><strong>รวม</strong></td>
            {totals.map((total, index) => (
              <td key={prices[index]} className="text-right"><strong>{total}</strong></td>
            ))}
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default DynamicMemberPrice;
