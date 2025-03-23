# 05 Navigating Between Pages

## Table of contents


---

# 📘 Next.js에서의 클라이언트 사이드 내비게이션과 활성 링크 표시

## 1. 전체 내용 요약

### 전통적인 `<a>` 태그 vs. `<Link />` 컴포넌트
- `<a>` 태그는 전체 페이지를 새로 고침함 → UX 저하
- Next.js의 `<Link />`는 클라이언트 사이드 전환을 지원함
- 더 빠르고 부드러운 전환이 가능해짐

---

### 클라이언트 사이드 내비게이션이란?
- 전체 페이지가 아닌 필요한 JavaScript만 로드하여 화면 전환
- 초기 로딩은 서버에서 하되, 이후 전환은 클라이언트에서 처리

---

### 자동 Code-splitting & Prefetch
- **Code-splitting**: 페이지 단위로 JS 코드 분리 → 가볍고 빠름
- **Prefetch**: `<Link />`가 화면에 보이면 해당 경로의 JS 코드를 미리 비동기로 로딩
- 결과적으로 클릭 시 거의 즉시 이동 가능

---

### 현재 페이지 표시(Active Link)
- `usePathname()` 훅으로 현재 경로 확인
- `clsx`를 사용해 현재 경로와 일치할 때만 스타일 추가

```tsx
className={clsx(
  '공통 스타일',
  { '활성화 스타일': pathname === link.href }
)}
```