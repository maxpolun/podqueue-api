CREATE TABLE subscriptions (
  user_uuid UUID references users(uuid),
  podcast_uuid UUID references podcasts(uuid),
  PRIMARY KEY (user_uuid, podcast_uuid)
)
