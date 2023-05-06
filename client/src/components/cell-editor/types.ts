import type { ClassicArticle, BasicCellArticle } from '#common/Article';

import type { Cell } from "#/components/cell-editor/cell";

export type { ClassicArticle };
export type CellArticle = BasicCellArticle<Cell>;
export type Article = ClassicArticle | CellArticle;