/** Base cell interface which should be contained in every cell. */
export interface CellCommonPart{ id: string };

/** key name for cell type. */
export const cellTypeStr = 'cellType';

/** Cell type discrimination part. */
export interface CellTypePart<T extends string = string>{ [cellTypeStr]: T };

/**
 * The cell type when cell field type F and cellType string T is given.
 * if F, T are not specified, this type indicates the most general type of a cell.
 * 
 * This is used internally before any concrete(union) Cell type is declared; use Cell<cellTypeName> instead on outside.
 */
export type BasicCell<
    F extends Record<string, any> = Record<string, any>,
    T extends string = string
> = CellCommonPart & CellTypePart<T> & F;

// test for type match
// const c : BasicCell = {
//     id: 'aa',
//     cellType: 'text',
//     zz: 'w'
// }