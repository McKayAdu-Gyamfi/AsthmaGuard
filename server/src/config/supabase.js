import { createClient } from '@supabase/supabase-js';


const supabaseUrl = 'https://uewfaexbptgjpukrvypt.supabase.co';
const supabaseKey = 'sb_publishable_sGE7bbxqEoo9qQ-P6BnZjw_VHIP8LY8';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
