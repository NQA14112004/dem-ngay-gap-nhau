-- Chạy toàn bộ file này một lần trong Supabase: SQL Editor > New query > Run.
-- Bảng này cho phép mọi người có link đọc thư, nhưng chỉ hàm bên dưới mới được ghi.

create table if not exists public.daily_wishes (
  day_key date primary key,
  message text not null check (char_length(message) between 1 and 4000),
  created_at timestamptz not null default now()
);

alter table public.daily_wishes enable row level security;

revoke all on table public.daily_wishes from anon, authenticated;
grant select on table public.daily_wishes to anon, authenticated;
drop policy if exists "Ai co link deu doc duoc thu" on public.daily_wishes;
create policy "Ai co link deu doc duoc thu"
on public.daily_wishes for select to anon, authenticated using (true);

drop function if exists public.save_daily_wish(date, text, text);
create or replace function public.save_daily_wish(
  p_day_key date,
  p_message text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Chỉ tài khoản Supabase của người viết mới có thể gọi hàm này.
  if auth.uid() is null then
    raise exception using errcode = 'P0001', message = 'not-authorized';
  end if;

  -- Chỉ được ghi thư cho đúng ngày hiện tại theo giờ Việt Nam.
  if p_day_key is distinct from (now() at time zone 'Asia/Ho_Chi_Minh')::date then
    raise exception using errcode = 'P0001', message = 'invalid-day';
  end if;

  if coalesce(char_length(btrim(p_message)), 0) = 0
     or char_length(p_message) > 4000 then
    raise exception using errcode = 'P0001', message = 'invalid-message';
  end if;

  insert into public.daily_wishes (day_key, message)
  values (p_day_key, btrim(p_message))
  on conflict (day_key) do nothing;

  if not found then
    raise exception using errcode = 'P0001', message = 'already-saved';
  end if;
end;
$$;

revoke all on function public.save_daily_wish(date, text) from public, anon;
grant execute on function public.save_daily_wish(date, text) to authenticated;
