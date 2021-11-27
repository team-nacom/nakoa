import React, { useRef, MutableRefObject } from 'react';

import { BubbleType } from '../cellTypes'

import { Flat } from '../bubble';
import { FlatSubAction, FlatAction } from '../action';

interface StaticCellComponentProps extends React.HTMLAttributes<HTMLElement>{
    cellId : string;
    method : 'render' | 'preview';
    type : BubbleType;
}

interface EditorCellComponentProps extends React.HTMLAttributes<HTMLElement>{
    cellId : string;
    method : 'editor';
    type : BubbleType;
    refs : MutableRefObject<Record<string,HTMLElement | null>>; // propagate down. should be generated exclusively by root.
}

type CellComponentProps = StaticCellComponentProps | EditorCellComponentProps;

export type { CellComponentProps, StaticCellComponentProps, EditorCellComponentProps };