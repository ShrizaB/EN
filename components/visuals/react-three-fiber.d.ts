// TypeScript module declaration for @react-three/fiber
// This suppresses TS2307 for missing types

declare module "@react-three/fiber" {
  export * from "three";
  export const Canvas: any;
  export const useThree: any;
}
