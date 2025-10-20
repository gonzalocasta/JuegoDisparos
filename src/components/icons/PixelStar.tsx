import type { SVGProps } from 'react';

export function PixelStar(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 9 9"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      {...props}
    >
        <path d="M4 0H5V1H6V2H7V3H8V4H9V5H8V6H7V7H6V8H5V9H4V8H3V7H2V6H1V5H0V4H1V3H2V2H3V1H4V0Z" fill="currentColor" />
    </svg>
  );
}
