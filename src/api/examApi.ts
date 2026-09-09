// src/api/examApi.ts
import axios from 'axios';
import type {
  ExamGenerateRequest,
  ExamGenerateResponse,
  ExamSubmitRequest,
  ExamSubmitResponse,
  ProblemReviewResponse,
} from '../types/exam';

// 1. Axios 기본 인스턴스 설정
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. API 호출 함수 모음
export const examApi = {
  /**
   * 시험 생성 API
   * POST /api/exams/generate
   */
  generateExam: async (request: ExamGenerateRequest): Promise<ExamGenerateResponse> => {
    const response = await apiClient.post<ExamGenerateResponse>('/api/exams/generate', request);
    return response.data;
  },

  /**
   * 답안 제출 및 채점 API
   * POST /api/exams/submit
   */
  submitExam: async (request: ExamSubmitRequest): Promise<ExamSubmitResponse> => {
    const response = await apiClient.post<ExamSubmitResponse>('/api/exams/submit', request);
    return response.data;
  },

  /**
   * 오답/복습 문제 조회 API
   * GET /api/problems/review
   * @param domainId (선택) 특정 단원의 오답만 볼 경우
   */
  getReviewProblems: async (domainId?: string): Promise<ProblemReviewResponse> => {
    const response = await apiClient.get<ProblemReviewResponse>('/api/problems/review', {
      params: domainId ? { domainId } : undefined, // domainId가 있으면 쿼리 파라미터로 추가
    });
    return response.data;
  },
};