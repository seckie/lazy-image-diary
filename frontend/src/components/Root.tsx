import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Default from '../containers/Default';
import OAuthCallback from '../containers/OAuthCallback';
import CreateDiary from '../containers/CreateDiary';
import NotFound from '../containers/NotFound';

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
  // <Redirect from='/oauth-callback' to='/create-diary' />
}

export default App;
