# Reacting to Input with State

- React는 UI를 선언적으로 조작할 수 있는 방식을 제공함
- UI의 개별 요소를 직접 조작하는 대신, 컴포넌트가 가질 수 있는 다양한 상태를 설명하고, 사용자 입력에 따라 상태를 전환함
- 이는 디자이너가 UI를 사고하는 방식과 유사함

> ### You will learn
> - How declarative UI programming differs from imperative UI programming
> - How to enumerate the different visual states your component can be in
> - How to trigger the changes between the different visual states from code

## Table of contents
1. [How declarative UI compares to imperative ](#1-how-declarative-ui-compares-to-imperative)
1. [Thinking about UI declaratively](#2-thinking-about-ui-declaratively)
1. [Recap](#5-recap)

---

## 1. How declarative UI compares to imperative
선언형 UI와 명령형 UI의 비교

UI 상호작용을 설계할 때, 사용자 행동에 따라 UI가 어떻게 변화하는지를 생각합니다. 예를 들어, 사용자가 답변을 제출하는 폼이 있다고 할 때:
- 사용자가 입력하면 “제출” 버튼이 활성화됨
- “제출”을 누르면 폼과 버튼은 비활성화되고, 스피너가 표시됨
- 네트워크 요청이 성공하면 폼이 숨겨지고, “감사합니다” 메시지가 표시됨
- 실패하면 오류 메시지가 표시되고, 폼은 다시 활성화됨

### 명령형 UI(Imperative UI)

![명령형 UI 운전 비유](https://react.dev/images/docs/illustrations/i_imperative-ui-programming.png)

> 💡 **명령형 UI**는 마치 옆에 앉아 있는 사람에게 차를 운전하면서 매번 어떤 방향으로 가야 하는지를 일일이 지시하는 것과 같습니다. 명령이 잘못되면, 잘못된 방향으로 가게 됩니다

명령형 프로그래밍에서는 위의 흐름이 코드의 형태와 직접적으로 일치함. 어떤 일이 발생했는지에 따라 UI를 조작하는 정확한 명령을 작성해야 합니다. 

그래서 이러한 방식을 *명령형(imperative)*이라고 부릅니다. 각 UI 요소에 대해 스피너부터 버튼까지 어떻게 바꿔야 하는지를 명령해야 하기 때문

명령형 UI 조작은 단순한 예제에서는 충분히 작동하지만, 복잡한 시스템에서는 관리가 기하급수적으로 어려워집니다. 여러 개의 폼이 있는 페이지를 생각해보세요. 새로운 UI 요소나 상호작용을 추가할 때마다 기존 코드 전체를 점검하며 버그가 생기지 않았는지 확인해야 합니다.

### 선언형 UI(Declarative UI)

![선언형 UI 운전 비유](https://react.dev/images/docs/illustrations/i_declarative-ui-programming.png)

> 💡 **선언형 UI**는 택시에 타서 목적지를 말하고 운전사는 목적지까지 데려다주는 방식과 비슷합니다. 운전사는 여러분보다 더 나은 경로를 알고 있을 수도 있습니다!

새로운 UI 요소나 상호작용을 추가할 때마다 기존 코드 전체를 점검하며 버그가 생기지 않았는지 확인하는 일에는 어려움이 따름:
React는 이러한 문제를 해결하기 위해 만들어짐

React에서는 UI를 직접 조작하지 않음:
- 컴포넌트를 직접 활성화하거나 비활성화하거나, 보여주거나 숨기지 않음
- 대신에, 무엇을 보여주고 싶은지 선언하면 React가 직접 UI를 업데이트함

## 2. Thinking about UI declaratively
React에서 UI를 어떻게 사고하는지를 이해하기 위해, 폼 예제를 다시 React로 구현하면서 다음 과정을 따릅니다:
1. 컴포넌트가 가질 수 있는 다양한 시각적 상태 식별
2. 상태 전환을 유발하는 트리거 결정
3. 상태를 useState로 표현
4. 불필요한 상태 변수 제거
5. 이벤트 핸들러를 상태에 연결

### 1단계: 컴포넌트의 시각적 상태 식별
컴퓨터 과학에서는 “상태 기계”가 몇 가지 상태 중 하나에 있다는 개념이 있음.  
디자이너는 다양한 “시각적 상태”를 목업으로 보여주기도 함.  

> React는 디자인과 컴퓨터 과학의 교차점에 있으므로, 이 두 아이디어 모두에서 영감을 받습니다.

먼저, 사용자가 볼 수 있는 다양한 “상태”를 시각화해야 함:
- Empty: 폼에 입력이 없고 “제출” 버튼은 비활성화
- Typing: 폼에 입력이 있고 “제출” 버튼은 활성화
- Submitting: 폼이 비활성화되고 스피너가 표시
- Success: 폼 대신 “Thank you” 메시지 표시
- Error: Typing 상태와 유사하지만 오류 메시지 추가

### 2단계: 상태 전환을 유발하는 트리거 결정
상태 업데이트는 두 가지 종류의 입력에 의해 발생함:
- 사람의 입력: 클릭, 타이핑, 링크 탐색
- 컴퓨터의 입력: 네트워크 응답, 타임아웃, 이미지 로딩 등

이 두 경우 모두, UI를 업데이트하려면 상태 변수를 설정해야 함

폼의 경우에는 다음과 같은 입력에 따라 상태를 전환해야 함:
- 텍스트 입력 변경 → Empty ↔ Typing
- “Submit” 버튼 클릭 → Submitting
- 네트워크 응답 성공 → Success
- 네트워크 응답 실패 → Error 상태와 오류 메시지

#### Note
> 사람의 입력은 보통 이벤트 핸들러가 필요함

이 흐름을 시각화하기 위해 각 상태를 원형으로 그리고 상태 전환을 화살표로 나타내는 것이 좋음

#### Form states

![Form states](https://react.dev/_next/image?url=%2Fimages%2Fdocs%2Fdiagrams%2Fresponding_to_input_flow.png&w=1920&q=75)


### 3단계: useState로 상태를 표현하기
UI의 시각적 상태를 표현하기 위해 useState를 사용. 

> 복잡하지 않게 설계하는 것이 중요합니다. 상태가 많을수록 버그도 늘어납니다!

### 4단계: 불필요한 상태 변수 제거
상태 중복을 피하고, 의미가 불분명한 상태를 없애야 함. 그래야 컴포넌트를 더 쉽게 이해할 수 있고, 의도하지 않은 UI 상태를 막을 수 있음. 

예:
- isTyping과 isSubmitting이 동시에 true인 경우는 불가능한 상태. 이런 경우는 'status'라는 단일 상태로 묶어야 함
- isEmpty와 isTyping이 동시에 true일 수도 없으므로 answer.length === 0 같은 조건으로 대체 가능
- isError는 error !== null로 대체 가능

→ 정리 후에는 다음과 같은 필수 상태만 남음:

```js
const [answer, setAnswer] = useState('');
const [error, setError] = useState(null);
const [status, setStatus] = useState('typing'); // 'typing', 'submitting', 'success'
```

### 5단계: 이벤트 핸들러를 상태와 연결

마지막으로 이벤트 핸들러를 작성해 상태를 업데이트해야 함. 각 사용자 입력과 비동기 결과에 따라 setState를 호출하면 됨

> 이 방식은 기존의 imperative 방식보다 길어 보일 수 있지만, 유지보수가 훨씬 쉬운 구조

### 예제 코드
기존 코드를 React로 구현한 코드

```jsx
import { useState } from 'react';

export default function Form() {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');

  if (status === 'success') {
    return <h1>That's right!</h1>
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitForm(answer);
      setStatus('success');
    } catch (err) {
      setStatus('typing');
      setError(err);
    }
  }

  function handleTextareaChange(e) {
    setAnswer(e.target.value);
  }

  return (
    <>
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air into drinkable water?
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={handleTextareaChange}
          disabled={status === 'submitting'}
        />
        <br />
        <button disabled={
          answer.length === 0 ||
          status === 'submitting'
        }>
          Submit
        </button>
        {error !== null &&
          <p className="Error">
            {error.message}
          </p>
        }
      </form>
    </>
  );
}

function submitForm(answer) {
  // Pretend it's hitting the network.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let shouldError = answer.toLowerCase() !== 'lima'
      if (shouldError) {
        reject(new Error('Good guess but a wrong answer. Try again!'));
      } else {
        resolve();
      }
    }, 1500);
  });
}
```

---

## Recap
- 선언형 프로그래밍은 UI를 명령으로 조작하는 대신, 각 상태에 따라 어떻게 보여야 하는지를 기술하는 방식
- 컴포넌트를 선언적으로 만들기 위한 단계:
    1. 시각적 상태 식별
    2. 상태 전환 트리거 결정
    3. 상태를 useState로 메모리에 표현
    4. 불필요한 상태 제거
    5. 이벤트 핸들러 연결

---

## Challenges

### Challenges 내용 정리
- React는 단순히 코드를 더 길게 만드는 것이 아니라, 명확한 상태 기반 모델을 통해 예측 가능하고 유지보수 쉬운 UI 구성을 가능하게 함
- 불필요한 상태를 줄이고, 하나의 상태로 여러 UI 상태를 표현하는 방법의 의도적 훈련이 중요함
- 선언형 UI 사고방식은 단지 React의 문법이 아니라, UX의 다양한 상태 전환을 모델링하는 방식의 변화임
  - React의 선언형 UI 모델은 단순한 기술 문법이 아니라, “사용자가 어떤 상태에 있을 때 어떤 화면을 보여줄지”를 상태 기반으로 설계하는 패러다임 전환
  - 즉, UX 흐름을 코드로 모델링하는 방식
- 실전 개발에서 자주 마주치는 입력 처리, 조건부 렌더링, 상태 전환 등을 연습하며, 실제 컴포넌트를 설계하는 기반을 탄탄히 할 수 있음

### 선언형 UI 정리

- 명령형 사고는 “무엇을 해야 하는지” 중심
- 선언형 사고는 “어떤 상태일 때, 어떤 UI를 보여줘야 하는지” 중심

> React에서는 **상태(state)**를 기반으로 UI를 자동으로 구성하기 때문에 **사용자의 상태 흐름(UX Flow)**을 “데이터 구조”로 모델링하는 게 핵심


| 비교 항목     | 명령형 사고 방식                            | 선언형 사고 방식                             |
|--------------|---------------------------------------------|----------------------------------------------|
| **UI 상태 관리** | DOM 속성을 직접 조작 (`style.display`, `disabled`) | 상태 값(`status`)에 따라 자동 렌더링 |
| **UX 흐름 표현** | "어떻게"를 지시하는 방식                     | "무엇이 어떤 상태일 때 보이는가"를 선언하는 방식 |
| **코드 구조**   | 이벤트 핸들러 안에 UI 조작이 섞여 있음          | **상태 → UI 렌더링이 명확히 분리됨**              |
| **유지보수성**  | UI가 복잡해질수록 분기와 조작 코드가 증가       | 상태 전이만 잘 설계하면 UI는 자동 반영됨       |

#### UI 예시
- *명령형 UI*

```js
// 사용자가 클릭하면 직접 DOM 조작
button.onclick = function () {
  button.disabled = true;
  spinner.style.display = 'block';
  
  submitForm().then(() => {
    form.style.display = 'none';
    successMessage.style.display = 'block';
  }).catch(() => {
    errorMessage.style.display = 'block';
    button.disabled = false;
  }).finally(() => {
    spinner.style.display = 'none';
  });
};
```

- *선언형 UI*

```tsx
const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'

return (
  <form onSubmit={handleSubmit}>
    <button disabled={status === 'loading'}>Submit</button>
    {status === 'loading' && <Spinner />}
    {status === 'success' && <p>Thanks!</p>}
    {status === 'error' && <p>Error occurred</p>}
  </form>
);
```

```js
async function handleSubmit(e: FormEvent) {
  e.preventDefault();
  setStatus('loading');
  try {
    await submitForm();
    setStatus('success');
  } catch {
    setStatus('error');
  }
}
```


### 풀이

```jsx
import { useState } from 'react';

export default function Picture() {
  const [isActive, setIsActive] = useState(true);
  
  return (
      <div 
        className={`background ${isActive ? 'background--active' : ''}`}
        onClick={() => setIsActive(!isActive)}
      >
      <img
        className={`picture ${!isActive ? 'picture--active' : ''}`}
        alt="Rainbow houses in Kampung Pelangi, Indonesia"
        src="https://i.imgur.com/5qwVYb1.jpeg"
        onClick={() => setIsActive(!isActive)}
      />
    </div>
  );
}
```

