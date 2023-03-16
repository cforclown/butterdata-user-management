import { IFilters } from './query/filters/filters';
import { IPaginationPayload, IPaginationResponse, IPaginationSortOrders } from './pagination';

export interface IExploreQueryPayload {
  pagination: IPaginationPayload;
  sorts?: Record<string, IPaginationSortOrders>;
  filters?: IFilters[];
  groups?: string[];
}

export interface IExploreQueryResponse {
  data: any[];
  query: IExploreQueryPayload & {
    pagination: IPaginationResponse
  };
};
