import { Resource } from '../src/resource.js'
import { test } from '@japa/runner'

class TestResourceResource extends Resource {
  defineMap(data: any): object {
    return {
      fullName: data.firstName + ' ' + data.lastName,
      firstName: data.firstName,
      lastName: data.lastName,
    }
  }
}

const testObjectEntity = {
  firstName: 'John',
  lastName: 'Doe',
}

const resultRefineEntity: any = new TestResourceResource(testObjectEntity).refine()
const resultPickEntity: any = new TestResourceResource(testObjectEntity).pick('firstName').get()
const resultOmitEntity: any = new TestResourceResource(testObjectEntity).omit('firstName').get()

test.group('Entity', () => {
  test('test_entity', ({ assert }) => {
    assert.equal(resultRefineEntity.fullName, 'John Doe')
  })
  test('test_pick_entity', ({ assert }) => {
    assert.equal(resultPickEntity.firstName, 'John')
    assert.equal(resultPickEntity.lastName, undefined)
  })
  test('test_omit_entity', ({ assert }) => {
    assert.equal(resultOmitEntity.firstName, undefined)
    assert.equal(resultOmitEntity.lastName, 'Doe')
  })
})
