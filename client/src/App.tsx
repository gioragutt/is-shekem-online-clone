import { gql, useQuery } from '@apollo/client';
import { Box, Container, Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import React from 'react';
import { ReportForm } from './components/ReportForm';
import { ReportsHistory } from './components/ReportsHistory';
import { StatusBanner } from './components/StatusBanner';

const REPORTS = gql`
  query Reports {
    reports {
      reporter
      timestamp
      open
      upvotes
      downvotes
      myVote
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    textAlign: 'center',
    margin: 'auto',
    marginTop: 36,
  },
  statusBanner: {
    flexDirection: 'column',
  },
  errorBox: {
    backgroundColor: theme.palette.error.light,
    marginTop: 16,
  },
}));

function App() {
  const classes = useStyles();
  const { loading, error, data, refetch } = useQuery(REPORTS, {
    pollInterval: 6_000,
  });

  if (error) {
    return (
      <Container maxWidth="md" className={classes.root} dir="ltr">
        <Typography color="error" align="center">
          Well that's emberassing...
          {' '}
          <span role="img" aria-label="Embarrassed emoji">
            😳
          </span>
          <Paper className={classes.errorBox}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              height={400}
              p={4}
            >
              {error.message}
              <br />
              <b>
                <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', textAlign: 'left' }}>
                  {JSON.stringify(error.networkError, null, 2)}
                </pre>
              </b>
            </Box>
          </Paper>
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" className={classes.root}>
      <Grid container>
        <Grid item xs={12}>
          <StatusBanner {...{ loading, report: data?.reports[0], onVote: refetch }} />
        </Grid>
        <Grid item xs={12}>
          <ReportForm onCreateReport={() => refetch()} />
        </Grid>
        <Grid item xs={12}>
          <ReportsHistory {...{ loading, reports: data?.reports }} />
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
