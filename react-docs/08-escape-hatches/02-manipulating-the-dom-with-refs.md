# Manipulating the DOM with Refs

```plaintext
💬 원문:  
React automatically updates the DOM to match your render output, so your components won’t often need to manipulate it.  
However, sometimes you might need access to the DOM elements managed by React—for example, to focus a node, scroll to it, or measure its size and position.  
There is no built-in way to do those things in React, so you will need a ref to the DOM node.  

---

📝 한글 번역:  
React는 컴포넌트의 렌더링 결과에 맞게 DOM을 자동으로 업데이트하므로, DOM을 직접 조작할 일은 흔치 않습니다.  
하지만 간혹 React가 관리하는 DOM 요소에 접근해야 할 때가 있습니다. 예를 들어 어떤 노드에 포커스를 맞추거나, 해당 위치로 스크롤하거나, 크기나 위치를 측정해야 할 때가 그렇습니다.  
이러한 작업을 위해서는 React에 내장된 기능이 없기 때문에 ref를 사용해야 합니다.  
```

> React는 렌더 출력에 따라 자동으로 DOM을 업데이트하므로 대부분의 경우 DOM을 직접 조작할 필요가 없지만, **특정 경우(포커스 설정, 스크롤 이동, 위치 측정 등)에는 DOM 노드에 접근할 필요**가 있으며, 이럴 때 ref를 사용함

> ### You will learn
> - How to access a DOM node managed by React with the ref attribute
> - How the ref JSX attribute relates to the useRef Hook
> - How to access another component’s DOM node
> - In which cases it’s safe to modify the DOM managed by React

## Table of contents
1. [Getting a ref to the node](#1-getting-a-ref-to-the-node)
1. [Accessing another component’s DOM nodes](#2-accessing-another-components-dom-nodes)
1. [When React attaches the refs](#3-when-react-attaches-the-refs)
1. [Best practices for DOM manipulation with refs](#4-best-practices-for-dom-manipulation-with-refs)
1. [Recap](#recap)
1. [Challenges](#challenges)

---


## 1. Getting a ref to the node
💡 핵심 표현
> 💬 원문:  
> “The useRef Hook returns an object with a single property called current.”  
> 📝 한글 번역:  
> `useRef` 훅은 `current`라는 단일 속성을 가진 객체를 반환합니다.  

> 💬 원문:  
> “React will put a reference to this node into myRef.current.”  
> 📝 한글 번역:  
> React는 이 노드의 참조를 `myRef.current`에 저장합니다.  
  
### 요약
- `useRef()`를 사용해 참조 객체를 생성하고, JSX에서 `ref` 속성으로 전달하면 해당 DOM 노드를 참조할 수 있음
- 참조된 DOM 노드는 `.current` 속성에 저장됨
- 이벤트 핸들러나 효과(Effect) 내부에서 `.current`를 활용해 DOM API를 사용할 수 있음

### 질문과 답변
Q1. useRef()는 언제 사용하나요?  
A1. DOM 요소에 직접 접근하거나, 상태처럼 렌더링에 영향을 주지 않는 데이터를 저장할 때 사용함

Q2. ref.current는 언제 값을 갖게 되나요?  
A2. 컴포넌트가 마운트된 후 DOM이 생성되는 “commit” 단계에서 설정됩니다. 초기에는 null임  

Q3. 이벤트 핸들러 외에 ref를 사용할 수 있는 방법은?  
A3. useEffect에서 접근하거나, 특정 DOM 작업을 위해 flushSync를 사용할 수 있음  


### 1. Example: Focusing a text input

### 1. Example: Scrolling to an element

---

## 2. Accessing another component’s DOM nodes
> 다른 컴포넌트의 DOM 노드에 접근하기 🤔

💡 핵심 표현
> 💬 원문:  
> “You can pass `refs` from parent component to child components just like any other prop.”  
> 📝 한글 번역:  
> 부모 컴포넌트는 다른 prop처럼 `ref`를 자식 컴포넌트에 전달할 수 있습니다.  

> 💬 원문:  
> “However, this also lets the parent component do something else–for example, change its CSS styles.”  
> 📝 한글 번역:  
> 하지만 이로 인해 부모 컴포넌트가 다른 작업, 예를 들어 CSS 스타일을 변경하는 것도 가능해집니다.  

> 💬 원문:  
> “You can do that with `useImperativeHandle`”  
> 📝 한글 번역:  
> `useImperativeHandle`을 사용하면 이를 제어할 수 있습니다.  

### 요약
- 부모 컴포넌트는 자식 컴포넌트에 `ref`를 prop처럼 전달할 수 있음
- 단, 자식 컴포넌트가 직접 DOM 노드를 반환하지 않으면, ref는 자식 자체를 참조하지 않기 때문에 DOM에 접근할 수 없음
- 일반 DOM 요소 (`<input>` 등)는 React가 `ref`를 자동으로 연결하지만, 사용자 정의 컴포넌트는 그렇지 않기 때문에 명시적인 전달이 필요함
- 더 정밀한 제어가 필요할 경우 useImperativeHandle을 통해 ref에 노출할 기능을 제한할 수 있음


### 예시 코드 
기본 예시 코드 (부모에서 `ref` 전달):
```jsx
import { useRef } from 'react';

function MyInput({ ref }) {
  return <input ref={ref} />;
}

function MyForm() {
  const inputRef = useRef(null);
  return <MyInput ref={inputRef} />
}
```

### 질문과 답변
Q1. 자식 컴포넌트에 ref를 전달하면 어떤 일이 일어나나요?  
A1. 자식이 DOM 요소를 직접 반환하거나, `forwardRef`로 감싸야 부모에서 ref를 통해 DOM에 접근할 수 있음  

Q2. useImperativeHandle은 언제 사용하나요?  
A2. 부모가 **자식의 DOM을 직접 제어하는 것을 제한하고 싶을 때**, 원하는 기능만 노출하기 위해 사용함  

Q3. forwardRef 없이 사용자 정의 컴포넌트에 ref를 전달하면 어떻게 되나요?  
A3. ref는 undefined가 되며, React는 경고를 출력할 수 있습니다. 반드시 `forwardRef`가 필요함  

✅ 참고: React 18 이후로는 함수형 컴포넌트에 ref를 전달하려면 `forwardRef`를 사용해야 함

---

## 3. When React attaches the refs
> React가 ref를 연결하는 시점은 언제일까? 🤔

💡 핵심 표현  
> 💬 원문:  
> “React sets ref.current during the commit.”  
> 📝 한글 번역:  
> React는 커밋 단계에서 ref.current 값을 설정합니다.  

> 💬 원문:  
> “Usually, you will access refs from event handlers.”  
> 📝 한글 번역:  
> 일반적으로 ref는 이벤트 핸들러에서 접근합니다.  

> 💬 원문:  
> “If you want to do something with a ref, but there is no particular event to do it in, you might need an Effect.”  
> 📝 한글 번역:  
> 특정 이벤트 없이 ref를 사용해야 할 경우, Effect가 필요할 수 있습니다.  

### 요약
- React는 컴포넌트를 렌더링할 때 두 단계로 작업함: render → commit
- `ref`는 commit 단계에서 연결됨
- 즉, 렌더링 중에는 DOM 노드가 아직 생성되지 않았기 때문에 `ref.current`는 `null` 임
- 일반적으로 `ref`는 이벤트 핸들러나 useEffect 안에서 사용하는 것이 안전함

### 예시 코드 
DOM이 아직 반영되지 않아 `.lastChild`가 기대한 결과를 주지 않을 때:
```jsx
setTodos([ ...todos, newTodo ]);
listRef.current.lastChild.scrollIntoView();
```

> 위 코드는 렌더링 이전에 DOM 접근을 시도하므로, 새로 추가된 항목이 반영되기 전 상태에서 스크롤함  

✅ 해결법: `flushSync`로 강제로 동기 렌더링
```jsx
import { flushSync } from 'react-dom';

flushSync(() => {
  setTodos([ ...todos, newTodo ]);
});
listRef.current.lastChild.scrollIntoView();
```


### 질문과 답변
Q1. ref는 언제 null이고 언제 DOM 노드를 가리키나요?  
A1. 렌더링 중에는 null이며, commit 단계에서 DOM 노드가 만들어지면 current가 채워짐  

Q2. 왜 flushSync가 필요한가요?  
A2. 상태 업데이트 후 DOM이 반영되기 전에는 DOM 접근이 불완전합니다. flushSync를 사용하면 즉시 반영시켜줄 수 있음  

Q3. 렌더 함수 안에서 ref.current를 사용하는 것은 안전한가요?  
A3. 아닙니다. 렌더링 중에는 DOM이 아직 존재하지 않으므로 ref는 사용할 수 없음  

---

## 4. Best practices for DOM manipulation with refs
> Refs를 활용한 DOM 조작의 모범 사례 🤔

💡 핵심 표현
> 💬 원문:  
> “Refs are an escape hatch. You should only use them when you have to ‘step outside React’.”  
> 📝 한글 번역:  
> ref는 비상구입니다. React의 체계를 벗어나야 할 때만 사용해야 합니다.  

> 💬 원문:  
> “Avoid changing DOM nodes managed by React.”  
> 📝 한글 번역:  
> React가 관리하는 DOM 노드를 직접 수정하는 것은 피해야 합니다.  

> 💬 원문:  
> “If you do modify DOM nodes managed by React, modify parts that React has no reason to update.”  
> 📝 한글 번역:  
> 부득이하게 DOM을 수정해야 한다면, React가 업데이트하지 않는 영역만 수정해야 합니다.  

### 요약
- `ref`는 React가 관리하지 않는 DOM 요소에 대해 직접 조작이 필요할 때 사용하는 **“escape hatch(비상구)”** 임
- 일반적으로는 **포커스, 스크롤, 크기 측정과 같이 비파괴적인(non-destructive) 작업**에만 사용해야 함
- 반면, **DOM 요소를 직접 삭제하거나 수정하는 작업은 React의 렌더 트리와 충돌**할 수 있으므로, **크래시나 예기치 않은 동작**을 유발할 수 있음

### 예시 코드 
잘못된 접근, React 외부에서 강제로 DOM 제거
```jsx
ref.current.remove();
```

> 위 코드처럼 DOM을 수동으로 제거하면 React가 나중에 동일한 DOM 노드를 다시 참조하려고 할 때 충돌이 발생함

✅ 해결법: 조건부 렌더링
```jsx
{show && <p ref={ref}>Hello world</p>}
```

조건부 렌더링을 통해 상태로 제어해야지, DOM API를 직접 호출해 제거하는 방식은 위험함

### 질문과 답변
Q1. 어떤 경우에 `ref`를 쓰는 것이 적절한가요?  
A1. 포커스 제어, 스크롤 이동, 요소 측정, 비디오 재생 등 React가 제공하지 않는 브라우저 API를 쓸 때 적절함  

Q2. `ref`로 DOM을 직접 수정하면 왜 위험한가요?  
A2. React는 가상 DOM을 기준으로 변경사항을 추적하므로, 외부에서 DOM을 변경하면 React의 예상과 불일치가 발생해 렌더링 오류로 이어질 수 있음  

Q3. React가 관리하지 않는 DOM 부분이란 무엇인가요?  
A3. JSX에서 항상 빈 `<div />`처럼 React가 내부 구조에 관심이 없는 DOM 노드를 의미함  

---

## Recap
📝 한글 번역:  
- Ref는 일반적인 개념이지만, 대부분의 경우 DOM 엘리먼트를 보관하는 데 사용함
- `<div ref={myRef}>`를 전달하여 React가 DOM 노드를 `myRef.current`에 넣도록 지시함
- 일반적으로 `ref`는 포커스 맞추기, 스크롤, DOM 요소 측정과 같은 비파괴적인 동작에 사용함
- 컴포넌트는 기본적으로 DOM 노드를 노출하지 않음. `ref` 프로퍼티를 사용하여 DOM 노드를 노출하도록 선택할 수 있음
- React가 관리하는 DOM 노드를 변경하지 않기
- React가 관리하는 DOM 노드를 수정해야 한다면, React가 업데이트할 이유가 없는 부분을 수정하기

> 💬 원문:  
- Refs are a generic concept, but most often you’ll use them to hold DOM elements.
- You instruct React to put a DOM node into `myRef.current` by passing `<div ref={myRef}>`.
- Usually, you will use `refs` for non-destructive actions like focusing, scrolling, or measuring DOM elements.
- A component doesn’t expose its DOM nodes by default. You can opt into exposing a DOM node by using the `ref` prop.
- Avoid changing DOM nodes managed by React.
- If you do modify DOM nodes managed by React, modify parts that React has no reason to update.

---

## Challenges

### 주요 학습 포인트  
- DOM 조작을 위해 ref를 사용하는 방법 익히기
- React의 상태 업데이트와 DOM 반영 사이의 타이밍 이해
- useRef, flushSync, scrollIntoView(), focus() 등 실제 활용법 학습
- 컴포넌트 간에 ref를 전달하고 사용할 수 있는 구조 설계 연습

- Play and pause the video: video 요소에 ref 연결 후 play/pause 호출
- Focus the search field: 버튼 클릭으로 input에 포커스
- Scrolling an image carousel: 선택된 이미지로 부드럽게 스크롤
- Forwarding refs: 자식 컴포넌트에 ref 전달하여 제어

### 1. Play and pause the video
버튼이 재생 중인지 일시정지 중인지 상태를 바꾸기는 하지만, 실제로 영상이 재생되거나 멈추지는 않음  
`<video>` DOM 요소에 `play()` 및 `pause()` 메서드를 호출하도록 `ref`를 추가하기

#### 학습 포인트 및 출제 의도
- `ref`를 활용해 DOM API (`video.play()`, `video.pause()`)에 접근하는 법
- 상태와 실제 DOM 동작 간의 동기화
- 브라우저 기본 컨트롤과 React 상태 간의 이벤트 처리 방법 학습

**💡 해결 방법**:
- `useRef`로 video 요소에 `ref` 설정
- `onClick` 핸들러에서 `isPlaying` 상태 변경
- 상태에 따라 `ref.current.play()` 또는 `pause()` 호출
- 추가로 `onPlay`, `onPause` 핸들러를 video에 부착하여 브라우저 컨트롤 사용 시 상태 유지

```jsx
const ref = useRef(null);

function handleClick() {
  const nextIsPlaying = !isPlaying;
  setIsPlaying(nextIsPlaying);

  if (nextIsPlaying) {
    ref.current.play();
  } else {
    ref.current.pause();
  }
}

<video
  ref={ref}
  onPlay={() => setIsPlaying(true)}
  onPause={() => setIsPlaying(false)}
/>
```

### 2. Focus the search field
`Search` 버튼을 클릭했을 때 `input` 필드에 자동으로 포커스되도록 만들어보기

#### 학습 포인트 및 출제 의도
- `ref`를 통해 DOM 요소의 `focus()` 메서드를 직접 호출하는 법
- `useRef`의 기본 활용법
- 버튼 클릭 이벤트와 DOM 접근 연결

**💡 해결 방법**:
- `useRef`로 `input` 요소에 `ref` 생성
- 버튼 `onClick`에서 `inputRef.current.focus()` 호출

```jsx
const inputRef = useRef(null);

<button onClick={() => inputRef.current.focus()}>
  Search
</button>

<input ref={inputRef} placeholder="Looking for something?" />
```

### 3. Scrolling an image carousel
이미지 캐러셀에서 선택된 이미지로 스크롤 이동하기  
- `Next` 버튼을 눌렀을 때, 가로로 나열된 이미지 중 다음 이미지를 스크롤로 가운데에 위치하도록 옮기기

#### 학습 포인트 및 출제 의도
- 조건부로 `ref`를 특정 항목에만 부여하는 기법
- 상태 업데이트 직후 DOM 접근 문제 해결: `flushSync` 활용
- `scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })` 사용법

**💡 해결 방법**:
- `selectedRef`를 만들어 현재 선택된 이미지의 `<li>`에만 `ref` 부여
- `flushSync`로 상태를 먼저 DOM에 반영한 뒤 스크롤 호출

```jsx
const selectedRef = useRef(null);

<button onClick={() => {
  flushSync(() => setIndex((index + 1) % catList.length));
  selectedRef.current.scrollIntoView({ behavior: 'smooth', inline: 'center' });
}} />

<li ref={index === i ? selectedRef : null}> ... </li>
```

### 4. Focus the search field with separate components
Search 버튼과 SearchInput이 서로 다른 파일에 정의되어 있음  
버튼 클릭 시 SearchInput에 포커스되도록 만들어보기

#### 학습 포인트 및 출제 의도
- `forwardRef`를 사용하여 자식 컴포넌트에 `ref` 전달
- 부모에서 이벤트 핸들러를 관리하면서 `ref` 연결을 유지하는 설계
- 함수형 컴포넌트와 `ref`의 관계 이해

**💡 해결 방법**:
- `SearchInput`에서 `forwardRef`로 `ref`를 `<input>`에 전달
- `SearchButton`은 `onClick prop`을 받아 그대로 `<button>`에 연결
- 부모(`Page`) 컴포넌트에서 `ref` 생성 및 핸들러 연결

```jsx
// App.js
const inputRef = useRef(null);

<SearchButton onClick={() => inputRef.current.focus()} />
<SearchInput ref={inputRef} />

// SearchInput.js
const SearchInput = forwardRef((props, ref) => (
  <input ref={ref} placeholder="Looking for something?" />
));
```
