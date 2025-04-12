// src/lib/deletetRecord.ts
import { supabase } from "../utils/supabase";
import { FetchedRecordError  } from "./fetchRecords";

type DeleteRecordResponse = {
  error: FetchedRecordError | null;
};

export const deleteRecord = async (id: string):Promise<DeleteRecordResponse> => {  
  const result = await supabase.from("study-record").delete().eq("id", id);
  const { error } = result;
  return { error };
};