// eslint-disable-next-line
import * as Button from '@mui/material/Button';

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    ai: true;
  }
}
