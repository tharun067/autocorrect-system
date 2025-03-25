import { useState } from 'react';
import { FileText, Type, Languages, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { TextCheck } from './components/TextCheck';
import { FileCheck } from './components/FileCheck';
import { LanguageCheck } from './components/LanguageCheck';
import { clsx } from 'clsx';

function App() {
  const [activeTab, setActiveTab] = useState<'text' | 'file'>('text');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8 transition-all duration-300">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Spell Checker
                </h1>
                <p className="text-gray-600">
                  Check and correct spelling in your text or documents
                </p>
              </div>
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Languages className="w-5 h-5" />
                <span>Language Detection</span>
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab('text')}
                    className={clsx(
                      'w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors',
                      activeTab === 'text'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    )}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Type className="w-5 h-5" />
                      Text Check
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('file')}
                    className={clsx(
                      'w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors',
                      activeTab === 'file'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    )}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <FileText className="w-5 h-5" />
                      File Upload
                    </div>
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'text' ? <TextCheck /> : <FileCheck />}
              </div>
            </div>
          </div>
        </div>

        {/* Language Detection Sidebar */}
        <div
          className={clsx(
            'fixed inset-y-0 right-0 bg-white shadow-xl transition-transform duration-300 transform w-96 z-50',
            isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={clsx(
              'absolute top-1/2 -translate-y-1/2 -left-8 bg-blue-500 text-white p-2 rounded-l-lg shadow-lg transition-colors hover:bg-blue-600',
              !isSidebarOpen && 'left-auto right-0 rounded-r-lg rounded-l-none'
            )}
          >
            {isSidebarOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
          
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Languages className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-semibold text-gray-900">Language Detection</h2>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <LanguageCheck />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;