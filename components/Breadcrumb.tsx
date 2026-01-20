import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbProps {
  items: { label: string; path?: string }[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex items-center text-sm text-gray-500 mb-6">
      <Link to="/" className="hover:text-primary transition-colors">
        <Home size={16} />
      </Link>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={16} className="mx-2" />
          {item.path ? (
            <Link to={item.path} className="hover:text-primary transition-colors font-medium">
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-gray-800 line-clamp-1">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;