import { Button } from '@mantine/core';
import { type ReactNode } from 'react';
import type { VegetableCard } from '../../types/VegetableCard';
import style from './style.module.css'
import classNames from 'classnames';

type ButtonProps = {
  item?: VegetableCard,
    text: string,
    color: string,
    textColor: string
    leftSection?: number | null,
    rightSection?: ReactNode,
    onClick: () => void
}

export default function ButtonCart ({ item, text, color, leftSection, rightSection, textColor, onClick }: ButtonProps) {
  return <Button 
  className={style.button}
  style={{ '--text-color': textColor } as React.CSSProperties}
  leftSection={<span className={classNames(leftSection ? style['left-section'] : null)}>
    {leftSection}
  </span>}
  rightSection={rightSection}
    color={color}
    onClick={onClick}>{text}</Button>
}