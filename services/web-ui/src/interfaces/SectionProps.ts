// Default section props
export interface SectionSharedProps {
  className?: string;
  topOuterDivider?: boolean;
  bottomOuterDivider?: boolean;
  topDivider?: boolean;
  bottomDivider?: boolean;
  hasBgColor?: boolean;
  invertColor?: boolean;
}

// Section split props
export interface SectionSplitProps extends SectionSharedProps {
  invertMobile?: boolean;
  invertDesktop?: boolean;
  alignTop?: boolean;
  imageFill?: boolean;
}

// Section tile props
export interface SectionTilesProps extends SectionSharedProps {
  pushLeft?: boolean;
}
