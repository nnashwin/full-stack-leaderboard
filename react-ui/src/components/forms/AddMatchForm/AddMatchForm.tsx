import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bulma-components';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { RootState } from '../../../app/store';
import { MatchParams } from '../../../common/types';
import {
  addMatch,
  clearState,
  fetchPlayerIds,
} from '../../../features/form/formSlice';

interface Player {
  id: string;
  name: string;
}

function AddMatchForm(): React.ReactElement | null {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(clearState());
    dispatch(fetchPlayerIds());
  }, [dispatch]);

  const [location, setLocation]: [string, (result: string) => void] =
    useState('');
  // TODO: fix hacky implementation where we use the first id and second id as player and opponent ids respectively as defaults.
  // This will break once we have uuids or other type of ids
  const [playerId, setPlayerId] = useState<number>(1);
  const [opponentId, setOpponentId] = useState<number>(2);
  const [matchTime, setMatchTime] = useState<string>('');
  const [finalPlayerScore, setFinalPlayerScore] = useState<number>(0);
  const [finalOpponentScore, setFinalOpponentScore] = useState<number>(0);

  const { errorMessage, isError, isFetching, players, submitSuccess } =
    useAppSelector((state: RootState) => state.form);

  const submitForm = (e: React.MouseEvent<HTMLElement>): void => {
    e.preventDefault();
    dispatch(clearState());
    const player = players.find((player) => Number(player.id) === playerId) ?? {
      name: '',
    };
    const opponent = players.find(
      (opponent) => Number(opponent.id) === opponentId
    ) ?? { name: '' };
    const matchParams: MatchParams = {
      playerId,
      playerName: player.name,
      finalPlayerScore,
      finalOpponentScore,
      location,
      opponentId,
      opponentName: opponent.name,
      matchTime,
    };

    dispatch(addMatch(matchParams));
  };

  useEffect(() => {
    if (submitSuccess) {
      setLocation('');
      setPlayerId(1);
      setOpponentId(2);
      setMatchTime('');
      setFinalPlayerScore(0);
      setFinalOpponentScore(0);
      dispatch(clearState());
    }
  }, [submitSuccess]);

  return (
    <>
      <Form.Field>
        <Form.Label>Match Location</Form.Label>
        <Form.Control>
          <Form.Input
            value={location}
            onChange={(e) => {
              return setLocation(e.target.value);
            }}
            required
          />
        </Form.Control>
      </Form.Field>
      <Form.Field>
        <Form.Label>Match Date</Form.Label>
        <Form.Control>
          <Form.Input
            type="date"
            value={matchTime}
            onChange={(e) => {
              setMatchTime(e.target.value);
            }}
            required
          />
        </Form.Control>
      </Form.Field>
      <Form.Field>
        <Form.Label>Player Id</Form.Label>
        <Form.Control>
          <Form.Select
            value={playerId}
            onChange={(e) => {
              setPlayerId(Number(e.target.value));
            }}
            required
          >
            {players.length === 0 && isFetching
              ? 'searching'
              : players.map((playerObj: Player) => {
                  const { name, id } = playerObj;
                  if (Number(id) === playerId) {
                    return (
                      <option key={`${name}-${id}`} value={id} selected>
                        {name}
                      </option>
                    );
                  }

                  return (
                    <option key={`${name}-${id}`} value={id}>
                      {name}
                    </option>
                  );
                })}
          </Form.Select>
        </Form.Control>
      </Form.Field>
      <Form.Field>
        <Form.Label>Opponent Id</Form.Label>
        <Form.Control>
          <Form.Select
            value={opponentId}
            onChange={(e) => {
              return setOpponentId(Number(e.target.value));
            }}
            required
          >
            {players.length === 0 && isFetching
              ? 'searching'
              : players.map((playerObj: Player) => {
                  const { name, id } = playerObj;
                  if (Number(id) === opponentId) {
                    return (
                      <option key={`${name}-${id}`} value={id} selected>
                        {name}
                      </option>
                    );
                  }

                  return (
                    <option key={`${name}-${id}`} value={id}>
                      {name}
                    </option>
                  );
                })}
          </Form.Select>
        </Form.Control>
      </Form.Field>
      <Form.Field>
        <Form.Label>Final Player Score</Form.Label>
        <Form.Control>
          <Form.Input
            onChange={(e) => {
              return setFinalPlayerScore(Number(e.target.value));
            }}
            type={'number'}
            value={finalPlayerScore}
            required
          />
        </Form.Control>
      </Form.Field>
      <Form.Field>
        <Form.Label>Final Opponent Score</Form.Label>
        <Form.Control>
          <Form.Input
            onChange={(e) => {
              return setFinalOpponentScore(Number(e.target.value));
            }}
            type={'number'}
            value={finalOpponentScore}
            required
          />
        </Form.Control>
      </Form.Field>
      <Form.Field kind="group">
        <Form.Control>
          <Button
            onClick={(e: React.MouseEvent<HTMLElement>) => submitForm(e)}
            color="link"
            disabled={isFetching}
          >
            Submit
          </Button>
        </Form.Control>
      </Form.Field>
      <Form.Field kind="group">
        {isFetching && (
          <Form.Control loading>Posting your data...</Form.Control>
        )}

        {isError && (
          <Form.Control>
            <span className="error-message">Error: {errorMessage}</span>
          </Form.Control>
        )}

        {submitSuccess && (
          <Form.Control>
            <span className="success-message">
              Your data has been posted successfully!
            </span>
          </Form.Control>
        )}
      </Form.Field>
    </>
  );
}

export default AddMatchForm;
