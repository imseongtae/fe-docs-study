# Thinking in React

# 학습 내용 리뷰
<!--  -->


```mermaid
graph TD
  subgraph UI 입력
    SearchBar["SearchBar<br />(검색어 입력 + 체크박스)"]
  end

  subgraph 부모 상태 관리
    FilterableProductTable["FilterableProductTable<br />(검색어, 체크박스 상태 저장)"]
  end

  subgraph 데이터 표시
    ProductTable["ProductTable<br />(필터된 목록 렌더링)"]
    ProductCategoryRow["ProductCategoryRow<br />(카테고리 헤더 표시)"]
    ProductRow["ProductRow<br />(상품 행 렌더링)"]
  end

  SearchBar -- 사용자 입력 이벤트 --> FilterableProductTable
  FilterableProductTable -- props 전달 --> SearchBar
  FilterableProductTable -- 필터링된 데이터 전달 --> ProductTable
  ProductTable --> ProductCategoryRow
  ProductTable --> ProductRow
```


## Installation


### HTML page

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