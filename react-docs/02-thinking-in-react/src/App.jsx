import './App.css';

import { PRODUCTS } from './data/products';
import FilterableProductTable from './components/FilterableProductTable';

function App() {
  return (
    <>
      {/*  */}
      <FilterableProductTable products={PRODUCTS} />
      {/*  */}
    </>
  );
}

export default App;
