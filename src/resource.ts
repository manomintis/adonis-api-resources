/*
 * adonis-api-resources
 *
 * (c) Boris Abramov <boris@rykantas.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { type Data, Processor } from './common/types.js'
import EntityProcessor from './processors/entity.js'
import CollectionProcessor from './processors/collection.js'
import PaginatedProcessor from './processors/paginated.js'
import { paginate } from './utils/paginate.js'

export abstract class Resource {
  constructor(private data: Data) {}

  private _processor?: Processor

  abstract defineMap(data: object): object

  private isPaginated(data: Data): boolean {
    const ormPaginated = 'rows' in data && 'currentPage' in data
    const odmPaginated = 'data' in data && 'meta' in data
    const indeedPaginated = ormPaginated || odmPaginated
    if (odmPaginated) (data as any).getMeta = () => (data as any).meta
    return indeedPaginated
  }

  private isCollection(data: Data): boolean {
    return Array.isArray(data)
  }

  private processor(): Processor {
    if (!this._processor) {
      if (this.isPaginated(this.data)) {
        this._processor = new PaginatedProcessor(new CollectionProcessor())
      } else if (this.isCollection(this.data)) {
        this._processor = new CollectionProcessor()
      } else {
        this._processor = new EntityProcessor()
      }
    }
    return this._processor
  }

  pick(...keys: string[]) {
    const processor = this.processor()
    this.data = processor.pick(this.data, ...keys)
    return this
  }

  omit(...keys: string[]): this {
    const processor = this.processor()
    this.data = processor.omit(this.data, ...keys)
    return this
  }

  remap(): this {
    const processor = this.processor()
    this.data = processor.remap(this.data, this.defineMap)
    return this
  }

  paginate(page: number = 1, limit: number = 10): this {
    if (!this.isCollection(this.data)) {
      throw new Error('Pagination requires an array of objects')
    }
    this.data = paginate(this.data as Array<object>, page, limit)
    return this
  }

  // Obsolete methods for backward compatibility
  redefine(): this {
    return this.remap()
  }
  get(): this {
    return this
  }
  refine(): this {
    return this.remap()
  }
  refinePaginate(page: number = 1, limit: number = 10): this {
    return this.remap().paginate(page, limit)
  }
}

;(Resource.prototype as any).toJSON = function () {
  return (this as any).data
}
