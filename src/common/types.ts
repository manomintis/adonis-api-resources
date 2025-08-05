/*
 * adonis-api-resources
 *
 * (c) Boris Abramov <boris@rykantas.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export type Data = object | object[]

export interface Processor {
  pick: Function
  omit: Function
  remap: Function
}

export interface PaginationMeta {
  total: number
  perPage: number
  currentPage: number
  lastPage: number
  firstPage: number
  firstPageUrl: string
  lastPageUrl: string
  nextPageUrl: string | null
  previousPageUrl: string | null
}

export interface PaginatedORMData {
  rows: object[]
  meta: PaginationMeta
}

export interface PaginatedODMData {
  data: object[]
  meta: PaginationMeta
}

export interface PaginatedData {
  data: object[]
  meta: PaginationMeta
}
