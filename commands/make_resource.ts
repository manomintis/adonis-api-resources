/*
 * adonis-api-resources
 *
 * (c) Boris Abramov <boris@ideainc.eu>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { BaseCommand, args } from '@adonisjs/core/ace'
import { stubsRoot } from '../stubs/main.js'

export default class MakeResource extends BaseCommand {
  static commandName = 'make:resource'
  static description = 'Create a new API resource class'

  @args.string({
    description: 'The name of the resource',
  })
  declare name: string

  async run(): Promise<void> {
    const codemods = await this.createCodemods()
    await codemods.makeUsingStub(stubsRoot, 'main.stub', {
      entity: this.app.generators.createEntity(this.name),
    })
  }
}
