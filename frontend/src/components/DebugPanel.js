import React, { useState } from 'react';

const DebugPanel = ({ data, title = "Debug Info" }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-800 text-white px-3 py-1 rounded-t-md text-sm"
      >
        {isOpen ? 'Hide' : 'Show'} {title}
      </button>
      
      {isOpen && (
        <div className="bg-gray-900 text-green-400 p-4 rounded-md shadow-lg max-h-96 overflow-auto w-96">
          <pre className="text-xs whitespace-pre-wrap">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default DebugPanel;
