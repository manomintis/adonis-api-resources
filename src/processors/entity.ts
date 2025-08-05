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

export default class EntityProcessor implements Processor {
  pick(data: object, ...keys: string[]): object {
    return pickEntity(data, keys)
  }

  omit(data: object, ...keys: string[]): object {
    return omitEntity(data, keys)
  }

  remap(data: object, defineMap: Function): object {
    return defineMap(data)
  }
}
