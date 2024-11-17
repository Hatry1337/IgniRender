export interface Point2D {
    x: number;
    y: number;
}

// Range of values is 0 - 1.0
export interface Color {
    red: number;
    green: number;
    blue: number
    alpha: number;
}

export interface Triangle2D {
    points: [Point2D, Point2D, Point2D];
    color?: Color;
}