# Updating Objects in State

State can hold any kind of JavaScript value, including objects. But you shouldn’t change objects that you hold in the React state directly. Instead, when you want to update an object, you need to create a new one (or make a copy of an existing one), and then set the state to use that copy.

> ### You will learn
> - How to correctly update an object in React state
> - How to update a nested object without mutating it
> - What immutability is, and how not to break it
> - How to make object copying less repetitive with Immer

## Table of contents
1. [What’s a mutation?](#1-whats-a-mutation)
1. [Treat state as read-only](#2-treat-state-as-read-only)
1. [Copying objects with the spread syntax](#3-copying-objects-with-the-spread-syntax)
1. [Updating a nested object](#4-updating-a-nested-object)
1. [Recap](#5-recap)

---

## 1. What’s a mutation? 

### Mutation 정의
- **Mutation(변경)**: 객체나 배열 등의 *기존 값 자체를 직접 수정*하는 행위
- 숫자, 문자열, 불린 등 **기본형(Primitive Type)** 은 변경할 수 없음
  - 값 자체가 읽기 전용이기 때문
- 하지만 객체(Object)는 **변경 가능**함.  
  - 그래서 리액트에서는 **객체도 변경하지 말고 새로 만들어서 대체해야 함**

### 예시
```jsx
const [position, setPosition] = useState({ x: 0, y: 0 });

position.x = 5; // ❌ 직접 변경 (Mutation)
```

### 정리
- 리액트에서는 **객체도 immutable(불변)**하게 다루어야 함
- 기존 객체를 직접 수정하는 대신, **새 객체를 만들어서** 상태를 갱신해야 함

---

## 2. Treat state as read-only

> state에 저장한 자바스크립트 객체는 어떤 것이라도 읽기 전용인 것처럼 다루어야 한다

### 문제 상황

```plaintext
<!-- 공식 문서 예제 설명 -->
아래 예시에서 state의 object는 현재 포인터 위치를 나타냅니다. 프리뷰 영역을 누르거나 커서를 움직일 때 빨간 점이 이동해야 합니다. 하지만 점은 초기 위치에 머무릅니다
```

아래는 문제를 일으키는 코드

```jsx
position.x = e.clientX;
position.y = e.clientY;
```
- 이렇게 직접 변경하면 React는 **변경 사실을 모름** → **리렌더링이 발생하지 않음**

### 올바른 방법
```jsx
onPointerMove={e => {
  setPosition({
    x: e.clientX,
    y: e.clientY
  });
}}
```
- 새 객체를 만들어 `setPosition`에 전달하면, React가 감지하고 리렌더링이 일어남

---

## 3. Copying objects with the spread syntax

> 전개 문법으로 객체 복사하기, (`...`) 의 사용

### Spread Syntax
- 새 객체 생성 시, 기존 데이터 일부를 복사하고 일부만 덮어쓰기 해야 할 때가 많음
  - 기존 객체를 복사하고, 필요한 부분만 덮어씌울 때 사용
  - 이럴 때 스프레드 문법 (...) 사용.
- **얕은 복사(Shallow Copy)** 만 수행

예시:
```jsx
setPerson({
  ...person, // 기존 데이터 복사
  firstName: e.target.value // 수정할 값만 덮어쓰기
});
```

- 기존 `person`의 모든 필드를 복사하고, `firstName`만 새 값으로 교체

>  큰 폼(Form)을 다룰 때, 개별 필드를 따로 관리하는 것보다, 하나의 객체에 묶어서 관리하는 것이 편리함




### Deep Dive: 여러 필드를 하나의 핸들러로 관리하기
더 나은 구조
- input의 name 속성을 이용해서 동적 프로퍼티 업데이트 가능
  - `name` 속성을 활용해 **하나의 핸들러로 여러 필드 관리** 가능

```jsx
function handleChange(e) {
  setPerson({
    ...person,
    [e.target.name]: e.target.value
  });
}
```

---

## 4. Updating a nested object

> 중첩된 객체 갱신하는 방법

- 중첩된 객체(예: `person.artwork.city`)를 수정할 때도 직접 변경 금지
- 내부 객체도 복제 후 수정해야 함

중첩 객체 예시:

```jsx
const [person, setPerson] = useState({
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://i.imgur.com/Sd1AgUOm.jpg',
  }
});
```

잘못된 방식:

```jsx
person.artwork.city = 'New Delhi'; // 직접 수정 ❌
```

올바른 방법:

```jsx
setPerson({
  ...person, // Copy other fields
  artwork: { // but replace the artwork
    ...person.artwork, // with the same one
    city: 'New Delhi' // but in New Delhi!
  }
});
```

### 주의
- **"중첩 객체"** 라고 표현하지만, 실제로는 객체 안에 객체가 "참조"로 연결되어 있는 것
- 따라서 한 객체를 수정하면, 객체를 참조하는 다른 객체들도 영향을 받게 됨

### Deep Dive: 객체는 '중첩'이 아님

- 코드 상에서는 중첩처럼 보이지만 실제로는 객체가 서로 참조(reference)하는 구조

```jsx
let obj1 = { city: 'Hamburg' };
let obj2 = { artwork: obj1 };
let obj3 = { artwork: obj1 };
// obj3.artwork.city를 수정하면 obj2.artwork.city도 같이 바뀜
```

- 복사하지 않고 수정하면 예기치 않은 사이드 이펙트가 발생할 수 있음


### Write concise update logic with Immer 

> Immer로 간결한 갱신 로직 작성하기

#### Immer란?
- '사용자는 직접 수정하는 것처럼 작성' → **내부적으로 복사본을 만들어서 안전하게 상태 갱신**해줌
- **Proxy** 기술을 사용해 내부 변경을 추적

Immer 사용 예시:

```jsx
updatePerson(draft => {
  draft.artwork.city = 'Lagos';
});
```
- 직접 수정하는 문법처럼 작성하지만 실제로는 새로운 객체를 만들어줌

> Immer 안 써도 될 것 같은데... 😂

---


## 5. Recap
- React의 모든 state는 불변으로 취급해야 함
  - React는 변경을 감지할 때, 기존 값과 새 값이 같은지 비교해서 작동하므로 → 값 자체를 수정하면 이 비교가 불가능해지기 때문
  - “새 값을 만들어서 교체하는 방식”을 기본 규칙으로 삼아야 함
- state에 객체를 저장하면 객체를 변경해도 렌더링이 트리거되지 않고 이전 렌더링 "스냅샷"의 상태가 변경됨
- 객체를 변경하는 대신, 새 버전을 생성하고, state를 설정하여 다시 렌더링을 트리거하자
- 객체의 복사본을 만들기 위해 `{...obj, something: 'newValue'}` 객체 스프레드 구문(spread syntax)을 사용할 수 있음
- 스프레드 구문은 얕은 복사(Shallow Copy)임. 한 수준의 깊이만 복사함
- 중첩된 객체를 업데이트하려면, 업데이트하려는 위치에서 끝까지 복사본을 만들어야 합니다.
- 반복적인 코드 복사를 줄이려면 Immer를 사용

---

## Q&A
예상 질문과 답변 (스터디/발표 대비용)

| 질문 | 답변 |
|:---|:---|
| 왜 객체를 직접 수정하면 안 되나요? | React는 기존 객체를 변경하는 것을 감지할 수 없습니다. 새 객체를 생성해야 리렌더링이 발생합니다. |
| 스프레드 문법은 깊은 복사인가요? | 아니요. 스프레드 문법은 얕은 복사(shallow copy)만 수행합니다. |
| 중첩 객체를 수정할 때는 어떻게 해야 하나요? | 수정 경로를 따라 모든 객체를 복제한 다음 수정해야 합니다. |
| Local Mutation은 왜 괜찮은가요? | 새 객체는 외부 코드와 공유되지 않기 때문에 수정해도 문제 없습니다. |
| Immer를 꼭 사용해야 하나요? | 필수는 아니지만, 중첩이 깊거나 복사가 반복되는 경우 코드가 깔끔해지고 실수를 줄일 수 있어 추천합니다. |

---
