import { COLORS } from "./constants";

export const TETROMINOES = [
  // I
  {
    shape: [
      [1, 1, 1, 1]
    ],
    color: COLORS.I
  },
  // J
  {
    shape: [
      [1, 0, 0],
      [1, 1, 1]
    ],
    color: COLORS.J
  },
  // L
  {
    shape: [
      [0, 0, 1],
      [1, 1, 1]
    ],
    color: COLORS.L
  },
  // O
  {
    shape: [
      [1, 1],
      [1, 1]
    ],
    color: COLORS.O
  },
  // S
  {
    shape: [
      [0, 1, 1],
      [1, 1, 0]
    ],
    color: COLORS.S
  },
  // T
  {
    shape: [
      [0, 1, 0],
      [1, 1, 1]
    ],
    color: COLORS.T
  },
  // Z
  {
    shape: [
      [1, 1, 0],
      [0, 1, 1]
    ],
    color: COLORS.Z
  }
];