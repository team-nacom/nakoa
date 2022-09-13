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

export interface RenderContext{
    
}
export interface RendererProps<T> extends RenderContext{
    mode: RenderMode,
    cell: T
}
export type Renderer<T> = (props: RendererProps<T>) => JSX.Element