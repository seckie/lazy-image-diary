import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Default from "./containers/Default";
import OAuthCallback from "./containers/OAuthCallback";
import CreateDiary from "./containers/CreateDiary";
import NotFound from "./containers/NotFound";

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Default} exact />
        <Route path="/oauth-callback" component={OAuthCallback} />
        <Route path="/create-diary" component={CreateDiary} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
};

export default App;
