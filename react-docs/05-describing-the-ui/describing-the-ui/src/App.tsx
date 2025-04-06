import './App.css';
import Gallery from './components/Gallery';
import Profile from './components/Profile';
import TodoList from './components/Todo/TodoList';
import Avatar from './components/Avatar';

function App() {
  return (
    <>
      <section>
        <h2>Hi!, I'm scientist</h2>
        <Profile />
      </section>
      <Gallery />

      <hr />
      <TodoList />

      <hr />
      {/* <Avatar person={{ name: 'Lin Lanying', imageId: '1bX5QH6' }} size={100} /> */}
      <Avatar
        person={{
          name: 'Katsuko Saruhashi',
          imageId: 'YfeOqp2',
        }}
      />
      <Avatar
        size={80}
        person={{
          name: 'Aklilu Lemma',
          imageId: 'OKS67lh',
        }}
      />
      <Avatar
        size={50}
        person={{
          name: 'Lin Lanying',
          imageId: '1bX5QH6',
        }}
      />
    </>
  );
}

export default App;
