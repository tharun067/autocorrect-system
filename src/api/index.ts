import axios from 'axios';
import { SpellCheckResult, FileCheckResponse } from '../types';

const API_BASE_URL = 'http://localhost:8000';

export async function checkText(text: string): Promise<{ results: SpellCheckResult[] }> {
  const response = await axios.post(`${API_BASE_URL}/check-text`, { text });
  return response.data;
}

export async function checkFile(file: File): Promise<FileCheckResponse> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axios.post(`${API_BASE_URL}/check-file`, formData);
  return response.data;
}