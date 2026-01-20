export enum QuizType {
  TU_VI = 'Tử vi',
  XEP_HANG = 'Xếp hạng',
  HOI_DAP = 'Hỏi đáp',
  DIEN_DAP_AN = 'Điền đáp án'
}

export enum Category {
  CON_GIAP = '12 Con giáp',
  CUNG_HOANG_DAO = 'Cung hoàng đạo',
  QUIZ = 'Quiz'
}

export interface QuizItem {
  id: string;
  category: Category;
  tieu_de: string;
  anh_thumb: string;
  ngay_thang_nam: string; // DD/MM/YYYY
  timestamp: number; // For sorting
  loai_trac_nghiem: QuizType;
  cau_hoi: string;
  anh_minh_hoa: string;
  
  // Answers and Results (Dynamic keys mapped to structured arrays for easier usage)
  dap_an: string[];
  hinh_anh_dap_an: string[];
  ket_qua: string[];
  hinh_anh_ket_qua: string[];
}
