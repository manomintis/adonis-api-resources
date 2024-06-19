import { serialize } from 'node:v8'
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

const resultEntity: any = new TestResourceResource(testObjectEntity).refine()
const resultCollection: any = new TestResourceResource(testObjectCollection).refine()
const resultPaginated: any = new TestResourceResource(testObjectPaginated).refine()
const resultRefinedPaginated: any = new TestResourceResource(testObjectCollection).refinePaginate(
  1,
  4
)
const resultRefinedPaginated2: any = new TestResourceResource(testObjectCollection).refinePaginate(
  2,
  4
)
const resultPick: any = new TestResourceResource(testObjectCollection).pick('firstName')
const resultOmit: any = new TestResourceResource(testObjectCollection).omit('firstName')

test.group('Resource', () => {
  test('test_entity', ({ assert }) => {
    assert.equal(resultEntity.fullName, 'John Doe')
  })
  test('test_collection', ({ assert }) => {
    assert.equal(resultCollection[0].fullName, 'John Doe')
    assert.equal(resultCollection[1].fullName, 'Jane Doe')
  })
  test('test_pagination', ({ assert }) => {
    assert.equal(resultPaginated.data[0].fullName, 'John Doe')
    assert.equal(resultPaginated.data[1].fullName, 'Jane Doe')
    assert.equal(resultPaginated.meta.currentPage, 1)
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
  test('test_pick', ({ assert }) => {
    assert.equal(resultPick.data[0].firstName, 'John')
    assert.equal(resultPick.data[0].lastName, undefined)
  })
  test('test_omit', ({ assert }) => {
    assert.equal(resultOmit.data[0].firstName, undefined)
    assert.equal(resultOmit.data[0].lastName, 'Doe')
  })
})
