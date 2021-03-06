import 'promise-polyfill/src/polyfill';
import 'whatwg-fetch';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import EOLAlert from './pages/EOLAlert';

ReactDOM.render(
  <EOLAlert/>,
  document.getElementById('root')
);
//
// if (!netInfo || !netInfo.enabled) {
//   alert('sorry, this network is not yet supported!');
//   window.location.href = 'https://ethercast.io';
// } else {
//   const store = makeStore();
//
//   store.dispatch(async dispatch => {
//     console.log('dispatched');
//
//     dispatch({ type: 'AUTH_LOADING' });
//
//     try {
//       const result = await Auth.getUser();
//       console.log('logged in', result);
//       dispatch({ type: 'LOGGED_IN', payload: result });
//     } catch (error) {
//       console.error('failed to auth', error);
//       dispatch({ type: 'LOGGED_OUT' });
//     }
//   });
//
//   ReactDOM.render(
//     <Provider store={store}>
//       <BrowserRouter>
//         <App/>
//       </BrowserRouter>
//     </Provider>,
//     document.getElementById('root')
//   );
// }