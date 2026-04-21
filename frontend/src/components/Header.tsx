import React from 'react';
import { Calendar } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 text-white rounded-2xl">
            <Calendar className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Smart Campus</h1>
            <p className="text-sm text-gray-500 -mt-1">Operations Hub</p>
          </div>
        </div>
        
        <div className="text-sm text-gray-500">
          IT3030 • Module B • Group WE_415
        </div>
      </div>
    </header>
  );
};

export default Header;