import type { SVGProps } from 'react';

export function PixelHeart(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 7 6"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      {...props}
    >
      <path d="M1 0H3V1H4V0H6V1H7V2H6V3H5V4H4V5H3V4H2V3H1V2H0V1H1V0Z" fill="currentColor" />
    </svg>
  );
}
