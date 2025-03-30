# 06 Setting Up Your Database

## Table of contents
1. [1. GitHub에 프로젝트 업로드](#1-github에-프로젝트-업로드)
1. [2. Vercel 계정 만들기 및 GitHub 연결](#2-vercel-계정-만들기-및-github-연결)
1. [3. PostgreSQL 데이터베이스 생성](#3-postgresql-데이터베이스-생성)
1. [4. Seed your database](#4-seed-your-database)

---


## 1. GitHub에 프로젝트 업로드
- 로컬에 있는 프로젝트를 GitHub 저장소로 푸시한다.
- GitHub Desktop 앱을 사용하면 초보자에게 더 쉬움.

## 2. Vercel 계정 만들기 및 GitHub 연결
- vercel.com/signup 에서 무료 계정 생성.
- GitHub로 로그인 → GitHub 저장소를 Vercel에 연결.
- 프로젝트 이름을 지정하고 Deploy 클릭 → 자동 배포 완료 🎉


## 3. PostgreSQL 데이터베이스 생성
- Vercel Dashboard → Storage 탭 → Create Database
- Supabase, Neon 중 선택 가능.
- 지역은 Washington D.C (iad1) 추천.

### 환경 변수 설정
- 생성된 DB의 .env.local 탭에서 “Show Secret” 클릭 → 코드 복사.
- 로컬 프로젝트에서 .env.example 파일을 .env로 이름 변경하고 붙여넣기.
- .gitignore에 .env가 포함되어 있는지 꼭 확인! (보안 중요)


## 4. Seed your database
- 로컬 서버 실행: `pnpm run dev`
- 브라우저에서 http://localhost:3000/seed 접속 → “Database seeded successfully” 메시지 확인
- 초기 테이블 생성 및 placeholder-data.ts로부터 데이터 삽입됨
- 완료 후 seed.ts 파일 삭제해도 됨

### Query 테스트
- app/query/route.ts 파일에서 listInvoices() 함수 사용

```sql
SELECT invoices.amount, customers.name
FROM invoices
JOIN customers ON invoices.customer_id = customers.id
WHERE invoices.amount = 666;
```

### Troubleshooting 팁
-	.env 값 복사 전에 꼭 Show Secret 클릭
-	bcrypt 문제 시 bcryptjs로 교체 가능
-	DB 초기화 필요 시 DROP TABLE 사용 가능 (단, 실제 서비스에서는 주의!)
