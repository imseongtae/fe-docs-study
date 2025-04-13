# Adding Search and Pagination

## Table of contents
1. [](#)

---

## 정리
> 이번 장에서는 Next.js에서 검색과 페이지네이션을 URL search params 기반으로 구현하는 방법을 학습
> - 클라이언트에서 검색어 입력 시 URL을 갱신하고, 서버에서는 이 URL을 바탕으로 데이터를 필터링함
> - 상태를 URL에 저장하기 때문에 북마크나 공유가 가능하며, 서버 사이드 렌더링과도 자연스럽게 연결됨
> - 마지막으로 디바운싱을 도입해 불필요한 요청을 줄이는 최적화까지 더함

### 목표
- /dashboard/invoices 페이지에 검색(Search) 및 페이지네이션(Pagination) 기능 추가
- URL search params를 활용해 상태 관리
- 서버에서 데이터 fetch, 클라이언트에서 URL 변경

## 구현 단계 요약

### 1. 사용자 입력 감지 (Search 컴포넌트)
- `<input>`에서 onChange 이벤트 발생 시 handleSearch() 호출
- 입력된 검색어(term)를 URLSearchParams에 반영
- `router.replace()`를 통해 URL을 업데이트 (페이지 새로고침 없이)

### 2. URL - Input 필드 동기화
•	`<input defaultValue={searchParams.get('query')?.toString()} />`
•	`defaultValue` 사용: `input` 자체 상태로 관리 (uncontrolled)

### 3. 검색어 기반 서버 데이터 
`fetch (/page.tsx)`
- 서버 컴포넌트에서는 searchParams prop을 통해 query 값 파싱
- query, page 값을 기반으로 Table, Pagination 컴포넌트에 전달

```tsx
const query = searchParams?.query || '';
const currentPage = Number(searchParams?.page) || 1;
```

### 4. Table 컴포넌트에서 데이터 가져오기
- 서버에서 fetchFilteredInvoices(query, currentPage)로 데이터 필터링 후 렌더링
- 검색/페이지 정보가 바뀔 때마다 서버에서 새롭게 렌더링됨

### 5. Pagination 컴포넌트 구현
- 서버에서 fetchInvoicesPages(query)로 총 페이지 수 계산
- 클라이언트 컴포넌트에서 currentPage를 URL에서 파싱
- 페이지 이동 시 URLSearchParams 수정 → 링크로 처리

```tsx
const createPageURL = (pageNumber: number) => {
  const params = new URLSearchParams(searchParams);
  params.set('page', pageNumber.toString());
  return `${pathname}?${params.toString()}`;
};
```
