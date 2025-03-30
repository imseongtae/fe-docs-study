# 06 Setting Up Your Database

## Table of contents
1. [1. GitHub에 프로젝트 업로드](#1-github에-프로젝트-업로드)
1. [2. Vercel 계정 만들기 및 GitHub 연결](#2-vercel-계정-만들기-및-github-연결)
1. [3. PostgreSQL 데이터베이스 생성](#3-postgresql-데이터베이스-생성)
1. [4. Seed your database](#4-seed-your-database)

---


## 1. Choosing how to fetch data
- API Layer: 클라이언트에서 데이터를 가져올 땐 API를 만들어야 해. DB 비밀번호 등 민감 정보가 노출되지 않도록 하기 위해
- 직접 DB 쿼리: 서버 컴포넌트에서 직접 DB 쿼리 가능. 이 경우 API 따로 안 만들어도 됨

### Using Server Components to fetch data
React Server Components 사용 이유
- async/await 사용해서 데이터를 쉽게 가져올 수 있음.
- 클라이언트에는 필요한 데이터만 보내고, 무거운 로직은 서버에서 처리.
- API 없이 DB에 직접 쿼리 가능 → 코드량 줄어듦.

### Using SQL
SQL 사용 장점
- postgres.js 라이브러리로 SQL 쿼리 작성
- SQL은 유연하고 강력하며, ORM도 내부적으로 SQL 사용함
- SQL을 쓰면 필요한 데이터만 딱 가져올 수 있어서 효율적

## 2. Fetching data for the dashboard overview page

### RevenueChart
fetchRevenue() 호출해서 수익 차트 데이터 가져오기

### LatestInvoices
fetchLatestInvoices() 호출 → SQL로 최근 5개 인보이스만 가져옴

### Card 컴포넌트들
fetchCardData()로 인보이스 개수, 고객 수, 수익 등 가져오기


## 3. What are request waterfalls?
- await를 순서대로 쓰면 요청이 차례대로 실행되어 느려짐.
- 예: fetchRevenue() → 끝나면 fetchLatestInvoices() → 또 끝나면 fetchCardData()


### Parallel Fetching
💡 해결책
- Promise.all() 사용해서 동시에 데이터 요청 → 성능 향상!

```ts
const [revenue, latestInvoices, cardData] = await Promise.all([
  fetchRevenue(),
  fetchLatestInvoices(),
  fetchCardData(),
]);
```

## 질의 응답
