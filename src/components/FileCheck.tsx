import React, { useState } from 'react';
import { Upload, Download, AlertCircle } from 'lucide-react';
import { FileCheckResponse } from '../types';
import { checkFile } from '../api';

interface FileCheckProps {
  className?: string;
}

export function FileCheck({ className }: FileCheckProps) {
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState<FileCheckResponse | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setResponse(null);
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const result = await checkFile(file);
      setResponse(result);
    } catch (err) {
      setError('Failed to process file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={className}>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <input
          type="file"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
          accept=".txt,.doc,.docx"
          disabled={isUploading}
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center gap-4"
        >
          <Upload className="w-12 h-12 text-gray-400" />
          <div>
            <p className="text-lg font-medium text-gray-700">
              {file ? file.name : 'Choose a file'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              or drag and drop it here
            </p>
          </div>
        </label>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      )}

      <button
        onClick={handleFileUpload}
        disabled={!file || isUploading}
        className="mt-6 w-full bg-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {isUploading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Upload className="w-5 h-5" />
            Upload & Check
          </>
        )}
      </button>

      {response && (
        <div className="mt-8 p-6 bg-green-50 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800 mb-4">
            File processed successfully!
          </h3>
          <p className="text-green-700 mb-4">
            Found and corrected {response.corrections_count} issues.
          </p>
          <a
            href={`http://localhost:8000${response.download_url}`}
            download
            className="inline-flex items-center gap-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            Download Corrected File
          </a>
        </div>
      )}
    </div>
  );
}