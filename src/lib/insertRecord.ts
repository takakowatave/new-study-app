// src/lib/insertRecord.ts
import { supabase } from "../utils/supabase";
import type { NewRecord } from "../domain/studyRecord";

export const insertRecord = async (newRecord: NewRecord) => {  // 型をつけてnewRecord を Supabase に送る
    return await supabase.from("study-record").insert([newRecord]).select();
};
