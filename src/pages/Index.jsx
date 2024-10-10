import React from 'react';
import TOTPGenerator from '../components/TOTPGenerator';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center p-4">
      <TOTPGenerator />
    </div>
  );
};

export default Index;