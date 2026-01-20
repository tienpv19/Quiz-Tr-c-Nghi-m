import React from 'react';
import { Link } from 'react-router-dom';
import { QuizItem } from '../types';

interface QuizCardProps {
  quiz: QuizItem;
  large?: boolean;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz, large = false }) => {
  // Use category slug for URL or ID directly
  const detailPath = `/quiz/${quiz.id}`;

  if (large) {
    return (
      <Link to={detailPath} className="group block h-full">
        <div className="relative h-full overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 bg-white flex flex-col">
          <div className="relative w-full h-64 md:h-80 overflow-hidden">
             <img 
              src={quiz.anh_thumb} 
              alt={quiz.tieu_de} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="p-6 flex flex-col justify-between flex-grow">
            <div>
               <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-wider text-white uppercase bg-primary rounded-full">
                {quiz.category}
              </span>
              <h3 className="text-2xl font-bold text-gray-800 group-hover:text-primary transition-colors line-clamp-2 mb-2">
                {quiz.tieu_de}
              </h3>
            </div>
            <p className="text-sm text-gray-500 mt-4">{quiz.ngay_thang_nam}</p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={detailPath} className="group block h-full">
      <div className="h-full overflow-hidden rounded-lg shadow hover:shadow-lg transition-all duration-300 bg-white flex flex-col transform hover:-translate-y-1">
        <div className="relative w-full h-48 overflow-hidden">
          <img 
            src={quiz.anh_thumb} 
            alt={quiz.tieu_de} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-bold text-gray-800 group-hover:text-primary transition-colors line-clamp-2 mb-2 leading-tight">
            {quiz.tieu_de}
          </h3>
          <div className="mt-auto pt-2 border-t border-gray-100">
             <p className="text-xs text-gray-400">{quiz.ngay_thang_nam}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default QuizCard;