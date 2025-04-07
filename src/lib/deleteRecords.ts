// src/lib/deletetRecord.ts
import { supabase } from "../utils/supabase";
import type { StudyRecord } from "../domain/studyRecord";

export const deleteRecord = async (record: StudyRecord) => {  
    return await supabase.from("study-record").delete().eq("id", record.id);
};
