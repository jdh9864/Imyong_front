// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ExamPage from './pages/ExamPage';
import ReviewPage from './pages/ReviewPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 메인: 문제 출제 설정 + 문제 풀이 + 한 페이지 채점/AI피드백 */}
        <Route path="/" element={<ExamPage />} />
        
        {/* 복습: 저장된 문제 & 틀린 문제 조회 */}
        <Route path="/review" element={<ReviewPage />} />
      </Routes>
    </BrowserRouter>
  );
}