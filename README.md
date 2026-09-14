Bio-Exam AI Client (생명과학 임용고시 AI 학습 및 복습 플랫폼)
🛠 기술 스택
Core: React, TypeScript (Strict Mode)

Bundler: Vite

Styling: Tailwind CSS

Routing: React Router DOM

HTTP Client: Axios

💡 아키텍처 및 전역 상태 관리를 배제한 이유
컴포넌트 지역 상태(Local State) 활용: 시험 풀기(ExamPage)와 오답 노트/복습(ReviewPage) 페이지는 각각 독립된 생명주기와 폼 입력 상태(userAnswers, currentPage)를 가집니다. 애플리케이션의 데이터 흐름이 단방향으로 명확하고 컴포넌트 트리 깊이가 깊지 않아, Redux나 Zustand 같은 무거운 전역 상태 관리 라이브러리를 배제했습니다.

불필요한 보일러플레이트 제거: 전역 스토어 설정에 소모되는 비용을 없애고, React 내장 훅(useState, useRef)과 부모-자식 간 props 전달만으로 폼 입력 및 페이지네이션 상태를 직관적으로 제어하여 유지보수성과 번들 사이즈를 최적화했습니다.

✨ 주요 구현 및 UX 최적화
모바일/태블릿 터치 제스처 최적화: 태블릿 브라우저 환경에서 가로 스와이프 시 브라우저 기본 히스토리(뒤로가기/앞으로가기)로 튀는 현상을 막기 위해 CSS touch-action: pan-y 및 커스텀 터치 이벤트 리스너를 구현하여 세로 스크롤은 허용하고 가로 페이지 슬라이드 조작만 매끄럽게 처리했습니다.

단일 문항 즉시 채점 UX: 일괄 제출 방식뿐만 아니라, 복습 페이지에서 문항별로 즉시 답안을 수정하고 백엔드 AI 재채점을 호출하여 실시간으로 정오답 여부와 모범 답안, AI 피드백을 확인할 수 있도록 비동기 인터페이스를 구축했습니다.
