# State: A Component's Memory


> ### You will learn (학습 목표)
> - What rendering means in React
> - When and why React renders a component
> - The steps involved in displaying a component on screen
> - Why rendering does not always produce a DOM update


## Table of contents

1. [일반 변수로 충분하지 않은 경우](#1-일반-변수로-충분하지-않은-경우)
2. [State 변수 추가하기](#2-state-변수-추가하기)
3. [컴포넌트에 여러 State 변수 지정하기](#3-컴포넌트에-여러-state-변수-지정하기)
4. [State는 격리되고 비공개로 유지됩니다](#4-state는-격리되고-비공개로-유지됩니다)

---

## 1. 일반 변수로 충분하지 않은 경우

### 1단계: 렌더링 트리거

#### 초기 렌더링
- React 앱은 `createRoot`와 `.render()` 호출로 시작 렌더링이 트리거됨.

```js
const root = createRoot(document.getElementById('root'));
root.render(<Image />);
```

#### State 업데이트 시 리렌더링
- `setState`를 호출하면 렌더가 자동으로 큐에 등록됨.
- 예: 사용자가 다른 UI 요소를 요청하는 것처럼 상태 변화가 리렌더링을 트리거.

---

## 2. State 변수 추가하기

### 2단계: React 컴포넌트 렌더링

#### 렌더링이란?
- React가 컴포넌트를 호출하여 화면에 무엇을 보여줄지 결정하는 것.

#### 호출 과정
- 최초 렌더: 최상위 컴포넌트를 호출
- 이후 렌더: 상태 변경이 일어난 컴포넌트부터 호출
- 컴포넌트가 다른 컴포넌트를 반환하면 재귀적으로 렌더링 수행

#### 순수함수 요건
- 같은 입력 → 같은 출력 (예측 가능성 확보)
- 사이드 이펙트 없어야 함 (외부 변수 수정 금지)

---

## 3. 컴포넌트에 여러 State 변수 지정하기

### 3단계: React가 DOM에 변경사항을 커밋

#### DOM 조작 방식
- 초기 렌더: `appendChild()`로 DOM 추가
- 이후 렌더: 이전 결과와 비교해 필요한 부분만 변경

#### 예시
- `<input>`처럼 변화가 없는 부분은 유지됨
- 새로운 값만 DOM에 반영됨 (최소 변경)

---

## 4. State는 격리되고 비공개로 유지됩니다

### 에필로그: 브라우저 페인트

- React가 DOM 변경 후, 브라우저가 이를 화면에 렌더링함
- 이 과정을 "페인트(Paint)"라고 표현

---

### 요약

- React 화면 갱신은 세 단계로 이루어짐:
  1. Trigger (트리거)
  2. Render (렌더)
  3. Commit (커밋)
- Strict Mode를 통해 순수하지 않은 함수 탐지 가능
- 이전과 동일한 렌더링 결과면 DOM을 변경하지 않음

