import React from 'react';
import { Box, Block, Container, Notification } from 'react-bulma-components';
import logo from '../assets/logo.svg';
import Table from './Table';
import '../css/App.css';
import '../css/bulma.min.css';

function App() {
  return (
    <>
      <Container breakpoint="widescreen" className="app-container">
        <Box>
          <Block>
            <Notification color="info">
                Leaderboard
            </Notification>
          </Block>
          <Table />
        </Box>
      </Container>
    </>
  );
}

export default App;
