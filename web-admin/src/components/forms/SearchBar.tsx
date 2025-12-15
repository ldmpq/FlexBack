import React from 'react';
import { Search, X } from 'lucide-react';
import type { SearchBarProps } from '../../types/searchBar.type';

const SearchBar: React.FC<SearchBarProps> = ({ 
  value, 
  onChange, 
  placeholder = "Tìm kiếm...",
  className = ""
}) => {
  return (
    <div className={`bg-white p-3 rounded-xl shadow-sm mb-6 flex items-center border border-gray-200 focus-within:ring-2 focus-within:ring-blue-100 transition ${className}`}>
      <Search className="text-gray-400 mr-3 shrink-0" size={20} />
      <input 
        type="text" 
        placeholder={placeholder} 
        className="flex-1 outline-none text-gray-700 placeholder-gray-400 bg-transparent"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button 
          onClick={() => onChange('')}
          className="p-1 hover:bg-gray-100 rounded-full transition duration-200"
          title="Xóa tìm kiếm"
        >
          <X size={16} className="text-gray-400 hover:text-gray-600"/>
        </button>
      )}
    </div>
  );
};

export default SearchBar;