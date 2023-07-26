import { colors } from '..';

export type Colors = typeof colors;
export type ColorValue = Colors[keyof Colors] | Colors['status'][keyof Colors['status']];
