# Mutating Data

## Table of contents
1. [](#)

---

## 정리
이번 장에서는 Next.js의 Server Actions를 활용해 데이터를 생성, 수정, 삭제하는 방법을 학습
- 폼 제출 시 FormData가 서버 함수로 전달되고, 이를 바탕으로 DB를 조작
- 또한 Zod를 통해 타입 검증을 수행하고, revalidatePath와 redirect로 UI와 경로를 최신 상태로 유지
- API 엔드포인트 없이도 간단히 데이터를 변경할 수 있다는 점이 가장 큰 특징

### 목표
- Invoices 페이지에서 Create / Update / Delete 기능 구현
- React Server Actions와 Next.js의 캐시 전략 활용
- FormData, Zod, revalidatePath, redirect 사용법 익히기

## 구현 단계 요약

### 1. Server Actions 이란?
- 서버에서 실행되는 비동기 함수
- 별도 API endpoint 없이 클라이언트/서버 컴포넌트에서 직접 호출 가능
- 서버 전용 기능('use server') → 보안, 타입 검증, 캐시 연동 등 장점 있음

### 2. 폼(Form)과 Server Action 연결
- `<form action={}>` 형식으로 연결
- form이 제출되면 FormData 객체가 Server Action에 전달됨
- HTML의 action과 다르게, 함수 직접 호출이 가능

### 3. FormData -> 타입 유효성 검사
- FormData.get()으로 값 추출
- type="number"라도 실제 값은 string → 형변환 필수
- Zod로 타입 스키마 정의하고 파싱

```ts
const schema = z.object({
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
});
const { customerId, amount, status } = schema.parse(formInput);
```

### 4. 데이터베이스에 삽입
- 금액은 센트 단위로 변환 (amount * 100)
- 날짜는 new Date().toISOString().split('T')[0]
- 삽입 쿼리 작성 후 실행

```ts
await sql`
  INSERT INTO invoices (customer_id, amount, status, date)
  VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
`;
```

### 캐시 무효화 & 리디렉션
- revalidatePath('/dashboard/invoices') → 서버에서 최신 데이터 가져오기
- redirect('/dashboard/invoices') → 사용자를 목록으로 이동
