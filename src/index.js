import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App/App.jsx';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
// takeLatest will listen for actions
import { takeLatest, put } from 'redux-saga/effects';

// elementList reducer is still listening for the 'SET_ELEMENTS' action
const elementList = (state = [], action) => {
    switch (action.type) {
        case 'SET_ELEMENTS':
            return action.payload;
        default:
            return state;
    }
};    

// this is the saga that will watch for actions
function* rootSaga() {
    // listen for an action and then do something when that action is dispatched
    // when the FETCH_ELEMENTS action is dispatched, run fetchElements
    yield takeLatest('FETCH_ELEMENTS', fetchElements);

    yield takeLatest('ADD_ELEMENT', addElement);

}

// addElement saga
// we have access to the action that was dispatched
function* addElement(action) {
    // POST request
    try {
        yield axios.post('/api/element', { 
            name: action.payload
        });
        // dispatch the FETCH_ELEMENTS action to trigger a GET request
        // and get all the elements
        yield put({ type: 'FETCH_ELEMENTS'})
    } catch (error) {
        console.log('error with POST element: ', error);
    }
}

// fetchElements saga
// we have access to the action that was dispatched
function* fetchElements(action) {
    console.log('fetch elements was dispatched with action: ', action);
    // historically we've done promise chaining (aka .then) but here we 
    // don't need to do that because of the yield generator magic

    // try/catch: This is similar to having a .catch() after our .then()
    // BUT we're not using .then here so we need new syntax
    // This is saying: TRY to do all the stuff in the 'try' block
    // if there's an error, CATCH that error and do whatever's in the 
    // catch block
    try {
        const elementResponse = yield axios.get('/api/element');
        // dispatch an action to update the redux store
        // 'put' is the same thing as 'dispatch' in our React components!
        // we can't use 'dispatch' because we get dispatch from useDispatch,
        // which is a React-specific thing
        yield put({ type: 'SET_ELEMENTS', payload: elementResponse.data });
    } catch (error) {
        console.log('error fetching elements: ', error);
    }
}


const sagaMiddleware = createSagaMiddleware();

// This is creating the store
// the store is the big JavaScript Object that holds all of the information for our application
const storeInstance = createStore(
    // This function is our first reducer
    // reducer is a function that runs every time an action is dispatched
    combineReducers({
        elementList,
    }),
    applyMiddleware(sagaMiddleware, logger),
);

sagaMiddleware.run(rootSaga);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Provider store={storeInstance}>
            <App />
        </Provider>
    </React.StrictMode>
);
