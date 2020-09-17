import { Container, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { StatusIcon } from './StatusIcon';

const useStyles = makeStyles((_theme) => ({
  statusBanner: {
    '& > *': {
      marginTop: 7,
    },
  },
  statusIcon: {
    fontSize: 160,
    backgroundColor: '#f1f5f8',
    borderRadius: 9999,
    padding: 20,
  },
}));

export interface StatusBannerProps {
  open: boolean;
  lastReporter: string;
  lastReportTime: string;
}

export function StatusBanner({ open, lastReporter, lastReportTime }: StatusBannerProps) {
  const classes = useStyles();


  return (
    <Container className={`${classes.statusBanner}`}>
      <Typography variant="h4">תגיד/י השק״ם פתוח?</Typography>
      <StatusIcon open={open} className={classes.statusIcon} />
      <div>
        דווח ע״י <b>{lastReporter}</b>
      </div>
      <div>
        <Typography color={open ? 'primary' : 'error'} variant="body2">
          <b>{lastReportTime}</b>
        </Typography>
      </div>
    </Container>
  );
}
