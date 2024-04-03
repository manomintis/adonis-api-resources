# AdonisJS API resources

[![gh-workflow-image]][gh-workflow-url] [![npm-image]][npm-url] ![][typescript-image] [![license-image]][license-url]

## Description

Provides a transformation layer between models and actual API endpont responses in JSON format.

## Setup

Install the package:

```sh
npm install adonis-api-resources
```


Configure the package:

```sh
node ace configure adonis-api-resources
```


## Usage


Generate a new resource:

```sh
node ace make:resource user
```


Edit newly generated app/resources/users_resource.ts to create output you need. This example shows how you may output user's full name even if your implementation of user model has separate fields for the first and last names:

```typescript
...
  return {
    full_name: data.firstName + ' ' + data.lastName,
  }
...
```


Import your generated resource before using it, i.e. in a controller:

```typescript
import UserResource from '#resources/user_resource'
```


Remove old endpoint return declaration:

```typescript
return user
```


Use the your generated resource instead:

```typescript
return new UserResource(user).refine()
```


You may also use arrays of models, with resources:

```typescript
return new UserResource(users).refine()
```

That's it. Enjoy yourself!


## Expected output examples


Model:

```json
{
  "full_name": "John Doe"
}
```


Array of models:

```json
[
  {
    "full_name": "John Doe"
  },
  {
    "full_name": "Jane Doe"
  }
]
```


## Pagination support


Offset-based pagination is supported. Example usage:

```typescript
const users = await User.query().paginate(1, 10)
return new UserResource(users).refine()
```


[gh-workflow-image]: https://img.shields.io/github/actions/workflow/status/manomintis/adonis-api-resources/test.yml?style=for-the-badge
[gh-workflow-url]: https://github.com/manomintis/adonis-api-resources/actions/workflows/test.yml "Github action"

[npm-image]: https://img.shields.io/npm/v/adonis-api-resources/latest.svg?style=for-the-badge&logo=npm
[npm-url]: https://www.npmjs.com/package/adonis-api-resources/v/latest "npm"

[typescript-image]: https://img.shields.io/badge/Typescript-294E80.svg?style=for-the-badge&logo=typescript

[license-url]: LICENSE.md
[license-image]: https://img.shields.io/github/license/manomintis/adonis-api-resources?style=for-the-badge
