-- Soft-delete updates return the row. Admins must still be able to SELECT it
-- after deleted_at is set; otherwise PostgREST fails the admin delete action.
drop policy if exists "Admins can read all portfolio projects" on public.portfolio_projects;

create policy "Admins can read all portfolio projects"
  on public.portfolio_projects
  for select
  to authenticated
  using ((select public.is_admin()));
