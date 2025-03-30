# React Compiler
React 컴파일러는 커뮤니티로부터 초기 피드백을 받기 위해 오픈소스로 공개한 새로운 컴파일러
- React 컴파일러는 빌드 타임 전용 도구로 React 앱을 자동으로 최적화
- 순수 자바스크립트로 동작
- React의 규칙을 이해하므로 코드를 다시 작성할 필요가 없음  

> ### You will learn (학습 목표)
> - Getting started with the compiler
> - Installing the compiler and ESLint plugin
> - Troubleshooting

## Table of contents

1. [1. Overview](#1-overview)
1. [2. Getting Started](#2-getting-started)
1. [3. Usage](#3-usage)
1. [4. Troubleshooting](#4-troubleshooting)

---

## 1. Overview

### What does the compiler do?
React 컴파일러는 애플리케이션을 최적화하기 위해 코드를 자동으로 메모이제이션 Memoization합니다. 

> 이미 useMemo, useCallback, React.memo와 같은 API를 통한 메모이제이션에 익숙할 것입니다  

**이러한 API를 사용하면 React에게 입력이 변경되지 않았다면 특정 부분을 다시 계산할 필요가 없다고 알릴 수 있어 업데이트 시 작업량을 줄일 수 있습니다**

> 이 방법은 강력하지만 메모이제이션을 적용하는 것을 잊거나 잘못 적용할 수도 있습니다. 이 경우 React가 의미 있는 변경 사항이 없는 UI 일부를 확인해야 하므로 효율적이지 않을 수 있습니다  

컴파일러는 자바스크립트와 React의 규칙에 대한 지식을 활용하여 아래 작업을 수행
- 자동으로 컴포넌트와 Hook 내부의 값 또는 값 그룹을 메모이제이션 함
- 규칙 위반을 감지할 경우 해당 컴포넌트 또는 Hook을 건너뛰고 다른 코드를 안전하게 컴파일

### Should I try out the compiler?
컴파일러가 여전히 실험적이며 다양한 결함이 있다는 점을 유의하기
- Meta와 같은 회사에서는 이미 프로덕션 환경에서 사용하였음
- 앱의 프로덕션에 컴파일러를 점진적으로 도입할지는 코드베이스의 건강 상태와 React의 규칙을 얼마나 잘 따랐는지에 따라 다를 것
- 급급할 필요는 없음, 안정적인 릴리즈에 도달할 때까지 기다려도 괜찮음. 
- 하지만 앱에서의 작은 실험을 통해 컴파일러를 시도해 보고 피드백을 제공하여 컴파일러 개선에 도움을 주는 것은 좋음

---

## 2. Getting Started

### eslint-plugin-react-compiler 설치

```bash
npm install -D eslint-plugin-react-compiler@beta
```

그런 다음, ESLint 설정Config 파일에 추가

```js
import reactCompiler from 'eslint-plugin-react-compiler'

export default [
  {
    plugins: {
      'react-compiler': reactCompiler,
    },
    rules: {
      'react-compiler/react-compiler': 'error',
    },
  },
]
```

### 코드베이스에 컴파일러 적용하기 

#### 기존 프로젝트
- 작은 디렉터리부터 점진적으로 적용하는 것이 좋음.
- 예시: 특정 디렉터리만 대상으로 설정

```js
const ReactCompilerConfig = {
  sources: (filename) => filename.includes('src/path/to/dir')
};
```

#### 새 프로젝트
전체 코드베이스에 바로 적용해도 됨

### Using React Compiler with React 17 or 18 
React 19 미만을 타겟한다면 react-compiler-runtime를 함께 포함

```bash
npm install react-compiler-runtime@beta
```

```js
// babel.config.js
const ReactCompilerConfig = {
  target: '18' // '17' | '18' | '19'
};

module.exports = function () {
  return {
    plugins: [
      ['babel-plugin-react-compiler', ReactCompilerConfig],
    ],
  };
};
```

### Using the compiler on libraries
- 라이브러리 코드도 컴파일러로 미리 컴파일 가능
- 컴파일된 코드를 npm에 배포하면 사용자 앱에서 따로 컴파일러 설정 안 해도 자동 최적화됨

## 3. Usage

### Vite
Vite를 사용하고 있다면, vite-plugin-react에 플러그인을 추가할 수 있음

```js
// vite.config.js
const ReactCompilerConfig = { /* ... */ };

export default defineConfig(() => {
  return {
    plugins: [
      react({
        babel: {
          plugins: [
            ["babel-plugin-react-compiler", ReactCompilerConfig],
          ],
        },
      }),
    ],
    // ...
  };
});
```

---

## 4. Troubleshooting

### 문제(버그)가 생겼다면 어떻게 할 수 있을까?
- React Compiler Playground에서 *최소한의 재현 가능한 예제(minimal repro)*를 먼저 만들어야 함
- 그런 다음 facebook/react GitHub 저장소에서 이슈를 등록하여 버그 보고
  - React 컴파일러 워킹 그룹에서도 회원으로 지원하여 피드백을 제공할 수 있음. 가입에 대한 자세한 내용은 README에서 확인하기

>  Playground에서 문제 상황을 최대한 단순화해서 올리는 것이 핵심


### React Compiler는 어떤 상황을 가정하고 동작하나요?
React 컴파일러가 정상 작동하려면 다음 조건을 충족해야 함:
- 의미 있는 자바스크립트 코드여야 함 (문법적으로 완전해야 함).
- nullable/optional 값을 다룰 때는 정의 여부를 확인해야 함:
  - TypeScript 사용 시 strictNullChecks 옵션이 필요.
  - 예: `object.nullableProp?.foo` 또는 `if (object.nullableProp) { ... }`
- **React 규칙(예: Hook 사용 규칙 등)**을 따라야 함.
  - 위반하면 컴파일러가 자동으로 해당 컴포넌트를 건너뜀.
  - ESLint 플러그인 설치 시 위반 사항을 코드 에디터에서 확인 가능  

### 컴포넌트가 최적화되었는지 어떻게 알 수 있을까요? 
- React DevTools v5 이상에서는 최적화된 컴포넌트 옆에 👉 "Memo ✨" 배지가 붙음
- 이는 해당 컴포넌트가 자동으로 **메모이제이션(memoization)** 되었음을 의미

### 컴파일 후 작동하지 않는 문제
가능한 원인 1: 컴파일러가 잘못 컴파일함
- JavaScript는 워낙 유연한 언어라 일부 코드가 잘못 컴파일되는 false negative가 생길 수 있음
- 심각한 경우 버그, 무한 루프, 정의되지 않은 동작 발생

가능한 원인 2: 컴파일된 컴포넌트가 내부적으로 규칙을 어김
- ESLint 플러그인을 설치해도 오류가 보이지 않으면
  - 컴파일러가 실수로 규칙을 위반한 코드를 컴파일한 것일 수 있음

#### use no memo 문제 있을 때 임시 탈출구
언제 써야 할까?
- 특정 컴포넌트/Hook을 컴파일러가 잘못 해석하거나 문제가 발생할 때
- 즉, “이건 컴파일하지 마”라고 알려주는 안전장치

```tsx
function SuspiciousComponent() {
  "use no memo"; // 컴포넌트가 React 컴파일러에 의해 컴파일되지 않도록 제외합니다.
  // ...
}
```

**주의사항**
- 임시 방편임. 장기적으로 유지하면 안 됨
- “use no memo”가 존재하면 해당 컴포넌트는 계속 최적화 대상에서 제외됨
- 문제 해결 후에는 반드시 이 지시어를 제거하고 다시 동작 여부를 확인해야 함

---

## 요약
- React 컴파일러는 아주 똑똑하지만, 모든 상황을 완벽히 처리하진 못함
- 따라서 문제가 생기면 조심스럽게 컴포넌트 단위로 테스트
- 필요 시 "use no memo"로 우회하면서 원인을 좁혀가는 전략이 핵심
