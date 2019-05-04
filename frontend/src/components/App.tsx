import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Default from './Default';
import OAuthCallback from './OAuthCallback';
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
        <Route path='/oauth-callback' component={OAuthCallback} />
        <Route path='/create-diary' component={CreateDiary} user={tempUser} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

export default App;
