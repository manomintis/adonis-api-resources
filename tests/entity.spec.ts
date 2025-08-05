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

const resultRefineEntity: any = new TestResourceResource(testObjectEntity).remap()
const resultPickEntity: any = new TestResourceResource(testObjectEntity).pick('firstName')
const resultOmitEntity: any = new TestResourceResource(testObjectEntity).omit('firstName')

test.group('Entity', () => {
  test('test_entity', ({ assert }) => {
    const data = (resultRefineEntity as any).toJSON()
    assert.equal(data.fullName, 'John Doe')
  })
  test('test_pick_entity', ({ assert }) => {
    const data = (resultPickEntity as any).toJSON()
    assert.equal(data.firstName, 'John')
    assert.equal(data.lastName, undefined)
  })
  test('test_omit_entity', ({ assert }) => {
    const data = (resultOmitEntity as any).toJSON()
    assert.equal(data.firstName, undefined)
    assert.equal(data.lastName, 'Doe')
  })
  test('test_paginate_entity_error', ({ assert }) => {
    assert.throws(() => {
      new TestResourceResource(testObjectEntity).paginate()
    }, 'Pagination requires an array of objects')
  })
  test('test_refine_paginate_entity_error', ({ assert }) => {
    assert.throws(() => {
      new TestResourceResource(testObjectEntity).refinePaginate()
    }, 'Pagination requires an array of objects')
  })
  test('test_backward_compatibility_methods', ({ assert }) => {
    const resource = new TestResourceResource(testObjectEntity)

    // Test redefine() method
    const redefined = resource.redefine()
    const data1 = (redefined as any).toJSON()
    assert.equal(data1.fullName, 'John Doe')

    // Test get() method
    const gotten = new TestResourceResource(testObjectEntity).get()
    assert.equal(typeof gotten, 'object')

    // Test refine() method
    const refined = new TestResourceResource(testObjectEntity).refine()
    const data2 = (refined as any).toJSON()
    assert.equal(data2.fullName, 'John Doe')
  })
})
