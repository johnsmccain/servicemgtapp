import { useState } from 'react'
import { 
  Box, 
  Container, 
  CssBaseline, 
  AppBar, 
  Toolbar, 
  Typography, 
  ThemeProvider, 
  createTheme 
} from '@mui/material'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import RatingReviewSystem from './components/Rating'
import ConnectWallet from './components/ConnectWallet'

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [count, setCount] = useState(0)

  // Demo data - in a real app, this would come from a route parameter or API
  const demoProvider = {
    id: '1234',
    name: 'Tech Solutions Inc.',
    service: {
      id: '5678',
      name: 'Web Development Service'
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              StarkNet Service Marketplace
            </Typography>
            <ConnectWallet />
          </Toolbar>
        </AppBar>
        
        <Container>
          <Box sx={{ my: 4 }}>
            <div>
              <a href="https://vite.dev" target="_blank" rel="noreferrer">
                <img src={viteLogo} className="logo" alt="Vite logo" />
              </a>
              <a href="https://react.dev" target="_blank" rel="noreferrer">
                <img src={reactLogo} className="logo react" alt="React logo" />
              </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
              {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
              <button onClick={() => setCount((count) => count + 1)}>
                count is {count}
              </button>
              <p>
                Edit <code>src/App.jsx</code> and save to test HMR
              </p>
            </div>
            <p className="read-the-docs">
              Click on the Vite and React logos to learn more
            </p>

            {/* Rating and Review System Integration */}
            <RatingReviewSystem 
              providerId={demoProvider.id}
              serviceId={demoProvider.service.id}
              serviceName={demoProvider.service.name}
            />
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default App
