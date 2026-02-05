-- Add AI settings for user 2
INSERT INTO "Setting" ("userId", "key", "value", "createdAt", "updatedAt")
VALUES 
  (2, 'ai_api_key', 'AIzaSyCntcPQ1JaMbl3aCqMC1ogv2yTc-ipCqIw', NOW(), NOW()),
  (2, 'ai_enabled', '1', NOW(), NOW()),
  (2, 'ai_system_instruction', 'كن مهذباً ومحترفاً. ساعد المرضى بكل ما تستطيع.', NOW(), NOW())
ON CONFLICT ("userId", "key") 
DO UPDATE SET 
  "value" = EXCLUDED."value",
  "updatedAt" = NOW();
