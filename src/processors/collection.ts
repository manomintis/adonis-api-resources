/*
 * adonis-api-resources
 *
 * (c) Boris Abramov <boris@rykantas.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Processor } from '#common/types'
import { pick as pickEntity, omit as omitEntity } from '#utils/parsers'

export default class CollectionProcessor implements Processor {
  pick(data: object[], ...keys: string[]) {
    let result = []
    for (let entity of data) {
      result.push(pickEntity(entity, keys))
    }
    return result
  }

  omit(data: object[], ...keys: string[]) {
    let result = []
    for (let entity of data) {
      result.push(omitEntity(entity, keys))
    }
    return result
  }

  remap(data: object[], defineMap: Function): object[] {
    return data.map((item) => {
      return defineMap(item)
    })
  }
}
