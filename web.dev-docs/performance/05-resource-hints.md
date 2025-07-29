# Assist the browser with resource hints

개요
- 리소스 힌트(Resource Hints)는 브라우저에 리소스 로딩 우선순위나 사전 작업을 알려주는 방식
- preconnect, dns-prefetch, preload, prefetch, Fetch Priority API 등이 있음
- 주로 `<head>` 내에 `<link>` 태그로 선언하거나, HTTP 헤더로 설정할 수 있음

---

## On this page

- [preconnect](#preconnect)
- [dns-prefetch](#dns-prefetch)
- [preload](#preload)
- [prefetch](#prefetch)
- [Fetch Priority API](#fetch-priority-api)
- [Resource hints demos](#resource-hints-demos)
- [Test your knowledge](#test-your-knowledge)
- [Up next: Image performance](#up-next-image-performance)

---

## preconnect
- 정의: 특정 출처(origin)에 대한 연결을 미리 수행해놓음 (DNS, TCP, TLS 포함).
- 용도: Google Fonts 등 외부 리소스를 빠르게 로딩하기 위함.
- 사용 예시:

```html
<link rel="preconnect" href="https://example.com">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

주의사항: CORS 리소스의 경우 crossorigin 속성을 반드시 포함해야 연결 재사용이 가능함.

---

## dns-prefetch
- 정의: 연결은 하지 않고 DNS 조회만 미리 수행.
- 비용이 낮아 많은 서버에 사용할 수 있음.
- 사용 예시:

```html
<link rel="dns-prefetch" href="https://fonts.googleapis.com">
<link rel="dns-prefetch" href="https://fonts.gstatic.com">
```

활용 도구: dnstradamus 같은 도구는 Intersection Observer API를 통해 자동 주입 가능.

---

## preload
- 정의: HTML 파서나 프리로드 스캐너가 인지하기 전, 특정 리소스를 미리 다운로드.
- 용도: LCP 후보 이미지, `@import` CSS, 폰트 파일 등 늦게 탐지되는 중요한 리소스.
- 사용 예시:

```html
<link rel="preload" href="/lcp-image.jpg" as="image">
<link rel="preload" href="/font.woff2" as="font" crossorigin>
```

주의사항:
- `as` 속성이 없으면 리소스가 두 번 다운로드됨
- crossorigin 속성 누락 시, 중복 다운로드 발생
- 너무 많이 사용하면 오히려 bandwidth contention이 발생할 수 있음

---

## prefetch
- 정의: 미래 탐색에 대비해 낮은 우선순위로 리소스를 미리 다운로드
- 특징: speculative(추측에 근거하는)한 성격이 있음
- 사용 예시:

```html
<link rel="prefetch" href="/next-page.css" as="style">
```

주의사항:
- 사용자가 그 페이지로 실제로 이동하지 않을 경우 리소스 낭비
- 사용자 데이터 절약 설정(Save-Data) 시에는 prefetch 생략이 권장됨

---

## Fetch Priority API
- 정의: `<link>`, `<img>`, `<script>`에 fetchpriority 속성으로 다운로드 우선순위를 설정.
- 사용 예시:

```html
<div class="gallery">
  <div class="poster">
    <img src="img/poster-1.jpg" fetchpriority="high">
  </div>
  <div class="thumbnails">
    <img src="img/thumbnail-2.jpg" fetchpriority="low">
    <img src="img/thumbnail-3.jpg" fetchpriority="low">
    <img src="img/thumbnail-4.jpg" fetchpriority="low">
  </div>
</div>
```

효과:
- LCP 이미지의 우선순위를 즉시 높게 지정 가능
- 페이지 로딩 초기 단계(critical phase)에서 낮은 우선순위 리소스는 지연될 수 있음

---

## Resource hints demos

[Learn Performance Resource Hints demo](https://chrome.dev/f/learn_performance_resource_hints/?attributionHidden=true&sidebarCollapsed=true&previewSize=100)

---

## Test your knowledge

**Q1. What does the `preconnect` resource hint do?**

- Performs only a DNS lookup for the cross-origin server.  
- **Opens a connection to a cross-origin server, including the DNS lookup, as well as connection and TLS negotiation ahead of when the browser would otherwise discover it.** ✔️

**Q2. What does the Fetch Priority API let you do?**

- **Specify the relative priority for `<link>`, `<img>`, and `<script>` elements.** ✔️
- Specify the priority at which the current page's HTML is downloaded.

**Q3. When should you use the `prefetch` hint?**

- **When you have _high confidence_ that the resources or pages you intend to prefetch are needed by the user.** ✔️
- For any and all resources or pages the user could need, whether or not they actually need them in the future.
- **If the user has not stated an explicit preference for reduced data usage.** ✔️
- (해당 리소스가 실제로 필요할 가능성이 매우 높을 때, 그리고 사용자가 데이터 절약 설정을 하지 않았을 때)
