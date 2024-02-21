import { Resource } from 'adonis-api-resources'
import { test } from '@japa/runner'

class TestResourceResource extends Resource {
  defineMap(data: any): object {
    return {
      fullName: data.firstName + ' ' + data.lastName,
    }
  }
}

const testObject = {
  firstName: 'John',
  lastName: 'Doe',
}

const result: any = new TestResourceResource(testObject).refine()

test.group('Resource', () => {
  test('create full name', ({ assert }) => {
    assert.equal(result.fullName, 'John Doe')
  })
})
