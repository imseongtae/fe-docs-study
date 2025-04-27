# Updating Arrays in State

Arrays are mutable in JavaScript, but you should treat them as immutable when you store them in state. Just like with objects, when you want to update an array stored in state, you need to create a new one (or make a copy of an existing one), and then set state to use the new array.

> ### You will learn
> - How to add, remove, or change items in an array in React state
> - How to update an object inside of an array
> - How to make array copying less repetitive with Immer

## Table of contents
1. [Updating arrays without mutation](#1-updating-arrays-without-mutation)
1. [Updating objects inside arrays](#2-updating-objects-inside-arrays)
1. [Recap](#5-recap)

---

## 1. Updating arrays without mutation

### 배열은 객체의 한 종류
- 자바스크립트에서 배열은 객체처럼 다루어야 하며, 리액트 상태에서는 읽기 전용처럼 다루어야 함
- 배열의 항목을 직접 수정하거나(`arr[0] = 'bird'`, `push()`, `pop()`) 같은 변경 메서드를 사용하는 것은 금지

### 새로운 배열을 만들어 상태를 업데이트해야 함
- 원래 배열을 기반으로 `filter()`, `map()` 같은 비변경 메서드를 사용해 새로운 배열을 만들고, 그것을 setState로 설정해야 함

| 동작                     | avoid (mutates the array)         | prefer (returns a new array)               |
|--------------------------|-----------------------------------|--------------------------------------------|
| **adding**               | `push`, `unshift`                 | `concat`, `[...arr]` spread syntax [(example)](#) |
| **removing**             | `pop`, `shift`, `splice`          | `filter`, `slice` [(example)](#)           |
| **replacing**            | `splice`, `arr[i] = ...` assignment | `map` [(example)](#)                       |
| **sorting**              | `reverse`, `sort`                 | copy the array first [(example)](#)        |

> 주의: slice()는 배열 복사. splice()는 배열 변경. 헷갈리지 말자!


### Adding to an array
- push()는 기존 배열을 변경하므로 사용 ❌
- 스프레드 문법 (...) 사용 추천

스프레드 문법 사용 예시:

```jsx
setArtists([
  ...artists,
  { id: nextId++, name: name }
]);
```

배열 앞에 추가하고 싶으면?:

```jsx
setArtists([
  { id: nextId++, name: name },
  ...artists
]);
```

### Removing from an array

**filter()** 를 사용해 원하는 항목을 제외하고 새 배열을 생성:

```jsx
setArtists(artists.filter(artist => artist.id !== targetId));
```

- 원본 배열은 변하지 않고 새로운 배열이 만들어짐

### Transforming an array

**map()** 을 사용해 특정 조건에 맞게 항목 변경:

```jsx
setShapes(shapes.map(shape =>
  shape.type === 'circle'
    ? { ...shape, y: shape.y + 50 }
    : shape
));
```

> 원본 객체를 복사(...shape)한 후 변경한다


### Replacing items in an array

`map()`을 통해 인덱스를 활용하여 원하는 항목만 변경:

```jsx
setCounters(counters.map((c, i) =>
  i === targetIndex ? c + 1 : c
));
```

### Inserting into an array

slice() + 스프레드 문법 조합:

```jsx
setArtists([
  ...artists.slice(0, insertAt),
  newArtist,
  ...artists.slice(insertAt)
]);
```

### Making other changes to an array

배열을 먼저 복사한 후 변경 메서드 사용:

```jsx
const nextList = [...list];
nextList.reverse(); // 안전
setList(nextList);
```

- 배열 안에 있는 객체는 복사되지 않음 (얕은 복사)
- 객체 자체도 따로 복사해야 안전

## 2. Updating objects inside arrays

배열 안 객체의 구조
- 배열은 객체들의 참조값을 가지고 있음
- 복사를 해도 내부 객체는 동일한 메모리 주소를 가리킴


잘못된 패턴 (문제가 발생하는 패턴):

```jsx
const myNextList = [...myList];
const artwork = myNextList.find(a => a.id === artworkId);
artwork.seen = nextSeen; // 객체를 직접 수정 ❌
```

- myNextList와 yourList가 공유 상태가 되어버림

올바른 패턴 (map 사용):

```jsx
setMyList(myList.map(artwork => 
  artwork.id === artworkId 
    ? { ...artwork, seen: nextSeen } // 새로운 객체 생성
    : artwork
));
```

- 변경할 항목만 새 객체로 복사하고 수정


### Write concise update logic with Immer 

> Immer로 간결한 업데이트 로직 작성

- immer를 쓰면 직접 변경하는 듯 코드를 쓸 수 있지만, 내부에서는 불변성을 유지함

```jsx
updateMyTodos(draft => {
  const artwork = draft.find(a => a.id === artworkId);
  artwork.seen = nextSeen;
});
```

- draft는 임시 복사본
- 최종적으로 불변성을 유지한 새 상태를 반환함

## 3. Recap

- 배열을 state 안에 저장할 수는 있지만, 그 배열을 직접 바꿔서는 안 됨
  - React에서는 state를 “불변(immutable)“하게 다루는 게 핵심 규칙
  - 이런 식으로 원본 배열을 건드리면 React가 변화를 감지하지 못하거나, 예상치 못한 버그가 생길 수 있음
	- 그래서 항상 새로운 배열을 만들어서 setState 해야 함
- 새 배열을 만들어 setState 해야 함
- map(), filter() 같은 비변경 메서드를 적극 사용
- 깊게 중첩된 객체를 다루기 힘들다면 Immer를 활용할 수 있음
