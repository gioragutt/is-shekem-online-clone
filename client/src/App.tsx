import { gql, useQuery } from '@apollo/client';
import { Container, Grid, makeStyles } from '@material-ui/core';
import React from 'react';
import { ErrorPage } from './components/ErrorPage';
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
}));

function App() {
  const classes = useStyles();
  const { loading, error, data, refetch } = useQuery(REPORTS, {
    pollInterval: 60_000,
  });

  if (error) {
    return <ErrorPage error={error} />;
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
