begin;

alter table public.tasks
  add column if not exists task_order integer;

with ordered_tasks as (
  select
    id,
    row_number() over (
      partition by workspace_id, project_id, column_id
      order by created_at asc nulls last, id asc
    ) - 1 as next_task_order
  from public.tasks
  where task_order is null
)
update public.tasks as tasks
set task_order = ordered_tasks.next_task_order
from ordered_tasks
where tasks.id = ordered_tasks.id;

create index if not exists tasks_workspace_project_column_order_idx
  on public.tasks (
    workspace_id,
    project_id,
    column_id,
    is_archived,
    task_order,
    created_at
  );

commit;
