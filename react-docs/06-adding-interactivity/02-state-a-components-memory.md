# State: A Component's Memory


> ### You will learn (학습 목표)
> - How to add a state variable with the useState Hook
> - What pair of values the useState Hook returns
> - How to add more than one state variable
> - Why state is called local


## Table of contents
1. [일반 변수로 충분하지 않은 경우](#1-일반-변수로-충분하지-않은-경우)
1. [state 변수 추가하기](#2-state-변수-추가하기)
1. [컴포넌트에 여러 state 변수 지정하기](#3-컴포넌트에-여러-state-변수-지정하기)
1. [State는 격리되고 비공개로 유지됩니다](#4-state는-격리되고-비공개로-유지됩니다)

---

## 1. 일반 변수로 충분하지 않은 경우
- 로컬 변수는 렌더 사이에 값을 유지하지 못함.
- 로컬 변수의 변경은 컴포넌트 재렌더링을 유발하지 않음.
- 해결 방법은 `useState` 훅을 사용하는 것.

---

## 2. state 변수 추가하기

### 첫 번째 훅 만나기

- `useState`는 Hook이며, 상태를 “기억”하기 위해 사용.
- React는 `useState`를 호출한 순서로 상태를 추적함.

### useState 해부하기

```js
const [index, setIndex] = useState(0);
```

- `index`: 현재 상태값
- `setIndex`: 상태를 변경하고 컴포넌트를 다시 렌더링하는 함수
- `useState(0)`: 상태의 초기값 설정

#### 작동 흐름

1. 첫 렌더: `useState(0)` → `[0, setIndex]` 반환
2. 버튼 클릭: `setIndex(1)` → 상태값 1로 업데이트
3. 재렌더: `useState(0)` 호출 → `[1, setIndex]` 반환

---

## 3. 컴포넌트에 여러 state 변수 지정하기

- 상태는 여러 개 가질 수 있으며, 서로 다른 종류 가능
- 예: 숫자 상태(`index`), 불리언 상태(`showMore`)
- 관련 없는 상태는 따로 관리하는 것이 좋음

## 4. State는 격리되고 비공개로 유지됩니다

- 상태는 해당 컴포넌트 인스턴스에만 국한됨 (격리됨)
- 동일한 컴포넌트를 두 번 렌더링해도 각각 독립된 상태를 가짐
- 상위 컴포넌트는 하위 컴포넌트의 상태를 알거나 조작할 수 없음
- 상태 공유가 필요하면, 공통 부모로 상태를 끌어올려야 함

## 요약

- 상태는 렌더 간 정보를 기억하기 위해 사용
- 상태는 `useState` 훅으로 선언
- 모든 Hook은 `use`로 시작하며 컴포넌트 최상단에서만 호출해야 함
- `useState`는 `[현재 상태, 업데이트 함수]`를 반환
- 상태는 컴포넌트 내부에만 존재하며 렌더된 위치별로 구분되어 있음
