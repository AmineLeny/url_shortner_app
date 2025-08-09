import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';

const Demo = styled('div')(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.background.paper,
}));

export default function InteractiveList() {
  const [urls, setUrls] = React.useState([]);
  const [dense, setDense] = React.useState(false);
  const [secondary, setSecondary] = React.useState(true);

  React.useEffect(() => {
    fetch('http://localhost:8000/urls')
      .then(res => res.json())
      .then(data => setUrls(data));
  }, []);

  // Delete handler
  const deleteUrl = async (ShortUrl) => {
    await fetch(`http://localhost:8000/urls/${ShortUrl}`, {
      method: 'DELETE',
    });
    // Refetch the list after deletion
    fetch('http://localhost:8000/urls')
      .then(res => res.json())
      .then(data => setUrls(data));
  };

  return (
    <Box sx={{ flexGrow: 1, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2, textAlign: 'center', fontWeight: 700 }}>
        My URLs
      </Typography>
      <FormGroup row sx={{ justifyContent: 'center', mb: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={dense}
              onChange={e => setDense(e.target.checked)}
            />
          }
          label="Dense"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={secondary}
              onChange={e => setSecondary(e.target.checked)}
            />
          }
          label="Show Short URL"
        />
      </FormGroup>
      <Demo>
        <List dense={dense}>
          {urls.map((url) => (
            <ListItem
              key={url.id || url.short_url}
              secondaryAction={
                <IconButton
                  onClick={() => deleteUrl(url.short_url)}
                  edge="end"
                  aria-label="delete"
                >
                  <DeleteIcon />
                </IconButton>
              }
              sx={{
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' },
                py: 2,
              }}
            >
              <ListItemText
                primary={
                  <span style={{ wordBreak: 'break-all', fontWeight: 600 }}>
                    {url.original_url}
                  </span>
                }
                secondary={
                  secondary && (
                    <span>
                      Short:&nbsp;
                      <a
                        href={`http://localhost:8000/urls/${url.short_url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#1976d2', textDecoration: 'underline', fontWeight: 500 }}
                      >
                        {url.short_url}
                      </a>
                    </span>
                  )
                }
              />
            </ListItem>
          ))}
        </List>
      </Demo>
    </Box>
  );
}