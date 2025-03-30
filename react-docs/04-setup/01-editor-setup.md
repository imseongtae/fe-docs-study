# Editor Setup

> A properly configured editor can make code clearer to read and faster to write. It can even help you catch bugs as you write them! If this is your first time setting up an editor or you’re looking to tune up your current editor, we have a few recommendations.

> 적절한 개발환경은 코드의 가독성을 높이며, 개발 속도를 높여줌 <- 생산성과 관련이 있음, 야근 안 하려면 해야 함 😂  
> 심지어 코드를 작성하는 과정에서 버그를 찾아줄 수도 있음 <- 미래의 나를 위해 꼭 설정해야 함

> ### You will learn (학습 목표)
> - What the most popular editors are
> - How to format your code automatically

## Table of contents

1. [1. Your editor](#1-your-editor)
1. [2. Recommended text editor features](#2-recommended-text-editor-features)

---

## 1. Your editor

### VS Code
**VS Code**는 현재 가장 많이 사용되는 에디터 중 하나  
- **VS Code**에 설치할 수 있는 익스텐션의 종류는 무수히 많음
- **Github**과 같은 외부 서비스와 연동 지원

### 그 외
VS Code 외에도 React 커뮤니티에서는 다음과 같은 에디터들이 흔히 사용됩니다.

- **WebStorm** 은 JavaScript에 특화되어 설계된 통합 개발 환경
- **Sublime Text**는 JSX와 TypeScript를 지원하며 문법 강조 및 자동 완성 기능이 내장되어 있음
- **Vim**은 모든 종류의 텍스트를 매우 효율적으로 생성하고 변경할 수 있도록 설계된 텍스트 편집기
  - 대부분의 UNIX 시스템과 Apple OS X에 “vi”로 포함되어 있음

---

## 2. Recommended text editor features

### 2-1. Linting
- 코드 린터는 코드를 작성하는 동안 실시간으로 문제를 찾아줌으로써 빠른 문제해결이 가능하도록 도와줌
- **ESLint**는 많이 사용되고 JavaScript를 위한 오픈소스 린터

- React를 위한 추천 설정과 함께 **ESLint** 설치하기 (사전에 Node가 설치되어 있어야 함)
- VS Code의 ESLint를 공식 익스텐션과 통합하기

> 💡 Make sure that you’ve enabled all the `eslint-plugin-react-hooks` rules for your project. They are essential and catch the most severe bugs early. The recommended `eslint-config-react-app` preset already includes them.  

> 💡 프로젝트의 모든 `eslint-plugin-react-hooks` 규칙을 활성화했는지 확인하세요. 이 규칙은 필수적이며 가장 심각한 버그를 조기에 발견합니다. 권장되는 `eslint-config-react-app` 프리셋에는 이미 이 규칙이 포함되어 있습니다.


### 2-2. Formatting
다른 개발자들과 협업할 때 가장 피하고 싶은 것은 탭 vs 공백에 대한 논쟁일 것 <- "결국, 코드의 형식"
다행히 `Prettier`를 사용하면 직접 지정해 놓은 규칙들에 부합하도록 코드의 형식을 정리할 수 있음 <- "Prettier 는 코드 형식을 정리하는 도구"

- `Prettier`를 실행하면 모든 탭은 공백으로 전환될 뿐만 아니라 들여쓰기, 따옴표 형식과 같은 요소들이 전부 설정에 부합하도록 수정될 것 
- 파일을 저장할 때마다 `Prettier`가 자동 실행되어, 이러한 작업들을 수행하도록 하는 것이 가장 이상적인 설정

> 💡 `Prettier`는 코드 형식을 정리하는 도구이지만, 협업자들 사이 코드 형식을 일관되게 맞추는 도구로도 사용할 수 있음

#### Formatting on save
저장할 때마다 코드가 포매팅 되는 것이 가장 이상적일 것. 이러한 설정은 VS Code에 자체적으로 내장되어 있음

1. VS Code에서 CTRL/CMD + SHIFT + P 누르기
2. ”settings”라고 입력하기
3. 엔터 누르기
4. 검색 창에서 “format on save”라고 입력하기
5. ”format on save” 옵션이 제대로 체크되었는지 확인하기!

#### Prettier in ESLint
Formatting on save 를 꼭 켜야 하는가 🤔

```js
rules: {      
  'prettier/prettier': 'error', // Prettier 룰을 ESLint에 적용
},
```

---

## 질문
- 린팅과 포맷팅 룰을 잘 점검하여, 코드 저장소를 방어하는 목적으로 잘 사용하는게 중요하다는 생각 
- 저장할 때마다 포맷팅을 적용하도록 하는 설정 때문인지, 동료가 작업하는 컴퓨터 속도 때문에 이슈를 겪은 적이 있다. 당시 동료의 컴퓨터는 최신 Mac이 아닌 Intel Mac을 사용했고, 최신 os도 아님, 저장하고, 린팅과 포맷팅 규칙을 저장하는 과정에서 딜레이가 생김, 작업 흐름을 깨먹고, 생산성 저하가 일어남
  - 느린 동료의 VS Code 에디터를 보면서 Linting, Formatting 설정이 현재 열려 있는 페이지만 검사를 하는 게 아니라 파일을 검사하는 것인가 생각했었음
  - 포맷팅 성능 향상을 위해 했던 고민
    - .eslintignore와 .prettierignore 설정 (`node_modules/`, `build/`, `dist/`) 
- 협업 품질 향상을 위해 했던 고민(나와의 협업) <-  `lint-staged` + `husky`

---
