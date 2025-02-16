/*
 * adonis-api-resources
 *
 * (c) Boris Abramov <boris@ideainc.eu>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export abstract class Resource {
  constructor(private data: any) {}

  abstract defineMap(data: any): object

  private isPaginated(): boolean {
    return 'rows' in this.data && 'currentPage' in this.data
  }

  private isCollection(): boolean {
    return Array.isArray(this.data)
  }

  private parsePaginated(meta: object, data: object): object {
    return {
      meta: meta,
      data: data,
    }
  }

  private redefineEntity(data: any): object {
    return this.defineMap(data)
  }

  private redefineCollection(data: any[]): object {
    return data.map((item) => {
      return this.redefineEntity(item)
    })
  }

  private pickEntity(entity: object, keys: string[]) {
    return Object.assign({}, ...keys.map((key) => ({ [key]: (entity as any)[key] })))
  }

  private pickCollection(data: object[], keys: string[]) {
    let result = []
    for (let entity of data) {
      result.push(this.pickEntity(entity, keys))
    }
    return result
  }

  private omitEntity(entity: object, keys: string[]) {
    const exclude = new Set(keys)
    const o =
      'serialize' in entity && typeof entity.serialize === 'function' ? entity.serialize() : entity
    return Object.fromEntries(Object.entries(o).filter((e) => !exclude.has(e[0])))
  }

  private omitCollection(data: object[], keys: string[]) {
    let result = []
    for (let entity of data) {
      result.push(this.omitEntity(entity, keys))
    }
    return result
  }

  pick(...keys: string[]): this {
    if (this.isPaginated()) {
      this.data = this.parsePaginated(
        (this.data as any).getMeta(),
        this.pickCollection((this.data as any).rows, keys)
      )
    } else if (this.isCollection()) {
      this.data = this.pickCollection(this.data, keys)
    } else {
      this.data = this.pickEntity(this.data, keys)
    }
    return this
  }

  omit(...keys: string[]): this {
    if (this.isPaginated()) {
      this.data = this.parsePaginated(
        (this.data as any).getMeta(),
        this.omitCollection((this.data as any).rows, keys)
      )
    } else if (this.isCollection()) {
      this.data = this.omitCollection(this.data, keys)
    } else {
      this.data = this.omitEntity(this.data, keys)
    }
    return this
  }

  redefine(): this {
    if (this.isPaginated()) {
      this.data = this.parsePaginated(
        (this.data as any).getMeta(),
        this.redefineCollection((this.data as any).rows)
      )
    } else if (this.isCollection()) {
      this.data = this.redefineCollection(this.data)
    } else {
      this.data = this.redefineEntity(this.data)
    }
    return this
  }

  refine(): object {
    return this.redefine().get()
  }

  refinePaginate(page: number = 1, limit: number = 10): object {
    return this.redefine().paginate(page, limit)
  }

  paginate(page: number = 1, limit: number = 10) {
    let lastPage = Math.max(Math.ceil(this.data.length / limit), 1)
    interface PaginationMeta {
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
    const meta: PaginationMeta = {
      total: this.data.length,
      perPage: Math.floor(limit),
      currentPage: Math.floor(page),
      lastPage: lastPage,
      firstPage: 1,
      firstPageUrl: '/?page=1',
      lastPageUrl: '/?page=' + lastPage,
      nextPageUrl: page < lastPage ? `/?page=${page + 1}` : null,
      previousPageUrl: page > 1 ? `/?page=${page - 1}` : null,
    }
    const collection = this.data.slice((page - 1) * limit, page * limit)
    this.data = {
      meta: meta,
      data: collection,
    }
    return this.data
  }

  get() {
    return this.data
  }
}
