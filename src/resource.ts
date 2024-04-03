/*
 * adonis-api-resources
 *
 * (c) Boris Abramov <boris@ideainc.eu>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export abstract class Resource {
  private data: any

  // Constructor
  constructor(data: object) {
    this.data = data
  }

  // Require explicit map definition
  abstract defineMap(data: any): object

  // Prepare refined object
  refine_entity(data: any): object {
    return this.defineMap(data)
  }

  // Prepare refined collection
  refine_collection(data: any[]): object {
    return data.map((item) => {
      return this.refine_entity(item)
    })
  }

  // Return refined output
  refine(): object {
    if ('rows' in this.data && 'currentPage' in this.data) {
      const meta = (this.data as any).getMeta()
      const collection = this.refine_collection((this.data as any).rows)
      const result = {
        meta: meta,
        data: collection,
      }
      return result
    } else if (Array.isArray(this.data)) {
      return this.refine_collection(this.data)
    }
    return this.refine_entity(this.data)
  }
}
