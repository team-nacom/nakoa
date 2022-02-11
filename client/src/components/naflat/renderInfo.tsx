import { Flat } from './flat';

// different from FlatContext:
// it should contain autonumbering informations and macros.

interface LabelInfo{
    auto: number[];
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

//autoLabel every cell
function autoLabel(flat: Flat, id?: string, preLabel?: Record<string, LabelInfo>, prefix?: number[]) : Record<string, LabelInfo>{
    if(id === undefined) return {};

    const pLabel = (preLabel === undefined? {} : preLabel);
    const pfix = (prefix === undefined ? [] : prefix);

    let newLabel : Record<string, LabelInfo> = {
        [id] : {
            auto: pfix,
            custom: pLabel[id]?.custom
        }
    };
    flat[id].childIds.forEach((childId, idx)=>{        
        let result = autoLabel(flat, childId, pLabel, [...pfix, idx + 1]);
        newLabel = {...newLabel, ...result};
    });

    return newLabel;
}

export type { RenderInfo };
export { autoLabel };