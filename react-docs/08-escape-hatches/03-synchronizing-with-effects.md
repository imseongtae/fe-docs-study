# Synchronizing with Effects

```plaintext
💬 원문:  
Some components need to synchronize with external systems.  
For example, you might want to control a non-React component based on the React state, set up a server connection, or send an analytics log when a component appears on the screen.  
Effects let you run some code after rendering so that you can synchronize your component with some system outside of React.

---

📝 한글 번역:  
어떤 컴포넌트는 외부 시스템과 동기화할 필요가 있습니다.  
예를 들어, React 상태에 따라 React가 아닌 컴포넌트를 제어하거나, 서버 연결을 설정하거나, 컴포넌트가 화면에 나타날 때 분석 로그를 전송하고 싶을 수 있습니다.  
Effect를 사용하면 렌더링 이후에 어떤 코드를 실행하여, 컴포넌트를 React 외부 시스템과 동기화할 수 있습니다.
```

> 이 문서에서는 React 컴포넌트가 외부 시스템과 동기화할 필요가 있을 때 사용하는 “Effect”에 대해 다룸. Effect는 브라우저 API 호출, 서버 연결, 애널리틱스 전송 등 렌더링 이후에 수행되어야 하는 사이드 이펙트를 처리함.

> ### You will learn
> - What Effects are
> - How Effects are different from events
> - How to declare an Effect in your component 
> - How to skip re-running an Effect unnecessarily (Effect가 불필요하게 재실행되는 것을 방지하는 방법)
> - Why Effects run twice in development and how to fix them (개발 환경에서 Effect가 두 번 실행되는 이유와 해결 방법)

## Table of contents
1. [What are Effects and how are they different from events?](#1-what-are-effects-and-how-are-they-different-from-events)
1. [You might not need an Effect](#2-you-might-not-need-an-effect)
1. [How to write an Effect](#3-how-to-write-an-effect)
1. [How to handle the Effect firing twice in development?](#4-how-to-handle-the-effect-firing-twice-in-development)
1. [Putting it all together](#5-putting-it-all-together)
1. [Recap](#recap)
1. [Challenges](#challenges)

---

## 1. What are Effects and how are they different from events?
💡 핵심 표현
> 💬 원문:  
> “Effects let you specify side effects that are caused by rendering itself, rather than by a particular event.”  
> 📝 한글 번역:  
> Effect는 특정 이벤트가 아닌, 렌더링 그 자체로 인해 발생하는 부수 효과를 지정할 수 있게 해줍니다.  

### Effect란?
Effect에 대해 알아보기 전에, **리액트 컴포넌트 내부에서 사용되는 두 가지 유형의 로직**에 대해 먼저 이해가 필요

**Rendering code**  
- 컴포넌트 최상위 수준에 위치하며, prop과 state를 받아 이를 변환한 후 화면에 표시될 JSX를 반환
- 렌더링 코드는 순수해야 함. 즉, 수학 공식처럼 단순히 결과를 “계산”해야 하며, 다른 행동은 하지 않아야 함

**Event handlers**
- 컴포넌트 내부에 중첩된 함수로, 계산만 하는 것이 아니라 어떤 동작을 수행함. 
  - 예를 들어 입력 필드를 업데이트하거나, POST 요청을 전송하거나, 화면을 이동시키는 등의 작업을 함
- 이벤트 핸들러는 특정 사용자 동작(예: 버튼 클릭, 입력 등)에 의해 발생하는 **부수 효과(side effect)**를 포함함

하지만 경우에 따라 이벤트 핸들러만으로는 부족할 수 있습니다. 예를 들어 ChatRoom 컴포넌트가 화면에 나타날 때마다 채팅 서버에 연결되어야 한다고 가정해봅시다. 서버에 연결하는 작업은 순수 계산이 아니므로 렌더링 중에 수행할 수 없으며, 클릭 같은 특정 이벤트에 의해 발생하는 것도 아닙니다.

### 요약
- 렌더링 코드: JSX를 계산하는 순수 함수 (부수 효과 없음)
- 이벤트 핸들러: 사용자 액션에 따라 부수 효과 발생
- Effect는 특정 이벤트가 아닌, 렌더링 그 자체에 의해 발생하는 부수 효과를 정의할 수 있게 해줌 (예: 서버 연결)
- Effect는 화면 업데이트 후 커밋(commit)의 끝에서 실행됨. 이는 리액트 컴포넌트를 네트워크나 서드파티 라이브러리와 같은 외부 시스템과 동기화하기에 적절한 시점

### 질문과 답변
Q. 이벤트 핸들러와 Effect의 가장 큰 차이점은 무엇인가요?
A. 이벤트 핸들러는 특정 사용자 액션에 의해 실행되고, Effect는 렌더링 자체로 인해 실행됨

---

## 2. You might not need an Effect
Effect는 보통 리액트 코드의 범위를 벗어나, 외부 시스템과 동기화할 때 사용됨. 
- 예를 들어 브라우저 API, 서드파티 위젯, 네트워크 요청 등이 해당
- 만약 Effect가 단순히 어떤 상태에 기반하여 다른 상태를 조정하고 있다면, Effect가 필요하지 않을 수도 있음

💡 핵심 표현
> 💬 원문:  
> “If your Effect only adjusts some state based on other state, you might not need an Effect.”  
> 📝 한글 번역:  
> 어떤 상태를 다른 상태에 따라 조정하기 위한 목적이라면, Effect가 필요하지 않을 수 있습니다.  

**To write an Effect, follow these three steps**:  
1. Declare an Effect.  
    - 기본적으로, Effect는 모든 커밋 이후에 실행됩니다.
2. Specify the Effect dependencies  
    - 대부분의 Effect는 매 렌더링마다 실행되어서는 안 되고, 필요할 때만 재실행되어야 함
    - 이를 제어하기 위해 *의존성(dependencies)*을 명시하는 법을 배우게 됨
3. Add cleanup if needed (필요하다면 cleanup 함수 추가하기)  

## 3. How to write an Effect

### Step 1: Declare an Effect
💡 핵심 표현
> 💬 원문:  
> “useEffect delays a piece of code from running until that render is reflected on the screen.”  
> 📝 한글 번역:  
> useEffect는 렌더링 결과가 실제 화면에 반영된 후에 코드 실행을 지연시킵니다.  

1. 컴포넌트에서 Effect를 선언하려면, 먼저 React에서 `useEffect` 훅을 가져옴
2. 그 다음, 컴포넌트 최상위에서 `useEffect`를 호출하고 그 안에 코드를 작성
3. 컴포넌트가 렌더링될 때마다, React는 화면을 업데이트한 이후에 `useEffect` 내부 코드를 실행. 즉, `useEffect`는 특정 코드의 실행을 화면이 업데이트된 이후로 “지연함”

**예시 코드**  
- 모든 렌더링 후 실행됨
- 예: `<video>` 태그의 `.play()` 메서드 호출

```jsx
useEffect(() => {
  // side effect here
});
```

#### Pitfall: Effect가 무한 루프를 일으키는 경우
Effect는 렌더링의 결과로 실행되며, setState()는 렌더링을 유발  
그래서 예제와 같은 코드는 무한 루프를 유발:  
1. 렌더링 →
2. Effect 실행 → setCount() 호출 →
3. 상태 변경 → 다시 렌더링 →
4. 다시 Effect 실행 → 무한 반복

> Effect는 외부 시스템과 동기화하는 데 사용되어야 함. 내부 상태만 다루는 경우라면, Effect가 필요하지 않을 수도 있음

### Step 2: Specify the Effect dependencies
> Effect 의존성 명시하기  
By default, Effects run after every render. Often, this is not what you want:

💡 핵심 표현
> 💬 원문:  
> “React will skip the Effect if all of its dependencies have the same values as during the last render.”  
> 📝 한글 번역:  
> 모든 의존성이 이전 렌더링과 동일한 값이면 React는 Effect 실행을 건너뜁니다.  

기본적으로, Effect는 모든 렌더링 후에 실행하지만 대부분의 경우, 이것은 원하는 동작이 아님:
- 어떤 경우에는, 너무 느림
- 어떤 경우에는, 잘못된 동작

**예시 코드**  
- 의존성 배열을 정확히 명시해야 예측 가능한 동작 가능
- `[]`은 `mount` 시 한 번만 실행됨

```jsx
useEffect(() => {
  // logic
}, [dependency]);
```

예제에서, "React Hook useEffect has a missing dependency: ‘isPlaying’" 이 발생하는 이유:  
- Effect 내부의 코드가 isPlaying prop에 의존하고 있음에도 불구하고, 의존성 배열에 그것을 명시하지 않았기 때문
- 이 문제를 해결하려면 isPlaying을 의존성 배열에 추가해야 함
- 이 배열 `[isPlaying]`은 `isPlaying`의 값이 이전 렌더와 동일한 경우 Effect를 다시 실행하지 말라는 의미

의존성 배열에는 여러 개의 항목을 넣을 수 있음:
- 리액트는 의존성 배열에 포함된 모든 값이 이전 렌더와 동일할 때만 Effect 실행을 생략함
- 이때 비교에는 `Object.is` 비교 방식이 사용됨

⚠️ 주의: 의존성은 “선택할 수 있는 것”이 아님
- Effect 내부에서 사용하는 값은 모두 의존성 배열에 명시해야 함
- 리액트는 이를 확인하는 린트 도구를 제공함
  - 만약 배열에 빠진 의존성이 있다면 경고를 출력하고, 잠재적인 버그를 사전에 막아줍니다.
- 만약 어떤 값이 바뀌더라도 Effect가 재실행되지 않길 원한다면, Effect 내부의 코드를 수정하여 해당 값이 필요 없도록 만들어야 함

⚠️ Pitfall: 빈 배열과 배열 생략은 다름

```jsx
useEffect(() => {
  // 모든 렌더링 후 실행
});

useEffect(() => {
  // 마운트 시에만 실행 (처음 화면에 나타날 때)
}, []);

useEffect(() => {
  // 마운트 시 또는 a 또는 b가 변경되었을 때 실행
}, [a, b]);
```

### Step 3: Add cleanup if needed
Effect 내부에서 cleanup 함수를 반환하면, 리액트는 다음과 같은 경우 cleanup 함수를 호출함:
- Effect가 재실행되기 직전
- 컴포넌트가 언마운트될 때

💡 핵심 표현
> 💬 원문:  
> “React will call your cleanup function each time before the Effect runs again, and one final time when the component unmounts.”  
> 📝 한글 번역:  
> React는 Effect가 다시 실행되기 전마다, 그리고 컴포넌트가 언마운트될 때 마지막으로 정리 함수(cleanup)를 호출합니다.  

**예시 코드**  
- `return` 함수는 정리 함수로, 연결 해제, 이벤트 리스너 제거 등에 사용됨

```jsx
useEffect(() => {
  const conn = createConnection();
  conn.connect();
  return () => conn.disconnect();
}, []);
```

리액트는 컴포넌트를 다시 마운트해도 실제 앱 로직이 깨지지 않도록 정리 함수가 잘 구현되었는지 검증함

In production, you would only see "✅ Connecting..." printed once:  
(운영 모드에서는 "✅ Connecting..."만 한 번 출력되며, 두 번 실행되지 않음)  

> 💡 참고: 이런 리액트의 개발 모드 동작은 StrictMode에서 작동함  
> StrictMode를 끄면 이 동작은 사라지지만, 이로 인해 버그를 놓칠 수 있기 때문에 StrictMode는 켜두는 것이 좋음

---

## 4. How to handle the Effect firing twice in development?
💡 핵심 표현
> 💬 원문:  
> “The right question isn’t ‘how to run an Effect once’, but ‘how to fix my Effect so that it works after remounting’.”  
> 📝 한글 번역:  
> “Effect를 한 번만 실행하려면 어떻게 해야 할까?”가 아니라 “다시 마운트된 이후에도 동작하도록 Effect를 고치려면 어떻게 해야 할까?”가 올바른 질문입니다.  

**❗️중요한 질문**은
- “어떻게 하면 Effect를 한 번만 실행되게 할 수 있을까?”가 아니라
- “내 Effect가 다시 마운트된 이후에도 올바르게 작동하게 하려면 어떻게 해야 할까?” 임
- **보통 그 해답은 정리(cleanup) 함수를 제대로 구현**하는 것
- 정리 함수는 Effect가 수행하던 작업을 멈추거나 취소하거나 되돌리는 역할을 함

React는 개발 모드에서 Strict Mode를 통해 컴포넌트를 한 번 마운트하고, 언마운트한 후 다시 마운트함  
이는 Effect가 제대로 정리(cleanup) 되는지 테스트하기 위함

기본 원칙은 이러함:
사용자는 Effect가 한 번 실행된 것과,
**“실행 → 정리 → 다시 실행” 순서로 실행된 것을 구분할 수 없어야 함**

```jsx
const connectionRef = useRef(null);
useEffect(() => {
  // This won’t fix the bug!!!
  if (!connectionRef.current) {
    connectionRef.current = createConnection();
    connectionRef.current.connect();
  }
}, []);
```

- 이렇게 하면 개발 모드에서 ‘✅ Connecting…’ 메시지는 한 번만 보이지만, 버그는 해결되지 않음
- cleanup 함수가 없으면 이전 연결이 해제되지 않아 연결이 누적됨

올바른 해결 방법: cleanup 함수 작성  
```jsx
useEffect(() => {
  const connection = createConnection();
  connection.connect();
  return () => connection.disconnect();
}, []);
```

이렇게 하면 로 자연스럽게 동작함
1. 첫 마운트 → 연결
2. 언마운트 → 연결 해제
3. 재마운트 → 다시 연결

### 요약
- React의 Strict Mode는 개발환경에서 Effect를 두 번 실행해 cleanup 미흡한 코드를 조기에 드러냄
- 올바른 정리 함수를 구현하는 것이 핵심

### 질문과 답변

1Q. Effect가 두 번 실행되는 이유는 무엇인가요?  
1A. React의 개발 모드, Strict Mode에서 의도적으로 한 번 더 마운트/언마운트하여 cleanup 구현이 누락되었는지 확인함

2Q. cleanup을 구현하지 않아 생기는 실질적인 문제는 무엇인가요?  
2A. 예를 들어 서버 연결이 해제되지 않고 계속 누적되면 중복 연결, 메모리 누수, 비정상 동작이 발생할 수 있음

3Q. 이중 실행을 없애려면 Strict Mode를 끄면 되지 않나요?  
3A. 가능하지만 권장되지 않음. Strict Mode는 개발 중 문제를 조기에 발견하게 해 주는 안전장치

### Controlling non-React widgets

### Subscribing to events

### Triggering animations

### Fetching data

### Sending analytics

### Not an Effect

#### Initializing the application
어떤 로직은 앱이 처음 시작될 때 한 번만 실행되어야 하며,  
컴포넌트 안이 아니라 컴포넌트 밖에서 처리해야 함

#### Buying a product
상품 구매는 렌더링에 의해 발생한 것이 아니라, 명확한 사용자 인터랙션에 의해 발생해야 한다는 것  
이러한 POST 요청은 특정 이벤트에서만 발생해야 하며, 렌더링 자체가 트리거가 되어선 안 됨

> Effect가 재마운트되었을 때 앱 로직이 깨지는 경우, 대부분은 이미 존재하던 버그가 노출된 것

즉, 사용자가 “뒤로 가기”를 눌렀을 때 페이지를 다시 보는 행위는
처음 그 페이지를 방문했을 때와 **동일한 결과**를 보여야 합니다.
리액트는 이 원칙을 지키도록 하기 위해 개발 모드에서 컴포넌트를 다시 마운트하는 것입니다.

---

## 5. Putting it all together
💡 핵심 표현
> 💬 원문:  
> “Each Effect ‘captures’ the text value from its corresponding render.”  
> 📝 한글 번역:  
> 각 Effect는 해당 렌더에서의 text 값을 “캡처”합니다.  


### 예시 코드
setTimeout을 사용하는 예제를 통해 Effect의 실행과 cleanup 과정을 직관적으로 체험
```jsx
useEffect(() => {
  const timeoutId = setTimeout(() => {
    console.log('⏰ ' + text);
  }, 3000);

  return () => {
    console.log('🟡 Cancel "' + text + '" log');
    clearTimeout(timeoutId);
  };
}, [text]);
```

작동 방식:
1. 입력 값이 바뀔 때마다 새로운 Effect가 실행되고 이전 Effect는 정리됨
2. 입력을 빠르게 바꾸면 이전 setTimeout은 정리되고, 가장 최신 값만 남음
3. unmount 시에도 cleanup이 호출되어 남아 있는 timeout도 취소됨

### 질문과 답변
1Q. 여러 번 입력한 경우 콘솔에 하나의 결과만 나오는 이유는?  
1A. 이전 setTimeout들이 cleanup에 의해 모두 취소되고, 마지막 것만 실행되기 때문

2Q. cleanup 함수를 작성하지 않으면 어떤 일이 발생하나요?  
2A. 이전 timeout들이 모두 실행되어 text 값 로그가 여러 개 출력됨

---

## Recap
📝 한글 번역:  
- 이벤트와 달리, Effect는 특정 상호작용이 아니라 렌더링 자체에 의해 발생함
- Effect를 사용하면, 컴포넌트를 외부 시스템(예: 서드파티 API, 네트워크 등)과 동기화할 수 있음
- 기본적으로, Effect는 모든 렌더링 후에 실행됩니다 (초기 렌더링도 포함)
- 이전 렌더와 모든 의존성 값이 동일하다면, React는 해당 Effect의 실행을 건너뜀
- 의존성은 개발자가 “선택”할 수 있는 것이 아니라, Effect 내부에서 사용된 코드에 따라 자동으로 결정됨
- **빈 의존성 배열([])**은 해당 Effect가 컴포넌트가 마운트될 때 한 번만 실행됨을 의미함
- 개발 환경에서 Strict Mode가 활성화되어 있으면, React는 컴포넌트를 두 번 마운트하여 Effect를 강하게 테스트함
- 만약 Effect가 이 재마운트 과정에서 문제가 생긴다면, **정리 함수(cleanup function)**를 구현해야 함
- React는 Effect가 다시 실행되기 직전에, 그리고 컴포넌트가 언마운트될 때, cleanup 함수를 호출함

💬 원문:  
- Unlike events, Effects are caused by rendering itself rather than a particular interaction.
- Effects let you synchronize a component with some external system (third-party API, network, etc).
- By default, Effects run after every render (including the initial one).
- React will skip the Effect if all of its dependencies have the same values as during the last render.
- You can't "choose" your dependencies. They are determined by the code inside the Effect.
- Empty dependency array (`[]`) corresponds to the component "mounting", i.e. being added to the screen.
- In Strict Mode, React mounts components twice (in development only!) to stress-test your Effects.
- If your Effect breaks because of remounting, you need to implement a cleanup function.
- React will call your cleanup function before the Effect runs next time, and during the unmount.

---

## Challenges

### 1. Focus a field on mount

📄 문제 설명  
이 예제에서 `<MyInput />` 컴포넌트는 입력 필드를 렌더링함
이 입력 필드가 화면에 나타났을 때 자동으로 focus 되도록 만들어보세요.
`ref.current.focus()` 코드가 주석 처리되어 있는데, 이 방식은 동작하지 않습니다.

autoFocus 속성은 무시하고, 순수하게 `useEffect`를 사용하여 구현해야 합니다.

**🎯 출제 의도**
- 렌더링 중 DOM에 직접 접근하는 것이 왜 문제인지 이해하도록 유도
- Effect를 통해 렌더링 이후 DOM 접근이 가능함을 학습

**정답 코드**
```jsx
useEffect(() => {
  ref.current.focus();
}, []);
```

**해설**
- ref.current.focus()는 DOM이 준비된 후 실행되어야 하므로 useEffect 안에 작성해야 함
- 빈 의존성 배열 []을 넣어 최초 마운트 시 한 번만 실행되게 함

### 2. Focus a field conditionally

📄 문제 설명 (한글 번역)

두 개의 `<MyInput />` 필드를 렌더링합니다.
현재 두 컴포넌트 모두 focus()를 호출하려고 시도하지만, 실제로는 두 번째 필드만 focus 됩니다.
첫 번째 필드만 focus 되도록 shouldFocus prop이 true일 때만 focus하도록 수정하세요.

**🎯 출제 의도**
- Effect를 선언적으로 작성하면서 조건 분기를 어떻게 처리하는지 학습
- prop 기반 Effect 조건 제어


**정답 코드**
```jsx
useEffect(() => {
  if (shouldFocus) {
    ref.current.focus();
  }
}, [shouldFocus]);
```

**해설**
- shouldFocus가 true일 때만 focus
- prop을 의존성 배열에 추가하여, 이 값이 바뀔 때마다 Effect 재실행됨


### 3. Fix an interval that fires twice

📄 문제 설명 (한글 번역)  
1초마다 숫자가 1씩 증가하는 카운터입니다.
하지만 지금은 1초마다 2씩 증가하고 있습니다.
이 문제의 원인을 찾고, 수정하세요.

**🎯 출제 의도**
- 이중 실행의 근본 원인이 Effect cleanup 누락임을 체득
- setInterval은 반드시 clearInterval로 정리해야 함을 학습

**정답 코드**
```jsx
useEffect(() => {
  function onTick() {
    setCount(c => c + 1);
  }

  const intervalId = setInterval(onTick, 1000);
  return () => clearInterval(intervalId);
}, []);
```

**해설**
- setInterval을 클린업하지 않으면 개발 환경에서 두 번 설정됨
- clearInterval을 통해 이전 타이머 제거


### Challenge 4. Fix fetching inside an Effect

📄 문제 설명 (한글 번역)  
사람 이름을 선택하면 해당 사람의 bio를 불러와 표시합니다.
그런데 빠르게 선택을 바꿔보면, 마지막 선택이 아닌 다른 사람의 bio가 표시되는 버그가 발생합니다.
이 문제를 해결하세요.

**🎯 출제 의도**
- 이전 Effect의 결과가 나중에 도착할 경우를 처리하는 방법 학습
- 상태 업데이트 타이밍에 따른 문제 해결법 이해

**정답 코드**
```jsx
useEffect(() => {
  let ignore = false;
  setBio(null);
  fetchBio(person).then(result => {
    if (!ignore) {
      setBio(result);
    }
  });

  return () => {
    ignore = true;
  };
}, [person]);
```

**해설**
- 각 Effect가 고유한 ignore 변수를 가짐
- 최신 Effect만 결과를 반영하도록 설정
