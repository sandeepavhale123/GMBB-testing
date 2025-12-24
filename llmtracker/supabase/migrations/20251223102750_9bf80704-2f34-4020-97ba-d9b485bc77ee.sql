-- Backfill brand_mentioned based on existing response_text
UPDATE llm_results lr
SET brand_mentioned = (
  LOWER(lr.response_text) LIKE '%' || LOWER(p.name) || '%'
)
FROM prompts pr
JOIN projects p ON pr.project_id = p.id
WHERE lr.prompt_id = pr.id
AND p.name IS NOT NULL AND p.name != '';

-- Backfill domain_mentioned based on response_text and citations
UPDATE llm_results lr
SET domain_mentioned = (
  LOWER(lr.response_text) LIKE '%' || 
  LOWER(REGEXP_REPLACE(REGEXP_REPLACE(p.domain, '^https?://', ''), '/$', '')) || '%'
  OR
  lr.citations::text LIKE '%' || 
  LOWER(REGEXP_REPLACE(REGEXP_REPLACE(p.domain, '^https?://', ''), '/$', '')) || '%'
)
FROM prompts pr
JOIN projects p ON pr.project_id = p.id
WHERE lr.prompt_id = pr.id
AND p.domain IS NOT NULL AND p.domain != '';