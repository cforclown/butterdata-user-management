import { Model } from 'mongoose';
import { pagination, sort } from '../mongoose-utils';
import { IExploreQueryPayload, IExploreQueryResponse } from './exploration.types';
import { IMongoQueryFilters } from './query/filters/filters';

export const constructExploreResponse = (query: IExploreQueryPayload, data: any[], pageCount: number): IExploreQueryResponse => ({
  data,
  query: {
    ...query,
    pagination: {
      ...query.pagination,
      pageCount
    }
  }
});

export const exploreResource = async <T>(
  model: Model<T>,
  query: IExploreQueryPayload,
  populates: Record<string, any>[],
  match: IMongoQueryFilters,
  select?: Record<string, number>,
  excludeArchived: boolean = true
): Promise<IExploreQueryResponse> => {
  const result = await model
    .aggregate([
      ...populates,
      {
        $match: excludeArchived
          ? Object.assign(match, {
            archived: false
          })
          : match
      },
      sort(query.pagination.sort.by, query.pagination.sort.order),
      pagination(query.pagination, select)
    ])
    .exec();

  const response = constructExploreResponse(query, [], 0);
  if (result[0].metadata.length && result[0].data.length) {
    response.data = result[0].data;
    response.query.pagination.pageCount = Math.ceil(result[0].metadata[0].total / query.pagination.limit);
  }

  return response;
};
