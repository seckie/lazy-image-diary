import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Default from './Default';
import OAuthCallback from './OAuthCallback';
import CreateDiary from './CreateDiary';
import NotFound from './NotFound';

const App: React.FC = () => {
  return (
    <Router>
      <Route path='/' component={Default} exact />
      <Route path='/oauth_callback' component={OAuthCallback} />
      <Route path='/create_todays_note' component={CreateDiary} />
      <Route component={NotFound} />
    </Router>
  );
}

export default App;
