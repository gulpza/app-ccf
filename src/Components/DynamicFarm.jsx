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

  var t = data.filter(e => e['Price'] < 1);
  data.forEach(item => {
    const date = moment(item['วันที่เด็ด']).format('DD/MM');
    const farm = item['ชื่อไร่'];
    const vegetableType = item['ประเภทผัก'];
    const dateRawMat = moment(item['วันที่รับผัก']).format('DD/MM');
    const weight = item['น้ำหนัก'];

    // Initialize if not exists
    if (!pivot[farm][dateRawMat]) {
      pivot[farm][dateRawMat] = {}; // Group by dateRawMat (วันที่รับผัก)
    }

    if (!pivot[farm][dateRawMat][vegetableType]) {
      pivot[farm][dateRawMat][vegetableType] = {
        dates: {},
      };
    }

    if (!pivot[farm][dateRawMat][vegetableType][date]) {
      pivot[farm][dateRawMat][vegetableType][date] = 0;
    }

    // Aggregate weight
    pivot[farm][dateRawMat][vegetableType][date] += weight;
  });

  return { pivot, dates, farms };
};

const DynamicFarm = ({ data }) => {
  const { pivot, dates, farms } = pivotData(data);
  const sumValues = (date) => {
    return farms.reduce((sum, farm) => {
      return sum + Object.values(pivot[farm]).reduce((farmSum, vegetableGroups) => {
        return farmSum + Object.values(vegetableGroups).reduce((vegSum, vegetableData) => {
          return vegSum + (vegetableData[date] || 0);
        }, 0);
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
              const dateGroups = Object.keys(pivot[farm]).sort((a, b) => {
                // Convert DD/MM to sortable format
                const [dayA, monthA] = a.split('/');
                const [dayB, monthB] = b.split('/');
                const dateA = new Date(2024, parseInt(monthA) - 1, parseInt(dayA));
                const dateB = new Date(2024, parseInt(monthB) - 1, parseInt(dayB));
                return dateA - dateB;
              });
              return dateGroups.flatMap(dateRawMat => {
                const vegetableTypes = Object.keys(pivot[farm][dateRawMat]).sort();
                return vegetableTypes.map((vegType, index) => (
              <tr key={`${farm}-${dateRawMat}-${vegType}-${index}`}>
                <td>{farm}</td>
                <td>{vegType}</td>
                <td>{dateRawMat}</td>
                {dates.map(date => (
                  <td key={date}>
                    {pivot[farm][dateRawMat][vegType][date]
                      ? pivot[farm][dateRawMat][vegType][date].toFixed(2)
                      : 0}
                  </td>
                ))}
              </tr>
                ));
              });
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2}></td>
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