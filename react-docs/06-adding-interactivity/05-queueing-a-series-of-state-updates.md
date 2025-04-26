# Queueing a Series of State Updates

```plaintext
🇺🇸 English (react.dev)

Setting a state variable will queue another render. But sometimes you might want to perform multiple operations on the value before queueing the next render. To do this, it helps to understand how React batches state updates
```

```plaintext
🇰🇷 한국어 (ko.react.dev)

상태 변수를 설정하면 다른 렌더링이 대기열에 추가됩니다. 하지만 때로는 다음 렌더링을 대기열에 넣기 전에 값에 대해 여러 연산을 수행해야 할 수도 있습니다. 이를 위해서는 React가 상태 업데이트를 일괄 처리하는 방법을 이해하면 도움이 됩니다.
```

> ### You will learn (학습 목표)
> - What “batching” is and how React uses it to process multiple state updates
> - How to apply several updates to the same state variable in a row

> 여기서 말하는 **“render”는 컴포넌트 함수를 다시 실행해서 새로운 UI를 그리도록 예약하는 것**이고, React는 상태 업데이트를 모아서 최소한의 render만 수행하기 위해 batch 처리를 하려는 것

### React 상태 업데이트 흐름
1.	setState 호출  
  → 상태 변경이 예약됨  
2.	React는 렌더링을 곧바로 하지 않음  
  → batching 전략으로 모아둠
3.	같은 이벤트 루프 안에서 여러 상태 업데이트가 일어나면  
  → 하나의 렌더링만 발생
4.	이벤트 루프 끝나면 → 컴포넌트 다시 호출  
  → a. 새로운 JSX 계산  
  → b. DOM 업데이트  


### render 용어 정리

| 항목             | 기술적 의미                     |
|------------------|---------------------------------|
| render           | 컴포넌트 함수 실행 + JSX 생성   |
| re-render        | 상태/props 변경 후 다시 실행    |
| queue a render   | React가 나중에 다시 실행을 예약 |

## Table of contents
1. [React batches state updates](#1-react-batches-state-updates)
1. [Updating the same state multiple times before the next render](#2-updating-the-same-state-multiple-times-before-the-next-render)
1. [요약](#3-요약)
1. [Try out some challenges](#4-try-out-some-challenges)

---

## 1. React batches state updates

React state batches 업데이트:
- React는 이벤트 핸들러 안의 여러 setState 호출을 “배치(batch)“하여 한 번에 처리
- 모든 코드 실행 후, 한 번에 상태 업데이트 → 렌더링 최적화
- 클릭과 같은 다른 이벤트 간에는 배치하지 않고, 별도로 처리

> 비유: 웨이터가 주문을 다 들은 후 주방에 전달하는 것처럼 🥸🍷 

---

## 2. Updating the same state multiple times before the next render

다음 렌더링 전에 동일한 state 변수를 여러 번 업데이트하기:
- 같은 state를 여러 번 업데이트하고 싶다면, 값이 아니라 함수(updater function)를 넘겨야 함
- setNumber(number + 1) 대신 setNumber(n => n + 1)을 사용
- 각 업데이트가 이전 결과를 기반으로 차례대로 적용

| queued update	 |  n  |returns       |
|----------------|-----|--------------|
| `n => n + 1`   |  0  | `0 + 1 = 1`  |
| `n => n + 1`   |  1  | `1 + 1 = 2`  |
| `n => n + 1`   |  2  | `1 + 1 = 2`  |


### What happens if you update state after replacing it

> state를 교체한 후 업데이트하면 어떻게 될까? 🤔

만약 이벤트 핸들러 안에서:

```jsx
<button onClick={() => {
  setNumber(number + 5);
  setNumber(n => n + 1);
}}>
```

처리 순서:
  1. setNumber(number + 5): “5로 교체” 큐에 추가
  2. setNumber(n => n + 1): “5에 +1” 적용
  3. 결과적으로 최종 값은 6

| queued update	   |  n           | returns      |
|------------------|--------------|--------------|
| ”replace with 5” |  0 (unused)  | `5`          |
| `n => n + 1`     |  5           | `5 + 1 = 6`  |


### What happens if you replace state after updating it 

> 업데이트 후 state를 바꾸면 어떻게 될까? 🤔

만약 이벤트 핸들러 안에서:

```jsx
<button onClick={() => {
  setNumber(number + 5);
  setNumber(n => n + 1);
  setNumber(42);
}}>
```

처리 순서:
1. `setNumber(number + 5)`: "5로 교체"
2. `setNumber(n => n + 1)`: "5 + 1"
3. `setNumber(42)`: "42로 교체"

결과적으로 최종 값은 **42**


| queued update	    |  n           | returns      |
|-------------------|--------------|--------------|
| ”replace with 5”  |  0 (unused)  | `5`          |
| `n => n + 1`      |  5           | `5 + 1 = 6`  |
| ”replace with 42” |  6 (unused)  | `42`         |


> **정리**  
> - 함수(`n => n + 1`)는 현재 값을 기본으로 업데이트
> - 값(숫자 5나 42)은 기존 큐를 무시하고 **새 값으로 교체**

### Naming conventions 

- 상태 업데이트 함수의 인자는 보통 **state 이름의 약어**를 사용

```jsx
setEnabled(e => !e);
setLastName(ln => ln.reverse());
setFriendCount(fc => fc * 2);
```

- 또는 전체 이름을 사용하거나 `prev` 접두어를 사용할 수 있음

```jsx
setEnabled(prevEnabled => !prevEnabled);
```

---

## 3. 요약

- `setState`는 즉시 값이 변경되는 것이 아니라 **새 렌더링을 요청**
- React는 이벤트 핸들러 실행이 하고 나서 **배치(batch) 처리**함
- 하나의 이벤트(동일 이벤트)에서 상태를 여러 번 업데이트하려면, **업데이터 함수(updater function, `setNumber(n => n + 1)`)** 를 사용

---

## 4. Try out some challenges

### Fix a request counter

#### 문제 핵심 오류
- setPending(pending + 1) 은 “현재 pending 값을 읽어서 +1”이기 때문에, 만약 동시에 두 번 클릭하면 둘 다 같은 pending(예: 0)을 읽고 +1 해서 결국 1번만 증가
- await delay(3000)으로 3초 후에 setPending(pending - 1)을 호출할 때도, 오래된 pending 값을 참조하기 때문에 상태가 뒤엉킴
- 그래서 음수로 내려가거나 예상치 못한 값이 됨

#### 해결 방법

```jsx
setCompleted(prev => prev + 1)
```

#### 정리

> 이렇게 이전 값을 기반으로 안전하게 업데이트하는 기법을 체득하는 게 문제의 핵심

1. React State는 고정되어 있음  
  → 이벤트 핸들러 실행 중에 읽은 `pending`과 `completed` 값은 일정 시점에 고정되어 있어서, **비동기 로직 이후에는 값이 최신 상태가 아닐 수 있음**
2. 비동기 작업과 State 업데이트  
3. 업데이터 함수 (Updater Function)  
  → 상태를 덮어쓰는(`pending + 1`) 대신, **이전 상태를 기반으로 계산**해야 정확한 동작을 보장할 수 있음
4. Race Condition  
  → 비동기 지연이 있을 때 여러 번 클릭하면 발생하는 경쟁 상태(Race Condition) 문제를 다루는 방법을 학습
5. React batching 이해  
  → React가 이벤트 핸들러 실행이 끝난 후, 한 번에 state 업데이트를 처리(batch)한다는 점을 감각적으로 이해


### Implement the state queue yourself