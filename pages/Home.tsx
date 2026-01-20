import React from 'react';
import { QuizItem } from '../types';
import QuizCard from '../components/QuizCard';

interface HomeProps {
  data: QuizItem[];
}

const Home: React.FC<HomeProps> = ({ data }) => {
  // Logic: 2 latest prominent, rest grid 4x1
  const featured = data.slice(0, 2);
  const others = data.slice(2);

  return (
    <div className="space-y-10">
      {/* Featured Section */}
      {featured.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featured.map(quiz => (
            <QuizCard key={quiz.id} quiz={quiz} large />
          ))}
        </div>
      )}

      {/* Grid List */}
      {others.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {others.map(quiz => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      )}
      
      {data.length === 0 && (
         <div className="text-center py-20 text-gray-500">
            Đang tải dữ liệu hoặc không có bài trắc nghiệm nào.
         </div>
      )}
    </div>
  );
};

export default Home;