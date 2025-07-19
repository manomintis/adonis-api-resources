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

class ObjectPaginated {
  currentPage = 1
  rows = testObjectCollection
  getMeta() {
    return { currentPage: 1 }
  }
}

const testObjectPaginated = new ObjectPaginated()

const resultRefineORMPaginated: any = new TestResourceResource(testObjectPaginated).refine()
const resultRefinedPaginated: any = new TestResourceResource(testObjectPaginated).refinePaginate(
  1,
  4
)
const resultRefinedPaginated2: any = new TestResourceResource(testObjectPaginated).refinePaginate(
  2,
  4
)

const resultPickPaginated: any = new TestResourceResource(testObjectPaginated)
  .pick('firstName')
  .get()

const resultOmitPaginated: any = new TestResourceResource(testObjectPaginated)
  .omit('firstName')
  .get()

test.group('ORM paginated', () => {
  test('test_pagination', ({ assert }) => {
    assert.equal(resultRefineORMPaginated.data[0].fullName, 'John Doe')
    assert.equal(resultRefineORMPaginated.data[1].fullName, 'Jane Doe')
    assert.equal(resultRefineORMPaginated.meta.currentPage, 1)
  })
  test('test_refine_pagination', ({ assert }) => {
    assert.equal(resultRefinedPaginated.data[0].fullName, 'John Doe')
    assert.equal(resultRefinedPaginated.data[1].fullName, 'Jane Doe')
    assert.equal(resultRefinedPaginated.meta.currentPage, 1)
  })
  test('test_refine_pagination2', ({ assert }) => {
    assert.equal(resultRefinedPaginated2.data[0].fullName, 'John2 Doe2')
    assert.equal(resultRefinedPaginated2.data[1].fullName, 'Jane2 Doe2')
    assert.equal(resultRefinedPaginated2.meta.currentPage, 2)
  })
  test('test_pick_collection_paginated', ({ assert }) => {
    assert.equal(resultPickPaginated.data[0].firstName, 'John')
    assert.equal(resultPickPaginated.data[0].lastName, undefined)
    assert.equal(resultPickPaginated.meta.currentPage, 1)
  })
  test('test_pick_collection_paginated', ({ assert }) => {
    assert.equal(resultOmitPaginated.data[0].firstName, undefined)
    assert.equal(resultOmitPaginated.data[0].lastName, 'Doe')
    assert.equal(resultOmitPaginated.meta.currentPage, 1)
  })
})
