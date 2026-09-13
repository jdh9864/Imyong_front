// src/pages/ExamPage.tsx
// src/pages/ExamPage.tsx
import { useState, useEffect } from 'react';
import { examApi } from '../api/examApi';
import type { 
  ExamGenerateRequest, 
  ExamGenerateResponse, 
  ExamSubmitRequest, 
  ExamSubmitResponse 
} from '../types/exam';

export interface DomainItem {
  domainId: string;
  majorCategory: string;
  domainName: string; 
}

export const DOMAIN_LIST: DomainItem[] = [
  // 1권. 세포학, 생화학 (8개)
  { domainId: '6a7188a99e7407e1a69315e2', majorCategory: '1권. 세포학, 생화학', domainName: '1. 세포의 구성 물질' },
  { domainId: '6a7188a99e7407e1a69315e3', majorCategory: '1권. 세포학, 생화학', domainName: '2. 효소' },
  { domainId: '6a7188a99e7407e1a69315e4', majorCategory: '1권. 세포학, 생화학', domainName: '3. 세포의 구조와 기능' },
  { domainId: '6a7188a99e7407e1a69315e5', majorCategory: '1권. 세포학, 생화학', domainName: '4. 생체 에너지론' },
  { domainId: '6a7188a99e7407e1a69315e6', majorCategory: '1권. 세포학, 생화학', domainName: '5. 광합성' },
  { domainId: '6a7188a99e7407e1a69315e7', majorCategory: '1권. 세포학, 생화학', domainName: '6. 세포 호흡과 당질의 생합성' },
  { domainId: '6a7188a99e7407e1a69315e8', majorCategory: '1권. 세포학, 생화학', domainName: '7. 그 밖의 물질 대사' },
  { domainId: '6a7188a99e7407e1a69315e9', majorCategory: '1권. 세포학, 생화학', domainName: '8. 세포의 수송 기작' },

  // 2권. 분자생물학 (5개)
  { domainId: '6a7188a99e7407e1a69315ea', majorCategory: '2권. 분자생물학', domainName: '1. 핵산의 물리화학적 특성' },
  { domainId: '6a7188a99e7407e1a69315eb', majorCategory: '2권. 분자생물학', domainName: '2. DNA 복제와 유전자 발현' },
  { domainId: '6a7188a99e7407e1a69315ec', majorCategory: '2권. 분자생물학', domainName: '3. 유전자 발현 조절' },
  { domainId: '6a7188a99e7407e1a69315ed', majorCategory: '2권. 분자생물학', domainName: '4. 돌연변이와 수복 기작' },
  { domainId: '6a7188a99e7407e1a69315ee', majorCategory: '2권. 분자생물학', domainName: '5. 분자생물학 실험 방법' },

  // 3권. 유전학, 분류학, 미생물학 (4개)
  { domainId: '6a7188a99e7407e1a69315ef', majorCategory: '3권. 유전학, 분류학, 미생물학', domainName: '1. 전달 유전학' },
  { domainId: '6a7188a99e7407e1a69315f0', majorCategory: '3권. 유전학, 분류학, 미생물학', domainName: '2. 집단 유전학 및 진화학' },
  { domainId: '6a7188a99e7407e1a69315f1', majorCategory: '3권. 유전학, 분류학, 미생물학', domainName: '3. 분류학' },
  { domainId: '6a7188a99e7407e1a69315f2', majorCategory: '3권. 유전학, 분류학, 미생물학', domainName: '4. 미생물학' },

  // 4권. 동물생리학 (7개)
  { domainId: '6a7188a99e7407e1a69315f3', majorCategory: '4권. 동물생리학', domainName: '1. 신호 전달과 내분비계' },
  { domainId: '6a7188a99e7407e1a69315f4', majorCategory: '4권. 동물생리학', domainName: '2. 신경 세포와 신경계' },
  { domainId: '6a7188a99e7407e1a69315f5', majorCategory: '4권. 동물생리학', domainName: '3. 감각계와 근육 생리학' },
  { domainId: '6a7188a99e7407e1a69315f6', majorCategory: '4권. 동물생리학', domainName: '4. 순환계' },
  { domainId: '6a7188a99e7407e1a69315f7', majorCategory: '4권. 동물생리학', domainName: '5. 호흡계' },
  { domainId: '6a7188a99e7407e1a69315f8', majorCategory: '4권. 동물생리학', domainName: '6. 소화계' },
  { domainId: '6a7188a99e7407e1a69315f9', majorCategory: '4권. 동물생리학', domainName: '7. 배설계' },

  // 5권. 면역학, 발생학 (3개)
  { domainId: '6a7188a99e7407e1a69315fa', majorCategory: '5권. 면역학, 발생학', domainName: '1. 면역학' },
  { domainId: '6a7188a99e7407e1a69315fb', majorCategory: '5권. 면역학, 발생학', domainName: '2. 세포 분열 및 암' },
  { domainId: '6a7188a99e7407e1a69315fc', majorCategory: '5권. 면역학, 발생학', domainName: '3. 생식과 발생' },

  // 6권. 식물학, 생리학 (3개)
  { domainId: '6a7188a99e7407e1a69315fd', majorCategory: '6권. 식물학, 생리학', domainName: '1. 식물의 생식과 발달' },
  { domainId: '6a7188a99e7407e1a69315fe', majorCategory: '6권. 식물학, 생리학', domainName: '2. 식물 생리학' },
  { domainId: '6a7188a99e7407e1a69315ff', majorCategory: '6권. 식물학, 생리학', domainName: '3. 생태학' },
];

// 사이드바, 메인 영역, 텍스트에어리어에 공통 적용할 커스텀 스크롤바 CSS 클래스
const customScrollbar = "[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-400/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-400/40";

export default function ExamPage() {
  const [step, setStep] = useState<'SOLVING' | 'RESULT'>('SOLVING');
  const [generationType, setGenerationType] = useState<'CHAPTER' | 'MOCK_EXAM'>('CHAPTER');
  
  const [selectedDomainId, setSelectedDomainId] = useState<string>('');
  const [selectedDomainName, setSelectedDomainName] = useState<string>('');
  
  // 단원별 풀기 출제 문항 수 상태 (기본 5개)
  const [problemCount, setProblemCount] = useState<number>(5);

  const [examData, setExamData] = useState<ExamGenerateResponse | null>(null);
  const [resultData, setResultData] = useState<ExamSubmitResponse | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  
  const [currentPage, setCurrentPage] = useState<number>(0);
  const problemsPerPage = 2;

  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return () => {};
  }, []);

  const categories = Array.from(new Set(DOMAIN_LIST.map((item) => item.majorCategory)));

  const handleGenerate = async () => {
    if (generationType === 'CHAPTER' && !selectedDomainId) {
      alert('출제할 단원을 선택해 주십시오.');
      return;
    }

    setIsGenerating(true);
    try {
      const payload: ExamGenerateRequest = {
        generationType,
        domainId: generationType === 'CHAPTER' ? selectedDomainId : undefined,
        domainName: generationType === 'CHAPTER' ? selectedDomainName : undefined,
        problemCount: generationType === 'CHAPTER' ? problemCount : undefined, // 동적 문항 수 연동
      };

      const res = await examApi.generateExam(payload);
      setExamData(res);
      setUserAnswers({});
      setCurrentPage(0);
      setStep('SOLVING');
    } catch (error) {
      console.error('시험 생성 실패:', error);
      alert('시험지 생성에 실패했습니다. 서버 연결 상태를 확인해주세요.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerChange = (problemId: string, value: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [problemId]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!examData) return;
    setIsLoading(true);

    try {
      const payload: ExamSubmitRequest = {
        examId: examData.examId,
        answers: Object.entries(userAnswers).map(([problemId, userAnswer]) => ({
          problemId,
          userAnswer,
        })),
      };

      const { jobId } = await examApi.submitExamAsync(payload);

      const pollInterval = setInterval(async () => {
        try {
          const statusRes = await examApi.getSubmitStatus(jobId);

          if (statusRes.status === 'COMPLETED') {
            clearInterval(pollInterval);
            const finalResult = await examApi.getSubmitResult(jobId);
            
            setResultData(finalResult);
            setStep('RESULT');
            setCurrentPage(0);
            setIsLoading(false);
          } else if (statusRes.status === 'FAILED') {
            clearInterval(pollInterval);
            alert('AI 채점 처리 중 오류가 발생했습니다.');
            setIsLoading(false);
          }
        } catch (pollError) {
          console.error('상태 조회 실패:', pollError);
          clearInterval(pollInterval);
          alert('채점 상태를 확인하는 중 네트워크 오류가 발생했습니다.');
          setIsLoading(false);
        }
      }, 3000);

    } catch (error) {
      console.error('채점 접수 요청 실패:', error);
      alert('채점 요청 접수 중 오류가 발생했습니다.');
      setIsLoading(false);
    }
  };

  const totalPages = examData ? Math.ceil(examData.problems.length / problemsPerPage) : 0;
  const currentProblems = examData 
    ? examData.problems.slice(currentPage * problemsPerPage, (currentPage + 1) * problemsPerPage) 
    : [];

  return (
    <div className="flex h-screen bg-[#F2F8FF]">
      {/* 좌측 사이드바 영역 */}
      <aside className={`w-72 bg-white/10 shadow-sm border-r border-slate-200/50 p-6 backdrop-blur-sm overflow-y-auto flex flex-col justify-between ${customScrollbar}`}>
        <div>
          <h2 className="font-bold text-lg mb-4 text-slate-800">출제 유형</h2>

          <div className="space-y-2 mb-6">
            <label className="flex items-center gap-2.5 cursor-pointer text-sm font-semibold text-slate-700 hover:text-slate-900">
              <input
                type="radio"
                name="generationType"
                value="CHAPTER"
                checked={generationType === 'CHAPTER'}
                onChange={() => setGenerationType('CHAPTER')}
                className="accent-blue-600 h-4 w-4 cursor-pointer"
              />
              <span>단원별 풀기</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer text-sm font-semibold text-slate-700 hover:text-slate-900">
              <input
                type="radio"
                name="generationType"
                value="MOCK_EXAM"
                checked={generationType === 'MOCK_EXAM'}
                onChange={() => {
                  setGenerationType('MOCK_EXAM');
                  setSelectedDomainId('');
                  setSelectedDomainName('');
                }}
                className="accent-blue-600 h-4 w-4 cursor-pointer"
              />
              <span>실전 모의고사</span>
            </label>
          </div>

          {generationType === 'CHAPTER' && (
            <div className="space-y-4 pt-4 border-t border-slate-200/60">
              <h3 className="font-bold text-sm text-slate-800 mb-2">출제 범위 선택</h3>
              {categories.map((category) => (
                <div key={category}>
                  <h4 className="text-xs font-semibold text-slate-500 mb-2">{category}</h4>
                  <div className="space-y-1.5 pl-2 border-l border-slate-200">
                    {DOMAIN_LIST.filter((item) => item.majorCategory === category).map((item) => (
                      <label
                        key={item.domainId}
                        className="flex items-center gap-2 cursor-pointer text-sm text-slate-700 hover:text-blue-600 py-0.5"
                      >
                        <input
                          type="radio"
                          name="domainSelect"
                          value={item.domainId}
                          checked={selectedDomainId === item.domainId}
                          onChange={() => {
                            setSelectedDomainId(item.domainId);
                            setSelectedDomainName(item.domainName);
                          }}
                          className="accent-blue-600 h-3.5 w-3.5 cursor-pointer"
                        />
                        <span className="truncate">{item.domainName}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              {/* 출제 문항 수 선택 드롭다운 */}
              <div className="pt-4 mt-4 border-t border-slate-200/60">
                <h3 className="font-bold text-sm text-slate-800 mb-2">출제 문항 수</h3>
                <select
                  value={problemCount}
                  onChange={(e) => setProblemCount(Number(e.target.value))}
                  className="w-full p-2 border border-slate-200/60 rounded-lg text-sm text-slate-700 bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {Array.from({ length: 15 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>{num}문제</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* 출제 버튼 영역 */}
        {(generationType === 'MOCK_EXAM' || selectedDomainId !== '') && (
          <div className="pt-4 mt-6 border-t border-slate-200/60 flex-shrink-0">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg font-bold cursor-pointer hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isGenerating ? '출제 중...' : '새로운 문제 출제'}
            </button>
          </div>
        )}
      </aside>

      {/* 우측 메인 영역 (커스텀 스크롤바 적용) */}
      <main className={`flex-1 p-8 overflow-y-auto relative flex flex-col ${customScrollbar}`}>
        {!examData ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 font-medium">
            <p>좌측 패널에서 출제 설정을 완료한 후 출제 버튼을 눌러주십시오.</p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            
            {step === 'RESULT' && resultData && (
              <div className="mb-6 px-6 py-4 bg-white border border-blue-200 rounded-xl flex items-center justify-between shadow-sm">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">채점 완료</h2>
                  <p className="text-sm text-slate-500 mt-1">작성된 답안에 대한 AI 피드백이 하단에 생성되었습니다.</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-slate-500 mr-2">총점:</span>
                  <span className="text-3xl font-extrabold text-blue-600">{resultData.obtainedScore}</span>
                  <span className="text-lg font-bold text-slate-400"> / {resultData.totalScore} 점</span>
                </div>
              </div>
            )}

            {isLoading && step === 'SOLVING' && (
              <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl">
                <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                <p className="text-lg font-bold text-slate-800">AI 채점 진행 중...</p>
                <p className="text-sm text-slate-500 mt-2">시간이 다소 소요될 수 있습니다. (최대 5분)</p>
              </div>
            )}

            <div className="flex-1 grid grid-cols-2 gap-8 relative z-0">
              {currentProblems.map((problem, index) => {
                const actualProblemNumber = currentPage * problemsPerPage + index + 1;
                const resultInfo = step === 'RESULT' && resultData?.results 
                  ? resultData.results.find(r => r.problemId === problem.problemId) 
                  : null;

                return (
                  <div key={problem.problemId} className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 flex flex-col">
                    
                    <div className="mb-6 flex justify-between items-center">
                      <h3 className="text-xl font-bold text-slate-800 tracking-tight">{actualProblemNumber}번 문제</h3>
                      {step === 'RESULT' && resultInfo && (
                        <span className={`px-4 py-1.5 rounded-full text-sm font-bold tracking-wide ${
                          resultInfo.isCorrect 
                            ? 'bg-green-50 text-green-700 border border-green-200' 
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          {resultInfo.isCorrect ? '정답' : '오답'} ({resultInfo.score ?? 0}점)
                        </span>
                      )}
                    </div>
                    
                    <div className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed flex-1">
                      {problem.content || problem.title}
                    </div>

                    {/* 내 답안 텍스트에어리어 (커스텀 스크롤바 적용) */}
                    <div className="mt-8 border-t border-slate-100 pt-6">
                      <label className="block text-base font-bold text-slate-800 mb-3">내 답안</label>
                      <textarea
                        value={userAnswers[problem.problemId] || ''}
                        onChange={(e) => handleAnswerChange(problem.problemId, e.target.value)}
                        disabled={step === 'RESULT' || isLoading}
                        className={`w-full h-32 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm transition-all shadow-inner ${customScrollbar} ${
                          step === 'RESULT' || isLoading
                            ? 'bg-slate-50 border-slate-200 text-slate-600 opacity-90 cursor-not-allowed' 
                            : 'bg-[#F8FAFC] border-slate-200 focus:bg-white text-slate-800'
                        }`}
                        placeholder="답안을 서술하십시오."
                      />
                    </div>

                    {step === 'RESULT' && resultInfo && resultInfo.aiFeedback && (
                      <div className="mt-4 p-5 bg-blue-50/50 border border-blue-100 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                          <label className="text-sm font-bold text-blue-900">AI 피드백</label>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                          {typeof resultInfo.aiFeedback === 'string' 
                            ? resultInfo.aiFeedback 
                            : JSON.stringify(resultInfo.aiFeedback, null, 2)}
                        </p>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>

            <div className="mt-8 pt-4 flex items-center justify-center relative">
              <div className="flex gap-6">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                  disabled={currentPage === 0 || isLoading}
                  className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors shadow-md"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={currentPage >= totalPages - 1 || isLoading}
                  className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors shadow-md"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              </div>

              {step === 'SOLVING' && (
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="absolute right-0 px-10 py-3 bg-blue-600 text-white rounded-lg font-extrabold text-base cursor-pointer hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-md tracking-wider"
                >
                  {isLoading ? '채점 중...' : '제 출'}
                </button>
              )}
            </div>

          </div>
        )}
      </main>
    </div>
  );
}