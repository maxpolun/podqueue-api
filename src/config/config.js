module.exports = {
  port: process.env.PORT || 4000,
  dbUrl: process.env.DATABASE_URL || 'postgres://podqueue@localhost/podqueue-dev',
  baseUrl: process.env.BASE_URL || 'http://localhost:4000'
}
