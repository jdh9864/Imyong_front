// src/pages/ReviewPage.tsx
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { examApi } from '../api/examApi';

// ==========================================
// 1. 타입 정의
// ==========================================
export type GenerationType = 'CHAPTER' | 'ALL_PROBLEMS';

export interface DomainItem {
  domainId: string;
  majorCategory: string;
  domainName: string; 
}

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
  aiFeedback: string | Record<string, unknown>; 
}

export interface ProblemReviewResponse {
  requestedDomainId: string;
  isFallbackToAll: boolean;
  problems: ReviewProblem[];
}

export const DOMAIN_LIST: DomainItem[] = [
  // 1권. 세포학, 생화학
  { domainId: '6a7188a99e7407e1a69315e2', majorCategory: '1권. 세포학, 생화학', domainName: '1. 세포의 구성 물질' },
  { domainId: '6a7188a99e7407e1a69315e3', majorCategory: '1권. 세포학, 생화학', domainName: '2. 효소' },
  { domainId: '6a7188a99e7407e1a69315e4', majorCategory: '1권. 세포학, 생화학', domainName: '3. 세포의 구조와 기능' },
  { domainId: '6a7188a99e7407e1a69315e5', majorCategory: '1권. 세포학, 생화학', domainName: '4. 생체 에너지론' },
  { domainId: '6a7188a99e7407e1a69315e6', majorCategory: '1권. 세포학, 생화학', domainName: '5. 광합성' },
  { domainId: '6a7188a99e7407e1a69315e7', majorCategory: '1권. 세포학, 생화학', domainName: '6. 세포 호흡과 당질의 생합성' },
  { domainId: '6a7188a99e7407e1a69315e8', majorCategory: '1권. 세포학, 생화학', domainName: '7. 그 밖의 물질 대사' },
  { domainId: '6a7188a99e7407e1a69315e9', majorCategory: '1권. 세포학, 생화학', domainName: '8. 세포의 수송 기작' },

  // 2권. 분자생물학
  { domainId: '6a7188a99e7407e1a69315ea', majorCategory: '2권. 분자생물학', domainName: '1. 핵산의 물리화학적 특성' },
  { domainId: '6a7188a99e7407e1a69315eb', majorCategory: '2권. 분자생물학', domainName: '2. DNA 복제와 유전자 발현' },
  { domainId: '6a7188a99e7407e1a69315ec', majorCategory: '2권. 분자생물학', domainName: '3. 유전자 발현 조절' },
  { domainId: '6a7188a99e7407e1a69315ed', majorCategory: '2권. 분자생물학', domainName: '4. 돌연변이와 수복 기작' },
  { domainId: '6a7188a99e7407e1a69315ee', majorCategory: '2권. 분자생물학', domainName: '5. 분자생물학 실험 방법' },

  // 3권. 유전학, 분류학, 미생물학
  { domainId: '6a7188a99e7407e1a69315ef', majorCategory: '3권. 유전학, 분류학, 미생물학', domainName: '1. 전달 유전학' },
  { domainId: '6a7188a99e7407e1a69315f0', majorCategory: '3권. 유전학, 분류학, 미생물학', domainName: '2. 집단 유전학 및 진화학' },
  { domainId: '6a7188a99e7407e1a69315f1', majorCategory: '3권. 유전학, 분류학, 미생물학', domainName: '3. 분류학' },
  { domainId: '6a7188a99e7407e1a69315f2', majorCategory: '3권. 유전학, 분류학, 미생물학', domainName: '4. 미생물학' },

  // 4권. 동물생리학
  { domainId: '6a7188a99e7407e1a69315f3', majorCategory: '4권. 동물생리학', domainName: '1. 신호 전달과 내분비계' },
  { domainId: '6a7188a99e7407e1a69315f4', majorCategory: '4권. 동물생리학', domainName: '2. 신경 세포와 신경계' },
  { domainId: '6a7188a99e7407e1a69315f5', majorCategory: '4권. 동물생리학', domainName: '3. 감각계와 근육 생리학' },
  { domainId: '6a7188a99e7407e1a69315f6', majorCategory: '4권. 동물생리학', domainName: '4. 순환계' },
  { domainId: '6a7188a99e7407e1a69315f7', majorCategory: '4권. 동물생리학', domainName: '5. 호흡계' },
  { domainId: '6a7188a99e7407e1a69315f8', majorCategory: '4권. 동물생리학', domainName: '6. 소화계' },
  { domainId: '6a7188a99e7407e1a69315f9', majorCategory: '4권. 동물생리학', domainName: '7. 배설계' },

  // 5권. 면역학, 발생학
  { domainId: '6a7188a99e7407e1a69315fa', majorCategory: '5권. 면역학, 발생학', domainName: '1. 면역학' },
  { domainId: '6a7188a99e7407e1a69315fb', majorCategory: '5권. 면역학, 발생학', domainName: '2. 세포 분열 및 암' },
  { domainId: '6a7188a99e7407e1a69315fc', majorCategory: '5권. 면역학, 발생학', domainName: '3. 생식과 발생' },

  // 6권. 식물학, 생리학
  { domainId: '6a7188a99e7407e1a69315fd', majorCategory: '6권. 식물학, 생리학', domainName: '1. 식물의 생식과 발달' },
  { domainId: '6a7188a99e7407e1a69315fe', majorCategory: '6권. 식물학, 생리학', domainName: '2. 식물 생리학' },
  { domainId: '6a7188a99e7407e1a69315ff', majorCategory: '6권. 식물학, 생리학', domainName: '3. 생태학' },
];

const customScrollbar = "[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-400/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-400/40";

export default function ReviewPage() {
  const navigate = useNavigate();

  // 반응형 상태 관리 (모바일 여부 체크)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [generationType, setGenerationType] = useState<GenerationType>('CHAPTER');
  const [selectedDomainId, setSelectedDomainId] = useState<string>('');

  const [reviewData, setReviewData] = useState<ProblemReviewResponse | null>(null);
  
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showResultForProblem, setShowResultForProblem] = useState<Record<string, boolean>>({});
  const [gradingLoading, setGradingLoading] = useState<Record<string, boolean>>({}); 

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isFetching, setIsFetching] = useState(false);

  const touchStartXRef = useRef<number | null>(null);
  const categories = Array.from(new Set(DOMAIN_LIST.map((item) => item.majorCategory)));

  // 모바일은 1문제, 태블릿/PC는 2문제
  const problemsPerPage = isMobile ? 1 : 2;

  const pagesArray = [];
  if (reviewData) {
    for (let i = 0; i < reviewData.problems.length; i += problemsPerPage) {
      pagesArray.push(reviewData.problems.slice(i, i + problemsPerPage));
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
    if (touchStartXRef.current === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartXRef.current - touchEndX;
    const minSwipeDistance = 50; 

    if (diffX > minSwipeDistance) {
      if (currentPage > 0) {
        setCurrentPage((prev) => prev - 1);
      }
    } else if (diffX < -minSwipeDistance) {
      if (!reviewData) {
        navigate('/');
      } else if (currentPage < totalPages - 1) {
        setCurrentPage((prev) => prev + 1);
      } else if (currentPage === totalPages - 1) {
        navigate('/');
      }
    }
    touchStartXRef.current = null;
  };

  const handleFetchProblems = async () => {
    if (generationType === 'CHAPTER' && !selectedDomainId) {
      alert('조회할 단원을 선택해 주십시오.');
      return;
    }

    setIsFetching(true);
    try {
      const res: ProblemReviewResponse = await examApi.getReviewProblems(
        generationType === 'CHAPTER' ? selectedDomainId : undefined
      );
      
      setReviewData(res);
      setCurrentPage(0);
      setShowResultForProblem({});
      
      const initialAnswers: Record<string, string> = {};
      res.problems.forEach(p => {
        initialAnswers[p.problemId] = p.userAnswer || '';
      });
      setUserAnswers(initialAnswers);
      
      // 모바일 환경일 경우 문제 조회 완료 시 사이드바 닫기
      if (isMobile) setIsMobileSidebarOpen(false);

    } catch (error) {
      console.error('오답노트 조회 실패:', error);
      alert('문제 조회에 실패했습니다. 서버 연결 상태를 확인해주세요.');
    } finally {
      setIsFetching(false);
    }
  };

  const handleAnswerChange = (problemId: string, value: string) => {
    setUserAnswers((prev) => ({ ...prev, [problemId]: value }));
  };

  const handleGradeProblem = async (problemId: string) => {
    const answer = userAnswers[problemId] || '';
    if (!answer.trim()) {
      alert('작성된 답안이 없습니다.');
      return;
    }

    setGradingLoading((prev) => ({ ...prev, [problemId]: true }));
    try {
      const updatedProblem = await examApi.gradeSingleProblem(problemId, answer);

      setReviewData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          problems: prev.problems.map((p) => 
            p.problemId === problemId ? updatedProblem : p
          ),
        };
      });

      setShowResultForProblem((prev) => ({ ...prev, [problemId]: true }));
    } catch (error) {
      console.error('단일 문제 재채점 실패:', error);
      alert('AI 재채점 처리 중 오류가 발생했습니다.');
    } finally {
      setGradingLoading((prev) => ({ ...prev, [problemId]: false }));
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#F2F8FF] relative overflow-hidden">
      
      {/* 모바일 백그라운드 오버레이 */}
      {isMobile && isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* 좌측 사이드바 영역 */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 flex flex-col justify-between 
        w-[80%] max-w-[320px] md:w-72 bg-white md:bg-white/10 shadow-2xl md:shadow-sm border-r border-slate-200/50 p-6 md:backdrop-blur-sm overflow-y-auto 
        transition-transform duration-300 ease-in-out ${customScrollbar}
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg text-slate-800">조회 유형</h2>
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
              <span>단원별 조회</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer text-sm font-semibold text-slate-700 hover:text-slate-900">
              <input
                type="radio"
                name="generationType"
                value="ALL_PROBLEMS"
                checked={generationType === 'ALL_PROBLEMS'}
                onChange={() => {
                  setGenerationType('ALL_PROBLEMS');
                  setSelectedDomainId('');
                }}
                className="accent-blue-600 h-4 w-4 cursor-pointer"
              />
              <span>전체 문제 조회</span>
            </label>
          </div>

          {generationType === 'CHAPTER' && (
            <div className="space-y-4 pt-4 border-t border-slate-200/60">
              <h3 className="font-bold text-sm text-slate-800 mb-2">조회 범위 선택</h3>
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
                          onChange={() => setSelectedDomainId(item.domainId)}
                          className="accent-blue-600 h-3.5 w-3.5 cursor-pointer"
                        />
                        <span className="truncate">{item.domainName}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {(generationType === 'ALL_PROBLEMS' || selectedDomainId !== '') && (
          <div className="pt-4 mt-6 border-t border-slate-200/60 flex-shrink-0">
            <button
              onClick={handleFetchProblems}
              disabled={isFetching}
              className="w-full px-6 py-3 md:py-2 bg-blue-600 text-white rounded-lg font-bold cursor-pointer hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isFetching ? '조회 중...' : '문제 조회'}
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
        {/* 모바일 상단 헤더 */}
        {isMobile && (
          <div className="flex items-center p-4 bg-white border-b border-slate-200 shadow-sm shrink-0 z-10">
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg mr-3"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </button>
            <h1 className="font-bold text-lg text-slate-800">
              문제 복습
            </h1>
          </div>
        )}

        <div className="flex-1 p-4 md:p-8 flex flex-col overflow-hidden relative">
          {!reviewData ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 font-medium px-4 text-center">
              <p>좌측 패널(또는 메뉴)에서 설정을 완료한 후<br/>[문제 조회] 버튼을 눌러주십시오.</p>
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
                        {/* 모바일 1열, 태블릿 2열 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 h-full">
                          {pageProblems.map((problem, idx) => {
                            const actualProblemNumber = pageIndex * problemsPerPage + idx + 1;
                            const isGraded = showResultForProblem[problem.problemId];
                            const isLoadingThis = gradingLoading[problem.problemId];

                            return (
                              <div key={problem.problemId} className="bg-white p-5 md:p-8 rounded-xl shadow-sm border border-slate-200 flex flex-col h-fit">
                                
                                <div className="mb-4 md:mb-6 flex justify-between items-center">
                                  <div className="flex items-center gap-2 md:gap-3">
                                    <h3 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight">{actualProblemNumber}번 문제</h3>
                                    
                                    {isGraded && (
                                      <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-extrabold tracking-wide border ${
                                        problem.isCorrect 
                                          ? 'bg-green-50 text-green-700 border-green-200' 
                                          : 'bg-red-50 text-red-700 border-red-200'
                                      }`}>
                                        {problem.isCorrect ? '정답' : '오답'}
                                      </span>
                                    )}
                                  </div>
                                  
                                  {/* 단일 문제 AI 채점 요청 버튼 */}
                                  {!isGraded && (
                                    <button 
                                      onClick={() => handleGradeProblem(problem.problemId)}
                                      disabled={isLoadingThis}
                                      className="px-3 md:px-4 py-1.5 bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 font-bold rounded-lg text-xs md:text-sm transition-colors cursor-pointer disabled:opacity-50"
                                    >
                                      {isLoadingThis ? '채점 중...' : '채점'}
                                    </button>
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
                                    className={`w-full h-28 md:h-32 p-3 md:p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm transition-all shadow-inner ${customScrollbar} ${
                                      isGraded
                                        ? 'bg-slate-50 border-slate-200 text-slate-600 opacity-90 cursor-not-allowed' 
                                        : 'bg-[#F8FAFC] border-slate-200 focus:bg-white text-slate-800'
                                    }`}
                                    placeholder="답안을 서술하십시오."
                                    disabled={isGraded}
                                  />
                                </div>

                                {/* 채점 완료 후 보여지는 AI 피드백 및 모범 답안 */}
                                {isGraded && (
                                  <div className="mt-4 flex flex-col gap-3 select-text">
                                    {problem.referenceAnswer && (
                                      <div className="p-3 md:p-4 bg-slate-50 border border-slate-200 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                          <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                          <label className="text-xs font-bold text-slate-700">모범 답안</label>
                                        </div>
                                        <p className="text-xs md:text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
                                          {problem.referenceAnswer}
                                        </p>
                                      </div>
                                    )}

                                    {problem.aiFeedback && (
                                      <div className="p-3 md:p-4 bg-blue-50/50 border border-blue-100 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                          <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                          <label className="text-xs md:text-sm font-bold text-blue-900">AI 피드백</label>
                                        </div>
                                        <p className="text-xs md:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                                          {typeof problem.aiFeedback === 'string' 
                                            ? problem.aiFeedback 
                                            : JSON.stringify(problem.aiFeedback, null, 2)}
                                        </p>
                                      </div>
                                    )}
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

              {/* 하단 페이지네이션 컨트롤 */}
              <div className="mt-2 md:mt-4 pt-4 flex items-center justify-center relative flex-shrink-0">
                <div className="flex gap-4 md:gap-6">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                    disabled={currentPage === 0}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-600 text-white flex items-center justify-center disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors shadow-md cursor-pointer"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                  </button>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
                    disabled={currentPage >= totalPages - 1}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-600 text-white flex items-center justify-center disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors shadow-md cursor-pointer"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>
      </main>
    </div>
  );
}