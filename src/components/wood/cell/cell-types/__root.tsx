// import React, { useCallback } from 'react';

// import { CellFrom } from '../types-common';
// import { RenderMode, Renderer, RendererProps } from '../types-render';

// // RULE OF THUMB: other than useRenderInfoScope and useCellDispatch, scopes should not appear in each cell rendering.
// import {
//     useRenderInfoScope,
//     useCellDispatch
// } from '#/components/wood/scopes'


// // export const rootCellName = 'root'
// export interface RootCellField{
//     value: string
// }
// export const rootCellDefault: RootCellField = {
//     value: ''
// }
// type RootCell = CellFrom<RootCellField,'text'> // only used in this file

// // renderers

// function RootCellViewer({ mode, cell } : RendererProps<RootCell>){
//     return (
//         <div className='rootCell' style={ {width:'100%', border:'1px solid black'} } >
//             {cell.value}
//         </div>
//     )
// }



// function RootCellEditor({ cell }: Omit<RendererProps<RootCell>,'mode'>){
//     // const {} = useRenderInfoScope()
//     const dispatch = useCellDispatch()

//     const changeHandler : React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = useCallback((ev) => {
//         ev.stopPropagation()
//         ev.preventDefault()
//         dispatch({
//             type: 'update',
//             id: cell.id,
//             ...({
//                 value: ev.target.value
//             } as Partial<RootCellField>)
//         })
//     }, [cell.id])

//     return (
//         <div className='editorRootCellWrapper' style={ {width:'100%', border:'1px solid black'} }>
//             { Date.now() }
//             <textarea
//                 className='editorRootCell editorCell'
//                 value={cell.value}
//                 onChange={ changeHandler }
//             />
//             <RootCellViewer mode={ RenderMode.PREVIEW } cell={cell} />
//         </div>
//     );
// }


// export function RootCellRenderer({ mode, cell }: RendererProps<RootCell>){
//     if(mode !== RenderMode.EDITOR){
//         return <RootCellViewer mode={ mode } cell={ cell } />
//     }

//     return <RootCellEditor cell={ cell } />
// }
export {};