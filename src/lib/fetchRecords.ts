// src/lib/record.ts
import { supabase } from "../utils/supabase";
export const fetchRecord = async () => {
return await supabase.from("study-record").select("*");
};