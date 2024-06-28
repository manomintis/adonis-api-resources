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

Generate a new resource (i.e. for a user):

```sh
node ace make:resource user
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

## redefine() and refine() - manually defined map

redefine() modifies a model or array of models according to your custom map defined in resource file. Used along with get() method, which indicates that data processing is done and provides the result. You can also use refine(), which is an alias of redefine().get(), see example below.

Edit newly generated app/resources/user_resource.ts to create output you need. This example shows how you may output user's full name even if your implementation of user model has separate fields for the first and last names:

```typescript
...
  return {
    full_name: data.firstName + ' ' + data.lastName,
  }
...
```

You may also use arrays of models with resources:

```typescript
return new UserResource(users).refine()
```

### Output examples

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

## paginate() and refinePaginate()

In case you are dealing with not paginateable array you can still create pagination using this extension. refinePaginate() is an alias of redefine().paginate(), see examples below:

```typescript
return new UserResource(users).refinePaginate(page, limit)
return new UserResource(users).redefine().paginate(page, limit)
```

Arguments:

page - number of page to show (optional, default value: 1)<br />
limit - items per page (optional, default value: 10)

## pick()

No map definition is needed, once you only want to pick a few values of the object and leave other values behind. Examples:

```typescript
return new UserResource(users).pick('firstName').get()
return new UserResource(users).pick('firstName', 'lastName', 'email').paginate(1, 20)
```

## omit()

No map definition is needed, once you only want to exclude a few values from the object. Examples:

```typescript
return new UserResource(users).omit('id').paginate()
return new UserResource(users).omit('createdAt', 'updatedAt').get()
```

## get()

get() finalizes data processing. While pick(), omit() and redefine() modify data, trailing get() or paginate() is needed to complete the response. This requirement is not applied to refine() and refinePaginate()

## Lucid pagination support

Lucid offset-based pagination is supported.

[gh-workflow-image]: https://img.shields.io/github/actions/workflow/status/manomintis/adonis-api-resources/test.yml?style=for-the-badge
[gh-workflow-url]: https://github.com/manomintis/adonis-api-resources/actions/workflows/test.yml "Github action"

[npm-image]: https://img.shields.io/npm/v/adonis-api-resources/latest.svg?style=for-the-badge&logo=npm
[npm-url]: https://www.npmjs.com/package/adonis-api-resources/v/latest "npm"

[typescript-image]: https://img.shields.io/badge/Typescript-294E80.svg?style=for-the-badge&logo=typescript

[license-url]: LICENSE.md
[license-image]: https://img.shields.io/github/license/manomintis/adonis-api-resources?style=for-the-badge
