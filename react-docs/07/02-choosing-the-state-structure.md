# Reacting to Input with State

- React는 UI를 선언적으로 조작할 수 있는 방식을 제공함
- UI의 개별 요소를 직접 조작하는 대신, 컴포넌트가 가질 수 있는 다양한 상태를 설명하고, 사용자 입력에 따라 상태를 전환함
- 이는 디자이너가 UI를 사고하는 방식과 유사함

> ### You will learn
> - When to use a single vs multiple state variables
> - What to avoid when organizing state
> - How to fix common issues with the state structure

## Table of contents
1. [Principles for structuring state](#1-principles-for-structuring-state)
1. [Thinking about UI declaratively](#2-thinking-about-ui-declaratively)
1. [Recap](#5-recap)

---

## 1. Principles for structuring state
어떤 상태를 보유하는 컴포넌트를 작성할 때는 사용할 상태 변수의 수와 데이터의 형태를 고려하고 설계해야 함

상태 구조화 원칙:
1. Group related state  
  → 두 개 이상의 상태가 항상 함께 업데이트된다면 하나의 상태로 합치는 것이 좋음
2. Avoid contradictions in state  
  → 상태 값들 사이에 모순이 생기지 않도록 구조화해야 함
3. Avoid redundant state  
  → props나 기존 state로 계산할 수 있는 정보는 state로 만들지 말 것
4. Avoid duplication in state  
  → 동일한 데이터를 여러 state 변수나 중첩된 객체에 중복 저장하지 말 것
5. Avoid deeply nested state  
  → 깊은 구조의 상태는 업데이트하기 어려우므로 가능한 한 flat하게 구조화할 것

> 요약: 상태를 쉽게 업데이트하면서도 오류를 줄이기 위한 설계 원칙을 따르자. 이는 데이터베이스를 정규화하는 원리와 유사함

---

## 2. Group related state

- x, y를 개별 상태로 관리하는 대신

```jsx
const [position, setPosition] = useState({ x: 0, y: 0 });
```
- 유동적인 필드 수가 필요한 경우 객체나 배열로 그룹화
- 단점: 객체 상태를 업데이트할 때는 나머지 필드를 명시적으로 복사해야 함

## 3. Avoid contradictions in state

- 예시: isSending, isSent는 동시에 true가 될 수 있어 모순 가능성 존재
- isSending, isSent는 상태에서 파생된 상수로 처리

```jsx
const [status, setStatus] = useState('typing'); // 'typing' | 'sending' | 'sent'
```

## 4. Avoid redundant state
- 예시: fullName을 firstName, lastName으로부터 계산할 수 있음  
  → fullName을 별도로 state로 유지하면 중복 상태가 됨

```jsx
const fullName = firstName + ' ' + lastName;
```

## 5. Avoid duplication in state
- 예시: selectedItem 객체와 items 리스트 내 동일한 객체 → 상태 중복
- 문제: 하나만 변경되면 둘이 불일치하게 됨
- 해결: 객체 대신 식별자(id)만 상태로 저장

```jsx
const [selectedId, setSelectedId] = useState(0);
const selectedItem = items.find(item => item.id === selectedId);
```

## 6. Avoid deeply nested state
- 예시: 중첩된 트리 구조 (place.childPlaces)는 업데이트가 복잡하고 번거로움
- 해결: 상태를 “flat”하게 구조화  
  → 각 place를 ID로 참조하고, child ID 목록을 배열로 저장

```jsx
{
  0: { id: 0, title: '(Root)', childIds: [1, 2] },
  1: { id: 1, title: 'Earth', childIds: [...] },
  ...
}
```

## Recap
- 두 상태 변수가 항상 함께 업데이트된다면 하나로 병합
- 불가능한 상태가 생기지 않도록 구조 설계
- 업데이트 실수 줄이도록 상태 구성
- 중복된 상태 지양 (계산 가능한 값은 상태로 만들지 않기)
- props는 필요 시 직접 사용하고, 상태로 복제하지 않기
- 선택 상태는 전체 객체가 아니라 ID나 index로 관리
- 깊은 중첩 상태는 flat하게 변환 고려
