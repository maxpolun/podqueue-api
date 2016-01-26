INSERT INTO users (uuid, email, username, pw_hash)
  VALUES
('ad5c99b6-be23-11e5-bbc6-3c15c2ca3dc6',
  'maxpolun@gmail.com',
  'maxpolun',
  '$2a$10$f1pCGE922MK5WzuSLjsMx.LvEkvIr83mSXNMSdPytkW1vC3l2TDue');

INSERT INTO podcasts (uuid, name, description, feed_url)
  VALUES
('45eeedf2-be2c-11e5-8815-3c15c2ca3dc6',
  'The History of Rome',
  'A weekly podcast tracing the rise, decline and fall of the Roman Empire. Now complete! Visit us at http://thehistoryofrome.typepad.com',
  'http://historyofrome.libsyn.com/rss');

INSERT INTO episodes (uuid,
  podcast_uuid,
  file_url,
  file_length,
  file_format,
  file_duration,
  name,
  description ,
  released_at,
  author_guid)
VALUES
  ('66f6624a-be2d-11e5-9039-3c15c2ca3dc6',
    '45eeedf2-be2c-11e5-8815-3c15c2ca3dc6',
    'http://feedproxy.google.com/~r/TheHistoryOfRome/~5/mvZ6GxepKFo/01-_In_the_Beginning.mp3',
    5667112,
    'audio/mpeg',
    '11:49',
    '001- In the Beginning',
    '&lt;p&gt;Welcome to The History of Rome, a weekly series tracing the rise and fall of the Roman Empire. Today we will hear the mythical origin story of Rome and compare it with modern historical and archaeological evidence. How much truth is wrapped up in the legend? We end this week with the death of Remus and the founding of Rome.&lt;/p&gt;&lt;img src="http://feeds.feedburner.com/~r/TheHistoryOfRome/~4/bEECVPWDJYM" height="1" width="1" alt=""/&gt;',
    'Sat, 28 Jul 2007 00:47:00 +0000',
    '33cde82d0142aeaa882db7613212e31b');

INSERT INTO queues (user_uuid, episode_uuid, ordering)
VALUES
  ('ad5c99b6-be23-11e5-bbc6-3c15c2ca3dc6',
    '66f6624a-be2d-11e5-9039-3c15c2ca3dc6',
    1);

INSERT INTO subscriptions (user_uuid, podcast_uuid)
VALUES
  ('ad5c99b6-be23-11e5-bbc6-3c15c2ca3dc6', '45eeedf2-be2c-11e5-8815-3c15c2ca3dc6');

