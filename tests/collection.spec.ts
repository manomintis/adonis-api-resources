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

const resultRefineCollection: any = new TestResourceResource(testObjectCollection).refine()
const resultPickCollection: any = new TestResourceResource(testObjectCollection)
  .pick('firstName')
  .get()
const resultOmitCollection: any = new TestResourceResource(testObjectCollection)
  .omit('firstName')
  .get()

test.group('Collection', () => {
  test('test_collection', ({ assert }) => {
    assert.equal(resultRefineCollection[0].fullName, 'John Doe')
    assert.equal(resultRefineCollection[1].fullName, 'Jane Doe')
  })
  test('test_pick_collection', ({ assert }) => {
    assert.equal(resultPickCollection[0].firstName, 'John')
    assert.equal(resultPickCollection[0].lastName, undefined)
  })
  test('test_omit_collection', ({ assert }) => {
    assert.equal(resultOmitCollection[0].firstName, undefined)
    assert.equal(resultOmitCollection[0].lastName, 'Doe')
  })
})
