// Types in this file should be declared AFTER every cell is implemented;
// It should contain every celltype definitions in './cell-types/'

import {
    variantFactory, variantList, VariantOf, fields, TypeNames
} from 'variant'

import {
    CellBase,
    CellFrom, //just for test
    cellTypeStr
} from './types-common'

import { TextCellField } from './cell-types/text'
import { CodeCellField } from './cell-types/code'
import { MathCellField } from './cell-types/math'

export { cellTypeStr };

// some currying, bit dirty...
const cvf = variantFactory(cellTypeStr)
const cv = <F>() => <K extends string>(name: K) => cvf(name, fields<F & CellBase>())
const cellFields = variantList([
    cv<TextCellField>()('text'),
    cv<CodeCellField>()('code'),
    cv<MathCellField>()('math'),
])

/**
 * sum type of 'cellType' field.
 * equivalent to 'text' | 'code' | 'math' | ... | undefined
 */
export type CellType = TypeNames<
     typeof cellFields,
     typeof cellTypeStr
>

/**
 * sum type of fields.
 * equivalent to { id: string, cellType: 'text', value: string } | ...
 * 
 * to narrow cell types, use e.g. Cell<'text'> or Cell<'text' | 'code'>
 * 
 * Cell<'text'> should be compatible with CellFrom<TextCellField, 'text'>.
 * @todo can we force this in compile-time?
 */
export type Cell<T extends CellType = undefined> = VariantOf<typeof cellFields, T, typeof cellTypeStr>

export type CellData = {
    [id: string]: Cell
}