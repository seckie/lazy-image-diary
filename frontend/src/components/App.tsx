import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Default from './Default';

const App: React.FC = () => {
  return (
    <Router>
      <Route path='/' component={Default} />
    </Router>
  );
}

export default App;
