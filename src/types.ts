export interface SpellCheckResult {
  word: string;
  is_correct: boolean;
  suggestions: string[];
}

export interface FileCheckResponse {
  corrections_count: number;
  download_url: string;
}

export interface ApiError {
  message: string;
  status: number;
}