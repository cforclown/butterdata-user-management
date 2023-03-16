export const FilterNumberAggregations = ['<', '≤', '=', '≥', '>'] as const;
export type FilterNumberAggregationTypes = (typeof FilterNumberAggregations)[number];
export const isFilterNumberAggregationType = (type: any): type is FilterNumberAggregationTypes => FilterNumberAggregations.includes(type);

export const FilterStringAggregations = ['MATCHES_ANY', 'CONTAINS_ANY', 'STARTS_WITH_ANY', 'EXCLUDE_ALL'] as const;
export type FilterStringAggregationTypes = (typeof FilterStringAggregations)[number];
export const isFilterStringAggregationType = (type: any): type is FilterNumberAggregationTypes => FilterStringAggregations.includes(type);

export interface IFilter {
  field: string;
  aggregation: FilterNumberAggregationTypes | FilterStringAggregationTypes;
  value: any;
}

export type IFilters = [IFilter]

export interface IMongoQueryFilter {
  $regex: string,
  $options: 'i'
}

export interface IMongoAndFilter {
  '$and': Record<string, IMongoQueryFilter>[]
}

export interface IMongoOrFilter {
  '$or': Record<string, IMongoQueryFilter>[]
}

export type IMongoQueryFilters = Record<string, any> | IMongoAndFilter | IMongoOrFilter;

export const MongoMatchNumberAggregations: Record<FilterNumberAggregationTypes, string> = {
  '<': '$lt',
  '≤': '$lte',
  '=': '$lte',
  '≥': '$gte',
  '>': '$gt'
};

export const MongoMatchStringAggregations: Record<FilterStringAggregationTypes, string> = {
  MATCHES_ANY: '$lt',
  CONTAINS_ANY: '$lte',
  STARTS_WITH_ANY: '$lte',
  EXCLUDE_ALL: '$gte'
};

export const constructMongoFilters = (filters: IFilters): IMongoQueryFilters => {
  let [{ field, aggregation, value }] = filters;
  if (isFilterNumberAggregationType(aggregation)) {
    return {
      [field]: {
        [MongoMatchNumberAggregations[aggregation]]: value
      }
    };
  }
  if (isFilterStringAggregationType(aggregation)) {
    value = aggregation === 'CONTAINS_ANY'
      ? {
        $regex: value,
        $options: 'i'
      }
      : value;
    return {
      [field]: {
        [MongoMatchNumberAggregations[aggregation]]: value
      }
    };
  }

  return {};
};
