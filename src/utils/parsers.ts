/*
 * adonis-api-resources
 *
 * (c) Boris Abramov <boris@rykantas.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export const pick = (entity: object, keys: string[]) => {
  return Object.assign({}, ...keys.map((key) => ({ [key]: (entity as any)[key] })))
}

export const omit = (entity: object, keys: string[]) => {
  const exclude = new Set(keys)
  const o =
    'serialize' in entity && typeof entity.serialize === 'function' ? entity.serialize() : entity
  return Object.fromEntries(Object.entries(o).filter((e) => !exclude.has(e[0])))
}

export const remap = (data: any, defineMap: Function): object => {
  return defineMap(data)
}
