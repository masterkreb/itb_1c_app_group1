import React from "react";
import {useNavigate } from "react-router";
import { 
  Box, 
  Button, 
  Container, 
  Paper, 
  Typography, 
  Stack, 
  Divider, 
  Grid 
} from "@mui/material";
import MovieIcon from "@mui/icons-material/Movie";
import PersonIcon from "@mui/icons-material/Person";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          borderRadius: 2,
          background: "linear-gradient(120deg, #f5f7fa 0%, #e4e8f0 100%)",
          color: "#333"
        }}
      >
        <Box textAlign="center" mb={4}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 600, letterSpacing: 1 }}>
            🎬 Film- & Schauspieler-Verwaltung <span style={{ color: "#6d4aff" }}>| M294</span>
          </Typography>
          <Typography variant="h6" sx={{ maxWidth: 700, mx: "auto", mb: 2, lineHeight: 1.6 }}>
            Willkommen zur Abschlussarbeit im Modul 294!
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: 700, mx: "auto" }}>
            Verwalte Filme und Schauspieler effizient in einer modernen Single Page Application.<br />
            <span style={{ color: "#0088cc" }}>CRUD</span>-Funktionen &amp; n:n-Beziehungsmanagement inklusive.
          </Typography>
        </Box>

        <Divider sx={{ my: 4, bgcolor: "rgba(0,0,0,0.1)" }} />

        <Grid container spacing={4} justifyContent="center" alignItems="stretch">
          <Grid item xs={12} sm={6} sx={{ display: 'flex' }}>
            <Paper
              elevation={2} 
              sx={{ 
                p: 3, 
                display: "flex",
                flexDirection: "column",
                background: "#ffffff",
                border: "1px solid rgba(0,0,0,0.08)",
                transition: "transform 0.3s, box-shadow 0.3s",
                flexGrow: 1,
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 12px 20px -5px rgba(0,0,0,0.1)"
                }
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <MovieIcon sx={{ fontSize: 40, color: "#6d4aff", mr: 2 }} />
                <Typography variant="h5" component="h2" fontWeight={500} color="#333">
                  Filmverwaltung
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mb: 3, flexGrow: 1, color: "#555" }}>
                Füge neue Filme hinzu, bearbeite vorhandene oder entferne sie. 
                Verknüpfe Filme mit Schauspielern für eine vollständige Filmdatenbank.
              </Typography>
              <Button 
                variant="contained" 
                fullWidth
                size="large"
                onClick={() => navigate("/film")}
                sx={{ 
                  bgcolor: "#6d4aff", 
                  "&:hover": { 
                    bgcolor: "#5c3dd6" 
                  } 
                }}
              >
                Filme verwalten
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} sx={{ display: 'flex' }}>
            <Paper
              elevation={2} 
              sx={{ 
                p: 3, 
                display: "flex",
                flexDirection: "column",
                background: "#ffffff",
                border: "1px solid rgba(0,0,0,0.08)",
                transition: "transform 0.3s, box-shadow 0.3s",
                flexGrow: 1,
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 12px 20px -5px rgba(0,0,0,0.1)"
                }
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <PersonIcon sx={{ fontSize: 40, color: "#0088cc", mr: 2 }} />
                <Typography variant="h5" component="h2" fontWeight={500} color="#333">
                  Schauspielerverwaltung
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mb: 3, flexGrow: 1, color: "#555" }}>
                Erstelle, bearbeite und verwalte Schauspielerprofile. 
                Ordne Schauspieler den jeweiligen Filmen zu, in denen sie mitgewirkt haben.
              </Typography>
              <Button 
                variant="contained" 
                fullWidth
                size="large"
                onClick={() => navigate("/actor")}
                sx={{ 
                  bgcolor: "#0088cc", 
                  "&:hover": { 
                    bgcolor: "#0077b3" 
                  } 
                }}
              >
                Schauspieler verwalten
              </Button>
            </Paper>
          </Grid>
        </Grid>

        <Box 
          sx={{ 
            mt: 6,
            p: 3, 
            borderRadius: 2,
            background: "rgba(255,255,255,0.8)",
            border: "1px solid rgba(0,0,0,0.06)",
            maxWidth: 700,
            mx: "auto"
          }}
        >
          <Typography variant="h6" color="#0088cc" gutterBottom textAlign="center">
            Projekt-Features
          </Typography>
          <Stack spacing={1.5} mt={2}>
            <Typography variant="body2" sx={{ display: "flex", alignItems: "center", color: "#444" }}>
              <span style={{ color: "#6d4aff", marginRight: "8px" }}>✓</span> 
              <strong>CRUD für Filme & Schauspieler:</strong> Vollständige Verwaltung aller Daten
            </Typography>
            <Typography variant="body2" sx={{ display: "flex", alignItems: "center", color: "#444" }}>
              <span style={{ color: "#6d4aff", marginRight: "8px" }}>✓</span> 
              <strong>Symmetrische n:n-Beziehungsverwaltung:</strong> Flexible Zuordnung zwischen Filmen und Schauspielern
            </Typography>
            <Typography variant="body2" sx={{ display: "flex", alignItems: "center", color: "#444" }}>
              <span style={{ color: "#6d4aff", marginRight: "8px" }}>✓</span> 
              <strong>Moderne REST-Architektur & React Frontend:</strong> Basierend auf Best Practices
            </Typography>
          </Stack>
        </Box>

        <Divider sx={{ my: 4, bgcolor: "rgba(0,0,0,0.1)" }} />

        <Typography variant="body2" textAlign="center" sx={{ opacity: 0.7, color: "#555" }}>
          © {new Date().getFullYear()} M294 Abschlussarbeit – Gruppe 6
        </Typography>
      </Paper>
    </Container>
  );
};

export default HomePage;
