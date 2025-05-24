# Preserving and Resetting State

```plaintext
💬 원문:  
When you want a component to “remember” some information,  
but you don’t want that information to trigger new renders,  
you can use a ref.

---

📝 한글 번역:  
컴포넌트가 어떤 정보를 “기억”하길 원하지만,  
그 정보가 새로운 렌더링을 트리거하지 않길 원할 때, ref를 사용할 수 있습니다.
```

> 즉, 변경되더라도 컴포넌트를 다시 렌더링하지 않아도 되는 값을 저장하는 용도로 사용함

> ### You will learn
> - How to add a ref to your component
> - How to update a ref’s value
> - How refs are different from state
> - How to use refs safely

## Table of contents
1. [State is tied to a position in the render tree](#1-state-is-tied-to-a-position-in-the-render-tree)
1. [Adding a ref to your component](#1-adding-a-ref-to-your-component)
1. [Example: Building a Stopwatch](#2-example-building-a-stopwatch)
1. [Differences between refs and state](#3-differences-between-refs-and-state)
1. [When to use refs](#4-when-to-use-refs)
1. [Best practices for refs](#5-best-practices-for-refs)
1. [Refs and the DOM](#6-refs-and-the-dom)
1. [Recap](#recap)
1. [Challenges](#challenges)

---

## 1. Adding a ref to your component
💡 핵심 표현
> 💬 원문:  
> “It’s like a secret pocket of your component that React doesn’t track.”  
> 📝 한글 번역:  
> React가 추적하지 않는 컴포넌트의 비밀 주머니 같은 것입니다.  

### 예시 코드
useRef 훅을 React로부터 import하여 컴포넌트에 ref를 추가할 수 있음:
```jsx
import { useRef } from 'react';
const ref = useRef(0);
```

- `useRef`는 `{ current: 0 }`과 같은 객체를 반환함  
- `ref.current`로 현재 값을 읽거나 수정할 수 있으며, 이 값은 React가 추적하지 않기 때문에 변경되어도 컴포넌트가 다시 렌더링되지 않음

> 즉, `ref`는 React의 단방향 데이터 흐름에서 벗어날 수 있는 “비밀 포켓”과 같은 역할을 함

```jsx
import { useRef } from 'react';

export default function Counter() {
  const ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('You clicked ' + ref.current + ' times!');
  }

  return <button onClick={handleClick}>Click me!</button>;
}
```

### 요약
- `ref`는 숫자뿐 아니라 문자열, 객체, 함수 등 어떤 것이든 참조할 수 있음
- `ref`는 상태(`state`)처럼 렌더링 간 값을 유지하지만, 값이 변경되어도 렌더링을 유발하지 않음
  - `useRef` 훅은 `{ current: ... }` 객체를 반환하며, 이를 통해 React가 렌더링과 무관한 값을 기억하게 할 수 있음
  - `ref`는 `{ current: value }` 형태의 객체를 반환함
  - `ref.current`는 수정 가능한 값임

---

## 2. Example: building a Stopwatch
💡 핵심 표현
> 💬 원문:  
> “Since the interval ID is not used for rendering, you can keep it in a ref.”  
> 📝 한글 번역:  
> interval ID는 렌더링에 사용되지 않으므로, ref에 저장할 수 있습니다.

> 💬 원문:  
> When a piece of information is only needed by event handlers and changing it doesn’t require a re-render, using a ref may be more efficient.  
> 📝 한글 번역:  
> 이벤트 핸들러에게만 필요한 정보이고, 이를 변경해도 다시 렌더(re-render)할 필요가 없는 경우에는 참조를 사용하는 것이 더 효율적일 수 있습니다.  

### 요약
- 렌더링에 필요한 값은 `state` 에 저장
- 렌더링에 필요 없는 값(예: 타이머 ID)은 `ref`에 저장

### 예제: 스톱워치 만들기
예제에서는 state와 ref를 동시에 사용:
- 사용자가 “Start”를 눌렀을 때의 시간과 현재 시간을 state로 저장
- interval ID는 렌더링에 필요 없으므로 ref로 저장
- Start를 누르면 setInterval로 now를 계속 업데이트하고, Stop을 누르면 clearInterval로 중단

### 예시 코드
UI에 영향을 주지 않는 interval ID는 ref로 관리하는 예:
```jsx
const intervalRef = useRef(null);

function handleStart() {
  clearInterval(intervalRef.current);
  intervalRef.current = setInterval(() => {
    setNow(Date.now());
  }, 10);
}
```

---

## 3. Differences between refs and state
💡 핵심 표현
> 💬 원문:  
> Refs are an “escape hatch” you won’t need often  
> 📝 한글 번역:  
> ref는 자주 필요하지 않은 “탈출구(escape hatch)“입니다.

> 💬 원문:  
> “Changing a ref does not trigger a re-render.”  
> 📝 한글 번역:  
> ref를 변경해도 컴포넌트를 다시 렌더링하지 않습니다.  

### 요약
| 특징                      | ref                      | state                |
|---------------------------|--------------------------|----------------------|
| **React가 추적하는가?**   | ❌ 아니오                | ✅ 예                |
| **값 변경 시 리렌더링**   | ❌ 아니오                | ✅ 예                |
| **렌더링 중 접근**        | ❌ (권장하지 않음)       | ✅ 가능              |
| **값 변경 방식**          | `ref.current = newValue` | `setValue(newValue)` |

> React가 추적한다는 표현이 무슨 의미일까? 😂  
> `ref.current`로 현재 값을 읽거나 수정할 수 있으며, 변경되어도 컴포넌트가 다시 렌더링되지 않음을 의미

### Deep Dive: How does useRef work inside?
> 내부적으로 useRef는 어떻게 작동할까요? 🤔

React 내부에서 useRef는 다음과 같이 구현된 것처럼 생각할 수 있습니다:
```jsx
function useRef(initialValue) {
  const [ref, unused] = useState({ current: initialValue });
  return ref;
}
```

> 💬 원문:  
> During the first render, useRef returns `{ current: initialValue }`. This object is stored by React, so during the next render the same object will be returned. **Note how the state setter is unused in this example. It is unnecessary because useRef always needs to return the same object!**

**Deep Dive 요약**
- 한 번 만들어진 ref 객체는 이후에도 동일한 객체를 반환함
- 상태(setState)는 사용되지 않으며, 변경을 React가 감지할 필요도 없음

---

## 4. When to use refs
💡 핵심 표현
> 💬 원문:  
> If your component needs to store some value, but it doesn’t impact the rendering logic, choose refs.  
> 📝 한글 번역:  
> 컴포넌트가 어떤 값을 저장해야 하지만, 렌더링에는 영향을 주지 않는다면 ref를 선택하세요.  

> 💬 원문:  
“Refs are useful when you work with external systems or browser APIs.”  
📝 한글 번역:  
외부 시스템이나 브라우저 API와 작업할 때 ref는 유용합니다.  

### 요약
ref는 브라우저 API와 상호작용하거나 외부 시스템과 연결할 때 유용하며, 주로 아래와 같은 상황에서 사용됨:
- `setTimeout`, `setInterval`의 ID 저장
- **DOM 요소** 직접 조작 (`ref={myRef}`)
- 외부 API와의 상호작용 사용 (예: WebSocket 인스턴스)
- 렌더링과 무관한 객체 보관

---

## 5. Best practices for refs
💡 핵심 표현
> 💬 원문:  
> 1. Treat refs as an escape hatch.  
> 2. Don’t read or write ref.current during rendering.  

> 📝 한글 번역:  
> 1. `ref`는 탈출구(escape hatch)로 취급하세요.  
> 2. 렌더링 중에는 `ref.current`를 읽거나 쓰지 마세요.  

### 요약
- ref는 **탈출구(escape hatch)**입니다. 필요할 때만 사용
- 렌더 중에 `ref.current`를 읽거나 쓰지 않기
- 상태처럼 **불변성(immmutability)**을 유지할 필요는 없음

---

## 6. Refs and the DOM 
- `ref`를 JSX의 `ref` 속성에 전달하면 해당 DOM 요소가 `ref.current`에 저장됨
- DOM에서 제거되면 `ref.current`는 자동으로 `null`로 설정됨
```jsx
const inputRef = useRef(null);

<input ref={inputRef} />
```

## Recap
- `ref`는 렌더링에 사용되지 않는 값을 유지하기 위한 탈출구이며, 자주 필요하지는 않음
- `ref`는 현재라는 단일 프로퍼티를 가진 일반 자바스크립트 객체로, 읽거나 저장할 수 있음(which you can read or set)
- `useRef` Hook을 호출하여, React에 `ref`를 제공하도록 요청할 수 있음
- `state`와 마찬가지로 `ref`를 사용하면 컴포넌트의 리렌더링 사이에 정보를 유지할 수 있음
- `state`와 달리 `ref`의 현재 값을 설정해도, **리렌더링이 트리거되지 않음**(current value does not trigger a re-render)
- 렌더링 중에는 `ref.current`를 읽거나 쓰지 않아야 함. 컴포넌트를 예측하는데 어려움이 따르게 됨

## Challenges
