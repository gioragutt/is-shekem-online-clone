import { gql, useMutation } from '@apollo/client';
import { Box, IconButton, makeStyles, Paper, TextField, Tooltip } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import React, { useCallback, useState } from 'react';
import { SectionTitle } from './SectionTitle';
import { ClosedIcon, OpenIcon } from './StatusIcon';

const useStyles = makeStyles({
  form: {
    display: 'flex',
  },
  nameInput: {
    flex: 1,
    padding: '0 30px',
    '& > *': {
      width: '100%',
    },
  },
});

export const CREATE_REPORT = gql`
  mutation CreateReport($reporter: String!, $open: Boolean!) {
    createReport(input: { reporter: $reporter, open: $open }) {
      open
    }
  }
`;

export interface ReportFormProps {
  onCreateReport(): void;
}

export function ReportForm({ onCreateReport }: ReportFormProps) {
  const classes = useStyles();
  const [reporter, setReporter] = useState('');

  const [createReport] = useMutation(CREATE_REPORT, {
    onCompleted: () => onCreateReport(),
    // Specified cause otherwise component dies and mutation error test fails
    onError() {},
  });

  const handleCreateReport = useCallback(
    (open: boolean) => {
      createReport({ variables: { reporter, open } });
      setReporter('');
    },
    [createReport, reporter]
  );

  return (
    <Box>
      <SectionTitle title="דיווח חדש" icon={<AddIcon />} />
      <Paper variant="outlined">
        <form className={classes.form} autoComplete="off">
          <Tooltip title="דווח סגור" placement="top">
            <span>
              <IconButton
                type="button"
                onClick={() => handleCreateReport(false)}
                disabled={!reporter}
                data-testid="close-button"
              >
                <ClosedIcon fontSize="large" />
              </IconButton>
            </span>
          </Tooltip>

          <div className={classes.nameInput}>
            <TextField
              label="שם מדווח"
              value={reporter}
              inputProps={{ 'data-testid': 'reporter-input' }}
              onChange={(e) => setReporter(e.target.value)}
            />
          </div>

          <Tooltip title="דווח פתוח" placement="top">
            <span>
              <IconButton
                type="button"
                onClick={() => handleCreateReport(true)}
                disabled={!reporter}
                data-testid="open-button"
              >
                <OpenIcon fontSize="large" />
              </IconButton>
            </span>
          </Tooltip>
        </form>
      </Paper>
    </Box>
  );
}
