import { FilterNumberAggregations, FilterStringAggregations } from './query';

const queryFilterNumber = {
  type: 'string',
  enum: FilterNumberAggregations
};

const queryFilterString = {
  type: 'string',
  enum: FilterStringAggregations
};

const queryFilter = {
  aggregation: {
    type: {
      oneOf: [
        { '#ref': '#/components/schemas/queryFilterNumber' },
        { '#ref': '#/components/schemas/queryFilterString' }
      ]
    }
  },
  value: {
    oneOf: [
      { type: 'string' },
      { type: 'number' },
      { type: 'object' }
    ]
  }
};

const queryFilters = {
  filters: {
    type: {
      oneOf: [
        { '#ref': '#/components/schemas/queryFilter' },
        { '#ref': '#/components/schemas/queryFilters' }
      ]
    }
  },
  operation: {
    type: 'string',
    enum: ['AND', 'OR']
  }
};

const queryPagination = {
  page: { type: 'integer' },
  limit: { type: 'integer' },
  sort: {
    type: 'object',
    properties: {
      by: { type: 'string' },
      order: {
        type: 'integer',
        enum: [1, -1]
      }
    }
  }
};

const queryShort = { type: 'integer', enum: [1, -1] };

export const query = {
  query: { type: 'string' },
  pagination: { '#ref': '#/components/schemas/queryPagination' },
  sorts: {
    type: 'object',
    additionalProperties: { '#ref': '#/components/schemas/queryShort' }
  },
  filters: { '#ref': '#/components/schemas/queryFilters' },
  groups: {
    type: 'array',
    items: { type: 'string' }
  }
};

export default {
  queryPagination,
  queryShort,
  queryFilterNumber,
  queryFilterString,
  queryFilter,
  queryFilters,
  query
};
