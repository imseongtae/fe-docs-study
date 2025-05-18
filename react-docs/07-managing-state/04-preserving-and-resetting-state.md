# Preserving and Resetting State

```plaintext
State is isolated between components.  
React keeps track of which state belongs to which component based on their place in the UI tree.  
You can control when to preserve state and when to reset it between re-renders.  

---

상태는 컴포넌트 간에 격리됩니다.  
React는 UI 트리에서 어떤 컴포넌트가 어떤 상태에 속하는지를 추적합니다.  
언제 상태를 보존할지, 언제 다시 렌더링할지 제어할 수 있습니다.  
```

> ### You will learn
> - When React chooses to preserve or reset the state
> - How to force React to reset component’s state
> - How keys and types affect whether the state is preserved

## Table of contents
1. [State is tied to a position in the render tree](#1-state-is-tied-to-a-position-in-the-render-tree)
1. [Same component at the same position preserves state](#2-same-component-at-the-same-position-preserves-state)
1. [Different components at the same position reset state](#3-different-components-at-the-same-position-reset-state)
1. [Resetting state at the same position](#4-resetting-state-at-the-same-position)
1. [Recap](#5-recap)
1. [Challenges](#6-challenges)

---

## 1. State is tied to a position in the render tree

> 상태는 렌더 트리 상의 위치에 묶여 있다

> 💬 원문:  
> “React associates each piece of state it’s holding with the correct component by where that component sits in the render tree.”

> 📝 한글 번역:  
> “React는 렌더링 트리에서 해당 컴포넌트의 위치에 따라 보유하고 있는 각 상태를 올바른 컴포넌트와 연결합니다.”

- 동일한 컴포넌트를 두 위치에 렌더하면, 상태도 두 개로 나뉜다 (예: `<Counter />`가 두 번 사용되어 각각 독립적인 score 상태를 가짐)
- 각 위치에서 별개의 상태를 가진다 → 서로 영향을 주지 않음

```jsx
export default function App() {
  const counter = <Counter />;
  return (
    <div>
      {counter}
      {counter}
    </div>
  );
}

function Counter() {
  return (...{/* This is Counter component */})
  
}
```

트리로서 표현되는 모습:

![As a tree](https://react.dev/_next/image?url=%2Fimages%2Fdocs%2Fdiagrams%2Fpreserving_state_tree.png&w=828&q=75)

---

## 2. Same component at the same position preserves state

> 💬 원문:  
> “React preserves a component’s state for as long as it’s being rendered at its position in the UI tree”

> 📝 한글 번역:  
> 컴포넌트가 UI 트리 내에서 같은 위치에 렌더링되고 있는 한, React는 해당 컴포넌트의 상태를 보존한다

- if 조건이 달라져도 같은 위치라면 상태 유지됨
- JSX 내에서 `<Counter />`가 위치만 같으면 동일한 컴포넌트로 인식
  - 동일한 역할을 수행하는 컴포넌트라도 이름이 바뀌면 인식하지 못함

### Pitfall

```plaintext
💬 원문:
You might expect the state to reset when you tick checkbox, but it doesn’t! 
This is because both of these `<Counter />` tags are rendered at the same position. 
React doesn’t know where you place the conditions in your function.
All it “sees” is the tree you return.

In both cases, the App component returns a <div> with `<Counter />` as a first child. 
To React, these two counters have the same “address”: the first child of the first child of the root. 
This is how React matches them up between the previous and next renders, regardless of how you structure your logic.

---

📝 한글 번역:
확인란을 선택하면 상태가 초기화될 것으로 예상할 수 있지만 그렇지 않습니다! 
이 두 <Counter /> 태그가 모두 같은 위치에 렌더링되기 때문입니다. 
React는 함수에서 조건을 어디에 배치했는지 알지 못합니다. 리턴하는 트리만 "볼" 뿐입니다.

두 경우 모두 App 컴포넌트는 <Counter />를 첫 번째 자식으로 가진 <div>를 반환합니다. 
React에서 이 두 카운터는 루트의 첫 번째 자식의 첫 번째 자식이라는 동일한 "주소"를 갖습니다.
이것이 로직 구조에 관계없이 이전 렌더링과 다음 렌더링 사이에서 React가 이를 일치시키는 방식입니다.
```

---

## 3. Different components at the same position reset state
서로 다른 컴포넌트를 동일 위치에 렌더하면 상태는 초기화됨

> 💬 원문:  
> “When you render a different component in the same position, it resets the state of its entire subtree.”

> 📝 한글 번역:  
> 동일한 위치에 다른 컴포넌트를 렌더링하면, 해당 하위 트리 전체의 상태가 초기화된다.

- `<Counter />` 대신 `<p>` 태그로 바꾸면 상태 사라짐
- DOM 구조가 달라지면 상태는 유지되지 않음

### 실험: 컴포넌트 상태 보존 실험
주소가 같다면, 로직 구조에 관계없이 리액트는 이전 렌더링과 다음 렌더링 사이 상태를 보존함
- 주소를 동일하게 하고, 시각적 숨긴다면, 컴포넌트의 상태는 보존될 것

```jsx
import { useState } from 'react';

export default function App() {
  const [isPaused, setIsPaused] = useState(false);
  return (
    <div>
      {isPaused ? (
        <>
          <div style={{ display: isPaused ? 'none' : 'block' }}>
            <Counter />
          </div>
          <p>See you later!</p> 
        </>
      ) : (
        <>
          <div style={{ display: isPaused ? 'none' : 'block' }}>
            <Counter />
          </div>
        </>
      )}
      <label>
        <input
          type="checkbox"
          checked={isPaused}
          onChange={e => {
            setIsPaused(e.target.checked)
          }}
        />
        Take a break
      </label>
    </div>
  );
}
```

---

## 4. Resetting state at the same position

### Option 1: Rendering a component in different positions
방법 1: 서로 다른 위치에 렌더
- 조건문을 나눠 `<Counter />`를 다르게 렌더링 → 상태 분리됨

### Option 2: Resetting state with a key
방법 2: key를 부여하여 상태 구분

> 💬 원문:  
> “You can force a subtree to reset its state by giving it a different key.”

> 📝 한글 번역:  
> 특정 하위 트리의 상태를 재설정하려면 다른 key를 부여하면 된다.

- `<Counter key="Taylor" />` vs `<Counter key="Sarah" />` → 서로 다른 상태를 가짐

### Resetting a form with a key
- 예: 채팅 앱에서 다른 유저를 선택할 때 `Chat` 컴포넌트에 `key={to.id}` 부여
- 이전 입력 상태가 보존되지 않도록 설정 가능
- 반대로, 상태를 유지하려면 `key`를 생략하거나 상태를 상위로 올리기

---

## 5. Recap
- React는 동일한 컴포넌트가 동일한 위치에서 렌더링되는 한 상태를 유지함
- 상태는 JSX 태그에 보관되지 않음. JSX를 배치한 트리 위치와 연관되어 있음
  - 같은 위치의 같은 컴포넌트 → 상태 보존
  - 위치나 타입이 바뀌면 → 상태 초기화
- 하위 트리에 다른 키를 지정하여 상태를 강제로 재설정할 수 있음
- 컴포넌트 정의를 중첩하지 말 것. 실수로 상태가 초기화될 수 있음

---

## 6. Challenges

### 1. Fix disappearing input text
입력창에 작성한 텍스트가 버튼 클릭 시 사라지는 문제를 해결하기

🎯 출제 의도:
- 렌더 트리에서의 컴포넌트 위치가 상태 보존에 미치는 영향을  이해하기 위함
- JSX 구조는 같아 보여도 실제로는 다른 위치라는 점을 이해하기 위함

📚 학습 포인트:
- 컴포넌트가 항상 같은 위치에 렌더되도록 구조를 통일해야 상태가 유지됨
- 조건부 렌더링(if/else)에 따라 컴포넌트 구조가 달라지는 경우, 상태에 의도치 않은 영향을 줄 수 있음

### 2. Swap two form fields
이름 입력 필드의 순서를 바꿨을 때 입력한 값까지 바뀌는 문제를 해결하기

🎯 출제 의도:
- 리스트 내 key 미지정이 얼마나 쉽게 상태를 엉키게 만들 수 있는지를 보여주기 위함
- 같은 컴포넌트를 다른 순서로 렌더링하면 위치(주소) 기반 상태 매핑이 깨진다는 점을 강조

📚 학습 포인트:
- key는 단순히 리스트 렌더링용이 아니라 상태를 정확히 식별하기 위한 도구
- 순서를 바꾸는 상황에서는 꼭 명확한 key를 부여해야 함

### 3. Reset a detail form
다른 연락처를 선택했을 때 이전 입력값이 남아있는 문제를 해결하기
- 사용자를 바꿨지만 `<EditContact />` 컴포넌트가 같은 위치에 유지됨
- 상태가 유지되어 사용자 혼란 유발

🎯 출제 의도:
- `props` 변경이 상태를 자동 초기화하지 않는다는 점을 보여주기 위함
- `key`를 통한 의도적 상태 초기화 방법을 학습시키기 위함

📚 학습 포인트:
- 상태가 필요한 시점에 재설정하려면 `key`를 사용해 새로운 컴포넌트로 인식시켜야 함
- Save(상태 보존) vs Reset(재설정)의 요구사항 및 의도를 명확히 해야 함

### 4. Clear an image while it’s loading
이미지 전환 시, 이전 이미지가 잠깐 보이는 문제를 해결하기

📄 문제 요약:
- 동일한 `<img />` DOM 요소를 재사용하고 있기 때문에, 새로운 이미지가 로딩되기 전까지 이전 이미지가 보임

🎯 출제 의도:
- DOM 노드 재사용에 대한 React의 기본 동작 방식을 이해하기 위함
- `key`를 활용해 DOM 노드 자체를 새로 만들 수 있는 방법 안내

📚 학습 포인트:
- 상태와 함께 DOM 요소의 재사용 여부도 key로 제어할 수 있음
- UI 정확성이 중요한 경우, DOM 노드 재생성을 통해 사용자 혼란을 방지할 수 있음

### 5. Fix misplaced state in the list
리스트 항목 순서를 바꿨을 때, 상태가 다른 항목에 연결되는 문제 해결하기

📄 문제 요약:
- `key={index}`로 설정한 리스트에서 순서를 뒤집으면 상태가 위치에 따라 바뀜 (ex. Alice → Taylor로 이메일 상태가 전이)

🎯 출제 의도:
- `key`를 `index`로 설정할 때 발생하는 대표적인 버그 시나리오를 체험하기 위함
- 상태를 고유 항목과 연결하려면 고유한 `id` 값을 사용해야 함을 이해

📚 학습 포인트:
- index를 `key`로 쓰면 안 되는 대표적 예시
- 상태를 항목별로 유지하려면 `key`는 항상 **고유 식별자(id)**를 사용해야 함

> 💬 공식문서 원문:  
> State is associated with the tree position. A key lets you specify a named position instead of relying on order.
