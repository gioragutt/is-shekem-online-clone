import React from 'react';
import { create } from 'jss';
import rtl from 'jss-rtl';
import { StylesProvider, jssPreset } from '@material-ui/core/styles';

// Configure JSS
const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

export function RTL({ children }: { children: React.ReactNode }) {
  return <StylesProvider jss={jss}>{children}</StylesProvider>;
}
