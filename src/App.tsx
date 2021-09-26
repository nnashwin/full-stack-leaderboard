import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import './css/App.css';
import Constants from './common/constants';
import HomePage from './views/Home/Homepage/Homepage';
import LeaderboardPage from './views/Leaderboard/LeaderboardPage/LeaderboardPage';


function App() {
  return (
    <>
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to='/'>Home</Link>
              </li>
              <li>
                <Link to='/players'>Players</Link>
              </li>
              <li>
                <Link to='/matches'>Matches</Link>
              </li>
            </ul>
          </nav>
          <Switch>
            <Route exact path="/">
              <HomePage />
            </Route>
            <Route path="/players">
              <LeaderboardPage entity={Constants.PLAYER_ENTITY} />
            </Route>
            <Route path="/matches">
              <LeaderboardPage entity={Constants.MATCHES_ENTITY}/>
            </Route>
          </Switch>
        </div>
      </Router>
    </>
  );
}

export default App;