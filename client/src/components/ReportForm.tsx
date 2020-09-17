import { IconButton, makeStyles, TextField, Paper, Box } from '@material-ui/core';
import React from 'react';
import { ClosedIcon, OpenIcon } from './StatusIcon';
import { Tooltip } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { SectionTitle } from './SectionTitle';

const useStyles = makeStyles({
  form: {
    display: 'flex',
  },
  nameInput: {
    flex: 1,
    padding: '0 30px',
    '& > *': {
      width: '100%',
    }
  },
});

export function ReportForm() {
  const classes = useStyles();

  return (
    <Box>
      <SectionTitle title="דיווח חדש" icon={<AddIcon />} />
      <Paper variant="outlined">
        <form className={classes.form} autoComplete="off">
          <Tooltip title="דווח סגור" placement="top">
            <IconButton type="submit">
              <ClosedIcon fontSize="large" />
            </IconButton>
          </Tooltip>

          <div className={classes.nameInput}>
            <TextField label="שם מדווח" />
          </div>

          <Tooltip title="דווח פתוח" placement="top">
            <IconButton type="submit">
              <OpenIcon fontSize="large" />
            </IconButton>
          </Tooltip>
        </form>
      </Paper>
    </Box>
  );
}
