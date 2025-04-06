# Streaming

## Table of contents
1. [Static Rendering](#1-static-rendering)
1. [Dynamic Rendering](#2-dynamic-rendering)

---

## 1. Streaming이란?

Streaming은 데이터를 “한 꺼번에”가 아닌, “조각 단위로 나눠서 점진적으로” 서버에서 클라이언트로 전송하는 기술  
- 페이지 전체가 렌더링될 때까지 기다릴 필요 없이, 준비된 부분부터 점진적으로 사용자에게 보여줄 수 있음

Streaming의 주요 이점
- 느린 데이터 요청이 있어도 전체 페이지 로딩이 지연되지 않음
- 빠르게 인터랙션 가능한 UI 제공 가능
- React의 컴포넌트 모델과 잘 맞물림

## 2. Streaming 구현 방법

### 1. 페이지 단위 Streaming
- `/app/dashboard/loading.tsx` 파일을 생성하면, 해당 페이지 로딩 시 보여줄 fallback UI를 정의할 수 있음
- 이 파일은 React Suspense 위에서 동작
- 페이지 내 일부 컴포넌트는 먼저 렌더링되고, 나머지 컴포넌트는 나중에 데이터를 받아온 후 보여짐

```tsx
// 기본 로딩 UI
export default function Loading() {
  return <div>Loading...</div>;
}
```

- 더 나은 UX를 위해 단순한 텍스트 대신 로딩 스켈레톤 컴포넌트로 대체하는 것이 일반적

### 2. 컴포넌트 단위 Streaming (React Suspense)
- `<Suspense>`를 사용하여 특정 컴포넌트만 개별적으로 지연 로딩 가능
- fallback을 통해 데이터를 기다리는 동안 보여줄 UI 설정

```tsx
<Suspense fallback={<RevenueChartSkeleton />}>
  <RevenueChart />
</Suspense>
```

- 이 방식은 특정 컴포넌트가 느릴 때도 페이지 전체가 블로킹되지 않게 해 줌

## 3. Route Group으로 Streaming 범위 제어
- loading.tsx는 폴더 단위로 작동하기 때문에 하위 경로에도 적용됨.
- 이를 방지하려면 **Route Group(/(groupName))**을 사용하여 범위를 좁힐 수 있음.

```bash
📁 /dashboard
  └── 📁 /(overview)
      ├── loading.tsx  ← 여기서만 적용됨
      └── page.tsx
```

괄호 폴더 (overview)는 URL에 반영되지 않음


### Loading Skeleton이란?
- 데이터를 기다리는 동안 보여줄 간략한 UI 구조
- ex) 박스, 텍스트 블럭 등으로 구성된 시각적 자리표시자
- 사용자에게 컨텐츠가 곧 로딩될 것이라는 피드백 제공


### CardWrapper처럼 그룹으로 Suspense 걸기
- 여러 카드 컴포넌트를 개별 Suspense로 감싸면 화면이 들쑥날쑥 튈 수 있음
- 이럴 땐 그룹 컴포넌트를 만들어 한꺼번에 Suspense 처리:

```tsx
<Suspense fallback={<CardsSkeleton />}>
  <CardWrapper />
</Suspense>
```

### Suspense 경계 위치 결정 기준
1. 사용자에게 어떤 흐름으로 보여줄 것인지 고려
2. 데이터 의존성 여부 고려
3. 우선 렌더링할 요소는 위로, 느린 요소는 아래로
