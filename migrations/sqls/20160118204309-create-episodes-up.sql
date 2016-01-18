CREATE TABLE episodes (
  uuid UUID PRIMARY KEY default uuid_generate_v4(),
  podcast_uuid UUID references podcasts(uuid),
  file_url TEXT NOT NULL,
  file_length BIGINT NOT NULL,
  file_format TEXT NOT NULL,
  file_duration TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  released_at TIMESTAMP NOT NULL,
  author_guid TEXT
);
