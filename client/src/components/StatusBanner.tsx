import { gql, useMutation } from '@apollo/client';
import { Box, Container, makeStyles, Typography } from '@material-ui/core';
import { Skeleton, ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import React, { useCallback } from 'react';
import { Report, Vote } from '../models';
import { formatTimeAgo } from '../util';
import { StatusIcon } from './StatusIcon';
import { VoteValue } from './VoteValue';

const iconSize = 160;

const statusBannerSkeleton = (
  <>
    <Box display="flex" flexDirection="column" alignItems="center">
      <Skeleton variant="circle" width={iconSize} height={iconSize} />
      <Skeleton variant="text" width={150} />
      <Skeleton variant="text" width={150} />
    </Box>
    <div>
      <ToggleButtonGroup value={null}>
        <ToggleButton value="DOWNVOTE">
          <VoteValue vote="DOWNVOTE" value={0} />
        </ToggleButton>
        <ToggleButton value="UPVOTE">
          <VoteValue vote="UPVOTE" value={0} />
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  </>
);

const userStatusBannerContainerStyles = makeStyles({
  statusBanner: {
    '& > *': {
      marginTop: 7,
    },
  },
});

export function StatusBannerContainer({ children }: { children: React.ReactNode }) {
  const classes = userStatusBannerContainerStyles();
  return (
    <Container className={classes.statusBanner}>
      <Typography variant="h4">תגיד/י השק״ם פתוח?</Typography>
      {children}
    </Container>
  );
}

const useStatusBannerStyles = makeStyles({
  statusIcon: {
    fontSize: iconSize,
    backgroundColor: '#f1f5f8',
    borderRadius: 9999,
    padding: 20,
  },
});

export const VOTE_ON_REPORT = gql`
  mutation VoteOnReport($vote: Vote) {
    voteOnReport(vote: $vote) {
      open
    }
  }
`;

export interface StatusBannerProps {
  loading: boolean;
  report: Report | undefined;
  onVote(): void;
}

export function StatusBanner({ loading, report, onVote }: StatusBannerProps) {
  const classes = useStatusBannerStyles();
  const [voteOnReport] = useMutation(VOTE_ON_REPORT, {
    onCompleted: () => onVote(),
    // Specified cause otherwise component dies and mutation error test fails
    onError() {},
  });

  const handleChangeVote = useCallback(
    (_: any, vote: Vote) => {
      voteOnReport({ variables: { vote } });
    },
    [voteOnReport]
  );

  if (loading) {
    return <StatusBannerContainer>{statusBannerSkeleton}</StatusBannerContainer>;
  }

  if (report) {
    return (
      <StatusBannerContainer>
        <StatusIcon open={report.open} className={classes.statusIcon} />

        <div data-testid="status-banner-reporter">
          דווח ע״י <b>{report.reporter}</b>
        </div>

        <Typography color={report.open ? 'primary' : 'error'} variant="body2">
          <b>{formatTimeAgo(report.timestamp)}</b>
        </Typography>

        <div>
          <ToggleButtonGroup value={report.myVote} exclusive onChange={handleChangeVote}>
            <ToggleButton value="DOWNVOTE" data-testid="downvote-button">
              <VoteValue vote="DOWNVOTE" value={report.downvotes} />
            </ToggleButton>
            <ToggleButton value="UPVOTE" data-testid="upvote-button">
              <VoteValue vote="UPVOTE" value={report.upvotes} />
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
      </StatusBannerContainer>
    );
  }

  return (
    <StatusBannerContainer>
      <StatusIcon open={false} className={classes.statusIcon} />
      <Typography variant="h4">עדיין אין דיווח, היה הראשון לדווח!</Typography>
    </StatusBannerContainer>
  );
}
