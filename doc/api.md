API
===

## Podcasts

`/podcasts`:
  GET: get a paginated list of podcasts
  POST: add a podcast to the list

Podcast object:
  {
    name: 'name of podcast',
    description: 'an optional description of the podcast',
    feed: 'the feed url',
    episodesUrl: 'the url to get the episodes of the podcast (only in GET)'
  }

## Episodes
`/podcasts/:podcastId/episodes`
  GET: a paginated list of podcast episodes
`/podcasts/:podcastId/episodes/:episodeId`
  GET: an individual podcast episode

Episode object:
  {
    podcastUrl: 'url of podcast in podqueue-api',
    episodeUrl: 'the url of the episode in podqueue-api',
    fileUrl: 'the url to download the podcast episode audio file',
    name: 'episode name',
    description: 'episode description',
    releasedAt: 'the datetime of the episode release'
  }

## Users
`/users`
  POST: create a new user
`/users/:username`
  GET: get user info
  PUT: update user
`/users/:username/password-reset`
  POST: reset user password

## Queues
`/users/:username/queue`
  GET: the user's queue

Queue Object:
  {
    userUrl: 'url of user',
    episodes: ['an ordered list of episodes']
  }
``

