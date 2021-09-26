import React, { useEffect } from 'react';
import { Box, Block, Container, Notification } from 'react-bulma-components';
import { useAppDispatch, useAppSelector  } from '../../../app/hooks';
import { clearState, fetchPlayers, tableSelector } from '../../../features/table/tableSlice';
import '../../../css/bulma.min.css';

import {LeaderboardPageProps} from '../../../common/types';
import Table from '../../../features/table/Table';

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

function LeaderboardPage(props: LeaderboardPageProps) {
    const dispatch = useAppDispatch();

    // @ts-ignore
    // TODO: update the redux typescript related code to make the types match.
    const { data, isFetching, isSuccess, isError, errorMessage } = useAppSelector(tableSelector);

    useEffect(() => {
        return () => {
            dispatch(clearState());
        }
    }, []);

    useEffect(() => {
        return () => {
            dispatch(fetchPlayers());
        }
    }, [])

    return (
        <>
            <Container breakpoint="widescreen" className="app-container">
                <Box>
                <Block>
                    <div className="leaderboard-title">
                        Leaderboard
                    </div>
                </Block>
                { data.length > 0 && isSuccess ? <Table columns={columns} data={data} /> : 'Fetching...'}
                </Box>
            </Container>
        </>
    )
}

export default LeaderboardPage;