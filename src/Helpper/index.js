const transformData = (data) => {
    const result = {};

    data.forEach(entry => {
        const { วันที่รับผัก, ชื่อไร่, ประเภทผัก, น้ำหนัก } = entry;
        const dateKey = new Date(วันที่รับผัก).toISOString().split('T')[0];
        const farmTypeKey = `${ชื่อไร่}-${ประเภทผัก}`;

        if (!result[dateKey]) {
            result[dateKey] = {};
        }

        if (!result[dateKey][farmTypeKey]) {
            result[dateKey][farmTypeKey] = {
                "วันที่รับผัก": dateKey,
                "ชื่อไร่": ชื่อไร่,
                "ประเภทผัก": ประเภทผัก,
                "น้ำหนัก": 0
            };
        }

        result[dateKey][farmTypeKey]["น้ำหนัก"] += น้ำหนัก;
    });

    // Flatten the result object to an array
    return Object.values(result).flatMap(dateGroup => Object.values(dateGroup));
};