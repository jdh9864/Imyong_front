// src/pages/ExamPage.tsx
import { useState } from 'react';
import { examApi } from '../api/examApi';
import type { ExamGenerateResponse, ExamSubmitResponse } from '../types/exam';

export default function ReviewPage() {
  // 화면 단계를 제어하는 단일 상태: 'SOLVING' (풀이 중) | 'RESULT' (채점 및 AI 피드백)
  const [step, setStep] = useState<'SOLVING' | 'RESULT'>('SOLVING');
  
  // API 응답 데이터 저장
  const [examData, setExamData] = useState<ExamGenerateResponse | null>(null);
  const [resultData, setResultData] = useState<ExamSubmitResponse | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // 제출 버튼 클릭 시 동일 페이지에서 채점 상태로 전환
  const handleSubmit = async () => {
    if (!examData) return;
    setIsLoading(true);

    try {
      const submitPayload = {
        examId: examData.examId,
        answers: Object.entries(userAnswers).map(([problemId, userAnswer]) => ({
          problemId,
          userAnswer,
        })),
      };

      const res = await examApi.submitExam(submitPayload);
      setResultData(res);
      setStep('RESULT'); // 새로고침/페이지 이동 없이 결과 뷰로 전환!
    } catch (error) {
      console.error('채점 요청 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* 좌측 사이드바: 출제 범위/유형 선택 (이미지 1 좌측 레이아웃) */}
      <aside className="w-64 bg-white border-r p-6">
        <h2 className="font-bold text-lg mb-4">출제 유형</h2>
        {/* 사이드바 컨트롤들 */}
      </aside>

      {/* 우측 메인 영역 */}
      <main className="flex-1 p-8 overflow-y-auto">
        {step === 'SOLVING' ? (
          /* [1] 문제 풀이 뷰 (타이머 + 문제 카드 + 내 답안 작성 폼) */
          <div>
            {/* 문제 영역 */}
            <button 
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold"
            >
              {isLoading ? '채점 및 AI 피드백 생성 중...' : '제출'}
            </button>
          </div>
        ) : (
          /* [2] 채점 완료 뷰 (정답 여부 + 점수 + Gemini AI 피드백 표시) */
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">채점 결과 ({resultData?.obtainedScore}점)</h2>
              <button 
                onClick={() => setStep('SOLVING')} 
                className="px-4 py-2 border rounded-lg"
              >
                다시 풀기
              </button>
            </div>
            {/* 문제별 O/X 카드 및 AI 피드백 마크다운 출력 */}
          </div>
        )}
      </main>
    </div>
  );
}