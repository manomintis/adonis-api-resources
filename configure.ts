/*
 * adonis-api-resources
 *
 * (c) Boris Abramov <boris@ideainc.eu>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import ConfigureCommand from '@adonisjs/core/commands/configure'
import fs from 'node:fs'

export async function configure(_command: ConfigureCommand) {
  const codemods = await _command.createCodemods()

  // Create "make" command
  try {
    await codemods.updateRcFile((rcFile) => {
      rcFile.addCommand('adonis-api-resources/commands')
    })
  } catch (error) {
    console.error('Unable to update adonisrc.ts file')
    console.error(error)
  }

  /**
   * Update JSON configuration files to create "resources" namespace
   * @param {string} configName - JSON configuration file name ("package.json" only)
   * @returns {void} - No output
   */
  function updateConfig(configName: 'package.json'): void {
    const generalErrorText = 'Failed to create #resources namespace'
    const alreadyErrorText = 'Namespace #resources already exists in '
    fs.readFile('./' + configName, 'utf-8', (err, jsonData) => {
      if (err) {
        console.log(generalErrorText, err)
      } else {
        try {
          let data = JSON.parse(
            // Prevent parsing failure by removing JSON invalid trailing commas, often present in tsconfig.json
            jsonData.replace(/(?<=(true|false|null|["\d}\]])\s*),(?=\s*[}\]])/g, '')
          )
          switch (configName) {
            case 'package.json':
              if (data.imports?.['#resources/*'] !== undefined) {
                console.log(alreadyErrorText + configName)
              } else {
                data['imports']['#resources/*'] = './app/resources/*.js'
              }
              break
          }
          fs.writeFile(
            './' + configName,
            JSON.stringify(data, null, 2)
              .replace(/(\[\n\ +\")/gm, '["')
              .replace(/(\"\n\ +\])/gm, '"]'),
            (error) => {
              if (error) {
                console.log(generalErrorText, error)
              }
            }
          )
        } catch (error) {
          console.log(generalErrorText, error)
        }
      }
    })
  }

  // Create "resources" namespace
  updateConfig('package.json')
}
