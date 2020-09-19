import {
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Paper,
  Typography,
} from '@material-ui/core';
import HistoryIcon from '@material-ui/icons/History';
import { Skeleton } from '@material-ui/lab';
import React, {Fragment} from 'react';
import { Report } from '../models';
import { formatTimeAgo } from '../util';
import { SectionTitle } from './SectionTitle';
import { StatusIcon } from './StatusIcon';
import { VoteValue } from './VoteValue';

const useReportItemStyles = makeStyles({
  timeAgo: {
    minWidth: '120px',
    textAlign: 'right',
  },
});

function ReportItem({
  report: { reporter, open, downvotes, upvotes, timestamp },
}: {
  report: Report;
}) {
  const classes = useReportItemStyles();
  return (
    <ListItem>
      <ListItemAvatar>
        <StatusIcon open={open} />
      </ListItemAvatar>
      <ListItemText>{reporter}</ListItemText>

      <ListItemIcon>
        <VoteValue vote="DOWNVOTE" value={downvotes} />
      </ListItemIcon>
      <ListItemIcon>
        <VoteValue vote="UPVOTE" value={upvotes} />
      </ListItemIcon>
      <Typography className={classes.timeAgo}>{formatTimeAgo(timestamp)}</Typography>
    </ListItem>
  );
}
export interface ReportsHistoryProps {
  loading: boolean;
  reports: Report[];
}

export function ReportsHistory({ loading, reports }: ReportsHistoryProps) {
  if (!loading && reports.length === 0) {
    return <SectionTitle title="אין דיווחים אחרונים" icon={<HistoryIcon />} />;
  }
  return (
    <>
      <SectionTitle title="דיווחים אחרונים" icon={<HistoryIcon />} />
      <Paper variant="outlined">
        {loading ? (
          <List>
            <ListItem>
              <Skeleton variant="rect" />
            </ListItem>
            <ListItem>
              <Skeleton variant="rect" />
            </ListItem>
            <ListItem>
              <Skeleton variant="rect" />
            </ListItem>
            <ListItem>
              <Skeleton variant="rect" />
            </ListItem>
            <ListItem>
              <Skeleton variant="rect" />
            </ListItem>
          </List>
        ) : (
          <List>
            {reports.map((report, index) => (
              <Fragment key={`${report.reporter}-${report.timestamp}`}>
                {index === 0 ? null : <Divider />}
                <ReportItem report={report} />
              </Fragment>
            ))}
          </List>
        )}
      </Paper>
    </>
  );
}
