import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';

const pivotData = (data) => {
  const pivot = {};
  const dates = [...new Set(data.map(item => moment(item['วันที่เด็ด']).format('DD/MM/YYYY')))].sort();

  // Extract unique farm names and sort them
  const farms = [...new Set(data.map(item => item['ชื่อไร่']))].sort();

  farms.forEach(farm => {
    pivot[farm] = {};
  });

  data.forEach(item => {
    const date = moment(item['วันที่เด็ด']).format('DD/MM/YYYY');
    const farm = item['ชื่อไร่'];
    const weight = item['น้ำหนัก'];

    if (!pivot[farm][date]) {
      pivot[farm][date] = 0;
    }

    pivot[farm][date] += weight;
  });

  return { pivot, dates };
};

const DynamicFarm = ({ data }) => {
  const { pivot, dates } = pivotData(data);

  const sumValues = (date) => {
    return Object.values(pivot).reduce((sum, farmData) => {
      return sum + (farmData[date] || 0);
    }, 0).toFixed(1);
  };

  return (
    <div className="container">
      <table className="table table-striped">
        <thead className="thead-light">
          <tr>
            <th>ชื่อไร่ / วันที่เด็ด</th>
            {dates.map(date => (
              <th key={date}>{date}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.keys(pivot).map(farm => (
            <tr key={farm}>
              <td>{farm}</td>
              {dates.map(date => (
                <td key={date}>{pivot[farm][date] ? pivot[farm][date].toFixed(2) : 0}</td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
          <td><strong>รวม</strong></td>
            {dates.map(date => (
              <td key={date}><strong>{sumValues(date)}</strong></td>
            ))}
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default DynamicFarm;
