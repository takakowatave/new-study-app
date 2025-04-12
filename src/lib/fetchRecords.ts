// src/lib/fetchRecords.ts
import { supabase } from "../utils/supabase";

  //エラーの型
  export type FetchedRecordError = {
  code: string,
  message: string
};

  //記録一つの型
  export type FetchedStudyRecord = {
 id: string,            // 一意なID
 title: string,         // Recordの内容
 time: number,         // 学習時間
 created_at: string     // 作成日時（YYYY/MM/DD形式になる）
};

export type FetchRecordResponse = {
  data: FetchedStudyRecord[] | null;
  error: FetchedRecordError | null;
};

export const fetchRecord = async ():Promise<FetchRecordResponse>=> {
const result = await supabase.from("study-record").select("*");
const { data, error } = result;
return { data, error };
};