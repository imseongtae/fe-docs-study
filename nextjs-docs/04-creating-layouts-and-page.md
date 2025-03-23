# 04 Creating Layouts and Pages

## Table of contents


---


## Next.js에서 페이지와 레이아웃을 구성하는 방법
Next.js에서 레이아웃과 페이지로 더 많은 경로를 만드는 방법

### 1. 파일 시스템 기반 라우팅 (File-based Routing)

- Next.js는 폴더와 파일 이름을 기반으로 URL 경로를 자동 생성.
- app/page.tsx는 / 홈 경로와 연결됨.
- 예시: /app/dashboard/page.tsx → /dashboard 경로와 연결됨.


### 2. Nested Routing (중첩 라우팅)
- 폴더 안에 폴더를 중첩해서 계층적 URL 구조를 만들 수 있음.
- 각 폴더 안에 page.tsx를 넣으면 해당 경로에서 렌더링됨.

📁 예시 구조

```bash
/app
  └── /dashboard
        └── page.tsx           => /dashboard
        └── /customers
              └── page.tsx     => /dashboard/customers
        └── /invoices
              └── page.tsx     => /dashboard/invoices
```


### 3. 레이아웃 파일
레이아웃 파일 layout.tsx

- 공통 UI를 여러 페이지에서 공유할 때 사용.
- layout.tsx를 특정 폴더에 두면 그 폴더 하위의 모든 페이지에 공통 적용됨.
- 컴포넌트는 children props로 하위 페이지를 렌더링함.

```ts
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <SideNav />   // 공통 사이드바
      <main>{children}</main>  // 개별 페이지 렌더링
    </div>
  );
}
```

> 장점: 페이지 간 이동 시 layout은 재렌더링 되지 않고, 해당 페이지 콘텐츠만 업데이트됨.
> Partial Rendering 덕분에 성능과 UX가 향상됨.

### 4. Root Layout
Root Layout (/app/layout.tsx)

- 애플리케이션 전체에 적용되는 전역 레이아웃
- `<html>`, `<body>` 등을 조작하거나 글로벌 CSS, 폰트 적용 등에 사용
- 필수로 존재해야 하는 파일

```ts
export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
```

---


## 내용 정리

1.	Next.js는 파일/폴더 구조로 URL을 자동으로 매핑함
  - page.tsx가 존재하면 그 폴더의 경로가 URL이 됨
2. 폴더를 중첩해 계층적 라우팅(Nested Routing)을 구성할 수 있음
  - 예: /dashboard/customers와 같은 URL을 폴더로 쉽게 구현
3. layout.tsx를 이용해 공통 UI를 구성할 수 있음
  - 예: /dashboard/layout.tsx는 /dashboard 이하 모든 페이지에 적용
  - 페이지 이동 시 공통 UI는 유지되고 본문만 교체됨 → Partial Rendering
4.	Root Layout은 애플리케이션 전반에 적용되는 레이아웃이며 필수
  - HTML 구조, 글로벌 폰트, 스타일 등을 설정
