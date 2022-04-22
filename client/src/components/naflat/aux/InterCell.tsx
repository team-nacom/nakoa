import React from 'react';
import { maxDepth } from '../component';
import { Flat, CellType, defaultCellType } from '../flat';
import { FlatContext } from '../state';

interface AddCellButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    parentId: string,
    pos: number,
    depth: number,
}

function AddContentCellButton({ parentId, pos, ...others }: AddCellButtonProps) {
    const { state, dispatch } = React.useContext(FlatContext);

    return (
        <button className='addContentCellButton material-icons'
            onClick={(ev) => { ev.stopPropagation(); dispatch({ type: 'createEmpty', parentId, pos, cellType: defaultCellType }) }}>
            add_box
        </button>
    )
}

function AddSectionCellButton({ parentId, pos, ...others }: AddCellButtonProps) {
    const { state, dispatch } = React.useContext(FlatContext);

    return (
        <button className='addSectionCellButton material-icons'
            onClick={(ev) => { ev.stopPropagation(); dispatch({ type: 'createEmpty', parentId, pos, cellType: 'section' }) }}>
            list_alt
        </button>
    )
}

function InterCell(props: AddCellButtonProps) {
    let depth = props.depth;
    let isSectionCreationAllowed = depth <= maxDepth
    return (
        <div className='interBlockHelper'>
            <hr/> {/* only for css */}
            <div className='addButtonsWrapper'>
                <AddContentCellButton {...props} />
                {isSectionCreationAllowed &&
                    <AddSectionCellButton {...props} />
                }
            </div>
        </div>
    )
}

export default InterCell;