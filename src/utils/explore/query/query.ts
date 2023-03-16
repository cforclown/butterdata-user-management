export enum SortOrders {
  ASC = -1,
  DESC = 1
}

export interface IPaginationSort {
  by: string;
  order: SortOrders;
}

export interface IPaginationPayload {
  page: number;
  limit: number;
  sort: IPaginationSort;
}

export interface IPaginationResponse extends IPaginationPayload {
  pageCount: number;
}

export const FilterNumberAggregations = ['<', '≤', '=', '≥', '>'] as const;
export type FilterNumberAggregationTypes = (typeof FilterNumberAggregations)[number];
export const isFilterNumberAggregationType = (type: any): type is FilterNumberAggregationTypes => FilterNumberAggregations.includes(type);

export const FilterStringAggregations = ['MATCHES_ANY', 'CONTAINS_ANY', 'STARTS_WITH_ANY', 'EXCLUDE_ALL'] as const;
export type FilterStringAggregationTypes = (typeof FilterStringAggregations)[number];
export const isFilterStringAggregationType = (type: any): type is FilterNumberAggregationTypes => FilterStringAggregations.includes(type);

export interface IFilter {
  aggregation: FilterNumberAggregationTypes | FilterStringAggregationTypes,
  value: any
}
export interface IFilters {
  filters: Record<string, IFilter>;
  operation?: 'AND' | 'OR' // if undefined, operation will be threated as 'AND'
}

export interface IQuery {

}

export interface IExploreQueryPayload {
  pagination: IPaginationPayload;
  sorts?: Record<string, SortOrders>;
  filters?: IFilters[];
  groups?: string[];
}

export interface IExploreQueryResponse {
  data: any[];
  query: IExploreQueryPayload & {
    pagination: IPaginationResponse
  };
};
