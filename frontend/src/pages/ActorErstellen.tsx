import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    TextField, Button, Stack, Typography

} from '@mui/material';
import {createActor} from "../service/ActorService.ts";



const ActorErstellen: React.FC = () => {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
    }, []);

    const validateField = (name: string, value: string): string => {
        if ((name === 'first_name' || name === 'last_name') && (!value || value.trim().length < 2)) {
            return 'Mindestens 2 Zeichen erforderlich.';
        }
        if (value.length > 50) return 'Maximal 50 Zeichen erlaubt.';
        return '';
    };

    const validateAll = (): boolean => {
        const newErrors = {
            first_name: validateField('first_name', firstName),
            last_name: validateField('last_name', lastName)
        };
        setErrors(newErrors);
        return Object.values(newErrors).every(err => !err);
    };

    const handleSave = async () => {
        if (!validateAll()) {
            alert('Bitte korrigieren Sie die Eingaben.');
            return;
        }

        const newActor = {
            first_name: firstName.trim(),
            last_name: lastName.trim()
        };

        try {
            const newId = await createActor(newActor);
            if (typeof newId === 'number') {
                alert('Schauspieler erfolgreich erstellt.');
                navigate(`/actor/details/${newId}`);
            } else {
                throw new Error('Keine gültige ID zurückgegeben');
            }
        } catch (error) {
            console.error('Fehler beim Erstellen:', error);
            alert('Fehler beim Erstellen des Schauspielers.');
        }
    };
    return (
        <div>
            <Typography variant="h4" gutterBottom>Neuen Schauspieler erstellen</Typography>
            <Stack spacing={2}>
                {/* Vorname */}
                <TextField
                    label="Vorname"
                    value={firstName}
                    onChange={e => {
                        setFirstName(e.target.value);
                        setErrors({ ...errors, first_name: validateField('first_name', e.target.value) });
                    }}
                    error={!!errors.first_name}
                    helperText={errors.first_name}
                    fullWidth
                    required
                />
                {/* Nachname */}
                <TextField
                    label="Nachname"
                    value={lastName}
                    onChange={e => {
                        setLastName(e.target.value);
                        setErrors({ ...errors, last_name: validateField('last_name', e.target.value) });
                    }}
                    error={!!errors.last_name}
                    helperText={errors.last_name}
                    fullWidth
                    required
                />

                {/* Buttons */}
                <Stack direction="row" spacing={2}>
                    <Button variant="contained" color="primary" onClick={handleSave}>
                        Erstellen
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={() => navigate('/actor')}>
                        Zurück
                    </Button>
                </Stack>
            </Stack>
        </div>
    );
};

export default ActorErstellen;
