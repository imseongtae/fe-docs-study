# Installation


## Table of contents

1. [1. 설치하기](#1-설치하기)
1. [2. 새로운 React 앱 만들기](#2-새로운-react-앱-만들기)
1. [3. Build a React app from Scratch](#3-build-a-react-app-from-scratch)
1. [4. Add React to an Existing Project](#4-add-react-to-an-existing-project)

---

## 1. 설치하기

### 로컬 환경에서 React 시도하기 

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Hello World</title>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>

    <!-- Don't use this in production: -->
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="text/babel">
    
      function MyApp() {
        return <h1>Hello, world!</h1>;
      }

      const container = document.getElementById('root');
      const root = ReactDOM.createRoot(container);
      root.render(<MyApp />);
    </script>
  </body>
</html>
```

### Sunsetting CRA

2025년 2월 14일, React 공식 블로그에서는 **Create React App(CRA)**의 공식 지원 중단(Sunsetting)을 발표

CRA는 2016년 React 팀이 “개발 환경 설정 없이 React를 시작할 수 있도록” 만든 도구였어요. 하지만 시간이 흐르면서:
1. 현실적인 한계: 웹 개발의 요구사항이 복잡해지고, CRA는 점점 더 많은 설정을 감추기 어려워짐
2.	낮은 유지 관리: CRA의 주요 유지 관리자들이 다른 프로젝트로 옮기면서, 기능 추가나 이슈 대응이 더뎌짐
3.	대안의 등장: Vite, Next.js, Remix 같은 더 빠르고 모던한 빌드 툴들이 등장. 이들은 성능, DX(개발자 경험), SSR 지원 측면에서 CRA보다 우수

#### Sunsetting Create React App의 내용 요약

[Sunsetting Create React App](https://ko.react.dev/blog/2025/02/14/sunsetting-create-react-app) 의 핵심 내용을 요약하면 다음과 같음

> "React는 특정 도구에 얽매이지 않습니다. 여러분의 요구에 맞는 빌드 도구를 선택하세요"

이제 CRA는 React 공식 문서에서도 **“과거의 유산”**으로 다뤄지고 있고, React 커뮤니티는 더 빠르고 유연한 빌드 환경으로 이동 중

- [Sunsetting Create React App](https://ko.react.dev/blog/2025/02/14/sunsetting-create-react-app)


## 2. 새로운 React 앱 만들기

### Next.js
Next.js의 앱 라우터는 React의 아키텍처를 최대한 활용하여 풀스택 React 앱을 구현하는 React 프레임워크입니다.

Next.js는 Vercel에서 유지 관리합니다. Next.js 앱을 모든 Node.js 또는 서버리스 호스팅 또는 자체 서버에 배포할 수 있습니다. Next.js는 서버가 필요 없는 정적 내보내기 기능도 지원합니다. Vercel은 추가로 옵트인 유료 클라우드 서비스를 제공.

```bash
npx create-next-app@latest
```

### React Router (v7)

React 라우터는 가장 널리 사용되는 라우팅 라이브러리로, Vite와 결합하여 풀스택 React 프레임워크를 만들 수 있습니다. 표준 웹 API를 강조하며 다양한 JavaScript 런타임 및 플랫폼에 대해 즉시 배포할 수 있는 템플릿이 여러 개 있습니다.

새 React 라우터 프레임워크 프로젝트를 생성하려면 다음을 실행:

```bash
npx create-react-router@latest
```

### Expo (for native apps)

Expo는 진정한 네이티브 UI를 갖춘 범용 Android, iOS 및 웹 앱을 만들 수 있는 React 프레임워크입니다. 이 프레임워크는 네이티브 부분을 더 쉽게 사용할 수 있는 React Native용 SDK를 제공합니다. 새 Expo 프로젝트를 생성하려면 실행:

```bash
npx create-expo-app@latest
```


---


## 3. Build a React app from Scratch

이 문서는 앱에 기존 프레임워크가 잘 지원하지 않는 제약 조건이 있거나, 자체 프레임워크를 구축하는 것을 선호하거나, React 앱의 기본을 배우고 싶은 경우 처음부터 React 앱을 구축하는 것을 안내

### Step 1: Install a build tool

첫 번째 단계는 vite, parcel 또는 rsbuild와 같은 빌드 도구를 설치하는 것입니다. 이러한 빌드 도구는 소스 코드를 패키징하고 실행하는 기능을 제공하며, 로컬 개발을 위한 개발 서버와 앱을 프로덕션 서버에 배포하는 빌드 명령을 제공

- Vite, Parcel, Rsbuild 소개

### Step 2: Build Common Application Patterns
빌드 도구는 클라이언트 전용 단일 페이지 앱(SPA)으로 시작하지만 라우팅, 데이터 불러오기 또는 스타일링과 같은 일반적인 기능을 위한 추가 솔루션은 포함되어 있지 않음

> React 생태계에는 이러한 문제를 해결할 수 있는 많은 도구가 포함되어 있습니다. 시작점으로 널리 사용되는 몇 가지를 나열했지만, 자신에게 더 적합한 도구가 있다면 자유롭게 다른 도구를 선택해도 됨


#### Routing
URL에 따라 다른 화면을 보여주기 위해 필요

**핵심 내용**
- URL 경로를 컴포넌트에 매핑.
- 중첩 라우트, 경로 파라미터, 쿼리 파라미터 등을 지원해야 함.
- 라우터는 폴더 구조 기반이거나, 코드로 설정 가능.
- 데이터 prefetch, 코드 분할, SSR과 깊이 연관됨.

추천 도구:
- React Router
- TanStack Router

#### Data Fetching 
거의 모든 앱은 외부 데이터에 의존함

**핵심 고려사항**
- 로딩/에러 처리, 캐싱, prefetch 전략 필요
- 라우팅 로더 또는 서버에서 미리 데이터를 가져오면 waterfall(연쇄적인 지연) 방지 가능

추천 라이브러리:
- REST: React Query, SWR, RTK Query
- GraphQL: Apollo, Relay

#### Code-splitting 
앱이 커질수록 코드량이 증가하고 초기 로딩 시간이 길어짐

**핵심 전략**
- React.lazy 등으로 필요할 때만 코드 불러오기
- 라우트 기반 분할로 사용자 경험 향상
- 데이터 로딩과 코드 로딩을 동시에 해야 성능 좋음 (waterfall 방지)

관련 문서:
- Vite의 빌드 최적화
- Parcel 코드 스플리팅
- Rsbuild 코드 스플리팅


#### Improving Application Performance 
React 앱을 처음부터 구축할 때, 단순한 SPA(Single Page App)만으로는 모든 요구를 충족시키기에 어려움이 따름. 다양한 상황에 맞는 렌더링 전략을 적절히 선택하는 것이 성능과 사용자 경험 측면에서 중요

1. SPA (Single Page Application)
하나의 HTML 파일로 시작해, 클라이언트에서 JavaScript로 렌더링
- 장점: 설정이 간단하고 개발 속도가 빠름
- 단점: 초기 로딩 시 모든 JS가 필요하므로, LCP(최대 콘텐츠 표시 시간)가 느릴 수 있음

2. SSR (Server Side Rendering)
서버에서 HTML을 렌더링하고, 클라이언트로 완성된 페이지를 전송
- 장점: 초기 렌더링 속도가 빠르고 SEO에 유리함
- 단점: 설정 및 유지보수가 복잡할 수 있음 (특히 Streaming SSR은 난이도 높음)

3. SSG (Static Site Generation)
빌드 타임에 정적인 HTML 파일을 생성하여 배포
- 장점: 빠른 응답 속도와 안정성, 캐싱에 유리
- 단점: 실시간 데이터가 필요한 경우 적합하지 않음

4. RSC (React Server Components)
서버 전용 컴포넌트와 클라이언트 컴포넌트를 하나의 트리에서 혼합 사용 가능
- 장점: 클라이언트로 보내는 JS 양을 줄여 성능 최적화 가능
- 단점: 아직 생태계가 초기 단계이며, 깊은 설정 지식이 필요함


#### Q&A
Q1. SPA만으로는 부족한가요? 꼭 SSR이나 SSG를 써야 하나요?
초기 MVP나 내부 도구 등 단순한 앱은 SPA만으로도 충분하지만, SEO나 초기 성능이 중요한 공개 서비스라면 SSR이나 SSG가 유리함

Q2. SSR과 SSG는 동시에 사용할 수 있나요?
가능함. Next.js 같은 프레임워크는 각 페이지별로 SSR, SSG, CSR(클라이언트 렌더링)을 선택적으로 적용할 수 있게 해줌

- 홈/랜딩 페이지 → SSG
- 실시간 피드 페이지 → SSR
- 복잡한 대시보드 → RSC

Q3. React Server Components는 지금 도입해도 괜찮을까요?
RSC는 성능 면에서 매우 유리하지만, 아직 실무에 적용하기엔 복잡하고 문서화가 부족. 실험적인 프로젝트에는 괜찮지만, 상용 서비스엔 신중히 접근하는 것이 좋음

Q4. SSR과 SSG 중 어떤 걸 선택해야 하나요?
- 자주 변하지 않는 정적 페이지: SSG
- 자주 갱신되는 데이터나 사용자 개인화가 필요한 페이지: SSR

Q5. SSG가 빠르다는데 왜 항상 쓰지 않나요?
- 모든 페이지를 빌드 타임에 생성해야 하므로, 페이지 수가 많거나 데이터가 자주 바뀌는 경우 SSG는 비효율적


---


## 4. Add React to an Existing Project
React를 점진적으로 도입하는 전략

기존 웹 프로젝트를 완전히 React로 갈아엎을 필요는 없이 점진적으로 도입 가능하다.

### Using React for an entire subroute of your existing website 
기존 사이트의 일부 라우트를 React로 처리

- 예: example.com/some-app/ 아래 라우트만 React로 개발
- 이때는 React 기반 프레임워크(예: Next.js) 를 사용해 그 부분만 완전히 React SPA 또는 SSR 앱처럼 만들 수 있음
- 서버에서는 /some-app 아래 요청을 모두 해당 React 앱으로 프록시하거나 라우팅 처리 필요

> 기존 서버 앱(예: Rails)에서 /some-app 아래만 React 앱으로 구성한다면 얻는 이점
> - React + 프레임워크(Next.js, Gatsby)로 구성 후, 서버에서 해당 경로만 React 앱으로 라우팅
> - 장점: 새 기능만 React로 개발 가능, 유지보수 분리 용이

### Using React for a part of your existing page 
기존 페이지 내의 “일부 영역”에 React 컴포넌트를 삽입

- 예: Rails, Django, 또는 Backbone으로 구성된 페이지에서 `<div id="app">` 영역에 React 삽입
- 이 경우 기존 템플릿과 HTML은 그대로 두고, 특정 DOM 노드에만 React 컴포넌트를 mount
	
> 기존 HTML 또는 템플릿 내 `<div id="something">`에 React 컴포넌트 렌더링하면 얻는 이점
> - 점진적 도입에 매우 유용
> - 초기엔 버튼, 폼 등 작은 컴포넌트로 시작해 점차 확장 가능

#### Step 1: Set up a modular JavaScript environment
모듈형 JS 환경 구성

- import/export, JSX 사용을 위한 Babel 또는 Vite 세팅
- npm install react react-dom 으로 React 설치
- 파일 분리하고 컴포넌트를 모듈로 관리

#### Step 2: Render React components anywhere on the page
React 컴포넌트 삽입

```js
import { createRoot } from 'react-dom/client';

function NavigationBar() {
  return <h1>Hello from React!</h1>;
}

const domNode = document.getElementById('navigation');
const root = createRoot(domNode);
root.render(<NavigationBar />);
```

#### Q&A

Q1. 기존 프로젝트에 React를 넣으면, 성능에 문제가 생기지 않을까요?
전혀 그렇지 않음. React는 독립적인 컴포넌트 단위로 작동하므로, 기존 코드와 충돌하지 않으며 성능에도 큰 영향을 주지 않고, 오히려 잘 나누어 적용하면 성능도 향상될 수 있음

Q2. 왜 굳이 Next.js나 Vite 같은 도구가 필요한가요? 그냥 CDN으로도 되지 않나요?  
가능은 하지만 실제 운영 프로젝트에서는 모듈 관리, 번들링, 빠른 리로드, 코드 분할 등 개발 효율을 높여주는 도구가 필수적이기 때문에 Vite나 Next.js를 추천.

Q3. 템플릿 기반 페이지에 React를 적용하면 기존 템플릿 시스템과 충돌하지 않나요?  
충돌하지 않습니다. React는 특정 DOM 노드에만 mount되기 때문에, 템플릿 시스템은 그대로 유지하면서 필요한 부분에만 React를 적용할 수 있음

Q4. React로 점진적 마이그레이션을 하다가 전체 앱을 React로 바꾸고 싶어지면 어떻게 하나요?  
그 경우엔 Next.js나 Remix 같은 프레임워크로 전환하는 것이 가장 자연스러운 다음 단계. 처음부터 전체를 바꾸는 것보다, 점진적 적용 후 자연스럽게 이전하는 게 좋음

Q5. React Native도 기존 네이티브 앱에 이렇게 삽입할 수 있나요?  
React Native도 기존 Android/iOS 네이티브 앱에 하나의 화면 단위로 추가할 수 있음. 완전한 리플레이스 없이 점진적인 도입이 가능합니다.

