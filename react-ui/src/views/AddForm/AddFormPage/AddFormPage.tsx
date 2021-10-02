import React, { useState } from 'react';
import { Box, Container, Form } from 'react-bulma-components';
import AddPlayerForm from '../../../components/forms/AddPlayerForm/AddPlayerForm';
import AddMatchForm from '../../../components/forms/AddMatchForm/AddMatchForm';
import '../../../css/AddFormPage.css';

function AddFormPage(): React.ReactElement | null {
    const [formType, setFormType]: [string, (result: string) => void] = useState('add-player');

    return (
        <>
            <Container className="form-container">
                <Box>
                    <form>
                        <Form.Field>
                            <Form.Label>Form Type</Form.Label>
                            <Form.Control>
                                <Form.Select
                                    value={formType}
                                    onChange={(e) => {
                                        return setFormType(e.target.value)
                                    }}>
                                        <option value="add-player">Add Player</option>
                                        <option value="add-match">Add Match</option>
                                </Form.Select>
                            </Form.Control>
                        </Form.Field>
                        { formType === 'add-player' ? <AddPlayerForm /> : <AddMatchForm />}
                    </form>
                </Box>
            </Container>
        </>
    )
}

export default AddFormPage;