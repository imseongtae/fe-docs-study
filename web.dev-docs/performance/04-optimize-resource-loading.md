# Optimize resource loading

웹 페이지 초기 렌더링을 방해하는 리소스를 최적화하여 성능을 개선하는 방법에 대해 설명

## Table of contents
1. [Render blocking](#render-blocking)
1. [Parser blocking](#parser-blocking)
1. [The preload scanner](#the-preload-scanner)
1. [CSS](#css)
1. [JavaScript](#javascript)
1. [Test your knowledge](#test-your-knowledge)
1. [Up next: Assisting the browser with resource hints](#up-next-assisting-the-browser-with-resource-hints)

---

## Render blocking
- CSS는 렌더링 차단 리소스(render-blocking resource) 임
- 브라우저는 CSSOM이 구성될 때까지 렌더링을 차단하여 FOUC(Flash of Unstyled Content, 스타일이 지정되지 않은 콘텐츠의 플래시)를 방지
- FOUC는 사용자 경험 측면에서 바람직하지 않음
- CSS가 다운로드되고 적용된 후 페이지가 렌더링됨
- Render blocking은 반드시 나쁜 것은 아니지만, 그 지속 시간을 최소화해야 함

핵심 포인트
- CSS는 필수지만 최적화가 매우 중요
- CSS 용량이 작을수록 **첫 렌더링 시간(FCP)**이 개선됨

## Parser blocking

- `<script>` 요소는 async 또는 defer 속성이 없으면 parser-blocking resource이다.
- 브라우저는 스크립트를 평가하고 실행한 후에야 HTML 파싱을 계속할 수 있다.
- parser-blocking `<script>`는 render-blocking CSS 리소스가 모두 로딩되기 전에는 실행되지 않는다.

- `<script>` 요소에 async 또는 defer 속성이 없으면 parser-blocking.
- HTML 파싱 도중 스크립트를 만나면 다운로드, 파싱, 실행이 완료될 때까지 파서가 멈춤.
- 스크립트는 DOM을 수정하거나 접근할 수 있으므로 중단이 필요함.
- CSS가 먼저 로딩 완료되어야 해당 스크립트 실행 가능.

## The preload scanner

- preload scanner는 브라우저의 보조 HTML 파서이며, 주요 파서보다 빨리 리소스를 찾아서 사전 다운로드할 수 있다.
- preload scanner는 다음과 같은 리소스를 탐지하지 못한다:
  - CSS의 background-image
  - JavaScript로 삽입된 `<script>` 요소
  - JavaScript가 렌더링하는 HTML
  - CSS @import 선언
- 이러한 리소스는 late-discovered resource이며 preload scanner의 혜택을 받지 못한다.
- 피할 수 없다면 preload hint를 사용할 수 있다.

---

## CSS

### Minification
- CSS 파일을 minify 하면 파일 크기가 줄어들어 다운로드 속도가 빨라진다.
- 기본적으로 공백, 주석 등을 제거한다.
- 일부 advanced CSS minifier는 중복 규칙을 병합할 수도 있다.

```css
/* Minified CSS: */
h1,h2{color:#000}h1{font-size:2em}h2{font-size:1.5em}
```

### Remove unused CSS
- 스타일 시트를 모두 다운로드하고 파싱해야 렌더링이 가능
- Coverage tool(Chrome DevTools)로 현재 페이지에서 사용되지 않는 CSS를 식별할 수 있음
- render tree construction 최적화에도 효과가 있음
- 완전히 제거할 수는 없으며, 큰 이득이 있는 부분에 집중해야 함

### Avoid CSS `@import` declarations

- `@import`는 해당 CSS 파일이 먼저 다운로드되어야 함
- request chain이 발생하며, preload scanner(preload scanner는 브라우저의 보조 HTML 파서이며, 주요 파서보다 빨리 리소스를 찾아서 사전 다운로드)가 탐지할 수 없음
- `<link rel="stylesheet">`를 사용하는 것이 좋음
- CSS preprocessor에서는 @import가 하나의 스타일 시트로 번들링되므로 문제 없음

```css
/* Don't do this: */
@import url('style.css');
```

### Inline critical CSS
- `<head>`에 중요한 스타일을 인라인하면 network request를 줄일 수 있다
- 위 뷰포트(above the fold)의 렌더링에 필요한 스타일만 포함해야 한다
- 전체 HTML 응답 크기는 커지며, 캐시 효율이 낮아질 수 있음
- 유지 관리 및 자동화는 어려울 수 있다

```html
<head>
  <title>Page Title</title>
  <!-- ... -->
  <style>h1,h2{color:#000}h1{font-size:2em}h2{font-size:1.5em}</style>
</head>
<body>
  <!-- Other page markup... -->
  <link rel="stylesheet" href="non-critical.css">
</body>
```

### CSS demos

## JavaScript

JavaScript drives most of the interactivity on the web, but it comes at a cost. Shipping too much JavaScript can make your web page slow to respond during page load, and may even cause responsiveness issues that slow down interactions—both of which can be frustrating for users.

### Render-blocking JavaScript
- defer 또는 async 속성이 없는 `<script>`는 파싱과 렌더링을 차단한다
- inline 스크립트도 parser를 차단한다

### `async` versus `defer`
- async: 다운로드 후 즉시 실행, 실행 순서 보장 안됨
- defer: HTML 파싱 완료 후 실행, 순서 보장
- `type="module"`은 기본적으로 defer 처리된다

### Client-side rendering
- 중요한 콘텐츠나 LCP element는 JavaScript로 렌더링하지 않는 것이 좋다
- preload scanner가 탐지할 수 없어 리소스 다운로드 지연됨
- critical request chain이 발생하며, long task 유발 가능성이 높다

### Minification
- JavaScript minification은 파일 크기를 줄여 다운로드 속도를 향상시킨다
- 공백 제거뿐 아니라 변수 이름 축약(uglification)도 포함된다
- Terser와 같은 도구를 사용해 자동으로 처리할 수 있다

```javascript
// Unuglified JavaScript source code:
export function injectScript () {
  const scriptElement = document.createElement('script');
  scriptElement.src = '/js/scripts.js';
  scriptElement.type = 'module';

  document.body.appendChild(scriptElement);
}
```

```javascript
// Uglified JavaScript production code:
export function injectScript(){const t=document.createElement("script");t.src="/js/scripts.js",t.type="module",document.body.appendChild(t)}
```

### JavaScript demos

## Test your knowledge

**What is the best way to load multiple CSS files in the browser?**

- Multiple `<link>` elements. ✓
- The CSS `@import` declaration.

**What does the browser preload scanner do?**

- Detects `<link rel="preload">` elements in an HTML resource.
- It is a secondary HTML parser that examines raw markup to discover resources before the DOM parser can in order to discover them sooner. ✓

**Why does the browser temporarily block parsing of HTML by default when downloading JavaScript resources?**

- To prevent a Flash of Unstyled Content (FOUC).
- Because evaluating JavaScript is a very CPU-intensive task, and pausing HTML parsing gives more bandwidth to the CPU to finish loading scripts.
- Because scripts can modify or otherwise access the DOM. ✓
