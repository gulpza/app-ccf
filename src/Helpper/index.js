export function VerifyNumber(value) {
  // ตรวจสอบว่าค่าเป็นประเภท number และไม่ใช่ NaN
  if (typeof value === 'number' && !isNaN(value)) {
    return value; // คืนค่าตัวเลขถ้าเป็น number
  }

  // ตรวจสอบว่าค่าเป็นสตริงตัวเลขตั้งแต่ "0" ถึง "9"
  if (typeof value === 'string' && /^[0-9]$/.test(value)) {
    return Number(value); // แปลงเป็นตัวเลขแล้วคืนค่า
  }

  // คืนค่า 0 ถ้าไม่ตรงเงื่อนไขด้านบน
  return 0;
}