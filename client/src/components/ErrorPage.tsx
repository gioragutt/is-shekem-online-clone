import { ApolloError } from '@apollo/client';
import { Box, Container, makeStyles, Paper, Typography } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    textAlign: 'center',
    margin: 'auto',
    marginTop: 36,
  },
  errorBox: {
    backgroundColor: theme.palette.error.light,
    marginTop: 16,
  },
  errorJson: {
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    textAlign: 'left',
  },
}));

export interface ErrorPageProps {
  error: ApolloError | Error;
}

export function ErrorPage({ error }: ErrorPageProps) {
  const classes = useStyles();

  return (
    <Container maxWidth="md" className={classes.root} dir="ltr">
      <Typography color="error" align="center">
        Well that's emberassing...{' '}
        <span role="img" aria-label="Embarrassed emoji">
          😳
        </span>
        <Paper className={classes.errorBox}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height={400}
            p={4}
          >
            {error.message}
            <br />
            <b>
              <pre className={classes.errorJson}>
                {JSON.stringify((error as ApolloError).networkError || error, null, 2)}
              </pre>
            </b>
          </Box>
        </Paper>
      </Typography>
    </Container>
  );
}
