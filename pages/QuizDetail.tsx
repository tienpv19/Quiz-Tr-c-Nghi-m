import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QuizItem, QuizType } from '../types';
import Breadcrumb from '../components/Breadcrumb';
import QuizCard from '../components/QuizCard';
import { X } from 'lucide-react';

interface QuizDetailProps {
  allData: QuizItem[];
}

const QuizDetail: React.FC<QuizDetailProps> = ({ allData }) => {
  const { id } = useParams<{ id: string }>();
  const [quiz, setQuiz] = useState<QuizItem | null>(null);
  const [related, setRelated] = useState<QuizItem[]>([]);

  // State for interaction
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [rankingStep, setRankingStep] = useState<number>(0);
  const [fillAnswer, setFillAnswer] = useState<string>('');
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [showFillResult, setShowFillResult] = useState<boolean>(false);

  useEffect(() => {
    // Scroll to top whenever ID changes
    window.scrollTo(0, 0);

    if (id && allData.length > 0) {
      const found = allData.find(q => q.id === id);
      if (found) {
        setQuiz(found);
        // Find related: Same category, exclude current, sort newest, take 3
        const rel = allData
          .filter(q => q.category === found.category && q.id !== found.id)
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, 3);
        setRelated(rel);
        
        // Reset states
        setSelectedOptionIndex(null);
        setRankingStep(0);
        setFillAnswer('');
        setIsAnswerCorrect(null);
        setShowFillResult(false);
      }
    }
  }, [id, allData]);

  if (!quiz) return <div className="text-center py-20">Đang tải...</div>;

  // --- RENDER LOGIC FOR TYPES ---

  // 1. TU VI (Horoscope)
  const renderTuVi = () => (
    <>
      <div className="grid grid-cols-3 gap-3 md:gap-8 mt-8">
        {quiz.dap_an.map((ans, idx) => (
          <div 
            key={idx} 
            onClick={() => setSelectedOptionIndex(idx)}
            className="cursor-pointer group flex flex-col items-center p-2 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md"
          >
             <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 mb-3 rounded-full overflow-hidden border-2 border-transparent group-hover:border-primary/20 transition-all">
               {quiz.hinh_anh_dap_an[idx] ? (
                 <img src={quiz.hinh_anh_dap_an[idx]} alt={ans} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
               ) : (
                 <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 font-bold text-2xl">
                   {idx + 1}
                 </div>
               )}
             </div>
             <span className="text-sm md:text-lg font-bold text-gray-800 text-center group-hover:text-primary transition-colors">
               {ans}
             </span>
          </div>
        ))}
      </div>

      {/* Result Popup Modal */}
      {selectedOptionIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden relative animate-scale-up">
            
            {/* Header */}
            <div className="bg-[#d32f2f] text-white p-4 flex justify-between items-center shrink-0">
              <h3 className="text-lg font-bold flex-grow text-center pl-6">
                Kết Quả: {quiz.dap_an[selectedOptionIndex]}
              </h3>
              <button 
                onClick={() => setSelectedOptionIndex(null)}
                className="text-white/80 hover:text-white transition-colors p-1"
              >
                <X size={24} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto">
              <div className="flex flex-col items-center">
                {quiz.hinh_anh_dap_an[selectedOptionIndex] && (
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 shadow-md mb-6 shrink-0">
                    <img 
                      src={quiz.hinh_anh_dap_an[selectedOptionIndex]} 
                      alt="Result" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                )}
                
                <div className="text-gray-800 text-justify leading-relaxed whitespace-pre-line">
                  {quiz.ket_qua[selectedOptionIndex]}
                </div>

                <button 
                  onClick={() => setSelectedOptionIndex(null)}
                  className="mt-8 w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-lg transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );

  // 2. XEP HANG (Ranking)
  const renderXepHang = () => (
    <div className="mt-8 max-w-4xl mx-auto">
       {rankingStep === 0 && (
         <div className="text-center">
           <button 
             onClick={() => setRankingStep(1)}
             className="px-8 py-3 bg-primary text-white font-bold rounded-lg shadow-lg hover:bg-secondary transform transition hover:scale-105"
           >
             Xem ngay
           </button>
         </div>
       )}

       {rankingStep > 0 && (
         <div className="space-y-8">
           {quiz.dap_an.slice(0, rankingStep).map((ans, idx) => (
             <div key={idx} className="bg-white border rounded-xl overflow-hidden shadow-sm animate-slide-up">
               <div className="bg-gray-50 p-3 border-b font-bold flex items-center">
                 <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mr-3">
                   {idx + 1}
                 </span>
                 {ans}
               </div>
               <div className="p-4">
                  {quiz.hinh_anh_dap_an[idx] && (
                    <img src={quiz.hinh_anh_dap_an[idx]} alt={ans} className="w-full max-h-96 object-contain mb-4 rounded" />
                  )}
                  <p className="text-gray-700">{quiz.ket_qua[idx]}</p>
               </div>
             </div>
           ))}
           
           {rankingStep < quiz.dap_an.length && (
              <div className="text-center pt-4">
                <button 
                  onClick={() => setRankingStep(prev => prev + 1)}
                  className="px-6 py-2 border-2 border-primary text-primary font-bold rounded-full hover:bg-primary hover:text-white transition-colors"
                >
                  Xem tiếp
                </button>
              </div>
           )}
         </div>
       )}
    </div>
  );

  // 3. HOI DAP (Q&A)
  const renderHoiDap = () => (
    <div className="mt-8 max-w-3xl mx-auto">
      {selectedOptionIndex === null ? (
        <div className="space-y-4">
          {quiz.dap_an.map((ans, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedOptionIndex(idx)}
              className="w-full text-left p-4 bg-white border rounded-lg shadow-sm hover:border-primary hover:shadow-md transition-all flex items-center group"
            >
              {quiz.hinh_anh_dap_an[idx] && (
                <img src={quiz.hinh_anh_dap_an[idx]} alt="" className="w-16 h-16 object-cover rounded mr-4" />
              )}
              <span className="font-medium text-lg text-gray-700 group-hover:text-primary">{ans}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow border border-blue-100 animate-fade-in">
          <h3 className="text-xl font-bold mb-4 text-primary">Kết quả</h3>
          <p className="text-gray-800 text-lg mb-6">{quiz.ket_qua[selectedOptionIndex]}</p>
          <button 
            onClick={() => setSelectedOptionIndex(null)}
            className="text-sm text-gray-500 underline hover:text-primary"
          >
            Chọn phương án khác
          </button>
        </div>
      )}
    </div>
  );

  // 4. DIEN DAP AN (Fill in blank)
  const handleFillSubmit = () => {
    const correct = quiz.dap_an[0]?.toLowerCase().trim();
    const userAns = fillAnswer.toLowerCase().trim();
    
    if (userAns === correct) {
      setIsAnswerCorrect(true);
      setShowFillResult(true);
    } else {
      setIsAnswerCorrect(false);
    }
  };

  const renderDienDapAn = () => (
    <div className="mt-8 max-w-4xl mx-auto">
      {/* Question Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <label className="block text-gray-700 font-bold mb-2">Câu trả lời của bạn</label>
        <div className="flex gap-2">
          <input 
            type="text" 
            value={fillAnswer}
            onChange={(e) => {
              setFillAnswer(e.target.value);
              if (isAnswerCorrect === false) setIsAnswerCorrect(null); // Reset red border on type
            }}
            className={`flex-grow border-2 p-3 rounded outline-none transition-colors ${
              isAnswerCorrect === false ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-black'
            }`}
            placeholder="Nhập đáp án..."
          />
          <button 
            onClick={handleFillSubmit}
            className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 font-bold"
          >
            Gửi
          </button>
        </div>
        
        {isAnswerCorrect === false && !showFillResult && (
           <div className="mt-3">
             <p className="text-red-600 font-medium mb-1">Câu trả lời chưa chính xác</p>
             <button 
                onClick={() => setShowFillResult(true)}
                className="text-sm text-gray-500 underline hover:text-black"
             >
               Xem đáp án
             </button>
           </div>
        )}
      </div>

      {/* Result Display */}
      {showFillResult && (
        <div className="mt-6 bg-green-50 border border-green-200 p-6 rounded-lg animate-fade-in">
           <h3 className="text-green-800 font-bold text-lg mb-2">
             {isAnswerCorrect ? "Câu trả lời chính xác" : "Đáp án"}
           </h3>
           <div className="bg-green-100 p-3 rounded text-green-900 font-mono text-xl mb-4 inline-block">
             {quiz.dap_an[0]}
           </div>
           
           {quiz.hinh_anh_ket_qua[0] && (
             <img src={quiz.hinh_anh_ket_qua[0]} alt="Result" className="w-full rounded mb-4 shadow-sm" />
           )}
           
           <p className="text-gray-800">{quiz.ket_qua[0]}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="animate-fade-in">
      <Breadcrumb items={[
        { label: quiz.category, path: `/category/${encodeURIComponent(quiz.category)}` },
        { label: quiz.tieu_de }
      ]} />

      <article className="bg-white rounded-xl shadow-sm p-4 md:p-8 mb-12">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">{quiz.tieu_de}</h1>
          <time className="text-gray-500 text-sm">{quiz.ngay_thang_nam}</time>
        </header>

        {/* Common Question Section */}
        <section className="mb-8">
          <p className="text-xl md:text-2xl font-serif text-gray-800 mb-6 text-center leading-relaxed max-w-4xl mx-auto">
            {quiz.cau_hoi}
          </p>
          {quiz.anh_minh_hoa && (
            <div className="max-w-3xl mx-auto rounded-lg overflow-hidden shadow-lg mb-8">
              <img src={quiz.anh_minh_hoa} alt="Minh họa" className="w-full h-auto" />
            </div>
          )}
        </section>

        {/* Dynamic Content based on Type */}
        <section className="border-t pt-8">
          {quiz.loai_trac_nghiem === QuizType.TU_VI && renderTuVi()}
          {quiz.loai_trac_nghiem === QuizType.XEP_HANG && renderXepHang()}
          {quiz.loai_trac_nghiem === QuizType.HOI_DAP && renderHoiDap()}
          {quiz.loai_trac_nghiem === QuizType.DIEN_DAP_AN && renderDienDapAn()}
        </section>
      </article>

      {/* Related Quizzes */}
      {related.length > 0 && (
        <div className="border-t-2 border-gray-100 pt-10">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">Có thể bạn quan tâm</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {related.map(r => (
              <QuizCard key={r.id} quiz={r} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizDetail;