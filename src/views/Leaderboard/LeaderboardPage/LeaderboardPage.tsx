import React, { useEffect } from 'react';
import { Box, Block, Container } from 'react-bulma-components';
import { useAppDispatch, useAppSelector  } from '../../../app/hooks';
import Constants from '../../../common/constants';
import { clearState, fetchMatches, fetchPlayers, tableSelector } from '../../../features/table/tableSlice';
import '../../../css/bulma.min.css';

import {LeaderboardPageProps} from '../../../common/types';
import Table from '../../../features/table/Table';



function LeaderboardPage(props: LeaderboardPageProps) {
    const dispatch = useAppDispatch();

    // @ts-ignore
    // TODO: update the redux typescript related code to make the types match.
    const { data, columns, currentTable, isFetching } = useAppSelector(tableSelector);

    const { entity } = props;

    useEffect(() => {
        if (currentTable !== entity) {
            dispatch(clearState());
            switch(entity) {
                case Constants.PLAYER_ENTITY:
                    dispatch(fetchPlayers());
                    break;
                case Constants.MATCHES_ENTITY:
                    dispatch(fetchMatches());
                    break;
            }
        }
    }, [currentTable, entity, dispatch]);

    return (
        <>
            <Container breakpoint="widescreen" className="app-container">
                <Box>
                <Block>
                    <div className="leaderboard-title">
                        Leaderboard
                    </div>
                </Block>
                { isFetching ? 'Fetching...' : <Table columns={columns} data={data} /> }
                </Box>
            </Container>
        </>
    )
}

export default LeaderboardPage;