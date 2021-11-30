import React, { useRef, MutableRefObject } from 'react';
import { CellComponentProps, StaticCellComponentProps, EditorCellComponentProps } from './componentProps';

import { BubbleType, BubbleMap } from '../types';

// WE NEED POLYMORPHISM..... is this the best?
import { RenderedTextCell, PreviewTextCell, EditorTextCell } from './Text';
import { RenderedMathCell, PreviewMathCell, EditorMathCell } from './Math';
import { RenderedCodeCell, PreviewCodeCell, EditorCodeCell } from './Code';

import { useNaBubbleState, dispatchNaBubbleState as dispatch } from '../actionReducer';
import SideBlockHelper from './helpers/sideBlockHelper';
import InterBlockHelper from './helpers/interBlockHelper';

//type: 'parent'
//value: title
//has children

function RenderedParentCell(props: StaticCellComponentProps) {
    const { cellId, ...others } = props;

    const [flat] = useNaBubbleState('flat');
    const childrenId = flat.record[cellId].childrenId || [];

    return (<div style={{ padding: '5px', border: '1px solid black' }}>
        {childrenId.map((childId) => (
            <RenderedCell {...others} cellId={childId} type={flat.record[childId].type} />
        ))}
    </div>);
}

function PreviewParentCell(props: StaticCellComponentProps) {
    const { cellId, ...others } = props;

    const [flat] = useNaBubbleState('previewFlat');
    const childrenId = flat.record[cellId].childrenId || [];

    return (<div style={{ padding: '5px', border: '1px solid black' }}>
        {childrenId.map((childId) => (
            <PreviewCell {...others} cellId={childId} type={flat.record[childId].type} />
        ))}
    </div>);
}

function EditorParentCell(props: EditorCellComponentProps) {
    const { cellId, refs, ...others } = props;

    const [flat] = useNaBubbleState('flat');
    const evalChildrenId = ()=>(flat.record[cellId].childrenId || []);
    const childrenId = evalChildrenId();

    return (<div
        ref={(el) => { refs.current[cellId] = el }}
        style={{ border: '1px solid gray', padding: '0 10px' }}
    >
        {
            childrenId.reduce((prev, childId, idx) => prev.concat(
                <EditorCell {...others} cellId={childId} type={flat.record[childId].type} refs={refs} />,
                <InterBlockHelper parentId={cellId} evalSiblingId={ evalChildrenId } idx={idx + 1} dispatch={dispatch} refs={refs} />
            ), [<InterBlockHelper parentId={cellId} evalSiblingId={ evalChildrenId } idx={0} dispatch={dispatch} refs={refs} />])
        }
    </div>);
}

function RenderedRootCell(props: React.HTMLAttributes<HTMLElement>) {
    const [flat] = useNaBubbleState('flat');
    return (<RenderedParentCell {...props} cellId={flat.rootId} method='render' type='parent' />);
}

function PreviewRootCell(props: React.HTMLAttributes<HTMLElement>) {
    const [flat] = useNaBubbleState('previewFlat');
    if (!flat) return (<></>);
    return (<PreviewParentCell {...props} cellId={flat.rootId} method='preview' type='parent' />);
}

function EditorRootCell(props: React.HTMLAttributes<HTMLElement>) {
    const [flat] = useNaBubbleState('flat');
    return (<EditorParentCell {...props} cellId={flat.rootId} method='editor' type='parent' refs={useRef({})} />);
}

//////// general renderers. register renderers when adding a new bubble.

function RenderedCell(props: StaticCellComponentProps) {
    // const [ flat ] = useNaBubbleState('flat');
    const map: BubbleMap<(props: StaticCellComponentProps) => JSX.Element> = {
        root: RenderedParentCell, //should't be called.
        parent: RenderedParentCell,
        text: RenderedTextCell,
        math: RenderedMathCell,
        code: RenderedCodeCell,
    }
    const RenderedTypedCell = map[props.type];
    return <RenderedTypedCell {...props} />
}

function PreviewCell(props: StaticCellComponentProps) {
    // const [ flat ] = useNaBubbleState('preivewFlat');
    const map: BubbleMap<(props: StaticCellComponentProps) => JSX.Element> = {
        root: PreviewParentCell, //should't be called.
        parent: PreviewParentCell,
        text: PreviewTextCell,
        math: PreviewMathCell,
        code: PreviewCodeCell,
    }
    const PreviewTypedCell = map[props.type];
    return <PreviewTypedCell {...props} />
}

function EditorCell(props: EditorCellComponentProps) {
    const [ flat ] = useNaBubbleState('flat');

    const parentId = flat.record[props.cellId].parentId;
    const evalSiblingId = ()=>(flat.record[parentId || '_'].childrenId || []);

    const map: BubbleMap<(props: EditorCellComponentProps) => JSX.Element> = {
        root: EditorParentCell, //should't be called.
        parent: EditorParentCell,
        text: EditorTextCell,
        math: EditorMathCell,
        code: EditorCodeCell,
    }
    const EditorTypedCell = map[props.type];
    return <div className='editorCellContainer'>
        <SideBlockHelper parentId = { parentId || '_' } cellId = {props.cellId} evalSiblingId = { evalSiblingId } refs={props.refs} dispatch={dispatch} />
        <EditorTypedCell {...props} />
    </div>;
}

export {
    RenderedRootCell, EditorRootCell, PreviewRootCell,
    // RenderedBubble, EditorBubble, PreviewBubble
    RenderedParentCell, EditorParentCell, PreviewParentCell
};