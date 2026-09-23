// src/pages/ExamPage.tsx
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

const customScrollbar = "[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-400/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-400/40";

export default function ExamPage() {
  const navigate = useNavigate();

  // 반응형 상태 관리 (모바일 여부 체크)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(true); // 모바일에서 처음 접속 시 열려있도록

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [step, setStep] = useState<'SOLVING' | 'RESULT'>('SOLVING');
  const [generationType, setGenerationType] = useState<'CHAPTER' | 'MOCK_EXAM'>('CHAPTER');

  const [selectedDomainId, setSelectedDomainId] = useState<string>('');
  const [selectedDomainName, setSelectedDomainName] = useState<string>('');

  const [problemCount, setProblemCount] = useState<number>(5);

  const [examData, setExamData] = useState<ExamGenerateResponse | null>(null);
  const [resultData, setResultData] = useState<ExamSubmitResponse | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const touchStartXRef = useRef<number | null>(null);
  const categories = Array.from(new Set(DOMAIN_LIST.map((item) => item.majorCategory)));

  // 모바일은 1문제, 태블릿/PC는 2문제
  const problemsPerPage = isMobile ? 1 : 2;

  const pagesArray = [];
  if (examData) {
    for (let i = 0; i < examData.problems.length; i += problemsPerPage) {
      pagesArray.push(examData.problems.slice(i, i + problemsPerPage));
    }
  }

  const totalPages = pagesArray.length;

  // 화면 리사이징 시 현재 페이지가 totalPages를 넘지 않도록 방어
  useEffect(() => {
    if (totalPages > 0 && currentPage >= totalPages) {
      setCurrentPage(totalPages - 1);
    }
  }, [totalPages, currentPage]);

  const handleTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'TEXTAREA' || target.closest('textarea')) {
      touchStartXRef.current = null;
      return;
    }
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || isLoading) return;

    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartXRef.current - touchEndX;
    const minSwipeDistance = 50; 

    if (diffX > minSwipeDistance) {
      if (!examData) {
        navigate('/review');
      } else if (currentPage < totalPages - 1) {
        setCurrentPage((prev) => prev + 1);
      } else if (currentPage === totalPages - 1) {
        navigate('/review');
      }
    } else if (diffX < -minSwipeDistance) {
      if (currentPage > 0) {
        setCurrentPage((prev) => prev - 1);
      }
    }
    touchStartXRef.current = null;
  };

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
        problemCount: generationType === 'CHAPTER' ? problemCount : undefined,
      };

      const res = await examApi.generateExam(payload);
      setExamData(res);
      setUserAnswers({});
      setCurrentPage(0);
      setStep('SOLVING');
      
      // 모바일 환경일 경우 문제 출제 완료 시 사이드바 닫기
      if (isMobile) setIsMobileSidebarOpen(false);

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

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#F2F8FF] relative overflow-hidden">
      
      {/* 모바일 백그라운드 오버레이 (사이드바 열렸을 때 뒷배경 흐리게) */}
      {isMobile && isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* 좌측 사이드바 영역 (모바일: Slide Over, 태블릿/PC: 고정) */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 flex flex-col justify-between 
        w-[80%] max-w-[320px] md:w-72 bg-white md:bg-white/10 shadow-2xl md:shadow-sm border-r border-slate-200/50 p-6 md:backdrop-blur-sm overflow-y-auto 
        transition-transform duration-300 ease-in-out ${customScrollbar}
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg text-slate-800">출제 유형</h2>
            {/* 모바일 닫기 버튼 */}
            {isMobile && (
              <button onClick={() => setIsMobileSidebarOpen(false)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            )}
          </div>

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

              <div className="pt-4 mt-4 border-t border-slate-200/60">
                <h3 className="font-bold text-sm text-slate-800 mb-2">출제 문항 수</h3>
                <select
                  value={problemCount}
                  onChange={(e) => setProblemCount(Number(e.target.value))}
                  className="w-full p-2 border border-slate-200/60 rounded-lg text-sm text-slate-700 bg-white md:bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {Array.from({ length: 15 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>{num}문제</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {(generationType === 'MOCK_EXAM' || selectedDomainId !== '') && (
          <div className="pt-4 mt-6 border-t border-slate-200/60 flex-shrink-0">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full px-6 py-3 md:py-2 bg-blue-600 text-white rounded-lg font-bold cursor-pointer hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isGenerating ? '출제 중...' : '새로운 문제 출제'}
            </button>
          </div>
        )}
      </aside>

      {/* 우측 메인 영역 */}
      <main 
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="flex-1 flex flex-col relative overflow-hidden select-none touch-pan-y"
      >
        {/* 모바일 상단 헤더 (사이드바 여는 햄버거 버튼) */}
        {isMobile && (
          <div className="flex items-center p-4 bg-white border-b border-slate-200 shadow-sm shrink-0 z-10">
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg mr-3"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </button>
            <h1 className="font-bold text-lg text-slate-800">
              {examData ? examData.title : '출제 설정'}
            </h1>
          </div>
        )}

        <div className="flex-1 p-4 md:p-8 flex flex-col overflow-hidden relative">
          {!examData ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 font-medium px-4 text-center">
              <p>좌측 패널(또는 메뉴)에서 출제 설정을 완료한 후<br/>출제 버튼을 눌러주십시오.</p>
              {isMobile && (
                <button 
                  onClick={() => setIsMobileSidebarOpen(true)}
                  className="mt-6 px-6 py-2 bg-blue-100 text-blue-600 font-bold rounded-full text-sm"
                >
                  메뉴 열기
                </button>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden">
              
              {step === 'RESULT' && resultData && (
                <div className="mb-4 md:mb-6 px-4 md:px-6 py-4 bg-white border border-blue-200 rounded-xl flex flex-col md:flex-row md:items-center justify-between shadow-sm flex-shrink-0 gap-3 md:gap-0">
                  <div>
                    <h2 className="text-lg md:text-xl font-bold text-slate-800">채점 완료</h2>
                    <p className="text-xs md:text-sm text-slate-500 mt-1">작성된 답안에 대한 AI 피드백이 하단에 생성되었습니다.</p>
                  </div>
                  <div className="text-left md:text-right">
                    <span className="text-sm font-bold text-slate-500 mr-2">총점:</span>
                    <span className="text-2xl md:text-3xl font-extrabold text-blue-600">{resultData.obtainedScore}</span>
                    <span className="text-base md:text-lg font-bold text-slate-400"> / {resultData.totalScore} 점</span>
                  </div>
                </div>
              )}

              {isLoading && step === 'SOLVING' && (
                <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl m-4 md:m-8">
                  <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                  <p className="text-lg font-bold text-slate-800">AI 채점 진행 중...</p>
                  <p className="text-sm text-slate-500 mt-2 text-center px-4">시간이 다소 소요될 수 있습니다.<br/>(최대 5분)</p>
                </div>
              )}

              {/* Transform 기반 슬라이더 트랙 */}
              <div className="flex-1 overflow-hidden relative">
                <div 
                  className="w-full h-full flex transition-transform duration-300 ease-out"
                  style={{ transform: `translateX(-${currentPage * 100}%)` }}
                >
                  {pagesArray.map((pageProblems, pageIndex) => (
                    <div 
                      key={pageIndex} 
                      className="w-full h-full flex-shrink-0 md:px-2 flex flex-col"
                    >
                      <div className={`flex-1 overflow-y-auto pb-4 ${customScrollbar}`}>
                        {/* 모바일은 1열, 태블릿은 2열 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 h-full">
                          {pageProblems.map((problem, idx) => {
                            const actualProblemNumber = pageIndex * problemsPerPage + idx + 1;
                            const resultInfo = step === 'RESULT' && resultData?.results 
                              ? resultData.results.find(r => r.problemId === problem.problemId) 
                              : null;

                            return (
                              <div key={problem.problemId} className="bg-white p-5 md:p-8 rounded-xl shadow-sm border border-slate-200 flex flex-col h-fit">
                                
                                <div className="mb-4 md:mb-6 flex justify-between items-center">
                                  <h3 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight">{actualProblemNumber}번 문제</h3>
                                  {step === 'RESULT' && resultInfo && (
                                    <span className={`px-3 md:px-4 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-bold tracking-wide ${
                                      resultInfo.isCorrect 
                                        ? 'bg-green-50 text-green-700 border border-green-200' 
                                        : 'bg-red-50 text-red-700 border border-red-200'
                                    }`}>
                                      {resultInfo.isCorrect ? '정답' : '오답'} ({resultInfo.score ?? 0}점)
                                    </span>
                                  )}
                                </div>
                                
                                <div className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed flex-1 select-text">
                                  {problem.content || problem.title}
                                </div>

                                <div className="mt-6 md:mt-8 border-t border-slate-100 pt-4 md:pt-6 select-text">
                                  <label className="block text-sm md:text-base font-bold text-slate-800 mb-2 md:mb-3">내 답안</label>
                                  <textarea
                                    value={userAnswers[problem.problemId] || ''}
                                    onChange={(e) => handleAnswerChange(problem.problemId, e.target.value)}
                                    disabled={step === 'RESULT' || isLoading}
                                    className={`w-full h-28 md:h-32 p-3 md:p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm transition-all shadow-inner ${customScrollbar} ${
                                      step === 'RESULT' || isLoading
                                        ? 'bg-slate-50 border-slate-200 text-slate-600 opacity-90 cursor-not-allowed' 
                                        : 'bg-[#F8FAFC] border-slate-200 focus:bg-white text-slate-800'
                                    }`}
                                    placeholder="답안을 서술하십시오."
                                  />
                                </div>

                                {step === 'RESULT' && resultInfo && resultInfo.aiFeedback && (
                                  <div className="mt-4 p-4 md:p-5 bg-blue-50/50 border border-blue-100 rounded-lg select-text">
                                    <div className="flex items-center gap-2 mb-2">
                                      <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                      <label className="text-xs md:text-sm font-bold text-blue-900">AI 피드백</label>
                                    </div>
                                    <p className="text-xs md:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
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
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 하단 페이지네이션 및 제출 컨트롤 */}
              <div className="mt-2 md:mt-4 pt-4 flex items-center justify-between md:justify-center relative flex-shrink-0">
                {/* 모바일에서는 중앙정렬을 위해 빈 div 추가, 데스크탑에선 무시됨 */}
                <div className="w-16 md:hidden"></div>

                <div className="flex gap-4 md:gap-6">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                    disabled={currentPage === 0 || isLoading}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-600 text-white flex items-center justify-center disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors shadow-md cursor-pointer"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                  </button>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
                    disabled={currentPage >= totalPages - 1 || isLoading}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-600 text-white flex items-center justify-center disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors shadow-md cursor-pointer"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                  </button>
                </div>

                {step === 'SOLVING' && (
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="w-20 md:w-auto md:absolute md:right-0 px-4 md:px-10 py-2.5 md:py-3 bg-blue-600 text-white rounded-lg font-extrabold text-sm md:text-base cursor-pointer hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-md md:tracking-wider"
                  >
                    {isLoading ? '채점' : '제출'}
                  </button>
                )}
                
                {step === 'RESULT' && <div className="w-20 md:hidden"></div>}
              </div>

            </div>
          )}
        </div>
      </main>
    </div>
  );
}