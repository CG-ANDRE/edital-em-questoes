-- Epic 3 QA fixes
-- H1: trigger BEFORE INSERT calcula is_correct server-side
-- M2: policy de questions filtra user_editais.is_active = true

-- ============================================================
-- H1 — Server-side correctness check
-- ============================================================
create or replace function public.enforce_user_answer_correctness()
returns trigger
language plpgsql
set search_path = public
security definer
as $$
declare
  v_correct text;
begin
  select correct_answer into v_correct
    from public.questions where id = new.question_id;
  if v_correct is null then
    raise exception 'question not found' using errcode = 'P0001';
  end if;
  new.is_correct := (v_correct = new.selected_answer);
  return new;
end;
$$;

create trigger trg_user_answer_correctness
  before insert on public.user_answers
  for each row execute function public.enforce_user_answer_correctness();

-- ============================================================
-- M2 — Policy filtra user_editais.is_active = true
-- ============================================================
drop policy if exists questions_select_public_published on public.questions;

create policy questions_select_public_published on public.questions
  for select to authenticated using (
    status = 'published'
    and exists (
      select 1
      from public.question_editais qe
      join public.user_editais ue on ue.edital_id = qe.edital_id
      where qe.question_id = questions.id
        and ue.user_id = auth.uid()
        and ue.is_active = true
    )
  );
