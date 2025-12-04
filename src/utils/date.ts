import dayjs from 'dayjs';
import jalaliday from 'jalaliday'; // 🚨 FIX: استفاده از نام صحیح پلاگین

dayjs.extend(jalaliday);

// تابع تبدیل تاریخ میلادی (ISO String) به شمسی
export const toShamsiDate = (dateString: string | Date, format: string = 'DD MMMM YYYY') => {
  if (!dateString) return '---';
  // استفاده از .calendar('jalali') که API پلاگین jalaliday است.
  return dayjs(dateString).calendar('jalali').format(format);
};

// تابع چک کردن تولد (مبنا بر ماه و روز میلادی)
export const checkIsBirthday = (dobString: string | Date): boolean => {
    if (!dobString) return false;
    
    const dob = new Date(dobString); 
    if (isNaN(dob.getTime())) return false;

    const today = new Date();
    
    // مقایسه ماه و روز (Gregorian)
    return today.getMonth() === dob.getMonth() && today.getDate() === dob.getDate();
}