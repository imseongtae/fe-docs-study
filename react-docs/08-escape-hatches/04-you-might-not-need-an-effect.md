# You Might Not Need an Effect
이 문서는 useEffect의 사용을 줄이고, 보다 선언적인 리액트 코드를 작성하는 방법에 대해 설명하고 있음  
“효과적으로 Effect를 줄이는 법”에 초점을 맞추고 있으며, 자주 발생하는 불필요한 Effect 사용 사례를 다루고 있음

```plaintext
💬 원문:  
Effects are an escape hatch from the React paradigm. They let you “step outside” of React and synchronize your components with some external system like a non-React widget, network, or the browser DOM. If there is no external system involved (for example, if you want to update a component’s state when some props or state change), you shouldn’t need an Effect. Removing unnecessary Effects will make your code easier to follow, faster to run, and less error-prone.

---

📝 한글 번역:  

```

> 이 문서에서는 React 컴포넌트가 외부 시스템과 동기화할 필요가 있을 때 사용하는 “Effect”에 대해 다룸. Effect는 브라우저 API 호출, 서버 연결, 애널리틱스 전송 등 렌더링 이후에 수행되어야 하는 사이드 이펙트를 처리함.

> ### You will learn
> - Why and how to remove unnecessary Effects from your components
> - How to cache expensive computations without Effects
> - How to reset and adjust component state without Effects
> - How to share logic between event handlers
> - Which logic should be moved to event handlers
> - How to notify parent components about changes


## Table of contents
1. [How to remove unnecessary Effects](#1-how-to-remove-unnecessary-effects)
1. [](#)
1. [](#)
1. [](#)

1. [Recap](#recap)
1. [Challenges](#challenges)

---

## 1. How to remove unnecessary Effects
불필요한 Effect를 제거하는 방법  

💡 핵심 표현
> 💬 원문:  
> “If there is no external system involved (for example, if you want to update a component’s state when some props or state change), you shouldn’t need an Effect.”  
> 📝 한글 번역:  
> 외부 시스템이 관련되지 않는 경우(예: props나 state가 변경될 때 컴포넌트의 상태를 업데이트하려는 경우)라면 Effect는 필요하지 않습니다.  

> 💬 원문:  
> “Removing unnecessary Effects will make your code easier to follow, faster to run, and less error-prone.”  
> 📝 한글 번역:  
> 불필요한 Effect를 제거하면 코드는 더 이해하기 쉬워지고, 더 빠르게 실행되며, 오류 가능성이 줄어듭니다.  

Effect가 필요하지 않은 두 가지 일반적인 경우:

**1. 렌더링을 위한 데이터 변환**
예시: 리스트 필터링 시 Effect와 useState를 사용하는 대신. 렌더링 중 계산하는 방식이 더 적합함

```jsx
// ❌ 잘못된 예시
useEffect(() => {
  setFilteredData(data.filter(...));
}, [data]);

// ✅ 권장 예시
const filteredData = data.filter(...);
```

**2. 사용자 이벤트 처리**
- 클릭 등의 이벤트는 Effect가 아닌 직접 핸들러 안에서 처리해야 함.
- 이유: Effect는 무슨 일이 일어났는지를 정확히 알 수 없기 때문.


## 2. Updating state based on props or state

💡 핵심 표현
> 💬 원문:  
> “When something can be calculated from the existing props or state, don’t put it in state. Instead, calculate it during rendering.”  
> 📝 한글 번역:  
> 기존 props나 state에서 계산할 수 있는 값이라면 state에 따로 보관하지 마세요. 대신 렌더링 중 계산하도록 하세요.

```jsx
// ❌ 잘못된 패턴
const [fullName, setFullName] = useState('');
useEffect(() => {
  setFullName(firstName + ' ' + lastName);
}, [firstName, lastName]);

// ✅ 좋은 패턴
const fullName = firstName + ' ' + lastName;
```

## 3. Caching expensive calculations
💡 핵심 표현
> 💬 원문:  
> “You can cache (or ‘memoize’) an expensive calculation by wrapping it in a useMemo Hook.”  
> 📝 한글 번역:  
> 계산 비용이 높은 연산은 useMemo Hook으로 감싸 캐싱(메모이제이션)할 수 있습니다.  

```jsx
const visibleTodos = useMemo(() => {
  return getFilteredTodos(todos, filter);
}, [todos, filter]);
```

### 질문과 답변
Q1. useMemo를 언제 사용해야 하나요?
A1. 연산량이 크거나 재계산이 잦은 값을 렌더링 중 캐싱하고 싶을 때 사용합니다.

Q2. 모든 계산에 useMemo를 써야 하나요?
A2. 단순 계산에는 오히려 비용이 증가할 수 있어 불필요한 최적화는 지양해야 함

---

## 4. Resetting all state when a prop changes
💡 핵심 표현
> 💬 원문:  
> “By passing userId as a key to the Profile component, you’re asking React to treat two Profile components with different userId as two different components that should not share any state.”  
> 📝 한글 번역:  
> userId를 Profile 컴포넌트의 key로 전달함으로써, React에게 서로 다른 userId를 가진 Profile 컴포넌트는 상태를 공유하지 않는 별개의 컴포넌트로 처리하라고 지시하는 것입니다.  

### 요약
- prop(userId)이 변경될 때 모든 상태를 재설정하고 싶다면, key를 활용해 컴포넌트를 강제로 다시 마운트하는 것이 효과적임
- useEffect를 통해 상태를 재설정하면 첫 번째 렌더는 “오래된 상태”로 렌더되고 이후 재렌더가 일어나므로 비효율적임

```jsx
// ❌ 잘못된 패턴
useEffect(() => {
  setComment('');
}, [userId]);

// ✅ 좋은 패턴
<Profile userId={userId} key={userId} />
```

### 질문과 답변
Q1. key를 사용하면 어떤 점이 좋은가요?
A1. React는 key가 변경되면 해당 컴포넌트를 새로 마운트하고 기존 상태를 제거하기 때문에, 상태 초기화가 필요할 때 유용합니다.

Q2. useEffect로 상태 초기화를 하면 안 되나요?
A2. 렌더링 이후 실행되므로 UX가 나쁘고, 중첩된 컴포넌트까지 초기화하려면 코드가 복잡해지기 때문에 지양해야 합니다.

---

## 5. Adjusting some state when a prop changes
💡 핵심 표현
> 💬 원문:  
> “Adjusting state based on props or other state makes your data flow more difficult to understand and debug.”  
> 📝 한글 번역:  
> props나 다른 상태를 기반으로 상태를 조정하면 데이터 흐름을 이해하고 디버깅하기 어려워집니다.  

### 요약
- prop 변경 시 일부 상태만 조정하려는 경우 Effect를 사용하는 대신 렌더링 중 직접 조건을 검사하여 상태를 변경하는 방식이 더 나음
- 혹은 아예 상태 구조를 변경하여 계산 가능한 상태로 치환하는 것이 이상적

코드:
```jsx
// ❌ 잘못된 패턴
useEffect(() => {
  setSelection(null);
}, [items]);

// ✅ 조금 더 나은 패턴
if (items !== prevItems) {
  setPrevItems(items);
  setSelection(null);
}

// ✅ 가장 좋은 패턴
const selection = items.find(item => item.id === selectedId) ?? null;
```


### 질문과 답변
Q1. useEffect 대신 렌더링 중에 상태를 업데이트해도 되나요?  
A1. 가능함. 단, 상태 간의 무한 루프를 방지하려면 조건 검사 (items !== prevItems)가 필요함

Q2. 계산 가능한 상태로 치환하면 무엇이 좋은가요?  
A2. 상태 동기화 이슈를 피할 수 있어 코드가 간단해지고, 버그도 줄어듦

---

## 6. Sharing logic between event handlers
💡 핵심 표현
> 💬 원문:  
> “Use Effects only for code that should run because the component was displayed to the user.”  
> 📝 한글 번역:  
> 컴포넌트가 사용자에게 표시되었기 때문에 실행되어야 하는 코드만 Effect에서 사용하세요.

### 요약
- 사용자 이벤트에 따른 동작(addToCart, showNotification)은 Effect가 아니라 이벤트 핸들러 안에서 직접 실행해야 함
- Effect는 컴포넌트 표시 시 실행되므로, 원하지 않는 동작(예: 페이지 새로고침 후 알림 재출력)이 발생할 수 있음
- 공통 로직은 별도 함수로 추출해 각 핸들러에서 호출하면 됨

예시:
```jsx
// ❌ 잘못된 패턴
useEffect(() => {
  if (product.isInCart) {
    showNotification(...);
  }
}, [product]);

// ✅ 좋은 패턴
function buyProduct() {
  addToCart(product);
  showNotification(...);
}
```


### 질문과 답변
Q1. 이벤트에서 발생한 동작도 Effect로 처리하면 안 되나요?
A1. 사용자 상호작용의 결과는 즉시 실행되어야 하며, Effect는 렌더 이후 실행되므로 동기적이지 않아 부적절함

Q2. 중복되는 이벤트 로직은 어떻게 처리해야 하나요?
A2. 공통 로직을 함수로 분리해서 핸들러들에서 호출하면, 코드 재사용성과 유지보수성을 높임

---

## 7. Sending a POST request
💡 핵심 표현
> 💬 원문:  
> “The /api/register POST request is not caused by the form being displayed. You only want to send the request at one specific moment in time: when the user presses the button.”  
> 📝 한글 번역:  
> /api/register POST 요청은 폼이 표시되었기 때문에 발생한 것이 아닙니다. 이 요청은 사용자가 버튼을 눌렀을 때 특정 시점에만 실행되어야 합니다.  

### 요약
- UI 표시가 아닌 사용자 상호작용으로 발생하는 동작은 Effect가 아니라 이벤트 핸들러 내부에서 실행해야 함
- Effect로 처리할 경우 의도치 않은 시점에 서버 요청이 발생할 수 있음
- 예: showForm 값이 false가 되는 순간 POST 요청이 발생하게 되면, 초기값이 false인 경우 의도하지 않은 빈 메시지가 전송될 수 있음


예시:
```jsx
// ❌ 잘못된 패턴
useEffect(() => {
  if (!showForm) {
    sendMessage(message);
  }
}, [showForm, message]);

// ✅ 좋은 패턴
function handleSubmit(e) {
  e.preventDefault();
  setShowForm(false);
  sendMessage(message);
}
```

### 질문과 답변
Q1. 왜 POST 요청을 Effect에서 실행하면 안 되나요?
A1. Effect는 컴포넌트 렌더링 이후 실행되므로, 폼이 표시되지 않아도 요청이 전송될 수 있어 예기치 않은 동작을 유발할 수 있음

Q2. 어떤 경우에는 POST 요청을 Effect에서 실행해도 괜찮은가요?
A2. 사용자가 화면을 본 것 자체가 의미가 있는 경우, 예: 분석 로그 전송 등은 Effect로 처리해도 괜찮음

---

## 8. Chains of computations
💡 핵심 표현
> 💬 원문:  
> “It is very inefficient: the component (and its children) have to re-render between each set call in the chain.”  
> 📝 한글 번역:  
> 이 방식은 매우 비효율적입니다. 체인의 각 set 호출마다 컴포넌트(및 자식 컴포넌트)가 다시 렌더링되어야 하기 때문입니다.  

### 요약
- Effect 체인을 통해 상태를 연쇄적으로 업데이트하는 패턴은 비효율적이고 유지보수가 어려움
- 이벤트 핸들러 내부에서 모든 상태를 계산하고 한 번에 set하는 방식이 훨씬 효율적임
- 체인을 만들면 과거 상태로 되돌리는 기능(undo 등) 구현 시에도 예기치 않게 로직이 재실행됨

```jsx
// ❌ 잘못된 체인
useEffect(() => {
  if (card !== null && card.gold) setGoldCardCount(c => c + 1);
}, [card]);

useEffect(() => {
  if (goldCardCount > 3) setRound(r => r + 1);
}, [goldCardCount]);

// ✅ 효율적인 방식
function handlePlaceCard(nextCard) {
  if (isGameOver) throw Error('Game already ended.');

  setCard(nextCard);
  if (nextCard.gold) {
    if (goldCardCount <= 3) {
      setGoldCardCount(goldCardCount + 1);
    } else {
      setGoldCardCount(0);
      setRound(round + 1);
      if (round === 5) {
        alert('Good game!');
      }
    }
  }
}
```

### 질문과 답변
Q1. Effect 체인의 가장 큰 단점은 무엇인가요?
A1. 각 상태 변경마다 재렌더링이 발생해 성능 저하 및 의도하지 않은 상태 변경을 유발함

Q2. 이벤트 핸들러 내부에서 계산하는 방식의 장점은?
A2. 모든 로직을 명확한 사용자 동작에 따라 실행할 수 있어 흐름이 직관적이고 유지보수가 쉬움

---

## 9. Initializing the application
💡 핵심 표현
> 💬 원문:  
> “If some logic must run once per app load rather than once per component mount, add a top-level variable to track whether it has already executed.”  
> 📝 한글 번역:  
> 일부 로직이 컴포넌트 마운트 시가 아니라 앱이 처음 로드될 때 한 번만 실행되어야 한다면, 전역 변수로 실행 여부를 추적하세요.  

### 요약
- 앱 전체에서 한 번만 실행되어야 하는 로직(예: 인증 토큰 확인, 로컬 저장소 로드)은 useEffect에 넣더라도 개발 환경의 Strict Mode로 인해 두 번 실행될 수 있음
- 이 경우 didInit 같은 전역 변수를 두어 실행 여부를 체크하거나, 모듈 레벨에서 실행하는 방식이 필요함

```jsx
// ✅ 전역 변수 방식
let didInit = false;

useEffect(() => {
  if (!didInit) {
    didInit = true;
    loadDataFromLocalStorage();
    checkAuthToken();
  }
}, []);

// ✅ 모듈 초기화 방식
if (typeof window !== 'undefined') {
  checkAuthToken();
  loadDataFromLocalStorage();
}
```

### 질문과 답변
Q1. 왜 useEffect가 두 번 실행되나요?
A1. React의 Strict Mode가 개발 환경에서 마운트/언마운트를 두 번 수행하여 Effect의 안정성을 점검하기 때문

Q2. 앱 초기화 로직은 어디에 두는 것이 좋나요?
A2. App 컴포넌트 또는 진입점(엔트리포인트)의 최상단에서 모듈 초기화 패턴으로 작성하는 것이 가장 안전함

---

## 10. Notifying parent components about state changes
💡 핵심 표현
> 💬 원문:  
> “It would be better to do everything in a single pass.”  
> 📝 한글 번역:  
> 모든 작업을 한 번의 렌더링 사이클에서 처리하는 것이 더 좋습니다.  

### 요약
- 자식 컴포넌트가 useEffect로 부모에게 상태 변경을 알리는 방식은 불필요한 추가 렌더링을 유발함
- setState → render → useEffect → onChange() → 부모 setState → re-render 순으로 중복 발생
- 해결책: 변경이 발생한 이벤트 핸들러 안에서 부모 콜백(onChange)과 자식 상태 변경을 동시에 처리

### 질문과 답변
Q1. 왜 Effect에서 onChange를 호출하면 안 되나요?
A1. 불필요한 렌더링과 상태 동기화 문제를 유발하기 때문. 이벤트 발생 시 즉시 호출하는 편이 더 효율적

Q2. 완전 제어 방식은 어떤 장점이 있나요?
A2. 상태를 부모 컴포넌트가 모두 관리하므로 상태 일관성이 높고 디버깅이 쉬워짐

---

## 11. Passing data to the parent
💡 핵심 표현
> 💬 원문:  
> “When child components update the state of their parent components in Effects, the data flow becomes very difficult to trace.”  
> 📝 한글 번역:  
> 자식 컴포넌트가 Effect 안에서 부모 상태를 업데이트하면 데이터 흐름을 추적하기 매우 어려워집니다.  

### 요약
- 자식 컴포넌트에서 데이터를 부모로 전달할 때 useEffect를 사용하는 것은 비효율적이며 예측 불가능한 흐름을 유발함
- 해결책: 부모가 직접 데이터를 가져오고, 필요한 데이터를 자식에게 prop으로 전달하는 방식이 더 바람직함

```jsx
// ❌ 잘못된 방식
useEffect(() => {
  if (data) {
    onFetched(data);
  }
}, [data]);

// ✅ 좋은 방식
function Parent() {
  const data = useSomeAPI();
  return <Child data={data} />;
}
```

### 질문과 답변
Q1. 왜 자식이 부모의 상태를 Effect로 업데이트하면 안 되나요?
A1. 데이터 흐름이 비정형적이 되어 추적이 어렵고, 여러 번 업데이트될 가능성도 생김

Q2. 어떻게 하면 데이터 흐름을 일관되게 유지할 수 있나요?
A2. 부모가 데이터를 직접 관리하고, 필요한 데이터를 자식에게 prop으로 내려주는 방식이 가장 일관적

---

## 12. Subscribing to an external store
💡 핵심 표현
> 💬 원문:  
> “React has a purpose-built Hook for subscribing to an external store that is preferred instead.”  
> 📝 한글 번역:  
> React는 외부 스토어에 구독하기 위한 목적에 맞는 Hook을 제공하며, 그 사용이 권장됩니다.  

### 요약
- 외부 API(예: navigator.onLine)나 스토어를 수동으로 구독할 때는 보통 useEffect로 리스너를 관리하지만,
- React는 이를 위해 useSyncExternalStore라는 전용 Hook을 제공함
- 이 Hook은 React와의 동기화를 안전하게 유지하며, 서버 렌더링 시에도 값 제공이 가능함

예시:  
```jsx
// ✅ useSyncExternalStore를 활용한 외부 상태 구독
function useOnlineStatus() {
  return useSyncExternalStore(
    (callback) => {
      window.addEventListener('online', callback);
      window.addEventListener('offline', callback);
      return () => {
        window.removeEventListener('online', callback);
        window.removeEventListener('offline', callback);
      };
    },
    () => navigator.onLine,
    () => true
  );
}
```

### 질문과 답변
Q1. useSyncExternalStore는 언제 사용해야 하나요?
A1. React 외부의 상태를 구독해야 할 때, 예를 들어 브라우저 API나 커스텀 전역 스토어를 구독할 때 사용함

Q2. useEffect와 비교했을 때 장점은 무엇인가요?
A2. React 렌더링 사이클과 더 안전하게 통합되며, 서버-클라이언트 환경 모두에서 동작을 정의할 수 있음

---

## 13. Fetching data
💡 핵심 표현
> 💬 원문:  
> “You can fetch data with Effects, but you need to implement cleanup to avoid race conditions.”  
> 📝 한글 번역:  
> Effect를 사용해 데이터를 가져올 수는 있지만, 경쟁 조건(race condition)을 피하기 위해 정리(cleanup) 로직이 필요합니다.  

### 요약
- 컴포넌트가 렌더링될 때 데이터를 가져오는 것은 Effect 사용이 적절함
- 하지만 검색어 입력과 같이 빠르게 상태가 바뀔 경우, 이전 요청이 나중에 응답될 수 있어 경쟁 조건이 발생함
- 해결책: let ignore = false 패턴을 활용한 정리 함수를 통해 이전 응답 무시 처리

### 질문과 답변
Q1. 왜 데이터 요청에 cleanup이 필요한가요?
A1. 여러 요청이 동시에 실행될 수 있기 때문에, 최신 요청이 아닌 응답이 마지막에 도착하면 잘못된 데이터가 화면에 표시될 수 있음

Q2. useEffect로 모든 데이터를 요청해도 되나요?
A2. 간단한 앱에선 괜찮지만, 대규모 앱에선 프레임워크나 커스텀 훅을 통해 더 정교한 전략(캐싱, 서버렌더링 등)을 적용하는 것이 좋음

---

## Recap
📝 한글 번역:  
- 어떤 값을 렌더링 중에 계산할 수 있다면, Effect는 필요하지 않습니다.
- 비용이 큰 계산을 캐싱하려면 useEffect 대신 useMemo를 사용하세요.
- 컴포넌트 트리 전체의 상태를 초기화하려면, 다른 key를 전달하세요.
- prop 변화에 따라 특정 상태만 초기화하고 싶다면, 렌더링 중에 직접 설정하세요.
- 컴포넌트가 화면에 표시되어야만 실행되는 코드는 Effect 안에 두고, 나머지는 이벤트 핸들러에 두세요.
- 여러 컴포넌트의 상태를 업데이트해야 한다면, 하나의 이벤트 안에서 처리하는 편이 더 좋습니다.
- 서로 다른 컴포넌트 간 상태를 동기화하려 할 때는, 상태 끌어올리기를 고려하세요.
- 데이터를 Effect로 가져올 수는 있지만, **경쟁 조건(race condition)**을 방지하려면 cleanup을 구현해야 합니다.

💬 원문:  
- If you can calculate something during render, you don’t need an Effect.
- To cache expensive calculations, add useMemo instead of useEffect.
- To reset the state of an entire component tree, pass a different key to it.
- To reset a particular bit of state in response to a prop change, set it during rendering.
- Code that runs because a component was displayed should be in Effects, the rest should be in events.
- If you need to update the state of several components, it’s better to do it during a single event.
- Whenever you try to synchronize state variables in different components, consider lifting state up.
- You can fetch data with Effects, but you need to implement cleanup to avoid race conditions.

---

## Challenges

### 1. Transform data without Effects
TodoList는 할 일 목록을 표시하는 컴포넌트  
“Show only active todos” 체크박스를 선택하면 완료된 할 일은 숨겨지고,  
푸터에는 완료되지 않은 항목의 개수가 표시됨  
Effect와 불필요한 상태 없이 컴포넌트를 단순화해보기

**출제 의도**
- 불필요한 state와 Effect 제거를 통해 렌더링 중 계산하는 코드의 장점을 이해시키기 위함
- 실제 개발에서 자주 나오는 “파생된 상태”를 state로 만들지 말라는 원칙을 실습하도록 유도
- 핵심 개념: “렌더링 중에 계산 가능한 값은 Effect 없이 처리하자”

**해설**
- activeTodos는 todos.filter(todo => !todo.completed)로 직접 계산 가능
- visibleTodos는 showActive에 따라 삼항 조건으로 결정 가능
- footer JSX는 직접 <footer>{...}</footer>로 넣으면 됨
- 모두 “계산 가능”하므로 state로 보관할 이유가 없다

### 2. Cache a calculation without Effects
현재 getVisibleTodos()가 실행될 때마다 콘솔에 로그가 찍히고 있음  
이 함수를 useEffect에서 호출해 state를 갱신하고 있는데,  
텍스트 입력창에 입력할 때마다 이 함수가 다시 호출되고 있음
Effect 없이도 이 함수를 효율적으로 사용할 방법을 찾아보기

**출제 의도**
- useEffect와 state를 사용하지 않고, useMemo를 이용한 계산 캐싱 방식을 익히는 문제
- 계산 결과가 바뀌지 않았을 때 불필요한 연산을 방지하는 최적화 방법 학습

**해설**

```jsx
const visibleTodos = useMemo(() => {
  return getVisibleTodos(todos, showActive);
}, [todos, showActive]);
```
- useMemo(() => getVisibleTodos(...), [todos, showActive])를 사용하면, text 변경에는 영향을 받지 않음
- 또는 NewTodo를 별도 컴포넌트로 분리하여 text 상태 변경 시 부모 TodoList가 리렌더되지 않게 함

### 3. Reset state without Effects
EditContact 컴포넌트는 savedContact prop을 받아 편집함  
연락처를 선택할 때마다 폼이 해당 연락처로 초기화되어야 함  
현재는 useEffect를 이용하여 상태를 덮어쓰고 있음
이 Effect를 제거하고도 상태를 초기화하는 방식으로 코드를 변경하기

**출제 의도**
- prop 변경에 따른 전체 폼 상태 재설정 방식을 익히기 위한 문제
- useEffect를 사용하지 않고도 상태를 초기화하는 법(key 속성 활용)을 학습함
- 핵심 개념: “컴포넌트를 새로 마운트해서 상태를 초기화하자”

**해설**
- 컴포넌트에 key={savedContact.id}를 전달하면 해당 컴포넌트가 새로 마운트됨
- 마운트 시 useState(savedContact.name)이 처음부터 다시 실행되어 초기화됨
- 이를 위해 컴포넌트를 EditContact → EditForm 두 개로 분리

---

### 4. Submit a form without Effects
Form 컴포넌트는 메시지를 입력받아 전송하는 폼입니다.
현재는 showForm이 false가 될 때 Effect가 실행되어 메시지를 전송합니다.
그런데 showForm의 초기값이 false인 경우, 사용자가 아무것도 입력하지 않아도 빈 메시지가 전송됩니다.
이러한 상황이 발생하지 않도록 Effect 대신 다른 방식으로 전송 로직을 구현해보세요.

**출제 의도**
- **사용자 행동(이벤트)**에 따라 실행되는 로직은 이벤트 핸들러 안에서 처리해야 함을 실습하는 문제
- useEffect를 사용하면 렌더링 타이밍에 따라 **원하지 않은 부작용(빈 메시지 전송)**이 생길 수 있음을 직접 확인
- 핵심 개념: “Effect는 컴포넌트가 보였을 때 실행되는 코드만 포함해야 한다”

**해설**
- 메시지를 전송하는 이유는 폼이 제출되었기 때문이지, 감사 메시지가 화면에 나타났기 때문이 아님
- 따라서 handleSubmit() 내부에서 sendMessage()를 호출해야 함
