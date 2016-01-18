CREATE TABLE podcasts (
  uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  feed_url TEXT NOT NULL
);
