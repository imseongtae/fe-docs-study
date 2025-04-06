# Describing the UI

## Table of contents

1. [Your First Component](#1-your-first-component)
1. [Importing and Exporting Components](#2-importing-and-exporting-components)
1. [Writing Markup with JSX](#3-writing-markup-with-jsx)
1. [JavaScript in JSX with Curly Braces](#4-javascript-in-jsx-with-curly-braces)
1. [Passing Props to a Component](#5-passing-props-to-a-component)

---

## 1. Your First Component
### 핵심 요약
- React를 사용하면 앱의 재사용 가능한 UI 요소인 컴포넌트를 만들 수 있음
- React 앱에서 모든 UI는 컴포넌트
- React 컴포넌트는 다음 몇 가지를 제외하고는 일반적인 JavaScript 함수
  1. 컴포넌트의 이름은 항상 대문자로 시작
  2. JSX 마크업을 반환


## 2. Importing and Exporting Components

### 핵심 요약
- Root 컴포넌트란 무엇인지
- 컴포넌트를 import 하거나 export 하는 방법
- 언제 default 또는 named imports와 exports를 사용할지
- 한 파일에서 여러 컴포넌트를 export 하는 방법


## 3. Writing Markup with JSX
> JSX가 존재하는 이유와 컴포넌트에서 JSX를 쓰는 방법에 대해 학습

### 핵심 요약
- React 컴포넌트는 서로 관련이 있는 마크업과 렌더링 로직을 함께 그룹화함
- JSX는 HTML과 비슷하지만 몇 가지 차이점이 있음
  - 필요한 경우 변환기를 사용할 수 있음
- 오류 메시지는 종종 마크업을 수정할 수 있도록 올바른 방향을 알려줌

### 궁금한 점
React에서 렌더링 로직과 마크업이 같은 위치에 함께 있게 된 이유에 큰 공감을 하게 됨

> 이러한 까닭에 현대 웹 프레임워크나 라이브러리는 렌더링 로직과 마크업과 스타일까지 같은 위치에 함께 두고 관장하려고 하는 것이 아닐까?

React에서 렌더링 로직과 마크업이 같은 위치에 함께 있게 된 이유입니다. 즉, 컴포넌트에서 말이죠.
로직이 내용과 스타일 또한 결정한다..
그래서 하나의 확장자 파일에서 모든 것을 관장하려는 것은 아닐까?

---

## 4. JavaScript in JSX with Curly Braces
JSX에 대한 거의 모든 것

### 문자열 전달하기
- 문자열 어트리뷰트를 JSX에 전달하려면 작은따옴표나 큰따옴표로 묶어야 함
- 중괄호를 사용하면 마크업에서 바로 JavaScript의 값을 사용할 수 있음

> 중괄호를 사용하면 마크업에서 바로 JavaScript를 사용할 수 있기 때문입니다.

```tsx
const Avatar = () => {
  const avatar = 'https://i.imgur.com/7vQD0fPs.jpg';
  const description = 'Gregorio Y. Zara';

  return <img className="avatar" src={avatar} alt={description} />;
};
```

### 이중 중괄호 사용

```tsx
<ul
  style={
    // 중괄호 안에 JavaScript 객체
    {
      backgroundColor: 'black',
      color: 'pink',
      textAlign: 'left',
      fontWeight: 'bold',
    }
  }
>
```

> JSX에서 `{{` 와 `}}` 를 본다면 JSX 중괄호 안의 객체에 불과하다는 것을 알아야 합니다.

> JSX는 JavaScript를 사용하여 데이터와 논리를 구성할 수 있는 매우 작은 템플릿 언어입니다.


### 핵심 요약
- 따옴표 안의 JSX 어트리뷰트는 문자열로 전달됨
- 중괄호를 사용하면 JavaScript 논리와 변수를 마크업으로 가져올 수 있음
- JSX 태그 내부 또는 어트리뷰트의 `=` 뒤에서 작동함
- `{{` 및 `}}` 는 특별한 문법이 아님. JSX 중괄호 안에 들어 있는 JavaScript 객체

---

## 5. Passing Props to a Component


### JSX spread 문법으로 props 전달하기 

```tsx
function Profile({ person, size, isSepia, thickBorder }) {
  return (
    <div className="card">
      <Avatar
        person={person}
        size={size}
        isSepia={isSepia}
        thickBorder={thickBorder}
      />
    </div>
  );
}
```


> spread 문법은 제한적으로 사용하세요. 다른 모든 컴포넌트에 이 구문을 사용한다면 문제가 있는 것입니다.

> TypeScript 활용시에 spread 문법의 효용이 더 높아질 것

```tsx
interface Avatar {
  person: Person;
  size: number;
  isSepia: boolean;
  thickBorder: string;
}

interface Person {
  name: string;
  imageId: string;
}

function Profile(props: Avatar) {
  return (
    <div className="card">
      <Avatar {...props} />
    </div>
  );
}
```



## 궁금한 사항 정리

### 1. 왜 JSX가 등장했을까?
배경:
- React 초기에는 UI를 React.createElement()로 직접 정의해야 했음
- 이 구조는 복잡한 UI가 되면 가독성과 유지보수가 매우 떨어짐

```js
React.createElement('h1', { className: 'greeting' }, 'Hello, world!');
```

#### JSX가 해결하는 문제는?
별도의 템플릿 언어가 아니라, JavaScript 내부에서 동작하는 템플릿 계층  
- JSX는 UI 구조를 HTML-like 문법으로 표현할 수 있도록 도와주는 문법 설탕(Syntactic Sugar)
- 결국 JSX는 React.createElement() 호출로 변환됨 → 즉, 함수 호출 구조

---

### 2. 컴포넌트 설계의 실제 사례
설계 고려 요소  
- 재사용 가능성: 다른 페이지나 상황에서도 동일한 방식으로 동작
- 확장 가능성: props만 바꾸면 스타일/기능 변화
- 유지보수 용이성: 인터페이스(interface)가 명확해야 함

버튼 컴포넌트 예시

```tsx

```

---

### 3. 스타일까지 컴포넌트 내부에 둘 수 있다?

> “스타일까지 컴포넌트 내부에 둘 수 있다?”

💡 세 가지 대표 방식

| 방식            | 설명                                                   | 장점                                | 단점                                |
|-----------------|--------------------------------------------------------|-------------------------------------|-------------------------------------|
| **CSS-in-JS**   | JS 파일 내에 CSS 정의 (ex: styled-components)         | 컴포넌트에 스타일 완전 통합         | 번들 크기 증가, 러닝 커브            |
| **Tailwind CSS**| 클래스 기반 유틸리티 CSS 프레임워크                   | 빠른 개발, 일관성 유지              | 클래스가 장황해질 수 있음            |
| **모듈 CSS**    | CSS 파일을 모듈화하여 import                          | 기존 CSS 습관 유지 가능             | 전역 스타일 관리 어려움              |

> “스타일도 이제는 컴포넌트의 일부다. 각 프로젝트에 맞는 스타일링 전략을 선택해야 한다.”
