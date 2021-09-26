import React from 'react';
import { Box, Block, Container, Notification } from 'react-bulma-components';
import '../../../css/bulma.min.css';

import {LeaderboardPageProps} from '../../../common/types';
import Table from '../../../components/Table/Table';

interface PlayerData {
    name: string;
    wins: number;
    losses: number;
    rating: number;
    gamesPlayed: number;
}

const columns = [
    {
        Header: 'Player Name',
        accessor: 'name', 
        sortType: 'basic'
    },
    {
        Header: 'Wins',
        accessor: 'wins',
        sortType: 'basic'
    },

    {
        Header: 'Losses',
        accessor: 'losses',
        sortType: 'basic'
    },
    {
        Header: 'Total Matches Played',
        accessor: 'gamesPlayed',
        sortType: 'basic'
    },
    {
        Header: 'Rating',
        accessor: 'rating',
        sortType: 'basic'
    },
];

const data = [
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

function LeaderboardPage(props: LeaderboardPageProps) {
    return (
        <>
            <Container breakpoint="widescreen" className="app-container">
                <Box>
                <Block>
                    <div className="leaderboard-title">
                        Leaderboard
                    </div>
                </Block>
                <Table columns={columns} data={data} />
                </Box>
            </Container>
        </>
    )
}

export default LeaderboardPage;