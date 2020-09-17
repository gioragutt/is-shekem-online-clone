import { Button, Container, Grid, makeStyles } from '@material-ui/core';
import React, { useReducer } from 'react';
import { StatusBanner } from './components/StatusBanner';
import { ReportForm } from './components/ReportForm';
import { ReportsHistory } from './components/ReportsHistory';

const useStyles = makeStyles((_theme) => ({
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
  const [open, toggleOpen] = useReducer((open) => !open, false);
  const lastReporter = 'זנגי המלך';
  const lastReportTime = 'לפני 20 דקות';

  return (
    <Container maxWidth="sm" className={classes.root}>
      <Button onClick={toggleOpen}>Open? {open}</Button>
      <Grid container>
        <Grid item xs={12}>
          <StatusBanner {...{ open, lastReportTime, lastReporter }} />
        </Grid>
        <Grid item xs={12}>
          <ReportForm />
        </Grid>
        <Grid item xs={12}>
          <ReportsHistory />
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
