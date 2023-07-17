# Project Architecture

## Language

- Nodejs(typescript)

## ERP Model

![erp model](https://imgur.com/QkjQYqY.jpg)

## design pattern (MVC)

### folder structure

├── **user**
│ ├── user.constants.ts (helper functions)
│ ├── user.interface.ts (user data initialization)
│ ├── user.model.ts (user model and statics)
│ ├── user.validation.ts (zod validation)
│ ├── user.route.ts (get, post, ...routes)
│ ├── user.controller.ts (get, post, ...request)
│ ├── user.service.ts (business logic of get, post, ...requests)
├── **post**
│ ├── post.constants.ts (helper functions)
│ ├── post.interface.ts (post data initialization)
│ ├── post.model.ts (post model and statics)
│ ├── post.validation.ts (zod validation)
│ ├── post.route.ts (get, post, ...routes)
│ ├── post.controller.ts (get, post, ...request)
│ ├── post.service.ts (business logic of get, post, ...requests)
├── ...

## Core Features

- Interface --> Model --> Schema --> route --> business logic
- Global Error Handler
- Authentication (Custom, Email, Pass)
- Authorization (JWT Token)
- CRUD operation (mongoose)
- Pagination
- Search (Partial and Exact Match)
- Permission (brainstorm)

## Security

- route security (zod validation)
- route authorization security (JWT access token)
- email verification (JWT access token)

## Route

domain/api/v1/

### Post

- domain/api/v1/post (GET)
- domain/api/v1/post?page=1&limit=10 (GET) **pagination**
- domain/api/v1/post?writer=xyz (GET) **search params**
- domain/api/v1/post/:id (PATCH)
- domain/api/v1/post/:id (DELETE)

### User

- domain/api/v1/user (GET)
- domain/api/v1/create-user (POST)
- domain/api/v1/user/:id (PATCH)
- domain/api/v1/user/:id (DELETE)
