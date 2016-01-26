CREATE TABLE sessions (
  session_id TEXT PRIMARY KEY,
  user_uuid uuid references users(uuid),
  expires_at TIMESTAMP WITH TIME ZONE
);
