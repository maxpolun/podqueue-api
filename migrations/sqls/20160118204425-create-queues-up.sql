CREATE TABLE queues (
  user_uuid UUID references users(uuid),
  episode_uuid UUID references episodes(uuid),
  ordering DECIMAL NOT NULL DEFAULT 0,
  PRIMARY KEY (user_uuid, episode_uuid)
);
