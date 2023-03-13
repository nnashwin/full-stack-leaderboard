import React, { useEffect } from 'react';
import { Box, Block, Container } from 'react-bulma-components';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import Constants from '../../../common/constants';
import {
  clearState,
  fetchMatches,
  fetchPlayers,
} from '../../../features/table/tableSlice';
import '../../../css/bulma.min.css';
import '../../../css/leaderboard.css';

import { LeaderboardPageProps } from '../../../common/types';
import Table from '../../../components/table/Table';

function LeaderboardPage(
  props: LeaderboardPageProps
): React.ReactElement | null {
  const dispatch = useAppDispatch();

  const { data, columns, isFetching, isError, isSuccess } = useAppSelector(
    (state) => state.table
  );

  const { entity } = props;

  useEffect(() => {
    dispatch(clearState());
    switch (entity) {
      case Constants.PLAYER_ENTITY:
        dispatch(fetchPlayers());
        break;
      case Constants.MATCHES_ENTITY:
        dispatch(fetchMatches());
        break;
    }

    return () => {
      dispatch(clearState());
    };
  }, [entity]);

  return (
    <>
      <Container breakpoint="widescreen" className="app-container">
        <Box className="leaderboard-box">
          <Block>
            <div className="leaderboard-title">Leaderboard</div>
          </Block>
          {isFetching ? 'Fetching...' : ''}
          {isSuccess ? <Table columns={columns} data={data} /> : ''}
          {isError
            ? 'An error has occurred with your request.  Please try again later.'
            : ''}
        </Box>
      </Container>
    </>
  );
}

export default LeaderboardPage;
