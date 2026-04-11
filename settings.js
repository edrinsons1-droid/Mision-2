// CONFIGURACIÓN CENTRALIZADA (NO TOCAR EN app.js)

const CONFIG = {
  SUPABASE_URL: "https://drohgrdzvttjbkrcrgko.supabase.co",
  SUPABASE_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyb2hncmR6dnR0amJrcmNyZ2tvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2MDA2MDYsImV4cCI6MjA5MTE3NjYwNn0.559FQm6ahLKqYkhSYRQJblRjHTSK1S5_NB8z7jbh41Y"
};

const supabaseClient = window.supabase.createClient(
  CONFIG.SUPABASE_URL,
  CONFIG.SUPABASE_KEY
);
