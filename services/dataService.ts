import { QuizItem, Category, QuizType } from '../types';

// Specific URLs for each sheet provided by the user
const SHEETS = [
  {
    category: Category.CON_GIAP,
    url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTFHNc8wXflaEZIkBqtoYK5M7bCPG4aYuIIa_mYjmFJWZALPWNPrOycdoAtJZNRiS_u9tL9S3oaw3p3/pub?gid=969575685&single=true&output=tsv'
  },
  {
    category: Category.CUNG_HOANG_DAO,
    url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTFHNc8wXflaEZIkBqtoYK5M7bCPG4aYuIIa_mYjmFJWZALPWNPrOycdoAtJZNRiS_u9tL9S3oaw3p3/pub?gid=1252389482&single=true&output=tsv'
  },
  {
    category: Category.QUIZ,
    url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTFHNc8wXflaEZIkBqtoYK5M7bCPG4aYuIIa_mYjmFJWZALPWNPrOycdoAtJZNRiS_u9tL9S3oaw3p3/pub?gid=2126276661&single=true&output=tsv'
  }
];

const parseDate = (dateStr: string): number => {
  if (!dateStr) return 0;
  try {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      // DD/MM/YYYY
      return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0])).getTime();
    }
  } catch (e) {
    console.error("Date parse error", e);
  }
  return 0;
};

// Helper to map raw TSV row to QuizItem
const mapRowToQuizItem = (row: any, index: number, forcedCategory: Category): QuizItem => {
  const dap_an: string[] = [];
  const hinh_anh_dap_an: string[] = [];
  const ket_qua: string[] = [];
  const hinh_anh_ket_qua: string[] = [];

  // Extract dynamic fields (assuming max 12 for zodiacs)
  for (let i = 1; i <= 12; i++) {
    if (row[`dap_an_${i}`]) dap_an.push(row[`dap_an_${i}`]);
    if (row[`hinh_anh_dap_an_${i}`]) hinh_anh_dap_an.push(row[`hinh_anh_dap_an_${i}`]);
    if (row[`ket_qua_${i}`]) ket_qua.push(row[`ket_qua_${i}`]);
    if (row[`hinh_anh_ket_qua_${i}`]) hinh_anh_ket_qua.push(row[`hinh_anh_ket_qua_${i}`]);
  }

  // Determine Quiz Type from string
  let type = QuizType.HOI_DAP; 
  // Map the raw text to Enum. 
  // Note: The data file might have slight variations, we normalize.
  const rawType = (row['loai_trac_nghiem'] || '').toLowerCase().trim();
  if (rawType.includes('tử vi')) type = QuizType.TU_VI;
  else if (rawType.includes('xếp hạng')) type = QuizType.XEP_HANG;
  else if (rawType.includes('hỏi đáp')) type = QuizType.HOI_DAP;
  else if (rawType.includes('điền đáp án')) type = QuizType.DIEN_DAP_AN;

  return {
    id: `${forcedCategory}-${index}`,
    category: forcedCategory,
    tieu_de: row['tieu_de'] || 'Không có tiêu đề',
    anh_thumb: row['anh_thumb'] || 'https://picsum.photos/400/300',
    ngay_thang_nam: row['ngay_thang_nam'] || '',
    timestamp: parseDate(row['ngay_thang_nam']),
    loai_trac_nghiem: type as QuizType,
    cau_hoi: row['cau_hoi'] || '',
    anh_minh_hoa: row['anh_minh_hoa'] || '',
    dap_an,
    hinh_anh_dap_an,
    ket_qua,
    hinh_anh_ket_qua
  };
};

const parseSheetData = (text: string, category: Category): QuizItem[] => {
  const lines = text.split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split('\t').map(h => h.trim().replace(/\r/, ''));
  
  return lines.slice(1).map((line, idx) => {
    const values = line.split('\t');
    const obj: any = {};
    headers.forEach((h, i) => {
      obj[h] = values[i]?.replace(/\r/, '') || '';
    });
    return obj;
  })
  .filter(obj => obj.tieu_de)
  .map((row, index) => mapRowToQuizItem(row, index, category));
};

export const fetchQuizData = async (): Promise<QuizItem[]> => {
  try {
    const promises = SHEETS.map(async (sheet) => {
      try {
        const response = await fetch(sheet.url);
        const text = await response.text();
        return parseSheetData(text, sheet.category);
      } catch (err) {
        console.error(`Error fetching sheet ${sheet.category}`, err);
        return [];
      }
    });

    const results = await Promise.all(promises);
    
    // Flatten array and sort by Newest
    const allData = results.flat().sort((a, b) => b.timestamp - a.timestamp);
    
    return allData;

  } catch (error) {
    console.error("Failed to fetch data", error);
    return [];
  }
};