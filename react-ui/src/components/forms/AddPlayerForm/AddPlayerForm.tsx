import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { RootState } from '../../../app/store';
import { addPlayer, clearState } from '../../../features/form/formSlice';
import { clearState as clearLeaderboardState } from '../../../features/table/tableSlice';

import { Button, Form } from 'react-bulma-components';

function AddPlayerForm(): React.ReactElement | null {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(clearState());
    }, [dispatch]);

    const [playerName, setPlayerName]: [string, (result: string) => void] = useState('');

    const { errorMessage, isError, isFetching, submitSuccess } = useAppSelector((state: RootState) => state.form);

    const submitForm = () => {
        if (playerName !== '') {
            dispatch(addPlayer(playerName));
            dispatch(clearState())
            setPlayerName('');
        }
    }

    return (
        <>
            <Form.Field>
                <Form.Label>Player Name</Form.Label>
                <Form.Control>
                    <Form.Input 
                        color="success"
                        value={playerName}
                        onChange={(e) => {
                            return setPlayerName(e.target.value);
                        }}
                        required
                    />
                </Form.Control>
            </Form.Field>
            <Form.Field kind="group">
                <Form.Control>
                    <Button onClick={() => submitForm()} color="link" disabled={isFetching || playerName === ''}>Submit</Button>
                </Form.Control>
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

export default AddPlayerForm;