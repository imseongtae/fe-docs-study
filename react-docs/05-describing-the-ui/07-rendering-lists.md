# Rendering Lists

> 데이터 모음에서 유사한 컴포넌트를 여러 개 표시하고 싶을 때가 종종 있음, JavaScript는 배열 메서드를 사용하여 데이터 배열을 조작할 수 있음
> React에서는 `filter()`와 `map()`을 사용해 데이터 배열을 필터링하고 컴포넌트 배열로 변환할 수 있음

> ### You will learn (학습 목표)
> - How to render components from an array using JavaScript’s map()
> - How to render only specific components using JavaScript’s filter()
> - When and why to use React keys

## Table of contents

1. [배열을 데이터로 렌더링하기](#1-배열을-데이터로-렌더링하기)
1. [배열의 항목들을 필터링하기](#2-배열의-항목들을-필터링하기)
1. [Keeping list items in order with key](#3-keeping-list-items-in-order-with-key)

---

## 1. 배열을 데이터로 렌더링하기

### 리스트를 다루는 방법
아래와 같이 내용이 있는 리스트가 있다고 가정할 때

```html
<ul>
  <li>Apple</li>
  <li>Banana</li>
  <li>Cherry</li>
</ul>
```

객체에서 컴포넌트 리스트를 렌더링할 수 있음

- 이러한 리스트 항목의 유일한 차이점은 콘텐츠, 즉 데이터임
- 인터페이스(댓글 목록에서 프로필 이미지 갤러리에 이르기까지)를 구축할 때 **서로 다른 데이터**를 사용하여 동일한 컴포넌트의 여러 인스턴스를 표시해야 하는 경우가 종종 있음
- 이러한 상황에서 해당 데이터를 JavaScript 객체와 배열에 저장하고 `map()`과 `filter()` 같은 메서드를 사용하여 해당 객체에서 컴포넌트 리스트를 렌더링할 수 있음

### React

```jsx
const fruits = ['Apple', 'Banana', 'Cherry'];

export default function List() {
  return (
    <ul>
      { people.map(person => <li>{person}</li>) }
    </ul>
  );
}
```

### 다른 프레임워크에서 리스트를 다루는 방법

#### Vue
- `v-for` 디렉티브를 사용해 반복 렌더링
- `:key`는 필수는 아니지만, 성능 최적화 및 DOM 트래킹에 매우 중요

```vue
<template>
  <ul>
    <li v-for="(fruit, index) in fruits" :key="index">
      {{ fruit }}
    </li>
  </ul>
</template>

<script setup>
const fruits = ['Apple', 'Banana', 'Cherry'];
</script>
```

#### Angular
- `*ngFor` 디렉티브로 반복 렌더링
- `let i = index`로 인덱스를 가져올 수 있음
- 구조적 지시자(*)를 사용하는 점이 Angular의 특징

```ts
import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common'; // 👈 추가

@Component({
  selector: 'app-root',
  standalone: true, // standalone 컴포넌트임을 명시
  imports: [CommonModule], // 👈 여기서 CommonModule을 추가해야 *ngFor 사용 가능
  template: `
    <ul>
      <li *ngFor="let fruit of fruits; let i = index">
        {{ i + 1 }}. {{ fruit }}
      </li>
    </ul>
  `,
})
export class AppComponent {
  fruits = ['Apple', 'Banana', 'Cherry'];
}

bootstrapApplication(AppComponent);
```

#### Svelte
-	`#each` 블록 문법을 사용하여 배열 반복.
-	`as fruit`, `i`를 통해 요소와 인덱스를 같이 받을 수 있음.
-	Svelte는 컴파일 타임에 최적화되어 매우 빠름.
-	반응형은 let 변수만으로도 작동하며, 직접 배열 변경이 가능.

```svelte
<script>
  let fruits = ['Apple', 'Banana', 'Cherry'];
</script>

<ul>
  {#each fruits as fruit, i}
    <li>{fruit}</li>
  {/each}
</ul>
```

### React를 더 잘 이해하기 위한 비교

#### 디렉티브(Directive)란 무엇인가?

> 한 줄 정의: 디렉티브는 템플릿(HTML)에서 특정 DOM 요소의 동작을 프레임워크가 제어할 수 있도록 지시하는 특수 문법. 즉, 프레임워크가 DOM을 더 똑똑하게 제어할 수 있게 하는 명령어에 해당

조금 더 자세히 말하면...
일반 HTML은 정적인 구조를 표현하지만, 프레임워크는 데이터를 기반으로 동적인 DOM을 렌더링해야 함.  
이때 템플릿 안에서 for, if, bind, show, model 같은 동작을 HTML 안에서 바로 다루게 해주는 문법이 필요한데, 이 역할을 수행하는 것이 바로 **디렉티브**

#### 디렉티브의 기원

- 디렉티브의 아이디어는 AngularJS (v1) 에서 처음 큰 의미로 사용됨
- 당시에는 “HTML은 선언적이지만 너무 정적이다”는 고민에서 시작

🔹 AngularJS 시대 (2010년대 초반)
- HTML에 ng-if, ng-repeat, ng-click 같은 **지시어(Directive)**를 붙여서 선언형 UI 구현
- 당시 jQuery는 imperative 방식이라 DOM을 직접 건드려야 했음

#### 리액트를 더 잘 이해하기 위한 관점

##### React vs 다른 프레임워크 비교 관점

| 관점             | React                                | Vue / Angular / Svelte                                |
|------------------|--------------------------------------|-------------------------------------------------------|
| 템플릿           | JSX (JS 안에 HTML)                   | HTML 템플릿 안에 로직                                 |
| 반복             | `.map()` 등 JS 사용                  | 디렉티브 (`v-for`, `*ngFor`, `#each`)                 |
| 조건부 렌더링    | 삼항 연산자, `&&`, `if`              | `v-if`, `*ngIf`, `#if` 등                             |
| 선언형 / 명령형  | 선언형에 가깝지만 JS 기반            | 템플릿은 선언형에 가깝고 추상화 많음                  |
| 철학             | JavaScript 중심, low-level 제어 강조 | HTML 중심, high-level 추상화 강조                     |

1. 템플릿 vs JSX 철학 차이
    - JSX는 자바스크립트의 힘을 그대로 가져와 사용함
    - Vue/Angular/Svelte는 HTML 템플릿 안에서 “제어된 방식”으로 로직 표현
1. 렌더링 추상화 레벨
    - React는 비교적 저수준(low-level)에서 직접 처리
    - 다른 프레임워크는 디렉티브로 추상화되어 더 선언적
1. 상태 변경에 따른 리렌더링 방식 차이
    - React는 virtual DOM diffing
    - Svelte는 compile-time에 구문을 분석해서 직접 DOM 조작 코드로 변환 (진짜 빠름)
    - Vue는 반응형 Proxy를 통한 자동 추적
    - Angular는 Zone.js와 Change Detection으로 추적
4. 선언형 프로그래밍에 대한 해석의 차이
    - React는 JS 내부에서 선언형을 구현
    - Vue/Angular/Svelte는 HTML 기반 선언형


> 차이는 결국 “누가 더 통제권을 가지는가 (JS vs Template)“의 문제로 연결되며, 이것을 비교하면 React를 더 잘 이해할 수 있음

---


## 2. 배열의 항목들을 필터링하기
훨씬 더 구조화된 데이터를 다루기 위해 JavaScript의 `Array.prototype.filter()` 를 잘 활용해야 함

```ts
const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
}];
```

### 주의사항
화살표 함수 사용 주의사항
- 화살표 함수는 암시적으로 `=>` 바로 뒤에 식을 반환하기 때문에 `return` 문이 필요하지 않음
- 하지만 `=>` 뒤에 `{` (중괄호)가 오는 경우 `return`을 명시적으로 작성해야 함

```js
const listItems = chemists.map(person => { // 중괄호
  return <li>...</li>;
});
```

`=> {` 를 표현하는 화살표 함수를 “block body”를 가지고 있다고 말함. 이 함수를 사용하면 한 줄 이상의 코드를 작성할 수 있지만 `return` 문을 반드시 작성해야 함. 그렇지 않으면 아무것도 반환되지 않음

> JavaScript 중심이고, low-level 제어가 중요하다보니 JavaScript의 기본적인 문법 주의사항을 잘 준수해야 함

---

## 3. Keeping list items in order with key
Key는 각 컴포넌트가 어떤 배열 항목에 해당하는지 React에 알려주어 나중에 일치시킬 수 있도록 함
> - 배열 항목이 정렬 등으로 인해 이동하거나, 삽입되거나, 삭제될 수 있는 경우 중요
> - key를 잘 선택하면 React가 무슨 일이 일어났는지 추론하고, DOM 트리에 업데이트 하는데 도움이 됨

### React의 `key` 사용에 대한 개념 정리

React에서 리스트를 렌더링할 때, 각 항목에는 **고유한 `key`**를 부여해야 함  
`key`는 React가 각 컴포넌트를 어떤 데이터 항목과 매칭시킬지를 알 수 있도록 도와줌

---

### `key`가 필요한 이유

> 배열 항목이 **삽입**, **삭제**, **재정렬**되는 경우, React는 DOM을 효율적으로 업데이트하기 위해 각 항목을 추적해야 함

예시 비유:  
- 데스크탑의 모든 파일에 **이름이 없고**, "첫 번째 파일", "두 번째 파일"처럼 순서로만 식별해야 한다고 상상해 보기 😂  
- 하나를 삭제하면 나머지 파일의 의미가 뒤바뀌게 됨

> `key`는 이런 혼란을 방지하고, React가 **항목의 고유한 정체성**을 인식하게 함

### `key` 값은 어디에서 가져오나요?

| 데이터 출처         | `key`로 사용하기 좋은 값                      |
|---------------------|-----------------------------------------------|
| 데이터베이스        | 고유한 `id` 또는 PK 값                        |
| 로컬에서 생성한 데이터 | `crypto.randomUUID()`, `uuid`, 일련번호 등 |

> `key`는 **즉석에서 Math.random()처럼 생성하면 안 되며**, 가능한 한 **항목 생성 시점**에 부여되어야 합니다.

### `key` 주의사항
1. 배열에서 항목의 인덱스를 key로 사용하면 종종 미묘하고 혼란스러운 버그가 발생
    - 항목이 삽입되거나, 삭제하거나, 배열의 순서가 바뀌면 시간이 지남에 따라 렌더링 순서가 변경됨
2. `key={Math.random()}`처럼 즉석에서 key를 생성하면 안됨
    - 렌더링 간에 key가 일치하지 않아, 모든 컴포넌트와 DOM이 매번 다시 생성될 수 있음 → 속도가 느려짐
    - 리스트 항목 내부의 모든 사용자의 입력도 손실
    - 데이터 기반의 안정적인 ID를 사용을 권장
3. 컴포넌트에 ID가 필요하다면 `<Profile key={id} userId={id} />`와 
같이 별도의 prop으로 전달해야 함
    - 컴포넌트가 key를 prop으로 받지 않는다는 점에 유의
    - key는 React 자체에서 힌트로만 사용


### `key` 규칙 정리

1. `key`는 **형제 노드 간에 고유**해야 함
2. **렌더링 중에 key를 생성하지 말 것** (랜덤 값, 배열 인덱스 등)
3. 서로 다른 배열에 같은 key가 있어도 괜찮음 (범위 내 고유성만 유지)
4. **값이 변경되지 않도록 유지**해야 함 → key는 항목의 **정체성(identity)**을 의미(생명주기 내내 항목을 식별하기 위해)

---

### 핵심 요약

| 항목            | 설명 |
|------------------|------|
| 목적             | React가 각 리스트 항목을 식별하고 최적화된 업데이트 수행 |
| 좋은 key 예시     | `user.id`, `task.uuid` 등 고정된 고유 값(데이터 기반의 안정적인 ID 사용을 권장) |
| 피해야 할 key 예시 | `Math.random()`, `index` (특히 동적 리스트에서) |

---
