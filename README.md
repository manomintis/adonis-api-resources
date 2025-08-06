# AdonisJS API resources

[![gh-workflow-image]][gh-workflow-url] [![npm-image]][npm-url] ![][typescript-image] [![license-image]][license-url]

## Description

Provides a transformation layer between a model and the actual API endpoint response in JSON format.

## Setup

Install the package:

```sh
npm install adonis-api-resources
```

Configure the package:

```sh
node ace configure adonis-api-resources
```

Generate a new resource (e.g., for a `User` model):

```sh
node ace make:resource user
```

Import the generated resource before using it, for example in a controller:

```typescript
import UserResource from '#resources/user_resource'
```

Remove the old endpoint return declaration:

```typescript
return user
```

Use the generated resource instead:

```typescript
return new UserResource(user).remap()
```

## remap() - manually defined map

`remap()` modifies a model or an array of models according to the custom map defined in the resource file.

Edit the newly generated `app/resources/user_resource.ts` file to produce the output you need. This example shows how you can output the user's full name, even if your `User` model has separate fields for the first and last names.

```typescript
...
  return {
    full_name: data.firstName + ' ' + data.lastName,
  }
...
```

You can also use arrays of models with resources:

```typescript
return new UserResource(users).remap()
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

## pick()

No map definition is needed if you only want to pick a few values from the object and leave the rest out. 

Example:

```typescript
return new UserResource(users).pick('email', 'firstName', 'lastName')
```

## omit()

No map definition is needed if you only want to exclude a few values from the object. 

Example:

```typescript
return new UserResource(users).omit('createdAt', 'updatedAt')
```

## paginate()

If you are dealing with a non-paginated array, you can still create pagination using this extension. 

See examples below:

```typescript
return new UserResource(users).remap().paginate(page, limit)
return new UserResource(users).pick('email', 'firstName', 'lastName').paginate(page)
return new UserResource(users).omit('id', 'password').paginate()
```

### Arguments

- **page** — Number of the page to show (optional, default: 1)  
- **limit** — Items per page (optional, default: 10)

## Pagination support

Offset-based pagination is supported for [Lucid](https://github.com/adonisjs/lucid) and [MongoDB ODM for AdonisJS](https://github.com/DreamsHive/adonis-odm)

[gh-workflow-image]: https://img.shields.io/github/actions/workflow/status/manomintis/adonis-api-resources/test.yml?style=for-the-badge
[gh-workflow-url]: https://github.com/manomintis/adonis-api-resources/actions/workflows/test.yml "Github action"

[npm-image]: https://img.shields.io/npm/v/adonis-api-resources/latest.svg?style=for-the-badge&logo=npm
[npm-url]: https://www.npmjs.com/package/adonis-api-resources/v/latest "npm"

[typescript-image]: https://img.shields.io/badge/Typescript-294E80.svg?style=for-the-badge&logo=typescript

[license-url]: LICENSE.md
[license-image]: https://img.shields.io/github/license/manomintis/adonis-api-resources?style=for-the-badge
