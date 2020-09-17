import {
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
  makeStyles
} from '@material-ui/core';
import HistoryIcon from '@material-ui/icons/History';
import { formatDistanceToNow } from 'date-fns';
import { he } from 'date-fns/locale';
import React from 'react';
import { SectionTitle } from './SectionTitle';
import { StatusIcon } from './StatusIcon';
import { VoteValue } from './VoteValue';

interface ReportItemData {
  reporter: string;
  open: boolean;
  upvotes: number;
  downvotes: number;
  timestamp: Date;
}

const data: ReportItemData[] = [
  {
    reporter: 'קקי',
    open: true,
    downvotes: 1,
    upvotes: 2,
    timestamp: new Date(),
  },
  {
    reporter: 'גדול',
    open: false,
    downvotes: 0,
    upvotes: 1,
    timestamp: new Date(Date.now() - 1_000_000),
  },
  {
    reporter: 'מאוד',
    open: true,
    downvotes: 3,
    upvotes: 10,
    timestamp: new Date(Date.now() - 10_000_000_000),
  },
];

const useReportItemStyles = makeStyles({
  timeAgo: {
    minWidth: '120px',
    textAlign: 'right'
  }
})

function ReportItem({ open, reporter, downvotes, upvotes, timestamp }: ReportItemData) {
  const classes = useReportItemStyles();
  return (
    <ListItem>
      <ListItemAvatar>
        <StatusIcon open={open} />
      </ListItemAvatar>
      <ListItemText>{reporter}</ListItemText>

      <ListItemIcon>
        <VoteValue vote={false} value={downvotes} />
      </ListItemIcon>
      <ListItemIcon>
        <VoteValue vote={true} value={upvotes} />
      </ListItemIcon>
      <Typography className={classes.timeAgo}>
        {formatDistanceToNow(timestamp, { locale: he, addSuffix: true })}
      </Typography>
    </ListItem>
  );
}

export function ReportsHistory() {
  return (
    <>
      <SectionTitle title="דיווחים אחרונים" icon={<HistoryIcon />} />
      <Paper variant="outlined">
        <List>
          {data.map((item, index) => (
            <>
              {index === 0 ? null : <Divider />}
              <ReportItem key={`${item.reporter}-${item.timestamp.getTime()}`} {...item} />
            </>
          ))}
        </List>
      </Paper>
    </>
  );
}
