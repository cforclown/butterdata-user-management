
import Joi from 'Joi';
import { FilterNumberAggregations, FilterStringAggregations } from './query';

const SortOrderSchema = Joi.number().valid(1, -1);
export const SortSchema = Joi.object({
  by: Joi.string(),
  order: SortOrderSchema
});

export const QueryFilterNumberSchema = Joi.string().valid(...FilterNumberAggregations);
export const QueryFilterStringSchema = Joi.string().valid(...FilterStringAggregations);
export const QueryFilterSchema = Joi.object({
  aggregation: Joi.string().allow(QueryFilterNumberSchema, QueryFilterStringSchema),
  value: Joi.any()
});

export const QueryFiltersSchema = Joi.object({
  filters: Joi.alternatives().try(QueryFilterSchema, Joi.link('query-filters')),
  operation: Joi.string().valid('AND', 'OR')
}).id('query-filters');

export const PaginationSchema = Joi.object({
  page: Joi.number().required(),
  limit: Joi.number().required(),
  sort: SortSchema
});

export const QuerySchema = Joi.object({
  query: Joi.string().allow(null).allow('').default(''),
  pagination: PaginationSchema.required(),
  sorts: Joi.object().pattern(Joi.string(), SortOrderSchema),
  filters: Joi.array().items(QueryFiltersSchema),
  groups: Joi.array().items(Joi.string())
});
