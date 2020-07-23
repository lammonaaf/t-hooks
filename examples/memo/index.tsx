import 'react-app-polyfill/ie11';
import 'regenerator-runtime/runtime';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Example } from './example';

const App = () => {
  return (
    <div>
      <Example />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
