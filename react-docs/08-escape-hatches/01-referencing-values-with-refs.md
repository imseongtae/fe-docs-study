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

---

## Challenges

### 1. Fix a broken chat input
> 💬 문제 설명 (번역)  
> “메시지를 입력하고 Send 버튼을 클릭하면 3초 후에 ‘Sent!’ 알림이 뜹니다. 이 동안 ‘Undo’ 버튼을 클릭하면 전송을 취소하도록 되어 있어야 합니다. 하지만 ‘Undo’를 눌러도 여전히 ‘Sent!’ 메시지가 뜨는 문제가 있습니다.”  
> 힌트: let timeoutID와 같은 일반 변수는 렌더링 사이에서 값을 유지하지 못합니다. timeoutID를 어디에 저장해야 할까요?

#### 해설
- 문제의 핵심은 timeoutID가 let으로 선언되어 있어 컴포넌트가 다시 렌더링되면 초기화된다는 점. 이로 인해 `handleUndo()`에서 참조하는 timeoutID는 이미 유효하지 않거나 `null`일 수 있음

**해결 방법**: `useRef`를 사용하여 timeoutID를 `ref`에 저장하면, 컴포넌트가 리렌더링되더라도 그 값을 유지할 수 있음
```jsx
const timeoutRef = useRef(null);
timeoutRef.current = setTimeout(...);
clearTimeout(timeoutRef.current);
```

#### 학습 포인트
- 리렌더링 사이에서 값을 유지하고 싶은 경우 ref를 사용해야 함
- 일반 변수는 리렌더링마다 초기화되므로 컴포넌트 생명 주기와 무관한 정보는 ref에 저장

#### 출제 의도
- ref와 일반 변수의 차이를 인지하도록 유도
- 이벤트 핸들러 사이에서의 데이터 공유를 어떻게 할 것인지 판단하게 함

### 2. Fix a component failing to re-render
> 리렌더링되지 않는 컴포넌트를 고치세요

> 💬 문제 설명 (번역)  
> “이 버튼은 ‘On’과 ‘Off’ 상태를 토글하도록 설계되었지만 항상 ‘Off’만 표시됩니다. 문제의 원인을 찾아 고쳐보세요.”  

#### 해설
- 이 문제의 핵심은 렌더링에 사용되는 값을 ref로 관리하고 있다는 점
- ref.current는 변경되어도 컴포넌트를 리렌더링하지 않기 때문에, ref.current를 기반으로 한 화면은 업데이트되지 않음


**해결 방법**: `useState`를 사용하여 상태를 관리하고 `setState`로 값을 갱신해야 리렌더링이 일어남
```jsx
const timeoutRef = useRef(null);
timeoutRef.current = setTimeout(...);
clearTimeout(timeoutRef.current);
```

#### 학습 포인트
- 렌더링에 영향을 주는 값은 `state`로 관리해야 함
- `ref`는 값을 저장하지만 렌더링을 트리거하지 않음

#### 출제 의도
- `ref`와 `state`의 용도 구분을 확실히 학습하게 함
- 리렌더링을 유발하는 로직을 짤 때 `state`의 필요성을 체감시키기 위함

### 3. Fix debouncing
> 디바운싱 기능이 올바르게 작동하도록 수정하기

> 💬 문제 설명 (번역)  
> 각 버튼 클릭은 1초 후 메시지를 보여주는 디바운싱 처리가 되어 있습니다. 그러나 버튼 하나를 클릭한 후 다른 버튼을 클릭하면, 첫 번째 버튼의 메시지가 사라지고 마지막 버튼만 표시됨  
> 힌트: 모든 버튼이 동일한 timeoutID를 공유하고 있어 상호 간섭이 발생합니다. 각 버튼이 별도의 timeout ID를 갖도록 바꿔야 함  

#### 해설

문제는 let timeoutID;가 컴포넌트 바깥에 있어 모든 버튼이 같은 timeoutID를 공유한다는 점입니다. 이로 인해 하나의 버튼이 setTimeout을 호출하면 다른 버튼의 timeout도 덮어쓰게 됩니다.

**해결 방법**: 각 버튼 내부에서 useRef를 사용하여 자신만의 timeout을 가지도록 함
```jsx
const timeoutRef = useRef(null);
```

#### 학습 포인트
- 컴포넌트 간 상태 충돌 방지를 위해 ref를 로컬 상태처럼 사용할 수 있다.
- 같은 컴포넌트를 여러 번 사용할 때, ref는 각 인스턴스마다 독립적으로 유지된다.

#### 출제 의도
- 컴포넌트 인스턴스 간 독립성 유지 개념을 학습
- 디바운싱, 비동기 타이머 관리 시 ref의 적절한 활용법을 익히도록 함

### 4. Read the latest state
> 최신 state 값을 읽도록 수정하기

> 💬 문제 설명 (번역)  
> “Send 버튼을 클릭하면 3초 후 메시지를 전송합니다. 그런데 클릭한 후 입력값을 수정해도 3초 후에는 클릭 당시의 메시지가 그대로 전송됩니다. 최신 입력값을 반영하도록 수정해보세요.”

#### 해설
state는 매 렌더마다 스냅샷처럼 유지되기 때문에, setTimeout 안에서는 클릭 당시의 값만 기억하고 나중에 변경된 값을 모르고 있음

**해결 방법**: text state 값을 ref에도 저장해서 항상 최신 값을 유지하게 하고, setTimeout에서는 `ref`를 참조하도록 함
```jsx
const textRef = useRef(text);
textRef.current = e.target.value;
...
alert(textRef.current);
```

#### 학습 포인트
- 비동기 작업에서는 `state`의 스냅샷 특성을 인지해야 함
- 최신 값을 보존하려면 `state` + `ref` 조합이 유용함

#### 출제 의도
- `state`와 `ref`의 차이를 시간 흐름 관점에서 비교하게 함
- 비동기 상황에서 `state`만으로는 부족할 수 있음을 체감하게 함
