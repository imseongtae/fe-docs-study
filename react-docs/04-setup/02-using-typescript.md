# Editor Setup

> ### You will learn (학습 목표)
> - TypeScript with React Components 
> - Examples of typing with Hooks 
> - Common types from @types/react 
> - Further learning locations 


## Table of contents

1. [1. Installation](#1-installation)
1. [2. TypeScript with React Components](#2-typescript-with-react-components)
1. [3. Hooks 예시](#3-hooks-예시)

---


## 1. Installation
모든 프로덕션 수준의 React 프레임워크는 TypeScript 사용을 지원함

- Next.js
- Remix
- Gatsby
- Expo

### 기존 React 프로젝트에 TypeScript 추가하기 

```bash
npm install @types/react @types/react-dom
```

다음 컴파일러 옵션을 `tsconfig.json`에 설정해야 합니다.
- dom은 lib에 포함되어야 함 (주의: lib 옵션이 지정되지 않으면, 기본적으로 dom이 포함됨)
- jsx를 유효한 옵션 중 하나로 설정해야 함. 대부분의 애플리케이션에서는 preserve로 충분. 라이브러리를 게시하는 경우 어떤 값을 선택해야 하는지 jsx 설명서를 참조

---

## 2. TypeScript with React Components
- JSX를 포함하고 있는 모든 파일은 `.tsx` 파일 확장자를 사용해야 함
- 파일이 JSX를 포함하고 있음을 TypeScript에 알려주는 TypeScript 전용 확장자

> interface나 type을 사용하여 컴포넌트의 props를 설명할 수 있음

```tsx
// MyApp.tsx
interface MyButtonProps {
  /** 버튼 안에 보여질 텍스트 */
  title: string;
  /** 버튼이 상호작용할 수 있는지 여부 */
  disabled: boolean;
}

function MyButton({ title, disabled }: MyButtonProps) {
  return (
    <button disabled={disabled}>{title}</button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton title="I'm a disabled button" disabled={true}/>
    </div>
  );
}
```

## 3. Hooks 예시

### useState
useState hook은 초기 state로 전달된 값을 재사용하여 값의 타입을 결정

```tsx
// 타입을 "boolean"으로 추론합니다
const [enabled, setEnabled] = useState(false);
```

- boolean 타입이 enabled에 할당
- setEnabled 는 boolean 인수나 boolean을 반환하는 함수를 받는 함수가 됨
- state에 대한 타입을 명시적으로 제공하려면 useState 호출에 타입 인수를 제공하면 됨

```tsx
// 명시적으로 타입을 "boolean"으로 설정합니다
const [enabled, setEnabled] = useState<boolean>(false);
```


이 경우에는 그다지 유용하지 않지만, type 제공을 원하게 되는 일반적인 경우는 유니언 타입이 있는 경우
- 아래 예시에서는 status는 몇 가지 다른 문자열 중 하나일 수 있습니다.

```ts
// 여기서 status는 몇 가지 다른 문자열 중 하나일 수 있음
type Status = "idle" | "loading" | "success" | "error";

const [status, setStatus] = useState<Status>("idle");
```


또는 State 구조화 원칙에서 권장하는 대로, 관련 state를 객체로 그룹화하고 객체 타입을 통해 다른 가능성을 설명할 수 있음

```ts
type RequestState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success', data: any }
  | { status: 'error', error: Error };

const [requestState, setRequestState] = useState<RequestState>({ status: 'idle' });
```

### useReducer
useReducer Hook은 reducer 함수와 초기 state를 취하는 더 복잡한 Hook임 
- reducer 함수의 타입은 초기 state에서 추론됨
- state에 대한 타입을 제공하기 위해 useReducer 호출에 타입 인수를 선택적으로 제공할 수 있지만, 대신 초기 state에서 타입을 설정하는 것이 더 좋은 경우가 많음

```tsx
import {useReducer} from 'react';

interface State {
   count: number
};

type CounterAction =
  | { type: "reset" }
  | { type: "setCount"; value: State["count"] }

const initialState: State = { count: 0 };

function stateReducer(state: State, action: CounterAction): State {
  switch (action.type) {
    case "reset":
      return initialState;
    case "setCount":
      return { ...state, count: action.value };
    default:
      throw new Error("Unknown action");
  }
}

export default function App() {
  const [state, dispatch] = useReducer(stateReducer, initialState);

  const addFive = () => dispatch({ type: "setCount", value: state.count + 5 });
  const reset = () => dispatch({ type: "reset" });

  return (
    <div>
      <h1>Welcome to my counter</h1>

      <p>Count: {state.count}</p>
      <button onClick={addFive}>Add 5</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

몇 가지 주요 위치에서 TypeScript를 사용하고 있음

1. `interface State`는 reducer state의 모양을 설명
2. `type CounterAction`은 reducer에 dispatch 할 수 있는 다양한 액션을 설명
3. `const initialState: State`는 초기 state의 타입을 제공하고, 기본적으로 useReducer에서 사용하는 타입도 제공
4. `stateReducer(state: State, action: CounterAction): State`는 reducer 함수의 인수와 반환 값의 타입을 설정
5. initialState에 타입을 설정하는 것보다 더 명시적인 대안은 useReducer에 타입 인수를 제공하는 것


### useContext
useContext Hook은 컴포넌트를 통해 props를 전달할 필요 없이 컴포넌트 트리를 따라 데이터를 전달하는 기술. Provider 컴포넌트를 생성할 때 사용되며, 종종 자식 컴포넌트에서 값을 소비하는 Hook을 생성할 때 사용됨

context에서 제공한 값의 타입은 createContext 호출에 전달된 값에서 추론됨



### useMemo
useMemo Hooks는 함수 호출로부터 memorized 된 값을 생성/재접근하여, 두 번째 매개변수로 전달된 종속성이 변경될 때만 함수를 다시 실행함  
- Hook을 호출한 결과는 첫 번째 매개변수에 있는 함수의 반환 값에서 추론됨
- Hook에 타입 인수를 제공하여 더욱더 명확하게 할 수 있음

```ts
// visibleTodos의 타입은 filterTodos의 반환 값에서 추론됩니다.
const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
```

### useCallback
useCallback는 두 번째 매개변수로 전달되는 종속성이 같다면 함수에 대한 안정적인 참조를 제공  
- useMemo와 마찬가지로, 함수의 타입은 첫 번째 매개변수에 있는 함수의 반환 값에서 추론됨
- Hook에 타입 인수를 제공하여 더욱더 명확하게 할 수 있음

```ts
const handleClick = useCallback(() => {
  // ...
}, [todos]);
```

> TypeScript strict mode에서 작업할 때 useCallback을 사용하려면 콜백에 매개변수를 위한 타입을 추가해야 합니다. 콜백의 타입은 함수의 반환 값에서 추론되고, 매개변수 없이는 타입을 완전히 이해할 수 없기 때문입니다.

코드 스타일 선호도에 따라, 콜백을 정의하는 동시에 이벤트 핸들러의 타입을 제공하기 위해 React 타입의 *EventHandler 함수를 사용할 수 있음

```tsx
import { useState, useCallback } from 'react';

export default function Form() {
  const [value, setValue] = useState("Change me");

  const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>((event) => {
    setValue(event.currentTarget.value);
  }, [setValue])

  return (
    <>
      <input value={value} onChange={handleChange} />
      <p>Value: {value}</p>
    </>
  );
}
```

---

## 4. 유용한 타입들 

> @types/react package에는 상당히 광범위한 타입 집합이 있으며, React와 TypeScript가 상호작용하는 방식에 익숙하다면 읽어볼 가치가 있습니다. DefinitelyTyped에 있는 React 폴더에서 찾을 수 있습니다. 여기에서는 좀 더 일반적인 타입 몇 가지를 다루겠습니다.

### DOM 이벤트
React에서 DOM 이벤트로 작업할 때, 종종 이벤트 핸들러로부터 이벤트의 타입을 추론할 수 있습니다. 하지만, 이벤트 핸들러에 전달할 함수를 추출하고 싶을 때는 이벤트 타입을 명시적으로 설정해야 합니다.

```tsx
import { useState } from 'react';

export default function Form() {
  const [value, setValue] = useState("Change me");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValue(event.currentTarget.value);
  }

  return (
    <>
      <input value={value} onChange={handleChange} />
      <p>Value: {value}</p>
    </>
  );
}
```

### Children
컴포넌트의 자식을 설명하는 데는 두 가지 일반적인 경로가 있음

#### 첫 번째
첫 번째는 JSX에서 자식으로 전달할 수 있는 모든 가능한 타입의 조합(union)인 React.ReactNode 타입을 사용하는 것

```ts
interface ModalRendererProps {
  title: string;
  children: React.ReactNode;
}
```

#### 두 번째
두 번째는 string이나 number 같은 JavaScript 원시 값(primitive)이 아닌 JSX 엘리먼트만 있는 React.ReactElement 타입을 사용하는 것입니다.


```ts
interface ModalRendererProps {
  title: string;
  children: React.ReactElement;
}
```

### Style Props
React의 인라인 스타일을 사용할 때, React.CSSProperties를 사용하여 style prop에 전달된 객체를 설명할 수 있음

- 이 타입은 모든 가능한 CSS 프로퍼티의 조합임
- style prop에 유효한 CSS 프로퍼티를 전달하고 있는지 확인하도록 도움
- 에디터에서 자동 완성 기능을 사용할 수 있는 좋은 방법

```ts
interface MyComponentProps {
  style: React.CSSProperties;
}
```

## 질문
### 1. interface vs type 차이, 언제 중요할까?

| 구분       | interface                                | type                                             |
|------------|-------------------------------------------|--------------------------------------------------|
| 목적       | 객체의 구조 정의에 특화                    | 유니언, 튜플, 함수 타입 등 다양한 표현 가능       |
| 확장성     | `extends`로 상속 가능                      | `&`로 타입 조합 가능                              |
| 중복 선언  | 가능 (자동 병합됨)                         | 불가능 (에러 발생)                                |
| 추천 사용처 | 컴포넌트 props, context 등 구조적 데이터   | 복잡한 유니언, 유틸리티 타입 활용 시              |

- Props, Context 등 구조적 데이터에는 interface가 직관적이고 확장성 좋음
- 여러 타입 조합/유니언은 type이 더 적합

### 2. children 타입: ReactNode vs ReactElement

| 타입              | 포함 범위                                              | 사용 시기                                                 |
|-------------------|--------------------------------------------------------|------------------------------------------------------------|
| `ReactNode`       | JSX, 문자열, 숫자, 배열, null 등 거의 모든 children    | 대부분의 일반적인 컴포넌트에서 사용                        |
| `ReactElement`    | JSX 요소만 (문자열/숫자 등은 포함되지 않음)           | 특정 JSX 구조만 허용하고 싶을 때 (예: 슬롯 컴포넌트 등)    |

- 유연한 children → ReactNode,
- 정확한 구조 요구 → ReactElement

### 3. 타입이 복잡해졌을 때, 어떻게 리팩토링할까?
1.	interface/type 분리: 컴포넌트 바깥으로 추출
2.	이름 붙이기: 타입에 의미 부여해서 이해도 향상
3.	도메인 기반 분할: 비즈니스 로직에 맞게 파일/타입 정리
4.	헬퍼 타입 사용: Partial<T>, Pick<T, K> 등으로 중복 줄이기

