// TypeScript module declaration for framer-motion-3d
// This suppresses TS2307 for missing types

declare module "framer-motion-3d" {
  import { ForwardRefExoticComponent, RefAttributes } from "react";
  import { MotionProps } from "framer-motion";
  export const motion: any;
}
