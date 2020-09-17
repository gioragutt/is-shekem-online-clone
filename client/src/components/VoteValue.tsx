import { makeStyles, Typography } from '@material-ui/core';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import React from 'react';

const useStyles = makeStyles({
  value: {
    marginRight: 8,
  },
});

export interface VoteValueProps {
  vote: boolean;
  value: number;
}

export function VoteValue({ vote, value }: VoteValueProps) {
  const classes = useStyles();
  if (vote) {
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
