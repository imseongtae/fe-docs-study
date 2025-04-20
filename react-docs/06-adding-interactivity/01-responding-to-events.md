# Responding to Events


> ### You will learn (학습 목표)
> - Different ways to write an event handler
> - How to pass event handling logic from a parent component
> - How events propagate and how to stop them

## Table of contents

1. [이벤트 핸들러 추가하기](#1-이벤트-핸들러-추가하기)
1. [이벤트 전파](#2-이벤트-전파)
1. [이벤트 핸들러가 사이드 이펙트를 가질 수도 있나요?](#3-이벤트-핸들러가-사이드-이펙트를-가질-수도-있나요)
1. [요약](#4-요약)

---

## 1. 이벤트 핸들러 추가하기

```jsx
export default function Button() {
  function handleClick() {
    alert('You clicked me!');
  }

  return (
    <button onClick={handleClick}>
      Click me
    </button>
  );
}
```

1. Button 컴포넌트 내부에 handleClick 함수를 선언
1. 해당 함수 내부 로직을 구현. (이번에는 메시지를 표시하기 위해 alert 사용)
1. `<button>` JSX에 onClick={handleClick}을 추가

> 주의: `onClick={handleClick()}` 처럼 함수를 호출하면 렌더링 시 즉시 실행됨

### 이벤트 핸들러 내에서 Prop 읽기
- 이벤트 핸들러는 컴포넌트 내부에 선언되므로 props 접근 가능

```jsx
function AlertButton({ message }) {
  return <button onClick={() => alert(message)}>...</button>;
}
```

### 이벤트 핸들러를 Prop으로 전달하기
- 부모 컴포넌트에서 이벤트 핸들러를 자식에 prop으로 전달

```jsx
function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

### 이벤트 핸들러 Prop 명명하기
- onSmash, onPlayMovie처럼 앱 맥락에 맞는 이름으로 prop 명명 가능
- 하지만 HTML 요소에는 onClick, onChange 등 브라우저 이벤트명을 사용해야 함

> 이벤트 핸들러에 적절한 HTML 태그를 사용하고 있는지 확인하세요. 예를 들어 클릭을 처리하기 위해서는 `<div onClick={handleClick}>` 대신 `<button onClick={handleClick}>`을 사용하세요. 실제 브라우저에서 `<button>`은 키보드 내비게이션과 같은 빌트인 브라우저 동작을 활성화 합니다. 만일 버튼의 기본 브라우저 스타일링이 싫어서 링크나 다른 UI 요소처럼 보이도록 하고 싶다면 CSS를 통해 그 목적을 이룰 수 있습니다. 접근성을 위한 마크업 작성법에 대해 더 알아보세요.

- [HTML: 접근성의 좋은 기반](https://developer.mozilla.org/ko/docs/Learn_web_development/Core/Accessibility/HTML)

## 2. 이벤트 전파
- 이벤트는 버블링(bubbling) 되어 부모 컴포넌트로 전파됨
- 자식 → 부모 순서로 핸들러가 실행됨
- 예: `<div onClick>`과 `<button onClick>`이 함께 있을 때 둘 다 실행됨

### 전파 멈추기
- 이벤트 객체 e 사용 → e.stopPropagation() 호출하여 전파 방지

```jsx
<button onClick={e => {
  e.stopPropagation();
  onClick();
}}>
```

### 전파의 대안으로 핸들러를 전달하기
- 자식 컴포넌트에서 onClick() 호출 구조로 명시적으로 전달
- 전파에 의존하지 않고, 코드 흐름을 명확하게 제어 가능

### 기본 동작 방지하기
- 일부 브라우저 이벤트(예: form submit)는 기본 동작 존재
- e.preventDefault() 호출로 기본 동작 차단

```jsx
<form onSubmit={e => {
  e.preventDefault();
  alert('Submitting!');
}}>
```


## 3. 이벤트 핸들러가 사이드 이펙트를 가질 수도 있나요?
- 가능함
- 이벤트 핸들러는 순수 함수일 필요 없음 → 상태 변경 등의 사이드 이펙트 수행 가능
- 상태 관리(state)를 통해 정보 저장 가능 (다음 챕터에서 학습)


## 4. 요약
- 이벤트 핸들러는 함수이며 JSX에 prop으로 전달
- 호출이 아닌 함수 전달 필요
- 컴포넌트 내부에서 정의되므로 props 사용 가능
- 부모에서 자식으로 이벤트 핸들러 전달 가능
- 이벤트는 전파되며, stopPropagation과 preventDefault로 제어 가능
- 전파 대신 명시적 호출 방식도 고려할 수 있음
