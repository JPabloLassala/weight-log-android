import Svg, { Path, SvgProps } from "react-native-svg";

const ScaleSvg = ({ color = "#000", ...props }: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <Path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
    <Path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
    <Path d="M7 21h10" />
    <Path d="M12 3v18" />
    <Path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
  </Svg>
);

export default ScaleSvg;
