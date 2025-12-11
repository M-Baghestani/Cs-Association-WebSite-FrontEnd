// src/utils/date.ts
import dayjs from 'dayjs';
import jalaliday from 'jalaliday';
import 'dayjs/locale/fa'; // 🚨 FIX: Import Persian locale

dayjs.extend(jalaliday);
dayjs.locale('fa'); // 🚨 FIX: Set global locale to Persian

export const toShamsiDate = (dateString: string | Date, format: string = 'DD MMMM YYYY') => {
  if (!dateString) return '---';
  // MMMM اکنون نام ماه را به فارسی نمایش می‌دهد (مانند آذر)
  return dayjs(dateString).calendar('jalali').format(format); 
};

export const checkIsBirthday = (dobString: string | Date): boolean => {
    if (!dobString) return false;
    
    const dob = new Date(dobString); 
    if (isNaN(dob.getTime())) return false;

    const today = new Date();
    
    // Compare Month and Day (Gregorian)
    return today.getMonth() === dob.getMonth() && today.getDate() === dob.getDate();
}
export const toLocalInputDate = (isoString: string | Date | undefined) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  
  const offsetMs = date.getTimezoneOffset() * 60000;
  const localDate = new Date(date.getTime() - offsetMs);
  
  return localDate.toISOString().slice(0, 16);
};