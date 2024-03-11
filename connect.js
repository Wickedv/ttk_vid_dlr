import {createClient} from '@supabase/supabase-js'

const supabaseurl  = process.env.supabaseUrl;
const supabasekey = process.env.supabaseKey;

const supabase = createClient(supabaseurl, supabasekey);

export default supabase;