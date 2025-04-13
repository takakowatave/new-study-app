// src/lib/updateRecord.ts
import { supabase } from "../utils/supabase";
import type { FormValues } from "../App";
import { FetchedRecordError  } from "./fetchRecords";

type updateRecordResponse = { //エラーの型を定義したオブジェクト型
  error: FetchedRecordError | null;
};

//一行一行何やってるかコメント
export const updateRecord = async ( // 他のファイルで使えるように
  id: string,          //どのレコードを更新するのか特定するため
  values: FormValues  // フォームでユーザーが入力した新しい値を受け取るため
): Promise<updateRecordResponse> => { //返り値をpromiseで固定する
  const { error: error } = await supabase    //プロパティ、supabaseから取得した変数
    .from("study-record") // study-recordから
    .update({ //下記の値でupdateする
      title: values.text, 
      time: Number(values.time),
      created_at: new Date(values.created_at).toISOString(),
    })
    .eq("id", id); //

  return { error };
};
