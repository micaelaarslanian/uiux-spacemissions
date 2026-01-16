import React from 'react';
import Button from '@mui/material/Button';

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 40 }}>
      <h1>Welcome to the UI/UX Interview Template</h1>
      <Button variant="contained" color="primary">
        Material UI Button
      </Button>
      <p style={{ marginTop: 24 }}>
        Start building your solution here.
      </p>
    </div>
  );
}

export default App;
