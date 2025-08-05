/*
 * adonis-api-resources
 *
 * (c) Boris Abramov <boris@rykantas.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { PaginatedData, PaginatedODMData, PaginatedORMData, Processor } from '#common/types'
import CollectionProcessor from '#processors/collection'

export default class PaginatedProcessor implements Processor {
  constructor(private collectionProcessor: CollectionProcessor) {}

  private extractCollection(data: PaginatedORMData | PaginatedODMData): object[] {
    return 'rows' in data ? data.rows : data.data
  }

  private extractMeta(data: PaginatedORMData | PaginatedODMData) {
    if ('getMeta' in data) {
      if (typeof data.getMeta === 'function') {
        return data.getMeta()
      } else {
        return data.meta
      }
    } else return {}
  }

  pick(data: PaginatedORMData | PaginatedODMData, ...keys: string[]): PaginatedData {
    return {
      meta: this.extractMeta(data),
      data: this.collectionProcessor.pick(this.extractCollection(data), ...keys),
    }
  }

  omit(data: PaginatedORMData | PaginatedODMData, ...keys: string[]): PaginatedData {
    return {
      meta: this.extractMeta(data),
      data: this.collectionProcessor.omit(this.extractCollection(data), ...keys),
    }
  }

  remap(data: PaginatedORMData | PaginatedODMData, defineMap: Function): PaginatedData {
    return {
      meta: this.extractMeta(data),
      data: this.collectionProcessor.remap(this.extractCollection(data), defineMap),
    }
  }
}
