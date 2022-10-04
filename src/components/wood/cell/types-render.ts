// Types in this file should be declared BEFORE every cell is implemented
// so that each celltype renderer can refer to these types.

/**
 * props interface for component indicating a cell.
 * @property {string} id cell id.
 */
export interface CellIndicatorProps{
    id: string
    depth?: number
}

/**
 * Rendering mode for renderer. 
 */
export enum RenderMode{
    PUBLISH,
    DISPLAY,
    PREVIEW,
    EDITOR
}

export interface RendererProps<T>{
    mode: RenderMode,
    cell: T
    // @todo for optimization, pass id and render timestamp (+ context change timestamp?) instead of the whole cell.
}
export type Renderer<T> = (props: RendererProps<T>) => JSX.Element