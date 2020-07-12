import { PaginationOptions } from '../../graphql';

export const normalizePaginationOptions = (
  paginationOptions?: Partial<PaginationOptions>,
  defaultLimit?: number,
): Required<PaginationOptions> => {
  if (!paginationOptions) paginationOptions = {};

  const offset =
    paginationOptions.offset && paginationOptions.offset >= 0
      ? paginationOptions.offset
      : 0;

  const maxLimit = defaultLimit || 30;
  const limit =
    paginationOptions.limit < maxLimit && paginationOptions.limit >= 0
      ? paginationOptions.limit
      : maxLimit;

  return { offset, limit };
};
