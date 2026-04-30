-- Story 1.8 — Preparação para exclusão de conta (LGPD Direito ao Esquecimento)
-- Estratégia: audit_log preserva registro mesmo após delete do usuário (NFR12 retenção 12m).
-- actor_user_id já é nullable e tem ON DELETE SET NULL na Story 1.2 (verificado).

-- Garantir que action='dsr_delete' é aceito (text livre, não há CHECK constraint).
-- Apenas adicionar comentário documentando os valores aceitos:
comment on column public.audit_log.action is
  'Tipos: INSERT, UPDATE, DELETE (triggers); dsr_export, dsr_delete (LGPD self-service).';

-- TODO: ao criar user_answers/confidence_scores em Epic 3/5, herdar padrão:
--   user_id ON DELETE SET NULL + anonymized_user_hash text
--   CHECK (user_id IS NOT NULL OR anonymized_user_hash IS NOT NULL)
-- Mantém agregados estatísticos sem PII após exclusão de conta.
