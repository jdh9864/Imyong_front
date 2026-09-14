// src/api/examApi.ts
import axios from 'axios';
import type {
  ExamGenerateRequest,
  ExamGenerateResponse,
  ExamSubmitRequest,
  ExamSubmitResponse,
  ProblemReviewResponse,
  ReviewProblem,
} from '../types/exam';

// 1. Axios 기본 인스턴스 설정 (비동기 처리 대기를 위해 60초 타임아웃 적용)
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 60000, 
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
   * 1. 비동기 답안 제출 접수 API (jobId 반환)
   * POST /api/exams/submit
   */
  submitExamAsync: async (request: ExamSubmitRequest): Promise<{ jobId: string }> => {
    const response = await apiClient.post<{ jobId: string }>('/api/exams/submit', request);
    return response.data;
  },

  /**
   * 2. 채점 진행 상태 조회 API
   * GET /api/exams/submit/status/{jobId}
   */
  getSubmitStatus: async (jobId: string): Promise<{ status: 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'NOT_FOUND' }> => {
    const response = await apiClient.get<{ status: 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'NOT_FOUND' }>(
      `/api/exams/submit/status/${jobId}`
    );
    return response.data;
  },

  /**
   * 3. 최종 채점 결과 조회 API
   * GET /api/exams/submit/result/{jobId}
   */
  getSubmitResult: async (jobId: string): Promise<ExamSubmitResponse> => {
    const response = await apiClient.get<ExamSubmitResponse>(`/api/exams/submit/result/${jobId}`);
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

  gradeSingleProblem: async (problemId: string, userAnswer: string): Promise<ReviewProblem> => {
    const response = await apiClient.post<ReviewProblem>('/api/problems/review/grade', {
      problemId,
      userAnswer,
    });
    return response.data;
  },
};