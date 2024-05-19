import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://eheilunfadtduyyowlmp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoZWlsdW5mYWR0ZHV5eW93bG1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU3MzY4MDgsImV4cCI6MjAzMTMxMjgwOH0.VfJuU3wF3-TGEQyOY4EYhHz3vVyzanCehhrnByleJS4'
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase
