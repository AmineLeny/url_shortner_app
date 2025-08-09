import './home.css'
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import { useState } from 'react';

const Home = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');

  async function handleClick() {
    setLoading(true);
    setError('');
    setShortUrl('');
    try {
      const response = await fetch('http://localhost:8000/urls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ original_url: url })
      });
      if (!response.ok) {
        throw new Error('Failed to shorten URL');
      }
      const data = await response.json();
      setShortUrl(data.short_url || '');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  return (
    <div  style={{
      display: 'flex',
      justifyContent: 'center',
    }}>
    
      <Box  sx={{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh',
    width: { xs: '90vw', sm: '400px' }
  }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: 'primary.main',
            letterSpacing: '.1rem',
            mb: 3,
            textAlign: 'center',
            textShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}
        >
          Enter your original URL below:
        </Typography>
        <TextField
          fullWidth
          label="Enter your full URL"
          id="fullWidth"
          value={url}
          onChange={e => setUrl(e.target.value)}
          variant="outlined"
        />
        <Button
          size="large"
          onClick={handleClick}
          endIcon={<SendIcon />}
          variant="contained"
          disabled={loading || !url}
          sx={{ mt: 2 }}
        >
          {loading ? 'Generating...' : 'Generate short URL'}
        </Button>
        {shortUrl && (
          <Typography
            variant="h6"
            sx={{
              mt: 3,
              fontWeight: 600,
              color: 'success.main',
              background: 'rgba(76,175,80,0.08)',
              px: 2,
              py: 1,
              borderRadius: 2,
              textAlign: 'center'
            }}
          >
            SHORT URL:&nbsp;
            <a
              href={`http://localhost:8000/urls/${shortUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#1976d2',
                fontWeight: 700,
                textDecoration: 'underline'
              }}
            >
              {shortUrl}
            </a>
          </Typography>
        )}
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </Box>
    </div>
  );
};

export default Home;