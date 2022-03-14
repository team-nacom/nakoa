import { Flat, CellType } from './flat';

// different from FlatContext:
// it should contain autonumbering informations and macros.

interface LabelInfo{
    auto: number[];
    autoType: number[];
    custom?: string;
}

interface RenderInfo{
    label: Record<string, LabelInfo>;
    refs: Record<string, string>;
    macros: {
        math: Object;
        text: Object;
    }
}

/**
 * update auto label of every cell
 * @param flat reference flat.
 * @param id root id to start with.
 * @param preLabel previous label object.
 * @param prefixAll number array used to enumerate 'all cell count.'
 * @param prefixType number array used to enumerate 'same type cell count.'
 * @returns new label object.
 */
function autoLabel(flat: Flat, id?: string, preLabel?: Record<string, LabelInfo>, prefixAll?: number[], prefixType?: number[]) : Record<string, LabelInfo>{
    if(id === undefined) return {};

    const pLabel = (preLabel === undefined? {} : preLabel);
    const pfixAll = (prefixAll === undefined ? [] : prefixAll);
    const pfixType = (prefixType === undefined ? [] : prefixType);

    let newLabel : Record<string, LabelInfo> = {
        [id] : {
            auto: pfixAll,
            autoType: pfixType,
            custom: pLabel[id]?.custom
        }
    };

    flat[id].childIds.reduce((acc : Record<string, number>, childId, idx)=>{
        const cell = flat[childId];
        let countType = cell.type;
        // may have additional if statements, like...
        // if ( cell.type === 'block' && cell.value.blockType === 'theorem' ){
        //      countType = 'block-theorem';
        // }
        const typedIdx = acc[countType] = (acc[countType] || 0) + 1;
        
        let result = autoLabel(
            flat, childId, pLabel,
            [...pfixAll, idx + 1], // all cell count
            [...pfixType, typedIdx] // same type cell count
        );
        newLabel = {...newLabel, ...result};

        return acc;
    }, {})

    return newLabel;
}

export type { RenderInfo };
export { autoLabel };