# Keeping Components Pure

> 데이터 모음에서 유사한 컴포넌트를 여러 개 표시하고 싶을 때가 종종 있음, JavaScript는 배열 메서드를 사용하여 데이터 배열을 조작할 수 있음
> React에서는 `filter()`와 `map()`을 사용해 데이터 배열을 필터링하고 컴포넌트 배열로 변환할 수 있음

> ### You will learn (학습 목표)
> - What purity is and how it helps you avoid bugs
> - How to keep components pure by keeping changes out of the render phase
> - How to use Strict Mode to find mistakes in your components

## Table of contents

1. [Purity: Components as formulas](#1-purity-components-as-formulas)
1. [Side Effects: (un)intended consequences](#2-side-effects-unintended-consequences)
1. [Local mutation: Your component’s little secret](#3-local-mutation-your-components-little-secret)
1. [사이드 이펙트를 일으킬 수 있는 지점](#4-사이드-이펙트를-일으킬-수-있는-지점)

---

## 1. Purity: Components as formulas

컴퓨터 과학에서(특히 함수형 프로그래밍의 세계에서는) 순수 함수는 다음과 같은 특징을 지니고 있음:
- 자신의 일에 집중. 함수가 호출되기 전에 존재했던 어떤 객체나 변수는 변경하지 않음
- 같은 입력, 같은 출력. 같은 입력이 주어졌다면 순수함수는 같은 결과를 반환



### React 개념의 기반
순수 함수의 예를 보여주는 수학 공식

```
이 수학 공식을 생각해보기 y = 2x:
- 만약 x = 2이라면 항상 y = 4
- 만약 x = 3이라면 항상 y = 6
- 만약 x = 3이라면, 그날의 시간이나 주식 시장의 상태에 따라서 y가 9이거나 –1이거나 2.5가 되지 않음
- 만약 y = 2x 그리고 x = 3이라면, y는 항상 6
```

```js
// 위 내용을 자바스크립트 함수로 만든다면 아래와 같음
function double(number) {
  return 2 * number;
}
```

> React는 이러한 개념을 기반으로 설계

React는 이러한 개념을 기반으로 설계됨:
- React는 작성되는 모든 컴포넌트가 순수 함수일 거라 가정
- 이러한 가정은 React 컴포넌트에 같은 입력이 주어진다면 반드시 같은 JSX를 반환한다는 것을 의미


## 2. Side Effects: (un)intended consequences
> 테스트는 실패하고 사용자는 당황할 것이고 비행기는 추락할지도 모르는... 혼란스러운 버그를 피하는 방법은 컴포넌트가 순수하도록 만는 것
> 순수 함수는 함수 스코프 밖의 변수나 호출 전에 생성된 객체를 변경하지 않음

## 3. Local mutation: Your component’s little secret

> "순수 함수는 함수 스코프 밖의 변수나 호출 전에 생성된 객체를 변경하지 않음" 
> 그러나, 렌더링하는 동안 그냥 만든 변수와 객체를 변경하는 것은 전혀 문제가 없음


### Local mutation 예시
예시에서는, [] 배열을 만들고, cups 변수에 할당하고, 컵 한 묶음을 push 할 것

```jsx
function Cup({ guest }) {
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaGathering() {
  let cups = [];
  for (let i = 1; i <= 12; i++) {
    cups.push(<Cup key={i} guest={i} />);
  }
  return cups;
}
```

만약 cups 변수나 [] 배열이 TeaGathering의 바깥에서 생성되었다면 큰 문제가 될 것:
- 하지만 이것은 괜찮음 왜냐하면 그것들은 TeaGathering 내부에서, 같은 렌더링 동안 생성했기 때문
- TeaGathering 외부의 어떤 코드도 이 현상이 발생했다는 사실을 알 수 없음
- 이를 “지역 변경” 이라 하며, 이는 컴포넌트의 작은 비밀임

---

## 4. 사이드 이펙트를 일으킬 수 있는 지점
함수형 프로그래밍은 순수성에 크게 의존하지만, 언젠가는, 어딘가에서, 무언가가 바뀌어야 함. 그것이 프로그래밍의 요점입니다! 
화면을 업데이트하고, 애니메이션을 시작하고, 데이터를 변경하는 이러한 변화들을 사이드 이펙트라고 함(렌더링중에 발생하는 것이 아니라 “사이드에서” 발생하는 현상)


```
React에서, 사이드 이펙트는 보통 이벤트 핸들러에 포함됩니다. 이벤트 핸들러는 React가 일부 작업을 수행할 때 반응하는 기능입니다. 예를 들면 버튼을 클릭할 때처럼 말이죠. 이벤트 핸들러가 컴포넌트 내부에 정의되었다 하더라도 렌더링 중에는 실행되지 않습니다! 그래서 이벤트 핸들러는 순수할 필요가 없습니다.
```

> 이벤트 핸들러는 순수할 필요가 없음

```
다른 옵션을 모두 사용했지만 사이드 이펙트에 적합한 이벤트 핸들러를 찾을 수 없는 경우에도, 컴포넌트에서 useEffect 호출을 사용하여 반환된 JSX에 해당 이벤트 핸들러를 연결할 수 있습니다. 이것은 React에게 사이드 이펙트가 허용될 때 렌더링 후 나중에 실행하도록 지시합니다. 그러나 이 접근 방식이 마지막 수단이 되어야 합니다.
```

> 이 접근 방식은 마지막 수단이 되어야 함

> "가능하면 렌더링만으로 로직을 표현해 보세요. 이것이 당신을 얼마나 더 나아가게 할 수 있는지 알면 놀라게 될겁니다!"


### React는 왜 순수함을 신경쓸까요?

| 항목 | 설명 |
|------|------|
| 1. 다양한 환경에서 실행 가능 | - 서버 사이드 렌더링(SSR) 등 어디서든 실행 가능<br>- 입력이 같으면 결과도 같아 신뢰도 높음 |
| 2. 성능 최적화에 유리 | - 입력이 바뀌지 않은 컴포넌트는 렌더링 생략 가능<br>- 동일한 출력 보장 → 캐싱 가능 |
| 3. 렌더링 최적화 | - 렌더링 중간에 데이터 변경 시<br>→ 이전 렌더링을 중단하고 새 렌더링 시작 가능<br>- 순수 컴포넌트는 연산을 중단하는 것이 안전 |
| 4. React의 최신 기능과 시너지 | - 데이터 패칭, 애니메이션, 성능 최적화 등<br>→ 모든 최신 기능이 순수성을 기반으로 동작<br>- 순수성을 유지하면 기능을 최대한 활용 가능 |

> "우리가 구축하고 있는 모든 새로운 React 기능은 순수성을 활용합니다. 데이터 가져오기에서 애니메이션, 성능에 이르기까지 컴포넌트를 순수하게 유지하면 React 패러다임의 힘이 발휘됩니다."

