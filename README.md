# bloglab

A full stack application for bloggers who want to share their experiences.

## Why build bloglab?

I built bloglab because one of my many hobbies is traveling. Creating bloglab was a great opportunity to not only apply new technologies that I have learned, but also create a practical website to allow people to share their passions.

## Technologies Used

- React.js
- Webpack
- Materialize CSS
- Node.js
- Express.js
- PostgreSQL
- HTML5
- CSS3
- Heroku
- SendGrid API

## Live Demo

Try the application live at [https://lfz-bloglab.herokuapp.com/](https://lfz-bloglab.herokuapp.com/)

## Features

- User can create a blog post
- User can read a blog post
- User can browse all blogs
- User can comment on blog posts
- User can like blog posts
- User can copy the blog post link
- User can send the blog to their email
- User can sign up
- User can sign in
- User can sign out
- User can browse their blogs
- User can update a blog post
- User can delete a blog post

## Preview

![bloglab](server/public/images/bloglab-example.gif)

## Stretch Features

- Markdown support
- Sort blogs by post date/time

### System Requirements

- Node.js 10 or higher
- NPM 6 or higher
- PostgreSQL 14.1 or higher

### Getting Started

1. Clone the repository.

    ```shell
    git clone https://github.com/kenkieu/bloglab.git
    cd bloglab
    ```

1. Copy the env.example file, and edit all placeholder "changeMe" values.

    ```shell
    cp .env.example .env
    ```

1. Install all dependencies with NPM.

    ```shell
    npm install
    ```

1. Import the schema and data to the PostgreSQL database. Please note that running this command will drop the existing database (if one currently exists).

    ```shell
    npm run db:import
    ```

1. Start the project. Once started you can view the application by opening http://localhost:3000 in your browser.

    ```shell
    npm run dev
    ```
