# Lifecycle of Reactive Effects

이 문서는 이벤트 핸들러와 이펙트의 핵심적인 차이점을 설명하고, 특히 이펙트 내에서 반응형이 아닌 로직을 다루는 방법을 강조합니다.  
이벤트 핸들러는 사용자의 특정 상호작용에 반응하여 실행되는 반면, 
이펙트는 컴포넌트의 상태를 외부 시스템과 동기화하기 위해 필요할 때마다 자동으로 재실행됩니다. 

특히, 이펙트가 읽는 프롭이나 상태 변수 같은 '반응형 값'이 변경되면 이펙트는 재동기화되지만, 때로는 이펙트 내부의 특정 로직이 이러한 반응형 변화에 반응하지 않기를 원할 수 있습니다. 이를 위해 (실험적인 API인) 이펙트 이벤트를 사용하여 이펙트 내부의 비반응형 로직을 분리하고, 의도치 않은 재실행을 방지하며 코드의 예측 가능성을 높이는 방법을 제시합니다.




```plaintext
💬 원문:  
Effects have a different lifecycle from components. Components may mount, update, or unmount. An Effect can only do two things: to start synchronizing something, and later to stop synchronizing it. This cycle can happen multiple times if your Effect depends on props and state that change over time. React provides a linter rule to check that you’ve specified your Effect’s dependencies correctly. This keeps your Effect synchronized to the latest props and state.

---

📝 한글 번역:  
How an Effect’s lifecycle is different from a component’s lifecycle
How to think about each individual Effect in isolation
When your Effect needs to re-synchronize, and why
How your Effect’s dependencies are determined
What it means for a value to be reactive
What an empty dependency array means
How React verifies your dependencies are correct with a linter
What to do when you disagree with the linter
```

> 이 문서에서는 React 컴포넌트가 외부 시스템과 동기화할 필요가 있을 때 사용하는 “Effect”에 대해 다룸. Effect는 브라우저 API 호출, 서버 연결, 애널리틱스 전송 등 렌더링 이후에 수행되어야 하는 사이드 이펙트를 처리함.

> ### You will learn
> - How to choose between an event handler and an Effect
> - Why Effects are reactive, and event handlers are not
> - What to do when you want a part of your Effect’s code to not be reactive
> - What Effect Events are, and how to extract them from your Effects
> - How to read the latest props and state from Effects using Effect Events

## Table of contents
1. [Choosing between event handlers and Effects](#1choosing-between-event-handlers-and-effects)
1. [Reactive values and reactive logic](#2reactive-values-and-reactive-logic)
1. [Extracting non-reactive logic out of Effects](#3extracting-non-reactive-logic-out-of-effects)
1. [](#)
1. [Recap](#recap)
1. [Challenges](#challenges)

---

## 1.	Choosing between event handlers and Effects
이 섹션은 **“코드를 언제, 어떤 이유로 실행할 것인가?”**에 따라 이벤트 핸들러 또는 이펙트 중 무엇을 사용해야 할지 선택하는 기준을 설명함
- 이벤트 핸들러는 명확한 사용자 상호작용이 원인인 경우에 사용함
- 이펙트는 컴포넌트의 상태나 props가 변경되면서 **동기화(synchronization)**가 필요한 경우에 사용함

### Event handlers run in response to specific interactions
💡 핵심 표현
> 💬 원문:  
> “From the user’s perspective, sending a message should happen because the particular ‘Send’ button was clicked.”  
> 📝 한글 번역:  
> 사용자 관점에서 메시지 전송은 특정 “보내기” 버튼이 클릭되었기 때문에 발생해야 합니다.

**내용 정리**
- 메시지를 보내는 동작은 버튼 클릭이라는 명확한 이벤트에만 반응해야 하므로, sendMessage는 이벤트 핸들러 안에 있어야 함
- 이벤트 핸들러는 명시적으로 트리거되는 코드이므로, 그 내부 로직은 리액티브하지 않음

### Effects run whenever synchronization is needed
💡 핵심 표현
> 💬 원문:  
> “The reason to run this code is not some particular interaction.”  
> 📝 한글 번역:  
> 이 코드를 실행할 이유는 특정한 상호작용이 아닙니다.  

```jsx
useEffect(() => {
  const connection = createConnection(serverUrl, roomId);
  connection.connect();
  return () => {
    connection.disconnect();
  };
}, [roomId]);
```

**내용 정리**
- 채팅방이 바뀌면 서버 연결을 다시 설정해야 하므로 `roomId` 값에 반응하여 이펙트를 실행함
- 이 코드는 사용자의 명시적인 액션과 무관하게, 컴포넌트가 렌더링된 시점에서의 상태 변화에 반응해야 하므로 이펙트에 위치함
- 이펙트는 상태 또는 props와 같은 리액티브 값이 바뀌었을 때 자동으로 실행되는 동기화 수단

---

## 2.	Reactive values and reactive logic
💡 핵심 표현
> 💬 원문:  
> “Event handlers and Effects respond to changes differently:
>   - Logic inside event handlers is not reactive.
>   - Logic inside Effects is reactive.”
> 📝 한글 번역:  
> 이벤트 핸들러와 이펙트는 변화에 다르게 반응합니다:  
>   - 이벤트 핸들러 내부의 로직은 리액티브하지 않습니다.
>   - 이펙트 내부의 로직은 리액티브합니다.


### Logic inside event handlers is not reactive
💡 핵심 표현
> 💬 원문:  
> “From the user’s perspective, a change to the message does not mean that they want to send a message.”  
> 📝 한글 번역:  
> 사용자 관점에서 message가 변경되었다는 것은 메시지를 보내고 싶다는 의미가 아닙니다.  

**내용 정리**
- message를 바꾸는 것이 메시지를 전송하고 싶다는 의미는 아님. 사용자가 입력 중이라는 의미일 뿐
- 따라서 sendMessage(message)는 이벤트 핸들러 내에 있어야 하며, 자동 실행되지 않아야 함
<!-- - 사용자 액션(버튼 클릭)에 의해 실행되어야 하는 논리는 non-reactive 해야 함 -->

### Logic inside Effects is reactive
💡 핵심 표현
> 💬 원문:  
> “From the user’s perspective, a change to the roomId does mean that they want to connect to a different room.”  
> 📝 한글 번역:  
> 사용자 관점에서 roomId가 바뀌었다는 것은 다른 방에 접속하고 싶다는 의미입니다.

```jsx
useEffect(() => {
  const connection = createConnection(serverUrl, roomId);
  connection.connect();
  return () => {
    connection.disconnect();
  };
}, [roomId]);
```

- roomId가 바뀌면 해당 방으로 재연결하는 것이 자연스러운 UX ("a change to the roomId does mean that they want to connect to a different room")
- 이펙트는 리액티브 값이 변경될 때마다 실행되므로, **동기화(synchronization)**를 위한 코드에 적합함
- 의존성 배열 `[roomId]`는 이 이펙트가 어떤 값에 반응해야 하는지를 명시함

---

## 3.	Extracting non-reactive logic out of Effects
이펙트 내부에서는 리액티브 값들에 반응하도록 설계되어 있지만, 일부 코드는 리액티브하지 않게 동작해야 할 필요도 있음
- 예를 들어, 연결 후 보여줄 알림 메시지는 단지 가장 최신의 상태나 테마를 참고해서 표시하면 되며,
해당 값이 바뀌었다고 해서 다시 실행될 필요는 없음
- 이런 상황에서 사용하는 것이 바로 **useEffectEvent**

### Declaring an Effect Event
💡 핵심 표현
> 💬 원문:  
> “Effect Events let you ‘break the chain’ between the reactivity of Effects and code that should not be reactive.”  
> 📝 한글 번역:  
> Effect Event를 사용하면, 이펙트의 리액티브한 특성과 리액티브하지 않아야 하는 코드 사이의 연결을 끊을 수 있습니다.


**내용 정리**
- `theme`은 리액티브 값이지만, 알림 메시지를 다시 띄우는 트리거가 되어선 안 되므로, Effect Event 안으로 분리함
- 이렇게 하면 `theme`를 의존성 배열에서 제거해도 문제가 없음
- **Effect Event는 항상 최신 props와 state를 참조함**

**질문과 답변**
Q. useEffectEvent는 언제 사용해야 하나요?
A. 이펙트 내부의 코드 중 일부가 최신 값을 참조해야 하지만, 그 값의 변경에 반응해 실행되면 안 되는 경우 사용함

Q. Effect 이벤트와 이벤트 핸들러 차이점은 무엇인가요?
A. 이벤트 핸들러는 사용자의 상호작용에 대한 응답으로 실행되는 반면, Effect 이벤트는 Effect에서 직접 트리거 됨

### Reading latest props and state with Effect Events
💡 핵심 표현
> 💬 원문:  
> “Effect Events let you fix many patterns where you might be tempted to suppress the dependency linter.”  
> 📝 한글 번역:  
> Effect Event는 의존성 린터 경고를 억제하고 싶은 많은 상황을 올바르게 해결할 수 있도록 도와줍니다.  

**내용 정리**
- `numberOfItems`는 리액티브 값이지만, 페이지 방문 이벤트가 재실행되어야 할 근거는 아님
- 따라서 Effect Event 안에서 `numberOfItems`를 참조해도, 이펙트는 `url` 값만 보고 실행됨
- 사용자 입장에서 의미 있는 변화(예: URL 변경)는 이펙트에서, 나머지 부수 정보는 Effect Event에서 처리함


### Limitations of Effect Events
💡 핵심 표현
> 💬 원문:  
> “Effect Events are very limited in how you can use them:
> - Only call them from inside Effects.
> - Never pass them to other components or Hooks.”  

> 📝 한글 번역:  
> Effect Event는 사용에 있어 매우 제한적입니다
> - 오직 이펙트 내부에서만 호출해야 합니다.
> - 다른 컴포넌트나 훅에 전달해서는 안 됩니다.

**내용 정리**
- `useEffectEvent`로 생성된 함수는 Effect 내부에서만 호출해야 하며, 외부로 전달하면 안 됨
- 예를 들어, 이펙트 이벤트를 다른 훅(`useTimer`)에 전달하거나 컴포넌트 `prop`으로 넘기면 의도치 않은 동작이 발생할 수 있음
- 이펙트 이벤트는 이펙트 내부의 non-reactive 코드 블록을 정의하기 위한 용도이지, 범용 콜백 함수가 아님
- **올바른 방식은, 이펙트 안에서 바로 사용할 수 있도록 근처에서 정의하는 것**

---

## 4.	Recap
💬 원문:  
- Event handlers run in response to specific interactions
- Effects run whenever synchronization is needed
- Logic inside event handlers is not reactive
- Logic inside Effects is reactive
- You can move non-reactive logic from Effects into Effect Events
- Only call Effect Events from inside Effects
- Don’t pass Effect Events to other components or Hooks

📝 한글 번역:  
- 이벤트 핸들러는 특정 상호 작용에 대한 응답으로 실행됨
- 동기화가 필요할 때마다 Effects가 실행됨
- 이벤트 핸들러 내부의 로직은 반응형이 아님
- Effect 내부의 로직은 반응형임
- Effect의 비반응형 로직은 Effect 이벤트로 옮길 수 있음
- Effect 이벤트는 Effect 내부에서만 호출해야 함
- Effect 이벤트를 다른 컴포넌트나 Hook에 전달하면 안됨

**핵심 개념 정리**

| 개념            | 설명 |
|-----------------|------|
| **Event handler** | 사용자의 직접적인 인터랙션(예: 클릭, 입력)에 반응하여 실행됨 |
| **Effect**        | 컴포넌트의 state/props 변화 등 동기화가 필요한 시점에 실행됨 |
| **Reactive**      | 값의 변화에 따라 자동으로 실행되도록 반응하는 특성 |
| **Effect Event**  | 이펙트 내부에서만 호출 가능한 non-reactive 함수. 최신 props/state를 읽을 수 있음 |

**내용 정리**

| 항목                      | 이벤트 핸들러             | 이펙트                    | Effect Event                       |
|---------------------------|---------------------------|---------------------------|------------------------------------|
| **실행 조건**             | 특정 상호작용 발생 시     | 리액티브 값 변경 시       | 이펙트 내부에서 호출될 때          |
| **리액티브 여부**         | ❌ (non-reactive)         | ✅ (reactive)             | ❌ (non-reactive)                  |
| **최신 props/state 접근** | ✅ 가능                   | ✅ 가능 (주의 필요)       | ✅ 항상 최신 값 보장               |
| **사용 위치**             | JSX 이벤트 속성 등        | `useEffect` 내부          | `useEffect` 내부에서만 호출 가능   |
| **외부 전달 가능 여부**   | ✅ 가능                   | ❌ 해당 없음              | ❌ 전달 금지                       |

---

## 5.	Challenges

### Challenge 1: Fix a variable that doesn’t update
이 Timer 컴포넌트는 count 상태를 초마다 증가시킵니다.  
얼마나 증가시킬지는 increment 상태 변수에 저장되어 있고, 플러스/마이너스 버튼으로 제어할 수 있습니다.  
그런데 플러스 버튼을 아무리 눌러도 초당 증가량은 여전히 1입니다.  
이 코드에는 어떤 문제가 있을까요?

#### 출제 의도와 학습 포인트
- Effect의 의존성 배열 정확히 지정: increment 값을 이펙트에서 사용하고 있지만, 의존성 배열에 포함되지 않아 stale 값이 고정됨
- 린터 경고 무시하지 않기: eslint-disable-next-line을 쓴 코드가 실전에서 왜 위험한지 직접 보여줌
- 상태 변화 추적의 중요성: 리액티브한 상태가 이펙트에서 재실행을 트리거하려면 명시적 의존성이 필요함

#### 코드

```jsx
// ✅ 수정된 코드
useEffect(() => {
  const id = setInterval(() => {
    setCount(c => c + increment); // 항상 최신 increment 사용
  }, 1000);
  return () => clearInterval(id);
}, [increment]);
```

### Challenge 2: Fix a freezing counter
이 Timer 컴포넌트는 count 상태를 초마다 증가시킵니다. 증가값은 increment 상태에 저장되어 있습니다.
하지만 플러스나 마이너스 버튼을 초당 한 번 이상 누르면 타이머가 멈춘 것처럼 보입니다.

#### 출제 의도와 학습 포인트
- 리액티브 값 사용 시 불필요한 이펙트 재실행 회피: 이펙트가 increment 값에 반응하게 만들면, 사용자가 값을 바꿀 때마다 interval이 끊기고 다시 설정됨
- 비리액티브 로직은 Effect Event로 분리: 증가값만 최신 상태를 유지하면 되므로, onTick 이벤트로 로직을 분리해야 함
- 효율적인 interval 유지: 타이머가 무조건 매 1초마다 실행되도록 유지하고, 값만 최신으로 참조하면 됨

#### 코드

```jsx
// ❌ 문제 코드
useEffect(() => {
  const id = setInterval(() => {
    setCount(c => c + increment); // increment는 최신이지만, interval이 매번 재설정됨
  }, 1000);
  return () => clearInterval(id);
}, [increment]);
```

```jsx
// ✅ 해결 코드 (Effect Event 사용)
const onTick = useEffectEvent(() => {
  setCount(c => c + increment); // 항상 최신 increment 사용
});

useEffect(() => {
  const id = setInterval(() => {
    onTick(); // 이펙트는 한 번만 설정됨
  }, 1000);
  return () => clearInterval(id);
}, []);
```

- 이펙트가 `increment`에 의존하고 있어 버튼을 누를 때마다 기존 `interval`이 `clear`되고 새로 만들어짐
- 클릭이 빠르면 `interval`이 실행되기도 전에 제거되므로 타이머가 “멈춘 것처럼” 보임
- ✅ 해결: `increment`는 **Effect Event 내에서 참조하고, 이펙트 자체는 의존성이 없는 상태로 유지**


### Challenge 3: Fix a non-adjustable delay
이 예제에서는 interval의 delay를 조절할 수 있습니다.  
하지만 “+100ms” 버튼을 여러 번 눌러 delay 값을 1000ms로 바꿔도 타이머는 여전히 빠르게 작동합니다.  
마치 delay 값 변경이 무시되는 것처럼 보입니다.

#### 출제 의도와 학습 포인트
- Effect Event의 한계 이해: 모든 코드를 Effect Event로 옮기면 오히려 리액티브해야 할 로직까지 비리액티브하게 만들어 버릴 수 있음
- 이펙트 재실행이 필요한 조건 식별: delay 변경은 타이머 간격을 다시 설정해야 하므로, 이펙트가 재실행되어야 함
- non-reactive vs reactive 판단 기준 강화: 어떤 값이 바뀔 때 동작 자체를 재정의해야 한다면, 이펙트 내부에 남겨야 함

#### 코드

```jsx
// ❌ 문제 코드
const onMount = useEffectEvent(() => {
  return setInterval(() => {
    onTick();
  }, delay); // delay가 바뀌어도 이 코드는 다시 실행되지 않음
});

useEffect(() => {
  const id = onMount(); // 항상 초기 delay로 설정됨
  return () => clearInterval(id);
}, []);
```

```jsx
// ✅ 수정된 코드
const onTick = useEffectEvent(() => {
  setCount(c => c + increment);
});

useEffect(() => {
  const id = setInterval(() => {
    onTick(); // delay 변경 시 interval 재설정
  }, delay);
  return () => clearInterval(id);
}, [delay]);
```

**질문과 답변**
Q. 왜 setInterval을 Effect Event 안에서 정의하면 안 되나요?  
A. delay가 변경되어도 이펙트가 재실행되지 않기 때문에, interval 설정이 바뀌지 않고 유지됨

Q. 어떤 값은 이펙트 의존성에 포함시켜야 하고, 어떤 값은 Effect Event 안으로 분리할 수 있나요?  
A. 동작의 타이밍이나 재실행 여부에 직접 영향을 주는 값은 이펙트에서 사용하고, 값만 참조하는 보조 정보는 Effect Event에서 사용함

Q. delay가 바뀌면 이펙트가 재실행되어야 하는 이유는?  
A. interval을 새롭게 설정해 주어야 하기 때문입니다. 이전 interval을 clear하고, 새로운 간격으로 재시작해야 하기 때문

### Challenge 4: Fix a delayed notification
채팅방에 입장하면 알림 메시지가 뜹니다.  
하지만 “travel”에서 “music”으로 빠르게 전환하면, 알림이 두 번 뜨는데 둘 다 “Welcome to music” 라고 표시됩니다.  

#### 출제 의도와 학습 포인트
- Effect Event의 “최신 상태 값” 특성 이해: Effect Event 내부에서는 항상 최신 props/state를 참조하기 때문에, 과거 이펙트의 컨텍스트가 반영되지 않음
- Effect → Effect Event 간 인자 전달의 중요성: 지연된 로직에 필요한 정보는 Effect Event로 “직접 전달”해야 정확한 시점의 상태를 보존 가능
- 비동기 로직과 상태 싱크 맞추기: setTimeout 등 지연 실행되는 함수 내에서는 상태가 최신으로 바뀌어 버릴 수 있음 → 캡처 필요

#### 코드

```jsx
// ❌ 문제 코드
const onConnected = useEffectEvent(() => {
  showNotification('Welcome to ' + roomId, theme); // 항상 최신 roomId 참조
});

useEffect(() => {
  connection.on('connected', () => {
    setTimeout(() => {
      onConnected(); // 🔴 호출 시점에는 roomId가 이미 바뀌었을 수 있음
    }, 2000);
  });
}, [roomId]);
```

- 문제가 발생한 이유는 Effect Event 내부에서 `roomId`를 직접 참조하고 있기 때문
- `setTimeout`이 지연된 후 실행되면, 그 시점의 최신 `roomId`인 “music”이 반영됨 → 이전 이펙트(`roomId === 'travel'`)에서 예약된 알림조차 "`music`"으로 표시됨
- ✅ 해결: Effect Event의 인자로 `connectedRoomId`를 명시적으로 넘겨야 함

```jsx
// ✅ 수정된 코드
const onConnected = useEffectEvent((connectedRoomId) => {
  showNotification('Welcome to ' + connectedRoomId, theme); // 🔒 이전 이펙트의 roomId 고정
});

useEffect(() => {
  connection.on('connected', () => {
    setTimeout(() => {
      onConnected(roomId); // ✅ 이펙트가 실행되던 시점의 roomId 전달
    }, 2000);
  });
}, [roomId]);
```

**질문과 답변**
Q. Effect Event 내부에서 직접 roomId를 참조하면 왜 문제가 되나요?  
A. Effect Event는 항상 최신 상태 값을 참조하므로, 알림이 실행되는 시점의 roomId가 반영되어 “과거 이벤트에 대한 잘못된 정보”가 표시될 수 있음

Q. roomId를 인자로 넘기면 어떤 이점이 있나요?  
A. 이펙트가 실행된 당시의 roomId 값이 고정되어 전달되므로, 시간 차이로 인한 상태 변화에 영향을 받지 않음
