import { IPaginationPayload } from './explore/query/query';

export const lookup = (resource: string, field: string, refField?: string): any => ({
  $lookup: {
    from: resource,
    localField: field,
    foreignField: refField ?? '_id',
    as: field
  }
});

export const unwind = (field: string): any => ({ $unwind: '$' + field });

export const match = (matches: Record<string, any>): any => ({
  $match: matches
});

export const matchAny = (query?: string): any => ({
  $regex: query ?? '',
  $options: 'i'
});

export const sort = (by: string, order: number): any => ({
  $sort: {
    [by]: order
  }
});

export const pagination = (paginationPayload: IPaginationPayload, select?: Record<string, number>): any => {
  const data = [
    { $skip: (paginationPayload.page - 1) * paginationPayload.limit },
    { $limit: paginationPayload.limit },
    {
      $project: select
    }
  ];
  if (select) {
    data.push({ $project: select });
  }

  return {
    $facet: {
      metadata: [
        { $count: 'total' },
        { $addFields: { page: paginationPayload.page } }
      ],
      data
    }
  };
};
