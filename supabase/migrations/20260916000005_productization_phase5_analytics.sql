-- Phase 5: Community Acquisition Analytics Upgrade

ALTER TABLE community_clicks_analytics ADD COLUMN IF NOT EXISTS utm_source text;
ALTER TABLE community_clicks_analytics ADD COLUMN IF NOT EXISTS utm_medium text;
ALTER TABLE community_clicks_analytics ADD COLUMN IF NOT EXISTS utm_campaign text;
ALTER TABLE community_clicks_analytics ADD COLUMN IF NOT EXISTS device_category text;
