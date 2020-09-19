import { makeStyles, Typography } from '@material-ui/core';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import React from 'react';
import { Vote } from '../models';

const useStyles = makeStyles({
  value: {
    marginRight: 8,
  },
});

export interface VoteValueProps {
  vote: Vote;
  value: number;
}

export function VoteValue({ vote, value }: VoteValueProps) {
  const classes = useStyles();
  if (vote === 'UPVOTE') {
    return (
      <>
        <Typography color="primary" className={classes.value}>
          {value}
        </Typography>
        <ThumbUpIcon color="primary" />
      </>
    );
  }
  return (
    <>
      <Typography color="error" className={classes.value}>
        {value}
      </Typography>
      <ThumbDownIcon color="error" />
    </>
  );
}
