# Project Architecture

## Language

- Nodejs(typescript)

## ERP Model

![erp model](https://imgur.com/QkjQYqY.jpg)

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
