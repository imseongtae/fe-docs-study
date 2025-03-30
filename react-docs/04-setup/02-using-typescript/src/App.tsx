import { useReducer, useState } from 'react';
import './App.css';
import MyButton from './components/MyButton';
import { stateReducer, State } from './utils/stateReducer';
import Form from './components/Form';

const initialState: State = { count: 0 };

function App() {
  // 명시적으로 타입을 "boolean"으로 설정
  const [enabled, setEnabled] = useState<boolean>(false);

  if (enabled) {
    setEnabled(!enabled);
  }

  // reducer
  const [state, dispatch] = useReducer(stateReducer, initialState);

  const addFive = () => dispatch({ type: 'setCount', value: state.count + 5 });
  const reset = () => dispatch({ type: 'reset' });

  return (
    <>
      <div>
        {/*  */}
        <h1>Welcome to my app</h1>
        {/* 문자열을 직접 전달할 땐 "..." 형식으로 작성하는 게 더 읽기 쉽고, 불필요한 중괄호를 줄임 */}
        {/* JSX 표현식은 변수 또는 연산이 필요할 때 사용 */}
        <MyButton title={"I'm a Button"} disabled={enabled} />
      </div>

      <div>
        <h1>Welcome to my counter</h1>

        <p>Count: {state.count}</p>
        <button onClick={addFive}>Add 5</button>
        <button onClick={reset}>Reset</button>
      </div>

      <div>
        <Form />
      </div>
    </>
  );
}

export default App;
