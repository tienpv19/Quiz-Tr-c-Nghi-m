import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Link, NavLink, Navigate, useParams } from 'react-router-dom';
import { QuizItem, Category } from './types';
import { fetchQuizData } from './services/dataService';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import QuizDetail from './pages/QuizDetail';

const App: React.FC = () => {
  const [data, setData] = useState<QuizItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchQuizData();
      setData(result);
      setLoading(false);
    };
    loadData();
  }, []);

  const getCategoryData = (cat: Category) => data.filter(item => item.category === cat);

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col font-merriweather bg-gray-50">
        
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="py-6 text-center">
              <Link to="/" className="text-4xl font-black text-gray-900 tracking-tight hover:text-primary transition-colors">
                Trắc nghiệm
              </Link>
            </div>
            
            {/* Navigation Tabs */}
            <nav className="flex justify-center border-t border-gray-100 overflow-x-auto">
              <div className="flex space-x-1 md:space-x-8">
                {[Category.CON_GIAP, Category.CUNG_HOANG_DAO, Category.QUIZ].map((cat) => (
                  <NavLink
                    key={cat}
                    to={`/category/${encodeURIComponent(cat)}`}
                    className={({ isActive }) =>
                      `whitespace-nowrap py-4 px-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors duration-200 ${
                        isActive
                          ? 'border-primary text-primary'
                          : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
                      }`
                    }
                  >
                    {cat}
                  </NavLink>
                ))}
              </div>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
          {loading ? (
             <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
             </div>
          ) : (
            <Routes>
              <Route path="/" element={<Home data={data} />} />
              
              <Route path="/category/:categoryName" element={<CategoryWrapper data={data} />} />
              
              <Route path="/quiz/:id" element={<QuizDetail allData={data} />} />
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-8 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-400 text-sm">© 2023 Trắc Nghiệm Vui. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

// Wrapper to handle params matching and filtering
const CategoryWrapper: React.FC<{ data: QuizItem[] }> = ({ data }) => {
  const { categoryName } = useParams();
  const decodedName = decodeURIComponent(categoryName || '');
  
  const categoryData = data.filter(item => item.category === decodedName);

  return <CategoryPage title={decodedName} data={categoryData} />;
};

export default App;