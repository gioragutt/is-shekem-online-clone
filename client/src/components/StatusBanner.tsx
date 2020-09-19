import { gql, useMutation } from '@apollo/client';
import { Container, makeStyles, Typography } from '@material-ui/core';
import { Skeleton, ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import React, { useCallback, useReducer } from 'react';
import { Report, Vote } from '../models';
import { formatTimeAgo } from '../util';
import { StatusIcon } from './StatusIcon';
import { VoteValue } from './VoteValue';

const iconSize = 160;

const useStyles = makeStyles((_theme) => ({
  statusBanner: {
    '& > *': {
      marginTop: 7,
    },
  },
  statusIcon: {
    fontSize: iconSize,
    backgroundColor: '#f1f5f8',
    borderRadius: 9999,
    padding: 20,
  },
}));

const VOTE_ON_REPORT = gql`
  mutation VoteOnReport($vote: Vote) {
    voteOnReport(vote: $vote) {
      open
    }
  }
`;

export interface StatusBannerProps {
  loading: boolean;
  report: Report;
  onVote(): void;
}

export function StatusBanner({ loading, report, onVote }: StatusBannerProps) {
  const classes = useStyles();
  const [voteOnReport] = useMutation(VOTE_ON_REPORT, {
    onCompleted: () => onVote(),
  });

  const handleChangeVote = useCallback(
    (_: any, vote: Vote) => {
      voteOnReport({ variables: { vote } });
    },
    [voteOnReport]
  );

  if (!loading && !report) {
    return (
      <Container className={`${classes.statusBanner}`}>
        <Typography variant="h4">תגיד/י השק״ם פתוח?</Typography>
        <StatusIcon open={false} className={classes.statusIcon} />

        <Typography variant="h4">עדיין אין דיווח, היה הראשון לדווח!</Typography>
      </Container>
    );
  }

  return (
    <Container className={`${classes.statusBanner}`}>
      <Typography variant="h4">תגיד/י השק״ם פתוח?</Typography>
      {loading ? (
        <Skeleton variant="circle" width={iconSize} height={iconSize} />
      ) : (
        <StatusIcon open={report.open} className={classes.statusIcon} />
      )}

      {loading ? (
        <Skeleton variant="text" />
      ) : (
        <div>
          דווח ע״י <b>{report.reporter}</b>
        </div>
      )}

      {loading ? (
        <Skeleton variant="text" />
      ) : (
        <Typography color={report.open ? 'primary' : 'error'} variant="body2">
          <b>{formatTimeAgo(report.timestamp)}</b>
        </Typography>
      )}

      <div>
        {loading ? (
          <ToggleButtonGroup value={null}>
            <ToggleButton value="DOWNVOTE">
              <VoteValue vote="DOWNVOTE" value={0} />
            </ToggleButton>
            <ToggleButton value="UPVOTE">
              <VoteValue vote="UPVOTE" value={0} />
            </ToggleButton>
          </ToggleButtonGroup>
        ) : (
          <ToggleButtonGroup value={report.myVote} exclusive onChange={handleChangeVote}>
            <ToggleButton value="DOWNVOTE">
              <VoteValue vote="DOWNVOTE" value={report.downvotes} />
            </ToggleButton>
            <ToggleButton value="UPVOTE">
              <VoteValue vote="UPVOTE" value={report.upvotes} />
            </ToggleButton>
          </ToggleButtonGroup>
        )}
      </div>
    </Container>
  );
}
