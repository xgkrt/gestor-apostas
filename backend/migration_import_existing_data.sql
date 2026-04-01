-- =====================================================
-- Script de Migração: Importar Dados Existentes
-- Sistema de Configurações - Gestor de Apostas
-- =====================================================
-- 
-- Este script migra dados de apostas que usavam texto livre
-- para o novo sistema com relacionamentos via IDs.
--
-- IMPORTANTE: Execute este script APÓS o backend criar as tabelas
--
-- Etapas:
-- 1. Popular tabela sports com valores únicos de bets.sport_old
-- 2. Popular championships vinculando ao sport correto
-- 3. Popular markets, bookmakers, tipsters
-- 4. Atualizar bets com os IDs correspondentes
-- 5. Validar migração
-- =====================================================

-- Backup: Copiar valores antigos antes da migração
-- (já foi feito ao renomear colunas para *_old)

-- =====================================================
-- 1. MIGRAR ESPORTES (SPORTS)
-- =====================================================

INSERT INTO sports (name, active, created_at)
SELECT DISTINCT 
    TRIM(sport_old) as name,
    TRUE as active,
    NOW() as created_at
FROM bets
WHERE sport_old IS NOT NULL 
  AND TRIM(sport_old) != ''
  AND NOT EXISTS (
      SELECT 1 FROM sports s 
      WHERE LOWER(s.name) = LOWER(TRIM(bets.sport_old))
  )
ORDER BY name;

-- =====================================================
-- 2. MIGRAR CAMPEONATOS (CHAMPIONSHIPS)
-- =====================================================

INSERT INTO championships (name, sport_id, active, created_at)
SELECT DISTINCT 
    TRIM(b.championship_old) as name,
    s.id as sport_id,
    TRUE as active,
    NOW() as created_at
FROM bets b
INNER JOIN sports s ON LOWER(s.name) = LOWER(TRIM(b.sport_old))
WHERE b.championship_old IS NOT NULL 
  AND TRIM(b.championship_old) != ''
  AND NOT EXISTS (
      SELECT 1 FROM championships c 
      WHERE LOWER(c.name) = LOWER(TRIM(b.championship_old))
        AND c.sport_id = s.id
  )
ORDER BY name;

-- =====================================================
-- 3. MIGRAR MERCADOS (MARKETS)
-- =====================================================

INSERT INTO markets (name, active, created_at)
SELECT DISTINCT 
    TRIM(market_old) as name,
    TRUE as active,
    NOW() as created_at
FROM bets
WHERE market_old IS NOT NULL 
  AND TRIM(market_old) != ''
  AND NOT EXISTS (
      SELECT 1 FROM markets m 
      WHERE LOWER(m.name) = LOWER(TRIM(bets.market_old))
  )
ORDER BY name;

-- =====================================================
-- 4. MIGRAR CASAS DE APOSTAS (BOOKMAKERS)
-- =====================================================

INSERT INTO bookmakers (name, active, created_at)
SELECT DISTINCT 
    TRIM(bookmaker_old) as name,
    TRUE as active,
    NOW() as created_at
FROM bets
WHERE bookmaker_old IS NOT NULL 
  AND TRIM(bookmaker_old) != ''
  AND NOT EXISTS (
      SELECT 1 FROM bookmakers bm 
      WHERE LOWER(bm.name) = LOWER(TRIM(bets.bookmaker_old))
  )
ORDER BY name;

-- =====================================================
-- 5. MIGRAR TIPSTERS
-- =====================================================

INSERT INTO tipsters (name, active, created_at)
SELECT DISTINCT 
    TRIM(tipster_old) as name,
    TRUE as active,
    NOW() as created_at
FROM bets
WHERE tipster_old IS NOT NULL 
  AND TRIM(tipster_old) != ''
  AND NOT EXISTS (
      SELECT 1 FROM tipsters t 
      WHERE LOWER(t.name) = LOWER(TRIM(bets.tipster_old))
  )
ORDER BY name;

-- =====================================================
-- 6. ATUALIZAR APOSTAS COM IDs (BETS)
-- =====================================================

-- Atualizar sport_id
UPDATE bets b
INNER JOIN sports s ON LOWER(s.name) = LOWER(TRIM(b.sport_old))
SET b.sport_id = s.id
WHERE b.sport_old IS NOT NULL 
  AND TRIM(b.sport_old) != ''
  AND b.sport_id IS NULL;

-- Atualizar championship_id
UPDATE bets b
INNER JOIN sports s ON LOWER(s.name) = LOWER(TRIM(b.sport_old))
INNER JOIN championships c ON c.sport_id = s.id 
    AND LOWER(c.name) = LOWER(TRIM(b.championship_old))
SET b.championship_id = c.id
WHERE b.championship_old IS NOT NULL 
  AND TRIM(b.championship_old) != ''
  AND b.championship_id IS NULL;

-- Atualizar market_id
UPDATE bets b
INNER JOIN markets m ON LOWER(m.name) = LOWER(TRIM(b.market_old))
SET b.market_id = m.id
WHERE b.market_old IS NOT NULL 
  AND TRIM(b.market_old) != ''
  AND b.market_id IS NULL;

-- Atualizar bookmaker_id
UPDATE bets b
INNER JOIN bookmakers bm ON LOWER(bm.name) = LOWER(TRIM(b.bookmaker_old))
SET b.bookmaker_id = bm.id
WHERE b.bookmaker_old IS NOT NULL 
  AND TRIM(b.bookmaker_old) != ''
  AND b.bookmaker_id IS NULL;

-- Atualizar tipster_id
UPDATE bets b
INNER JOIN tipsters t ON LOWER(t.name) = LOWER(TRIM(b.tipster_old))
SET b.tipster_id = t.id
WHERE b.tipster_old IS NOT NULL 
  AND TRIM(b.tipster_old) != ''
  AND b.tipster_id IS NULL;

-- =====================================================
-- 7. VALIDAÇÃO DA MIGRAÇÃO
-- =====================================================

-- Contar registros migrados
SELECT 'SPORTS' as tabela, COUNT(*) as total FROM sports
UNION ALL
SELECT 'CHAMPIONSHIPS', COUNT(*) FROM championships
UNION ALL
SELECT 'MARKETS', COUNT(*) FROM markets
UNION ALL
SELECT 'BOOKMAKERS', COUNT(*) FROM bookmakers
UNION ALL
SELECT 'TIPSTERS', COUNT(*) FROM tipsters;

-- Verificar apostas com IDs populados
SELECT 
    COUNT(*) as total_bets,
    SUM(CASE WHEN sport_id IS NOT NULL THEN 1 ELSE 0 END) as com_sport_id,
    SUM(CASE WHEN championship_id IS NOT NULL THEN 1 ELSE 0 END) as com_championship_id,
    SUM(CASE WHEN market_id IS NOT NULL THEN 1 ELSE 0 END) as com_market_id,
    SUM(CASE WHEN bookmaker_id IS NOT NULL THEN 1 ELSE 0 END) as com_bookmaker_id,
    SUM(CASE WHEN tipster_id IS NOT NULL THEN 1 ELSE 0 END) as com_tipster_id
FROM bets;

-- Verificar apostas que NÃO foram migradas (valores antigos sem match)
SELECT 
    COUNT(*) as nao_migradas,
    'Esporte sem match' as tipo
FROM bets 
WHERE sport_old IS NOT NULL 
  AND TRIM(sport_old) != '' 
  AND sport_id IS NULL
UNION ALL
SELECT 
    COUNT(*),
    'Championship sem match'
FROM bets 
WHERE championship_old IS NOT NULL 
  AND TRIM(championship_old) != '' 
  AND championship_id IS NULL
UNION ALL
SELECT 
    COUNT(*),
    'Market sem match'
FROM bets 
WHERE market_old IS NOT NULL 
  AND TRIM(market_old) != '' 
  AND market_id IS NULL
UNION ALL
SELECT 
    COUNT(*),
    'Bookmaker sem match'
FROM bets 
WHERE bookmaker_old IS NOT NULL 
  AND TRIM(bookmaker_old) != '' 
  AND bookmaker_id IS NULL
UNION ALL
SELECT 
    COUNT(*),
    'Tipster sem match'
FROM bets 
WHERE tipster_old IS NOT NULL 
  AND TRIM(tipster_old) != '' 
  AND tipster_id IS NULL;

-- =====================================================
-- OBSERVAÇÕES
-- =====================================================
-- 
-- 1. As colunas *_old ainda contêm os valores originais como backup
-- 2. Após validar que tudo funcionou, você pode removê-las futuramente
-- 3. Se houver apostas não migradas, verifique inconsistências nos dados
--    (ex: espaços extras, case diferente que não foi normalizado)
-- 4. Para remover as colunas antigas (CUIDADO - faça backup antes):
--    ALTER TABLE bets DROP COLUMN sport_old;
--    ALTER TABLE bets DROP COLUMN championship_old;
--    ALTER TABLE bets DROP COLUMN market_old;
--    ALTER TABLE bets DROP COLUMN bookmaker_old;
--    ALTER TABLE bets DROP COLUMN tipster_old;
-- =====================================================
