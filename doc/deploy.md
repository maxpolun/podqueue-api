Deploy Guide
============

podqueue-api should be able to be deployed anywhere that node supports. It requires the following environmental variables:

* DATABASE_URL: The connection string to the postgres database.
* NODE_ENV: should be 'production' for production deploys
* URL: the externally visible url for the api endpoint for example: https://podqueue-api.com

With the environment provisioned, the deploy should run the following commands (some may be run automatically by the environment, for example, heroku runs `npm install`)

```
npm install
npm run migrate
```


