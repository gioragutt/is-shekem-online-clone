import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  ListItemIcon,
  makeStyles,
  Typography,
} from '@material-ui/core';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';

interface ReportItemData {
  reporter: string;
  open: boolean;
  upvotes: number;
  downvotes: number;
}

const data: ReportItemData[] = [
  {
    reporter: 'קקי',
    open: true,
    downvotes: 1,
    upvotes: 2,
  },
  {
    reporter: 'גדול',
    open: false,
    downvotes: 0,
    upvotes: 1,
  },
];

const useReportItemStyle = makeStyles({
  voteText: {
    marginRight: 8,
  }
})

function ReportItem({ reporter, downvotes, upvotes }: ReportItemData) {
  const classes = useReportItemStyle();
  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar>{reporter.substring(0, 2)}</Avatar>
      </ListItemAvatar>
      <ListItemText>{reporter}</ListItemText>

      <ListItemIcon>
        <Typography color="error" className={classes.voteText}>
          {downvotes}
        </Typography>
        <ThumbDownIcon color="error" />
      </ListItemIcon>
      <ListItemIcon>
        <Typography color="primary" className={classes.voteText}>
          {upvotes}
        </Typography>
        <ThumbUpIcon color="primary" />
      </ListItemIcon>
    </ListItem>
  );
}

export function ReportsHistory() {
  return (
    <List>
      {data.map((item) => (
        <ReportItem {...item} />
      ))}
    </List>
  );
}
