import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import { Container } from 'react-bulma-components';
import Constants from './common/constants';
import AddFormPage from './views/AddForm/AddFormPage/AddFormPage';
import HomePage from './views/Home/Homepage/Homepage';
import LeaderboardPage from './views/Leaderboard/LeaderboardPage/LeaderboardPage';
import './css/App.css';
import './css/bulma.min.css';


function App(): React.ReactElement | null {
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
              <li>
                <Link to='/add-form'>Add Form</Link>
              </li>
            </ul>
          </nav>

          <Container breakpoint="widescreen" className="app-container">
            <Switch>
              <Route exact path="/">
                <HomePage />
              </Route>
              <Route path="/add-form">
                <AddFormPage />
              </Route>
              <Route path="/matches">
                <LeaderboardPage entity={Constants.MATCHES_ENTITY}/>
              </Route>
              <Route path="/players">
                <LeaderboardPage entity={Constants.PLAYER_ENTITY} />
              </Route>
            </Switch>
          </Container>
          
        </div>
      </Router>
    </>
  );
}

export default App;