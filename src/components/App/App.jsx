import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

function App() {
// Sidebar

// Generator functions!
function* myGenerator() {
  yield 1;
  yield 'hello';
  yield { name: 'Emma'};
  yield 35;
};

// Create an instance of the function
const myGeneratorInstance = myGenerator();

// Execute the generator function and get back whatever was yielded
// console.log('first time:', myGeneratorInstance.next().value);
// console.log('second time:', myGeneratorInstance.next().value);
// console.log('third time:', myGeneratorInstance.next().value);
// console.log('fourth time:', myGeneratorInstance.next().value);
// console.log('fifth time:', myGeneratorInstance.next().value);

// END SIDEBAR ON GENERATORS

  const dispatch = useDispatch();
  const elements = useSelector(store => store.elementList)
  const [newElement, setNewElement] = useState('');

  useEffect(() => {
    dispatch({
      type: 'FETCH_ELEMENTS'
    })
  }, []);

  const addElement = () => {
    dispatch({ type: 'ADD_ELEMENT', payload: newElement });
    setNewElement('');
    // axios.post('/api/element', { 
    //   name: newElement
    // })
    //   .then(() => {
    //     dispatch({
    //       type: 'FETCH_ELEMENTS'
    //     })
    //     setNewElement('');
    //   })
    //   .catch(error => {
    //     console.log('error with element get request', error);
    //   });
  }


  return (
    <div>
      <h1>Atomic Elements</h1>

      <ul>
        {elements.map(element => (
          <li key={element}>
            {element}
          </li>
        ))}
      </ul>

      <input 
        value={newElement} 
        onChange={evt => setNewElement(evt.target.value)} 
      />
      <button onClick={addElement}>Add Element</button>
    </div>
  );
}


export default App;
