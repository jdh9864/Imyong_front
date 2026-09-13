// src/types/exam.ts

// 문제 생성 유형
export type GenerationType = 'CHAPTER' | 'MOCK_EXAM';

// 1. 문제 생성 요청 DTO
export interface ExamGenerateRequest {
  generationType: GenerationType;
  domainId?: string;
  domainName?: string; // 단원명 (예: 분자생물학)
  problemCount?: number;
}

// 문제 생성 응답 내 문제 항목
export interface GeneratedProblem {
  problemId: string;
  problemNumber: number;
  questionType: string;
  title: string;
  content: string;
  options: string[];
}

// 2. 문제 생성 응답 DTO
export interface ExamGenerateResponse {
  examId: string;
  title: string;
  generationType: GenerationType;
  problems: GeneratedProblem[];
}

// 제출 답안 항목
export interface SubmitAnswer {
  problemId: string;
  userAnswer: string;
}

// 3. 시험 제출 요청 DTO
export interface ExamSubmitRequest {
  examId: string;
  answers: SubmitAnswer[];
}

// 제출 결과 내 문제별 결과
export interface SubmitResult {
  problemId: string;
  problemNumber: number;
  score: number;
  isCorrect: boolean;
  aiFeedback: string; // Java Map<String, Object> 매핑
  missingKeywords: string[];
}

// 4. 시험 제출 응답 DTO
export interface ExamSubmitResponse {
  examId: string;
  totalScore: number;
  obtainedScore: number;
  isCompleted: boolean;
  submittedAt: string;
  results: SubmitResult[];
}

// 오답/복습 문제 항목
export interface ReviewProblem {
  problemId: string;
  domainId: string;
  problemNumber: number;
  questionType: string;
  title: string;
  content: string;
  referenceAnswer: string;
  userAnswer: string;
  isCorrect: boolean;
  aiFeedback: Record<string, unknown>;
}

// 5. 문제 복습/오답노트 응답 DTO
export interface ProblemReviewResponse {
  requestedDomainId: string;
  isFallbackToAll: boolean;
  problems: ReviewProblem[];
}