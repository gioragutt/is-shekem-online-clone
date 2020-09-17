import { Container, makeStyles, Typography } from '@material-ui/core';
import React, { useReducer, useCallback } from 'react';
import { StatusIcon } from './StatusIcon';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';

import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import { VoteValue } from './VoteValue';

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
  const [vote, changeVote] = useReducer((currentVote: boolean | null, clicked: boolean) => {
    if (currentVote === clicked) {
      return null;
    }
    return clicked;
  }, null);

  const handleChangeVote = useCallback((_: any, value: boolean) => changeVote(value), [changeVote]);

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
      <div>
        <ToggleButtonGroup
          value={vote}
          exclusive
          onChange={handleChangeVote}
          aria-label="text alignment"
        >
          <ToggleButton value={false}>
            <VoteValue vote={false} value={vote === false ? 1 : 0} />
          </ToggleButton>
          <ToggleButton value={true}>
            <VoteValue vote={true} value={vote === true ? 1 : 0} />
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
    </Container>
  );
}
