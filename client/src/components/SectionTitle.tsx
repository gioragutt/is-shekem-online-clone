import React from 'react';
import { Box, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  text: {
    paddingLeft: 4
  }
})

export interface SectionTitleProps {
  title: string;
  icon: React.ReactElement;
}

export function SectionTitle({ title, icon }: SectionTitleProps) {
  const classes = useStyles();
  return (
    <Box display="flex" justifyContent="center" alignContent="center" mt={2} mb={1}>
      {icon}
      <Typography className={classes.text} align="center">{title}</Typography>
    </Box>
  );
}
