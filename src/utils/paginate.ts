/*
 * adonis-api-resources
 *
 * (c) Boris Abramov <boris@rykantas.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { PaginatedData, PaginationMeta } from '../common/types.js'

export const paginate = (data: object[], page: number, limit: number): PaginatedData => {
  const lastPage = Math.max(Math.ceil(data.length / limit), 1)
  const meta: PaginationMeta = {
    total: data.length,
    perPage: Math.floor(limit),
    currentPage: Math.floor(page),
    lastPage: lastPage,
    firstPage: 1,
    firstPageUrl: '/?page=1',
    lastPageUrl: '/?page=' + lastPage,
    nextPageUrl: page < lastPage ? `/?page=${page + 1}` : null,
    previousPageUrl: page > 1 ? `/?page=${page - 1}` : null,
  }
  const collection = data.slice((page - 1) * limit, page * limit)
  return {
    meta: meta,
    data: collection,
  }
}
