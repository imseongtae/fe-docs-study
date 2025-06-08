# Removing Effect Dependencies

```bash
# notebooklm review
이 문서는 React Effect의 종속성 관리에 대한 핵심 원칙과 실용적인 해결책을 설명합니다. Effect를 작성할 때, 린터는 Effect 내에서 사용되는 모든 반응형 값 (프롭스, 상태 등)을 종속성 목록에 포함하도록 강제하여 컴포넌트의 최신 상태와 동기화되도록 합니다. 불필요한 종속성은 Effect가 너무 자주 실행되거나 무한 루프를 유발할 수 있으므로, 종속성 목록은 코드와 일치해야 합니다. 
종속성을 제거하려면 해당 값이 반응형이 아님을 "증명"해야 하며, 이는 코드를 변경함으로써 가능합니다. 린터 경고를 무시하는 것은 직관적이지 않은 버그로 이어질 수 있으므로, 상호작용에 대한 응답으로 코드를 실행해야 할 때는 이벤트 핸들러로 옮기거나, 관련 없는 작업을 수행하는 Effect를 분리하거나, 최신 상태를 읽되 "반응"하지 않으려면 Effect Event를 사용하는 등의 다양한 전략을 제시합니다. 특히 객체나 함수와 같은 종속성은 의도치 않게 Effect를 재실행시킬 수 있으므로, 이들을 컴포넌트 외부나 Effect 내부로 옮기거나 원시 값을 추출하여 불필요한 재동기화를 방지하는 방법을 강조합니다.
```

**서문**

```plaintext
💬 원문:  
Event handlers only re-run when you perform the same interaction again. Unlike event handlers, Effects re-synchronize if some value they read, like a prop or a state variable, is different from what it was during the last render. Sometimes, you also want a mix of both behaviors: an Effect that re-runs in response to some values but not others. This page will teach you how to do that.

---

📝 한글 번역:  
이벤트 핸들러는 동일한 인터랙션을 다시 수행할 때만 다시 실행됩니다. 이벤트 핸들러와 달리 이펙트는 소품이나 상태 변수와 같이 읽은 값이 마지막 렌더링 때와 다른 경우 다시 동기화합니다. 때로는 두 가지 동작을 혼합하여 일부 값에는 반응하지만 다른 값에는 반응하지 않는 효과를 원할 수도 있습니다. 이 페이지에서는 이를 수행하는 방법을 설명합니다.
```

> ### You will learn
> - How to choose between an event handler and an Effect
> - Why Effects are reactive, and event handlers are not
> - What to do when you want a part of your Effect’s code to not be reactive
> - What Effect Events are, and how to extract them from your Effects
> - How to read the latest props and state from Effects using Effect Events


## Table of contents
1. [Dependencies should match the code](#1dependencies-should-match-the-code)
1. [Removing unnecessary dependencies](#2removing-unnecessary-dependencies)
1. [Recap](#recap)
1. [Challenges](#challenges)

---

## 1.	Dependencies should match the code
💡 핵심 표현  
> 💬 원문:  
> “Effects 'react' to reactive values.”  
> 📝 한글 번역:  
> “Effect는 반응형 값에 반응합니다.”

- useEffect는 반응형 값(예: props, state 등)을 사용하는 경우, 해당 값을 의존성 배열에 반드시 명시해야 함
- 리액트는 Effect가 참조하는 모든 반응형 값을 추적하며, 이 값들이 변경되면 Effect를 다시 실행
- 만약 의존성 배열을 []로 비워두면, 린트 도구가 누락된 값을 경고해줌

### 질문과 답변
Q1. 왜 roomId를 의존성 배열에 넣어야 하나요?  
A1. roomId는 props로 전달된 반응형 값입니다. 값이 바뀌었을 때 Effect가 다시 실행되어야 동기화 문제가 생기지 않기 때문에 반드시 의존성 배열에 포함해야 함

Q2. 린트가 없더라도 `[roomId]`를 직접 판단해서 넣어야 하나요?  
A2. 린트는 도와주는 도구일 뿐이며, 코드가 반응형 값을 사용하는 구조라면 반드시 명시해야 함. 그렇지 않으면 버그가 발생할 수 있음

Q3. `[]`로 비워놓으면 처음만 실행되는데 안 되는 건가요?  
A3. `roomId`가 바뀌어도 Effect가 다시 실행되지 않기 때문에, 동기화되지 않은 상태(의도하지 않은 상황)가 발생하며 이는 버그임

### To remove a dependency, prove that it’s not a dependency
💡 핵심 표현  
> 💬 원문:  
> “To remove a dependency, 'prove' to the linter that it *doesn't need* to be a dependency.”  
> 📝 한글 번역:  
> 의존성을 제거하려면, 린트 도구에 그 값이 의존성이 *아니라는 점을 증명*해야 합니다.

> 💬 원문:  
> “Every reactive value used by your Effect's code must be declared in your dependency list.”  
> 📝 한글 번역:  
> Effect 코드에서 사용되는 모든 반응형 값은 의존성 목록에 명시되어야 합니다.

#### 내용 정리
- Effect에서 사용되는 모든 반응형 값은 의존성 배열에 포함되어야 함
- `roomId`, `props`, `state`, 또는 컴포넌트 내부에 선언된 값들이 여기에 해당됨
- 어떤 값을 의존성 목록에서 제거하고 싶다면, 그것이 반응형이 아님을 증명해야 함

##### 반응형이 아님을 증명하는 두 가지 방법
일반적으로 다음 두 가지 방법이 있다:  
1. 값을 컴포넌트 바깥으로 이동하여 반응형이 아닌 상수로 만듦
2. Effect 내부에서만 사용하는 비반응형 지역 변수로 처리

```jsx
const serverUrl = 'https://localhost:1234';
const roomId = 'music'; // ✅ 더 이상 반응형이 아님

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ 의존성 없음, 린트 통과
}
```

#### 질문과 답변
Q1. roomId가 의존성에서 빠지면 어떤 문제가 생기나요?  
A1. roomId는 prop이기 때문에 렌더링에 따라 바뀔 수 있음. 의존성에서 빠지면 변경 사항을 감지하지 못하고 오래된 값으로 Effect가 실행되어 버그가 발생할 수 있음

---

### To change the dependencies, change the code
You might have noticed a pattern in your workflow:

1. First, you **change the code** of your Effect or how your reactive values are declared.
1. Then, you follow the linter and adjust the dependencies to **match the code you have changed**.
1. If you’re not happy with the list of dependencies, you **go back to the first step** (and change the code again).


💡 핵심 표현  
> 💬 원문:  
> “If you want to change the dependencies, change the surrounding code first.”  
> 📝 한글 번역:  
> 의존성 목록을 바꾸고 싶다면, 먼저 그 주변 코드를 바꾸세요.

> 💬 원문:  
> “You don’t *choose* what to put on that list. The list *describes* your code.”  
> 📝 한글 번역:  
> 당신은 의존성 목록에 무엇을 *넣을지 선택*하지 않습니다. 이 목록은 당신의 *코드를 설명*합니다.

#### 내용 정리
- useEffect의 의존성 배열은 코드에서 사용하는 반응형 값들을 자동으로 반영해야 함
- 의존성 배열을 바꾸고 싶다고 해서 임의로 값을 빼거나 억지로 suppress lint 해서는 안 됨
- **코드를 먼저 바꾸고, 그에 따라 필요한 값만 의존성 배열에 포함되도록** 해야 함

#### 질문과 답변
Q1. 의존성 배열을 내가 직접 관리해도 괜찮은가요?  
A1. 의존성 배열은 자동으로 정해지는 결과이지, 임의로 구성하는 것이 아님. 린터가 알려주는 대로 코드에 맞게 맞추는 것이 원칙

Q2. Effect에서 특정 값만 반응하게 만들고 싶은데, 의존성 배열을 줄일 방법은 없을까요?  
A2. 그럴 경우 Effect 내부의 코드를 분리하거나, 구조를 바꾸는 방식으로 해결해야 함. 즉, 의존성을 줄이려면 먼저 코드 구조를 수정해야 함

Q3. suppress lint를 써서 린터를 끄면 어떤 문제가 생기나요?  
A3. 린터를 억지로 끄면, 의존성에서 빠진 값이 변경되어도 Effect가 실행되지 않아 예측 불가능한 버그가 생김

---

## 2.	Removing unnecessary dependencies

### Should this code move to an event handler?
💡 핵심 표현  
> 💬 원문:  
> “**The problem here is that this shouldn't be an Effect in the first place.**”  
> 📝 한글 번역:  
여기서의 문제는 이 코드가 애초에 Effect 안에 있을 필요가 없다는 것입니다.

> 💬 원문:  
> “To run some code in response to particular interaction, put that logic directly into the corresponding event handler.”  
> 📝 한글 번역:  
> 특정 사용자 상호작용에 반응하여 코드를 실행하려면, 그 로직을 해당 이벤트 핸들러 안에 직접 넣어야 합니다.

#### 내용 정리
- 어떤 코드가 **사용자 상호작용(예: 클릭, 폼 제출 등)**에 의해서만 실행되어야 한다면, 그 코드는 Effect가 아니라 이벤트 핸들러에 있어야 함
- Effect는 렌더링 후 동기화 목적에 적합하고, 특정한 인터랙션을 감지해 실행하는 용도로는 적합하지 않음
- Effect 내에서 if (submitted) 조건문을 사용해 POST 요청을 보내는 방식은 문제가 될 수 있음
- 테마나 기타 상태가 바뀌는 것과 같은 외부 요인에 의해 Effect가 다시 실행되면, 원하지 않는 부작용이 발생할 수 있음

#### 예시 코드 및 주석 해설
> 사용자의 직접적인 행동에 반응하는 로직은 useEffect 안이 아니라, onClick, onSubmit 등의 이벤트 핸들러 안에서 처리해야 함

잘못된 코드 – 제출 상태에 따라 Effect 안에서 실행됨
```jsx
function Form() {
  const [submitted, setSubmitted] = useState(false);
  const theme = useContext(ThemeContext);

  useEffect(() => {
    if (submitted) {
      // 🔴 부적절: 상호작용 기반 로직이 Effect에 있음
      post('/api/register');
      showNotification('Successfully registered!', theme);
    }
  }, [submitted, theme]);
}
```

올바른 코드 – 이벤트 핸들러에서 직접 실행  
```jsx
function Form() {
  const theme = useContext(ThemeContext);

  function handleSubmit() {
    // ✅ 적절: 직접 이벤트 핸들러에서 실행
    post('/api/register');
    showNotification('Successfully registered!', theme);
  }
}
```


### Is your Effect doing several unrelated things?
💡 핵심 표현  
> 💬 원문:  
> “A single Effect synchronizes two independent processes.”  
> 📝 한글 번역:  
> 하나의 Effect가 두 개의 독립적인 프로세스를 동기화하고 있습니다.

> 💬 원문:  
> “Each Effect should represent an independent synchronization process.”  
> 📝 한글 번역:  
> 각 Effect는 하나의 독립적인 동기화 과정을 나타내야 합니다.

#### 내용 정리
- 하나의 Effect에서 **서로 관련 없는 작업(예: 도시 목록과 지역 목록 요청)**을 함께 처리하는 것은 의존성 충돌과 불필요한 실행을 유발할 수 있음
- 각각의 작업은 의존하는 값이 다르기 때문에, 서로 다른 Effect로 분리하는 것이 원칙 -> **"Each Effect should represent an independent synchronization process."**
- Effect는 **“무엇과 동기화되는가?”**에 따라 쪼개는 것이 좋음
	- 예: country 변경 시 → 도시 목록 요청
	- 예: city 변경 시 → 지역 목록 요청
- 이렇게 분리하면 서로의 실행에 영향을 주지 않으며, 유지보수와 디버깅도 쉬워짐


#### 예시 코드 및 주석 해설
잘못된 코드 – 하나의 Effect에서 country와 city 모두 처리  
```jsx
useEffect(() => {
  fetch(`/api/cities?country=${country}`).then(...);
  if (city) {
    fetch(`/api/areas?city=${city}`).then(...);
  }
}, [country, city]); // ❌ city만 바뀌어도 도시 API 호출됨
```

올바른 코드 – 각각의 Effect로 분리  
```jsx
// country가 바뀔 때만 실행
useEffect(() => {
  fetch(`/api/cities?country=${country}`).then(...);
}, [country]);

// city가 바뀔 때만 실행
useEffect(() => {
  if (city) {
    fetch(`/api/areas?city=${city}`).then(...);
  }
}, [city]);
```

> 이렇게 분리하면 city가 바뀌어도 cities를 다시 가져오지 않고, 의도한 동기화만 발생함

#### 질문과 답변
Q1. 하나의 Effect에서 여러 동작을 처리하면 안 되나요?  
A1. 가능하긴 하지만, 동기화 대상이 다르면 분리하는 것이 원칙. 그렇지 않으면 한 값의 변경으로 다른 API 호출이 의도치 않게 재실행될 수 있음

Q2. Effect가 여러 개면 코드가 더 복잡해지지 않나요?  
A2. 단기적으로는 그럴 수 있지만, 유지보수와 예측 가능성 측면에서 훨씬 유리. 의존성과 동기화 흐름이 명확해지기 때문

Q3. 이런 구조를 반복하게 된다면 어떻게 개선하나요?  
A3. 반복되는 로직을 공통화해 Custom Hook으로 분리할 수 있음

---

### Are you reading some state to calculate the next state?
💡 핵심 표현  
> 💬 원문:  
> “To fix the issue, don't read messages inside the Effect. Instead, pass an updater function to setMessages.”  
> 📝 한글 번역:  
> 이 문제를 해결하려면 Effect 안에서 messages를 읽지 말고, 대신 updater 함수(setMessages에 함수 형태)를 전달하세요.

> 💬 원문:  
> “React puts your updater function in a queue and will provide the msgs argument to it during the next render.”  
> 📝 한글 번역:  
> 리액트는 업데이트 함수를 큐에 넣고, 다음 렌더 시 해당 함수에 msgs 인자를 전달합니다.

#### 내용 정리
- Effect 내부에서 현재 상태값(state)을 읽고 이를 기반으로 다음 상태를 계산하는 경우, 그 상태값이 의존성 배열에 포함되어야 함
- 하지만 이렇게 하면 상태가 바뀔 때마다 Effect가 다시 실행되어 **원치 않는 부작용(ex: 재연결 등)**이 발생할 수 있음
- 해결 방법은 현재 상태값을 직접 읽지 않고, setState(prev => next) 형태의 updater 함수를 사용하는 것
- 이 방법은 React가 업데이트 큐에서 순서대로 처리하므로 불필요한 재실행 없이 최신 상태를 안전하게 사용할 수 있음

#### 예시 코드 및 주석 해설
잘못된 코드 – 상태 messages를 직접 읽고 새 배열 생성
```jsx
useEffect(() => {
  const connection = createConnection();
  connection.connect();
  connection.on('message', (receivedMessage) => {
    setMessages([...messages, receivedMessage]); // ❌ messages 직접 참조
  });
  return () => connection.disconnect();
}, [roomId, messages]); // ❌ messages가 바뀔 때마다 Effect 재실행됨
```

올바른 코드 – updater 함수 사용으로 상태 참조 회피
```jsx
useEffect(() => {
  const connection = createConnection();
  connection.connect();
  connection.on('message', (receivedMessage) => {
    setMessages(msgs => [...msgs, receivedMessage]); // ✅ 최신 상태 안전하게 사용
  });
  return () => connection.disconnect();
}, [roomId]); // ✅ messages 의존성 제거 가능
```

> Effect 내에서 상태를 직접 참조하지 않으면 의존성에서 제거할 수 있어 불필요한 재실행 방지에 효과적

#### 질문과 답변
Q1. 상태를 읽지 않으면 어떻게 새로운 값을 만들 수 있나요?  
A1. `setState(prev => newValue)` 형태로 함수를 넘기면, React가 내부적으로 **가장 최신의 상태값(prev)**을 전달해주므로 직접 읽을 필요가 없음

Q2. 이 방법은 항상 쓸 수 있나요?  
A2. “이전 상태를 기반으로 새로운 상태를 계산할 때”는 항상 사용 가능함. 단, 외부 값과 함께 계산하는 경우는 별도 처리 필요할 수 있음

Q3. updater 함수를 쓰면 의존성 배열에서 상태를 빼도 되나요?  
A3. 네, updater 함수는 상태값을 직접 참조하지 않기 때문에, 해당 상태를 의존성 배열에 포함하지 않아도 됨

---

### Do you want to read a value without “reacting” to its changes?
💡 핵심 표현  
> 💬 원문:  
> “You don’t want this Effect to 'react' to the changes in isMuted.”  
> 📝 한글 번역:  
> 이 Effect가 isMuted의 변경에 ‘반응’하길 원하지 않습니다.

> 💬 원문:  
> “Now that you read isMuted inside an Effect Event, it doesn't need to be a dependency of your Effect.”  
> 📝 한글 번역:  
> Effect Event 내부에서 isMuted를 읽기 때문에, 더 이상 Effect의 의존성에 포함할 필요가 없습니다.

#### 내용 정리
- 특정 값(예: isMuted)은 최신값을 읽고 싶긴 하지만, 그것이 변경될 때 Effect가 다시 실행되길 원하지 않는 경우가 있음
- 이럴 땐 useEffectEvent (experimental API)를 활용해 Effect 안의 비반응형 동작을 분리할 수 있음
- useEffectEvent를 통해 만든 함수는 항상 최신 상태/props를 읽을 수 있지만, 반응형 의존성은 아님
- 따라서 의존성 배열에서 제외할 수 있고, Effect의 재실행을 방지할 수 있음

#### 예시 코드 및 주석 해설
잘못된 코드 – isMuted를 직접 사용하여 의존성에 포함됨
```jsx
useEffect(() => {
  connection.on('message', (receivedMessage) => {
    setMessages(msgs => [...msgs, receivedMessage]);
    if (!isMuted) {
      playSound(); // ❌ isMuted 변경 시 Effect 재실행됨
    }
  });
}, [roomId, isMuted]);
```

올바른 코드 – isMuted를 Effect Event로 분리
```jsx
const onMessage = useEffectEvent(receivedMessage => {
  setMessages(msgs => [...msgs, receivedMessage]);
  if (!isMuted) {
    playSound(); // ✅ 최신 값을 읽지만, 의존성 아님
  }
});

useEffect(() => {
  connection.on('message', (msg) => {
    onMessage(msg);
  });
}, [roomId]); // ✅ isMuted 빠짐
```

#### 질문과 답변
Q1. 왜 isMuted를 의존성에서 제거하고 싶나요?  
A1. isMuted는 단순히 읽고만 싶은 값인데, 의존성에 넣으면 바뀔 때마다 Effect가 재실행되어 불필요한 재연결 등 부작용이 생김

Q2. useEffectEvent가 없을 땐 어떻게 하나요?  
A2. 일반적으로는 useRef로 상태를 저장하고 참조하는 방식 등을 사용했지만, 이는 복잡하고 오류 발생 가능성이 높습니다. useEffectEvent가 공식적으로 더 안전한 방식

---

### Does some reactive value change unintentionally?
💡 핵심 표현  
> 💬 원문:  
> “Object and function dependencies can make your Effect re-synchronize more often than you need.”  
> 📝 한글 번역:  
> 객체와 함수 의존성은 Effect가 **필요 이상으로 자주 다시 동기화**되게 만들 수 있습니다.

> 💬 원문:  
> “In JavaScript, each newly created object and function is considered distinct from all the others.”  
> 📝 한글 번역:  
> JavaScript에서 새로 생성된 객체와 함수는 **내용이 같더라도** 모두 서로 다른 것으로 간주됩니다.

#### 내용 정리
- useEffect 안에서 사용하는 객체나 함수는 매 렌더링마다 새로 생성되기 때문에, 항상 새로운 값처럼 인식되어 Effect를 불필요하게 재실행시킬 수 있음
- 이는 특히 const options = { serverUrl, roomId } 같은 구조에서 자주 발생

해결책은 다음과 같음:
1. 정적 객체/함수는 컴포넌트 밖으로 이동
2. 동적 객체/함수는 Effect 내부로 이동
3. 객체에서 원시값만 추출해 의존성으로 사용
4. props로 받은 객체/함수 대신 원시값만 props로 전달

#### 예시 코드 및 주석 해설
잘못된 코드 – 매번 새로운 객체가 생성되어 Effect가 재실행됨
```jsx
function ChatRoom({ roomId }) {
  const options = { serverUrl: 'https://localhost:1234', roomId };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ❌ options가 매 렌더링마다 새로 만들어짐
}
```

해결 방법 ①: **정적 객체는 컴포넌트 밖으로 이동**
```jsx
const options = { serverUrl: 'https://localhost:1234', roomId: 'music' };

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ 재생성되지 않으므로 안전
}
```

✅ 해결 방법 ②: **동적 객체는 Effect 내부로 이동**
```jsx
function ChatRoom({ roomId }) {
  useEffect(() => {
    const options = { serverUrl: 'https://localhost:1234', roomId };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ 객체는 외부에 없음 → 의존성 안전
}
```

✅ 해결 방법 ③: **객체에서 원시값만 추출**
```jsx
function ChatRoom({ options }) {
  const { roomId, serverUrl } = options;

  useEffect(() => {
    const connection = createConnection({ roomId, serverUrl });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ 원시값 기준으로만 비교
}
```

#### 질문과 답변
Q1. 왜 객체를 의존성 배열에 넣으면 안 되나요?  
A1. 객체는 렌더링마다 새로운 참조값을 갖기 때문에, 내용이 같더라도 React는 다른 값으로 간주하고 Effect를 다시 실행하게 됨

Q2. props로 객체를 넘기면 항상 문제가 되나요?  
A2. 객체를 그대로 넘기면 렌더링마다 새로운 객체가 생성되기 쉬우므로 불필요한 재렌더링/재실행이 발생할 수 있음. 가능하면 원시값으로 나눠서 props로 넘기는 것이 권장

Q3. 함수도 같은 문제를 일으키나요?  
A3. 네, 함수도 렌더링 시마다 새로 생성되면 새로운 참조가 되어 의존성 변경으로 인식. 동일하게 Effect 안으로 넣거나 useEffectEvent 등을 사용하는 방식으로 해결해야 함


---

## Recap
💬 원문:  
- Dependencies should always match the code.
- When you’re not happy with your dependencies, what you need to edit is the code.
- Suppressing the linter leads to very confusing bugs, and you should always avoid it.
- To remove a dependency, you need to “prove” to the linter that it’s not necessary.
- If some code should run in response to a specific interaction, move that code to an event handler.
- If different parts of your Effect should re-run for different reasons, split it into several Effects.
- If you want to update some state based on the previous state, pass an updater function.
- If you want to read the latest value without “reacting” it, extract an Effect Event from your Effect.
- In JavaScript, objects and functions are considered different if they were created at different times.
- Try to avoid object and function dependencies. Move them outside the component or inside the Effect.

📝 한글 번역:  
- 종속성은 항상 코드와 일치해야 함
- 종속성이 마음에 들지 않을 때는 코드를 수정해야 함
- 린터를 억제하면 매우 혼란스러운 버그가 발생하므로 항상 이를 피해야 함
- 종속성을 제거하려면 해당 종속성이 필요하지 않다는 것을 린터에 '증명'해야 함
- 특정 상호작용에 대한 응답으로 일부 코드가 실행되어야 하는 경우 해당 코드를 이벤트 핸들러로 옮기기
- 이펙트의 여러 부분이 다른 이유로 다시 실행되어야 하는 경우 여러 개의 이펙트로 분할하기
- 이전 상태를 기반으로 일부 상태를 업데이트하려면 업데이터 함수를 전달하기
- “반응”하지 않고 최신 값을 읽으려면 효과에서 효과 이벤트를 추출하기
- 자바스크립트에서 객체와 함수는 서로 다른 시간에 생성된 경우 서로 다른 것으로 간주됨
- 객체와 함수의 종속성을 피하기. 컴포넌트 외부나 Effect 내부로 이동하기

---

## Challenges

### Challenge 1: Fix a resetting interval
매 초마다 동작하는 setInterval을 useEffect로 설정했는데,
매 tick마다 interval이 계속 재생성되고 있다는 점을 발견했습니다.  
이 문제를 해결하여 interval이 한 번만 생성되도록 수정해야 합니다. 


#### 해결 코드
- useEffect 안에서 count를 직접 참조하고 있기 때문에, count가 바뀔 때마다 Effect가 다시 실행되고 interval도 다시 만들어짐
- 상태값에 직접 접근하는 대신, updater 함수를 사용하면 이 문제를 피할 수 있음

```jsx
useEffect(() => {
  const id = setInterval(() => {
    setCount(c => c + 1); // ✅ 상태를 직접 참조하지 않고, 최신 값 기반으로 업데이트
  }, 1000);

  return () => clearInterval(id);
}, []); // ✅ 빈 배열 → 단 한 번만 실행됨
```

> 📌 setCount(c => c + 1) 형식으로 updater 함수를 사용하면 Effect 내부에서 count를 참조하지 않게 되어 의존성을 제거할 수 있고, useEffect는 단 한 번만 실행되어 interval이 고정됨

#### 출제 의도와 학습 포인트
출제 의도
- 개발자들이 흔히 실수하는 패턴인 "state를 읽어서 setState하는 방식"의 위험성을 인식하게 하고,
- 리액트의 상태 큐 시스템(updater function)을 통해 문제를 해결하도록 유도

학습 요소
- 의존성을 제거하기 위한 updater 함수 패턴 사용법
- 불필요한 재실행의 원인 분석: 의존성 배열에 포함된 상태값
- React에서 setInterval을 안정적으로 사용할 때의 패턴 이해

#### 예상 질문과 답변
Q. 왜 count를 useEffect 안에서 직접 쓰면 안 되나요?
A. 그러면 매번 count가 바뀔 때마다 Effect가 재실행되어 setInterval이 반복적으로 재생성되기 때문

Q. setCount(count + 1)과 setCount(c => c + 1)의 차이는 무엇인가요?
A. 전자는 외부의 count 값을 직접 참조하지만, 후자는 리액트가 최신 값을 넘겨주는 함수형 업데이트 방식. 후자가 안정적이고 재실행을 막을 수 있음

---

### Challenge 2: Fix a retriggering animation
이 Effect는 컴포넌트가 마운트될 때 fade-in 애니메이션을 실행합니다.  
하지만 “Next” 버튼을 누를 때마다 애니메이션이 반복 실행되는 현상이 발생하고 있습니다.  
문제를 해결하여 애니메이션이 처음 한 번만 실행되도록 수정하세요.

#### 해결 코드
- Effect의 의존성 배열에 포함된 값이 객체일 경우, 내용이 같더라도 렌더링마다 새 객체로 간주되어 Effect가 재실행됨
- 객체 참조의 일관성이 유지되지 않으면, 의도치 않게 반복 실행될 수 있음
- 애니메이션은 한 번만 실행되어야 하므로, 객체를 Effect 내부로 이동하거나 의존성을 제거할 필요가 있음

잘못된 예시 (추측)
```jsx
useEffect(() => {
  fadeIn(element); // 매번 객체가 새로 생성됨
}, [style]); // ❌ style 객체가 렌더링마다 새로워서 다시 실행됨
```

올바른 수정 예시
```jsx
useEffect(() => {
  fadeIn(element); // ✅ 한 번만 실행
}, []); // ✅ 의존성 없음 → 마운트 시 한 번 실행
```

또는 style 객체가 필요하다면:
```jsx
useEffect(() => {
  const style = getStyle(); // ✅ Effect 내부에서 객체 생성
  fadeIn(element, style);
}, []); // ✅ 외부 의존성 없음
```

> 핵심은: Effect 외부에서 만든 비정적 객체/함수는 매번 새로워지므로 의존성으로 넣지 말고, **Effect 내부로 이동시키거나 분리된 상태만 의존성으로 남기는 것**이 중요

#### 출제 의도와 학습 포인트
- 렌더링마다 새로 생성되는 참조 타입(객체, 함수 등)이 의존성 배열에서 어떻게 작용하는지 이해
- Effect의 한 번만 실행되는 조건과 불필요한 실행을 막기 위한 코드 구조를 익히게 하기 위함

#### 예상 질문과 답변
Q. 왜 객체가 같아 보여도 Effect가 다시 실행되나요?  
A. JavaScript에서는 객체가 생성 시점 기준으로 다르면 참조도 다르다고 판단함. 따라서 값이 같더라도 매 렌더링마다 새로 만들어진 객체는 의존성 변화로 간주되어 Effect가 재실행됨

Q. 객체를 의존성 배열에서 제외하면 안전한가요?  
A. 상황에 따라 다름. 해당 객체가 실제로 바뀌어 재실행되어야 할 이유가 없다면, Effect 내부에서 생성하거나 useMemo로 캐싱하여 안정화시켜야 함

Q. 애니메이션이 mount될 때 한 번만 실행되도록 하려면 어떤 조건이 필요한가요?  
A. useEffect의 의존성 배열을 []로 설정하여 컴포넌트가 처음 나타날 때 한 번만 실행되도록 해야 함

---

### Challenge 3: Fix a resetting connection
이 예제에서는 버튼을 눌러 테마를 변경할 때마다 채팅이 재연결되는 문제가 발생합니다.  
이 문제를 해결하여, 채팅은 오직 Server URL이나 채팅방(room)을 변경했을 때만 재연결되도록 수정하세요.

#### 해결 코드
Effect가 options를 의존하면, 리렌더마다 새로운 객체가 생성되어 Effect가 매번 실행되어 재연결이 발생함

문제 원인 요약:
```jsx
const options = {
  serverUrl: serverUrl,
  roomId: roomId
};

<ChatRoom options={options} />
```

```jsx
useEffect(() => {
  const connection = createConnection(options);
  ...
}, [options]);
```

올바른 코드
1. options 객체는 매번 새로 생성되므로 dependency로 쓰기에 적절하지 않음
2. 객체를 분해(destructure) 하여 내부의 primitive 값(roomId, serverUrl)만 의존성으로 등록
3. 객체 생성은 Effect 내부에서 실행

```jsx
export default function ChatRoom({ options }) {
  const { roomId, serverUrl } = options;

  useEffect(() => {
    const connection = createConnection({
      roomId,
      serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ 이제 객체가 아닌 원시 값에만 의존
}
```

#### 출제 의도와 학습 포인트
- Effect의 dependency로 객체를 직접 넣을 경우 발생하는 부작용 이해
- reactive 값만 의존성으로 사용하는 패턴 학습
- 불필요한 re-render를 피하기 위한 dependency 정제
- 실무에서도 흔히 발생하는 “의도치 않은 Effect 재실행” 문제를 해결하는 경험 제공

#### 예상 질문과 답변
Q1. 왜 options 객체를 의존성으로 쓰면 안 되나요?
A: options 객체는 매 렌더링마다 새롭게 생성되는 “새로운 객체”이기 때문에, 객체의 내용이 같더라도 === 비교에서는 다르게 평가됨.  
즉, useEffect의 dependency array에 [options]가 있을 경우, 매 렌더링마다 객체가 변경된 것으로 인식되어 Effect가 재실행되고, 불필요하게 채팅이 재연결됨

---

### Challenge 4 of 4: Fix a reconnecting chat, again
이번 예제는 암호화 여부를 선택할 수 있는 채팅 애플리케이션입니다.  
하지만 테마를 토글할 때마다 불필요하게 채팅이 재연결되고 있습니다.  
이 문제를 수정하여, 테마 변경은 재연결을 유발하지 않도록 하세요.  
단, 암호화 설정 또는 room 변경 시에는 정상적으로 재연결되어야 합니다.  

#### 해결 코드

🛠️ 문제 원인 요약
- onMessage와 createConnection 함수가 매번 새롭게 생성됨
- 이 함수들을 useEffect dependency로 넣으면, 테마(isDark)가 바뀔 때도 Effect가 다시 실행됨

```jsx
<ChatRoom
  onMessage={msg => { showNotification(msg, isDark ? 'dark' : 'light'); }}
  createConnection={() => {
    return isEncrypted ? createEncryptedConnection(...) : createUnencryptedConnection(...);
  }}
/>
```

✅ 해결 전략
1. onMessage → Effect Event로 감싸기 (실험적 API useEffectEvent)
2. createConnection → props로 넘기지 않고, Effect 내부에서 생성하도록 수정
3. dependency list에서 함수가 빠지게 되어, 불필요한 Effect 실행 방지

```jsx
// ChatRoom.js
export default function ChatRoom({ roomId, isEncrypted, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    function createConnection() {
      const options = { serverUrl: 'https://localhost:1234', roomId };
      return isEncrypted
        ? createEncryptedConnection(options)
        : createUnencryptedConnection(options);
    }

    const connection = createConnection();
    connection.on('message', msg => onReceiveMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]); // ✅ 더 이상 테마에 반응하지 않음
}
```

#### 출제 의도와 학습 포인트
- Effect 안에서 이벤트 핸들러를 다루는 방법 학습
- 함수를 dependency로 넘길 때 발생하는 문제 해결 전략
- useEffectEvent (실험적 API) 를 통한 함수 래핑 실습
- Effect 내부에서 함수 선언 및 호출 방식 정리

#### 예상 질문과 답변
Q1. onMessage, createConnection을 props로 넘겼을 때 문제가 생기는 이유는 뭔가요?  
A:이 두 함수는 App 컴포넌트 내에서 inline arrow function으로 작성되어 있기 때문에, 렌더링할 때마다 새로 생성되는 함수임. 이렇게 새로 생성된 함수는 항상 새로운 참조값을 가지기 때문에, useEffect의 dependency에 포함되면 Effect가 매번 재실행됨. 결과적으로 테마를 바꿀 때마다 채팅이 재연결되는 문제가 발생함.
