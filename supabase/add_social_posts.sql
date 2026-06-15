-- Add social_posts column to track where content was published
alter table reports add column if not exists social_posts jsonb default '{}';
