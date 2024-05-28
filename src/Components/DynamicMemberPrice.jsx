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
  const priceTotals = prices.map(price => 
    employees.reduce((sum, employee) => sum + pivot[employee][price], 0).toFixed(2)
  );

  // Calculate the total for each employee
  const employeeTotals = employees.map(employee => 
    prices.reduce((sum, price) => sum + pivot[employee][price], 0).toFixed(2)
  );

  // Calculate the grand total for the footer
  const grandTotal = priceTotals.reduce((sum, total) => sum + parseFloat(total), 0).toFixed(2);

  return (
    <div className="container">
      <table className="table table-striped">
        <thead className="thead-light">
          <tr>
            <th>พนักงาน / ราคา</th>
            {prices.map(price => (
              <th key={price}>{price}</th>
            ))}
            <th className="border-left">รวม</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, employeeIndex) => (
            <tr key={employee}>
              <td>{employee}</td>
              {prices.map(price => (
                <td key={price}>{pivot[employee][price].toFixed(2)}</td>
              ))}
              <td className="border-left"><strong>{employeeTotals[employeeIndex]}</strong></td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td><strong>รวม</strong></td>
            {priceTotals.map((total, index) => (
              <td key={prices[index]}><strong>{total}</strong></td>
            ))}
            <td className="border-left"><strong>{grandTotal}</strong></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default DynamicMemberPrice;
