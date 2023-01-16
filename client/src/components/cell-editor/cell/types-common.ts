// Types in this file should be declared BEFORE every cell is implemented
// so that each celltype definition can refer to these types.

/** Base cell interface which should be contained in every cell. */
export interface CellBase{
    id: string;
}

/** key name for cell type. */
export const cellTypeStr = 'cellType'

/**
 * The full cell type when cell field type F is given.
 * This is used internally before any concrete(union) Cell type is declared; use Cell<cellTypeName> instead on outside.
 */
export type CellFrom<F, T extends string> = { [cellTypeStr]: T } & F & CellBase
