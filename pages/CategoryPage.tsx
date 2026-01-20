import React from 'react';
import { QuizItem } from '../types';
import QuizCard from '../components/QuizCard';
import Breadcrumb from '../components/Breadcrumb';

interface CategoryPageProps {
  title: string;
  data: QuizItem[];
}

const CategoryPage: React.FC<CategoryPageProps> = ({ title, data }) => {
  return (
    <div>
      <Breadcrumb items={[{ label: title }]} />
      
      <div className="mb-8 border-b pb-4">
        <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {data.map(quiz => (
          <QuizCard key={quiz.id} quiz={quiz} />
        ))}
      </div>

      {data.length === 0 && (
         <div className="text-center py-20 text-gray-500">
            Không có bài trắc nghiệm nào trong mục này.
         </div>
      )}
    </div>
  );
};

export default CategoryPage;