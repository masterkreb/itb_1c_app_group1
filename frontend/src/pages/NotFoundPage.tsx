import { Box, Button, Container, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useNavigate } from 'react-router';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="md">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    minHeight: '70vh',
                    py: 4
                }}
            >
                <ErrorOutlineIcon sx={{ fontSize: 100, color: 'error.main', mb: 2 }} />
                <Typography variant="h2" component="h1" gutterBottom>
                    404
                </Typography>
                <Typography variant="h4" component="h2" gutterBottom>
                    Seite nicht gefunden
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
                    Die angeforderte Seite existiert nicht oder ist nicht verfügbar.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => navigate('/')}
                >
                    Zurück zur Startseite
                </Button>
            </Box>
        </Container>
    );
};

export default NotFoundPage;