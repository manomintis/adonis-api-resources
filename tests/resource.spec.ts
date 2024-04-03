import { Resource } from '../src/resource.js'
import { test } from '@japa/runner'

class TestResourceResource extends Resource {
  defineMap(data: any): object {
    return {
      fullName: data.firstName + ' ' + data.lastName,
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
  },
  {
    firstName: 'Jane',
    lastName: 'Doe',
  },
]

class ObjectPaginated {
  currentPage = 1
  rows = [
    {
      firstName: 'John',
      lastName: 'Doe',
    },
    {
      firstName: 'Jane',
      lastName: 'Doe',
    },
  ]
  getMeta() {
    return { currentPage: 1 }
  }
}
const testObjectPaginated = new ObjectPaginated()

const resultEntity: any = new TestResourceResource(testObjectEntity).refine()
const resultCollection: any = new TestResourceResource(testObjectCollection).refine()
const resultPaginated: any = new TestResourceResource(testObjectPaginated).refine()

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
})
