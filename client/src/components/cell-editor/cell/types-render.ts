// Types in this file should be declared BEFORE every cell is implemented
// so that each celltype renderer can refer to these types.

/**
 * Rendering mode for renderer. 
 */
export enum RenderMode{
    PUBLISH,
    DISPLAY,
    PREVIEW,
    EDITOR
}

/**
 * props interface for component indicating a cell.
 * @property {string} id cell id.
 */
export interface CellRendererProps{
    mode: RenderMode
    id: string
}

export interface CellTypeRendererProps<T>{
    mode: RenderMode,
    cell: T
}
export type Renderer<T> = (props: CellTypeRendererProps<T>) => JSX.Element