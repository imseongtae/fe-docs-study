const today = new Date();

const formDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
};

const baseUrl = 'https://i.imgur.com/';

const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink',
  },
  imageId: '7vQD0fP',
  // imageSize: 's',
  imageSize: 'b',
};

const TodoList = () => {
  // const name = 'Gregorio Y. Zara';
  const name = 'Hedy Lamarr';
  return (
    <>
      <h1>{name}'s To Do List</h1>
      <h2>To Do List for {formDate(today)}</h2>
      <hr />
      <div style={person.theme}>
        <h1>{person.name}'s Todos</h1>
        <img className="avatar" src="https://i.imgur.com/7vQD0fPs.jpg" alt="Gregorio Y. Zara" />

        <img
          className="avatar"
          src={`${baseUrl}${person.imageId}${person.imageSize}.jpg`}
          alt={person.name}
        />

        <ul
          style={
            // 중괄호 안에 JavaScript 객체
            {
              backgroundColor: 'black',
              color: 'pink',
              textAlign: 'left',
              fontWeight: 'bold',
            }
          }
        >
          <li>Improve the videophone</li>
          <li>Prepare aeronautics lectures</li>
          <li>Work on the alcohol-fuelled engine</li>
        </ul>
      </div>
    </>
  );
};

export default TodoList;
