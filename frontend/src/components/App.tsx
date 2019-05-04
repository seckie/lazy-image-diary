import React from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import Default from './Default';
import CreateDiary from './CreateDiary';
import NotFound from './NotFound';

const tempUser = {
  name: 'ABC'
};

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route path='/' component={Default} exact />
        <Redirect from='/oauth-callback' to='/create-diary' />
        <Route path='/create-diary' component={CreateDiary} user={tempUser} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

export default App;
