import { useMemo } from "react";

export const useCssProps = (props: React.CSSProperties) =>
  useMemo<React.CSSProperties>(() => props, [props]);