import React from 'react';
import { Box, Typography } from '@material-ui/core';

export interface SectionTitleProps {
  title: string;
  icon: React.ReactElement;
}

export function SectionTitle({title, icon}: SectionTitleProps) {
  return (
    <Box display="flex" justifyContent="center" alignContent="center" mt={2} mb={1}>
      {icon}
      <Typography align="center">{title}</Typography>
    </Box>
  );
}
