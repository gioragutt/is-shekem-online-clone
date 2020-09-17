import { createMuiTheme } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';

export const theme = createMuiTheme({
  direction: 'rtl',
  palette: {
    primary: {
      main: green[500],
    },
    error: {
      main: red[600]
    }
  },
});
