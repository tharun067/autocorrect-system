import { useState } from 'react';
import { FileText, Type } from 'lucide-react';
import { TextCheck } from './components/TextCheck';
import { FileCheck } from './components/FileCheck';

function App() {
  const [activeTab, setActiveTab] = useState<'text' | 'file'>('text');

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Spell Checker
          </h1>
          <p className="text-gray-600">
            Check and correct spelling in your text or documents
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('text')}
                className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'text'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } transition-colors`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Type className="w-5 h-5" />
                  Text Check
                </div>
              </button>
              <button
                onClick={() => setActiveTab('file')}
                className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'file'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } transition-colors`}
              >
                <div className="flex items-center justify-center gap-2">
                  <FileText className="w-5 h-5" />
                  File Upload
                </div>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'text' ? (
              <TextCheck />
            ) : (
              <FileCheck />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;