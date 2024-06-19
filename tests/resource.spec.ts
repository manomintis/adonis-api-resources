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

const resultRefineEntity: any = new TestResourceResource(testObjectEntity).refine()
const resultRefineCollection: any = new TestResourceResource(testObjectCollection).refine()
const resultRefineLucidPaginated: any = new TestResourceResource(testObjectPaginated).refine()
const resultRefinedPaginated: any = new TestResourceResource(testObjectCollection).refinePaginate(
  1,
  4
)
const resultRefinedPaginated2: any = new TestResourceResource(testObjectCollection).refinePaginate(
  2,
  4
)

const resultPickEntity: any = new TestResourceResource(testObjectEntity).pick('firstName').get()
const resultPickCollection: any = new TestResourceResource(testObjectCollection)
  .pick('firstName')
  .get()
const resultPickPaginated: any = new TestResourceResource(testObjectPaginated)
  .pick('firstName')
  .get()

const resultOmitEntity: any = new TestResourceResource(testObjectEntity).omit('firstName').get()
const resultOmitCollection: any = new TestResourceResource(testObjectCollection)
  .omit('firstName')
  .get()
const resultOmitPaginated: any = new TestResourceResource(testObjectPaginated)
  .omit('firstName')
  .get()

test.group('Resource', () => {
  test('test_entity', ({ assert }) => {
    assert.equal(resultRefineEntity.fullName, 'John Doe')
  })
  test('test_collection', ({ assert }) => {
    assert.equal(resultRefineCollection[0].fullName, 'John Doe')
    assert.equal(resultRefineCollection[1].fullName, 'Jane Doe')
  })
  test('test_pagination', ({ assert }) => {
    assert.equal(resultRefineLucidPaginated.data[0].fullName, 'John Doe')
    assert.equal(resultRefineLucidPaginated.data[1].fullName, 'Jane Doe')
    assert.equal(resultRefineLucidPaginated.meta.currentPage, 1)
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

  test('test_pick_entity', ({ assert }) => {
    assert.equal(resultPickEntity.firstName, 'John')
    assert.equal(resultPickEntity.lastName, undefined)
  })
  test('test_pick_collection', ({ assert }) => {
    assert.equal(resultPickCollection[0].firstName, 'John')
    assert.equal(resultPickCollection[0].lastName, undefined)
  })
  test('test_pick_collection_paginated', ({ assert }) => {
    assert.equal(resultPickPaginated.data[0].firstName, 'John')
    assert.equal(resultPickPaginated.data[0].lastName, undefined)
    assert.equal(resultPickPaginated.meta.currentPage, 1)
  })

  test('test_omit_entity', ({ assert }) => {
    assert.equal(resultOmitEntity.firstName, undefined)
    assert.equal(resultOmitEntity.lastName, 'Doe')
  })
  test('test_omit_collection', ({ assert }) => {
    assert.equal(resultOmitCollection[0].firstName, undefined)
    assert.equal(resultOmitCollection[0].lastName, 'Doe')
  })
  test('test_pick_collection_paginated', ({ assert }) => {
    assert.equal(resultOmitPaginated.data[0].firstName, undefined)
    assert.equal(resultOmitPaginated.data[0].lastName, 'Doe')
    assert.equal(resultOmitPaginated.meta.currentPage, 1)
  })
})
