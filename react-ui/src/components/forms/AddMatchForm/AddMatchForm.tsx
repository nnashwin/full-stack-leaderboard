import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bulma-components';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { RootState } from '../../../app/store';
import { MatchParams } from '../../../common/types';
import { addMatch, clearState, fetchPlayerIds } from '../../../features/form/formSlice';

function AddMatchForm(): React.ReactElement | null {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(clearState());
        dispatch(fetchPlayerIds());
    }, [dispatch]);

    const [location, setLocation]: [string, (result: string) => void] = useState('');
    // TODO: fix hacky implementation where we use the first id and second id as player and opponent ids respectively as defaults.
    // This will break once we have uuids or other type of ids
    const [playerId, setPlayerId]: [number, (result: number) => void] = useState(1);
    const [opponentId, setOpponentId]: [number, (result: number) => void] = useState(2);
    const [matchTime, setMatchTime]: [string, (result: string) => void] = useState('');
    const [finalPlayerScore, setFinalPlayerScore]: [number, (result: number) => void] = useState(0);
    const [finalOpponentScore, setFinalOpponentScore]: [number, (result: number) => void] = useState(0);

    const { errorMessage, isError, isFetching, playerIds, submitSuccess } = useAppSelector((state: RootState) => state.form);

    const submitForm = (e: React.MouseEvent<HTMLElement>): void => {
        e.preventDefault();
        dispatch(clearState());
        const matchParams: MatchParams = {
            playerId,
            finalPlayerScore,
            finalOpponentScore,
            location,
            opponentId,
            matchTime
        };

        dispatch(addMatch(matchParams));
    }

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
    }, [submitSuccess])

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
                            return setMatchTime(e.target.value);
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
                            return setPlayerId(Number(e.target.value));
                        }}
                        required
                    >
                        { playerIds.length === 0 && isFetching ? 'searching' : playerIds.map((playerObj) => {
                            const {name, id} = playerObj;
                            if (Number(id) === playerId) {
                                return <option key={`${name}-${id}`} value={id} selected>{name}</option>
                            }

                            return <option key={`${name}-${id}`} value={id}>{name}</option>
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

                        { playerIds.length === 0 && isFetching ? 'searching' : playerIds.map((playerObj) => {
                            const {name, id} = playerObj;
                            if (Number(id) === opponentId) {
                                return <option key={`${name}-${id}`} value={id} selected>{name}</option>
                            }

                            return <option key={`${name}-${id}`} value={id}>{name}</option>
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
                        type={"number"}
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
                        type={"number"}
                        value={finalOpponentScore}
                        required
                    />
                </Form.Control>
            </Form.Field>
            <Form.Field kind="group">
                <Form.Control>
                    <Button onClick={(e: React.MouseEvent<HTMLElement>) => submitForm(e)} color="link" disabled={isFetching}>Submit</Button>
                </Form.Control>
                
            </Form.Field>
            <Form.Field kind="group">
                {isFetching && (<Form.Control loading>
                    Posting your data...
                </Form.Control>)}

                {isError && (<Form.Control>
                    <span className="error-message">Error: {errorMessage}</span>
                </Form.Control>)}

                {submitSuccess && (<Form.Control>
                    <span className="success-message">Your data has been posted successfully!</span>
                </Form.Control>)}
            </Form.Field>
        </>
    );
}

export default AddMatchForm;