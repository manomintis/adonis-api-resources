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

const testObjectCollection = [
  {
    firstName: 'John',
    lastName: 'Doe',
    serialize: () => {
      return {
        firstName: 'John',
        lastName: 'Doe',
      }
    },
  },
  {
    firstName: 'Jane',
    lastName: 'Doe',
  },
  {
    firstName: 'John1',
    lastName: 'Doe1',
  },
  {
    firstName: 'Jane1',
    lastName: 'Doe1',
  },
  {
    firstName: 'John2',
    lastName: 'Doe2',
  },
  {
    firstName: 'Jane2',
    lastName: 'Doe2',
  },
  {
    firstName: 'John3',
    lastName: 'Doe3',
  },
  {
    firstName: 'Jane3',
    lastName: 'Doe3',
  },
]

const resultRefineCollection: any = new TestResourceResource(testObjectCollection).redefine()
const resultPickCollection: any = new TestResourceResource(testObjectCollection).pick('firstName')
const resultOmitCollection: any = new TestResourceResource(testObjectCollection).omit('firstName')
const resultPaginatedCollection: any = new TestResourceResource(testObjectCollection).paginate(1, 3)

test.group('Collection', () => {
  test('test_collection', ({ assert }) => {
    const data = (resultRefineCollection as any).toJSON()
    assert.equal(data[0].fullName, 'John Doe')
    assert.equal(data[1].fullName, 'Jane Doe')
  })
  test('test_pick_collection', ({ assert }) => {
    const data = (resultPickCollection as any).toJSON()
    assert.equal(data[0].firstName, 'John')
    assert.equal(data[0].lastName, undefined)
  })
  test('test_omit_collection', ({ assert }) => {
    const data = (resultOmitCollection as any).toJSON()
    assert.equal(data[0].firstName, undefined)
    assert.equal(data[0].lastName, 'Doe')
  })
  test('test_paginate_collection', ({ assert }) => {
    const data = (resultPaginatedCollection as any).toJSON()
    assert.equal(data.data.length, 3)
    assert.equal(data.data[0].firstName, 'John')
    assert.equal(data.meta.currentPage, 1)
    assert.equal(data.meta.total, 8)
  })
  test('test_chaining_methods', ({ assert }) => {
    const result = new TestResourceResource(testObjectCollection).pick('firstName').remap()
    const data = (result as any).toJSON()
    assert.equal(data[0].fullName, 'John undefined')
    assert.equal(data[0].firstName, 'John')
    assert.equal(data[0].lastName, undefined)
  })
  test('test_refine_paginate_collection', ({ assert }) => {
    const result = new TestResourceResource(testObjectCollection).refinePaginate(1, 2)
    const data = (result as any).toJSON()
    assert.equal(data.data.length, 2)
    assert.equal(data.data[0].fullName, 'John Doe')
    assert.equal(data.meta.currentPage, 1)
  })
  test('test_omit_with_serialize', ({ assert }) => {
    // Test omit on object with serialize method
    const result = new TestResourceResource(testObjectCollection).omit('lastName')
    const data = (result as any).toJSON()
    assert.equal(data[0].firstName, 'John')
    assert.equal(data[0].lastName, undefined)
  })
})
