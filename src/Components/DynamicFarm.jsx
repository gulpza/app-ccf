import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';

const pivotData = (data) => {
  const pivot = {};
  const dates = [...new Set(data.map(item => moment(item['วันที่เด็ด']).format('DD/MM')))].sort();

  // Extract unique farm names and sort them
  const farms = [...new Set(data.map(item => item['ชื่อไร่']))].sort();

  farms.forEach(farm => {
    pivot[farm] = {};
  });

  data.forEach(item => {
    const date = moment(item['วันที่เด็ด']).format('DD/MM');
    const farm = item['ชื่อไร่'];
    const vegetableType = item['ประเภทผัก'];
    const dateRawMat = moment(item['วันที่รับผัก']).format('DD/MM');
    const weight = item['น้ำหนัก'];

    if (!pivot[farm][vegetableType]) {
      pivot[farm][vegetableType] = {
        dates: {},
        dateRawMat,
      };
    }


    if (!pivot[farm][vegetableType][date]) {
      pivot[farm][vegetableType][date] = 0;
    }

    pivot[farm][vegetableType][date] += weight;
  });

  return { pivot, dates, farms };
};

const DynamicFarm = ({ data }) => {
  const { pivot, dates, farms } = pivotData(data);

  const sumValues = (date) => {
    return farms.reduce((sum, farm) => {
      return sum + Object.values(pivot[farm]).reduce((farmSum, vegetableData) => {
        return farmSum + (vegetableData[date] || 0);
      }, 0);
    }, 0).toFixed(2);
  };

  return (
    <div className="container">
      <div className="table-responsive">
        <table className="table table-striped">
          <thead className="thead-light">
            <tr>
              <th>ไร่</th>
              <th>ประเภทผัก</th>
              <th>วันที่รับผัก</th>
              {dates.map(date => (
                <th key={date}>{date}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {farms.flatMap(farm => {
              const vegetableTypes = Object.keys(pivot[farm]);
              return vegetableTypes.map((vegType, index) => (
                <tr key={`${farm}-${vegType}-${index}`}>
                  {<td>{farm}</td>}
                  <td>{vegType}</td>
                  <td>{pivot[farm][vegType].dateRawMat}</td>
                  {dates.map(date => (
                    <td key={date}>
                      {pivot[farm][vegType][date]
                        ? pivot[farm][vegType][date].toFixed(2)
                        : 0}
                    </td>
                  ))}
                </tr>
              ));
            })}
          </tbody>
          <tfoot>
            <tr>
              <td></td>
              <td></td>
              <td><strong>รวม</strong></td>
              {dates.map(date => (
                <td key={date}><strong>{sumValues(date)}</strong></td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default DynamicFarm;
