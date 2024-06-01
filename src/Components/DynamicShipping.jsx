import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const pivotData = (data) => {
  const pivot = {};
  const shippings = [...new Set(data.map(item => item['สถานที่ส่ง']))].sort((a, b) => a - b);
  const vegTypes = [...new Set(data.map(item => `${item['ประเภทผัก']}`))].sort((a, b) => a.localeCompare(b));

  vegTypes.forEach(vegType => {
    pivot[vegType] = {};
    shippings.forEach(shipping => {
      pivot[vegType][shipping] = 0; // Initialize with 0
    });
  });

  data.forEach(item => {
    const vegType = `${item['ประเภทผัก']}`;
    const shipping = item['สถานที่ส่ง'];
    const total = item['รวม'];

    if (pivot[vegType][shipping] === undefined) {
      pivot[vegType][shipping] = 0;
    }

    pivot[vegType][shipping] += total;
  });

  return { pivot, shippings, vegTypes };
};

const DynamicShipping = ({ data }) => {
  const { pivot, shippings, vegTypes } = pivotData(data);

  // Calculate the total for each shipping
  const shippingTotals = shippings.map(shipping => 
    vegTypes.reduce((sum, vegType) => sum + pivot[vegType][shipping], 0).toFixed(2)
  );

  // Calculate the total for each vegetable type
  const vegTypeTotals = vegTypes.map(vegType => 
    shippings.reduce((sum, shipping) => sum + pivot[vegType][shipping], 0).toFixed(2)
  );

  return (
    <div className="container">
       <div className="table-responsive">
      <table className="table table-striped">
        <thead className="thead-light">
          <tr>
            <th>ประเภทผัก / สถานที่ส่ง</th>
            {shippings.map(shipping => (
              <th key={shipping}>{shipping}</th>
            ))}
            <th className="border-left">รวม</th>
          </tr>
        </thead>
        <tbody>
          {vegTypes.map((vegType, vegTypeIndex) => (
            <tr key={vegType}>
              <td>{vegType}</td>
              {shippings.map(shipping => (
                <td key={shipping}>{pivot[vegType][shipping].toFixed(2)}</td>
              ))}
              <td className="border-left"><strong>{vegTypeTotals[vegTypeIndex]}</strong></td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td><strong>รวม</strong></td>
            {shippingTotals.map((total, index) => (
              <td key={shippings[index]}><strong>{total}</strong></td>
            ))}
            <td className="border-left"><strong>{shippingTotals.reduce((sum, total) => sum + parseFloat(total), 0).toFixed(2)}</strong></td>
          </tr>
        </tfoot>
      </table>
      </div>
    </div>
  );
};

export default DynamicShipping;
