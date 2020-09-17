import React from 'react';

import ClearRoundedIcon from '@material-ui/icons/ClearRounded';
import ThumbUpAltIcon from '@material-ui/icons/CheckRounded';
import { SvgIconProps } from '@material-ui/core';

export function OpenIcon(props: SvgIconProps) {
  return <ThumbUpAltIcon color="primary" {...props} />;
}

export function ClosedIcon(props: SvgIconProps) {
  return <ClearRoundedIcon color="error" {...props} />;
}

export function StatusIcon({open, ...props}: SvgIconProps & { open: boolean }) {
  if (open) {
    return <OpenIcon {...props} />;
  }
  return <ClosedIcon {...props} />;
}