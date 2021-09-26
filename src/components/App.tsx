import React from 'react';
import { Box, Block, Container, Notification } from 'react-bulma-components';
import {Column} from 'react-table';
import logo from '../assets/logo.svg';
import Table from './Table';
import '../css/App.css';
import '../css/bulma.min.css';

interface TableColumn {
    header: string;
    accessor: string;
    sortType: string;
}

interface ExampleObject {
    name: string;
    wins: number;
    losses: number;
    rating: number;
    gamesPlayed: number;
}

const columns: TableColumn[] = [
        {
            header: 'Player Name',
            accessor: 'name', 
            sortType: 'basic'
        },
        {
            header: 'Wins',
            accessor: 'wins',
            sortType: 'basic'
        },

        {
            header: 'Losses',
            accessor: 'losses',
            sortType: 'basic'
        },
        {
            header: 'Total Matches Played',
            accessor: 'gamesPlayed',
            sortType: 'basic'
        },
        {
            header: 'Rating',
            accessor: 'rating',
            sortType: 'basic'
        },
    ]


const data: ExampleObject[] = [
       {
         name: 'Liu Guoliang',
         wins: 100,
         losses: 5,
         rating: 2300,
         gamesPlayed: 105
       },
       {
         name: 'Chen Meng',
         wins: 110,
         losses: 0,
         rating: 3900,
         gamesPlayed: 110
       },
       {
         name: 'Mima Ito',
         wins: 55,
         losses: 80,
         rating: 1600,
         gamesPlayed: 135
       },
     ];
function App() {
  return (
    <>
      <Container breakpoint="widescreen" className="app-container">
        <Box>
          <Block>
            <div className="leaderboard-title">
                Leaderboard
            </div>
          </Block>
          <Table />
        </Box>
      </Container>
    </>
  );
}

export default App;
