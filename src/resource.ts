/*
 * adonis-api-resources
 *
 * (c) Boris Abramov <boris@ideainc.eu>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export abstract class Resource {
  protected data: any

  constructor(data: object) {
    this.data = data
  }

  abstract defineMap(data: any): object

  private isPaginated(): boolean {
    return 'rows' in this.data && 'currentPage' in this.data
  }

  private isCollection(): boolean {
    return Array.isArray(this.data)
  }

  private redefineEntity(data: any): object {
    return this.defineMap(data)
  }

  private redefineCollection(data: any[]): object {
    return data.map((item) => {
      return this.redefineEntity(item)
    })
  }

  pick(...keys: string[]): this {
    let result = []
    for (let item of this.data) {
      result.push(Object.assign({}, ...keys.map((key) => ({ [key]: item[key] }))))
    }
    this.data = result
    return this
  }

  omit(...keys: string[]): this {
    let result = []
    const exclude = new Set(keys)
    for (let item of this.data) {
      const o = typeof item.serialize === 'function' ? item.serialize() : item
      result.push(Object.fromEntries(Object.entries(o).filter((e) => !exclude.has(e[0]))))
    }
    this.data = result
    return this
  }

  redefine(): this {
    if (this.isPaginated()) {
      const meta = (this.data as any).getMeta()
      const collection = this.redefineCollection((this.data as any).rows)
      this.data = {
        meta: meta,
        data: collection,
      }
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
    const meta = {
      total: this.data.length,
      perPage: limit,
      currentPage: page,
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
