// src/lib/insertRecord.ts
import { supabase } from "../utils/supabase";
import type { NewRecord } from "../domain/studyRecord";
import { FetchedStudyRecord,FetchedRecordError  } from "./fetchRecords";

type InsertRecordResponse = { // 戻り値を決める
  data: FetchedStudyRecord[] | null; // 記録の配列か、null
  error: FetchedRecordError | null;// エラーかnull
};

export const insertRecord = async (newRecord: NewRecord):Promise<InsertRecordResponse> => {  // 型をつけてnewRecord を Supabase に送る
  const result = await supabase.from("study-record").insert([newRecord]).select();// supabaseにデータを送る
  const { data, error } = result;// resultを定義
  return { data, error }; // データとエラーを返す
};
