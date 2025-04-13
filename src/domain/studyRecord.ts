// Recordクラス：1つのRecord項目を表すクラス
export class StudyRecord {
  // コンストラクタ：id、タイトル、完了状態、作成日時を受け取って初期化
  constructor(
    public id: string,            // 一意なID
    public title: string,         // Recordの内容
    public time: number,         // 学習時間
    public created_at: string     // 作成日時（YYYY/MM/DD形式になる）
  ) {}

  
  // 静的メソッド：新しいRecordを作るときに使う補助関数
  public static newRecord(
    id: string,
    title: string,
    time: number,
    created_at: string
  ): StudyRecord{
    // created_atの日付を整形してからインスタンスを返す
    return new StudyRecord(id, title, time, formatDate(created_at));
  }
}

// フォームの初期値に使う関数を新たに定義する
export function formatDateForInput(dateString: string): string {
  const date = new Date(dateString);             // 文字列からDateオブジェクトを作成
  const year = date.getFullYear();              // 年を取得
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // 月（0始まりなので+1）
  const day = date.getDate().toString().padStart(2, "0");          // 日を取得
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");
  return `${year}-${month}-${day}T${hour}:${minute}`;             // 整形して返す
}


// 日付文字列を「YYYY/MM/DD」形式に変換する関数
function formatDate(dateString: string): string {
  const date = new Date(dateString);             // 文字列からDateオブジェクトを作成
  const year = date.getFullYear();              // 年を取得
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // 月（0始まりなので+1）
  const day = date.getDate().toString().padStart(2, "0");          // 日を取得

  return `${year}/${month}/${day}`;             // 整形して返す
}

// NewRecord作成用のtype
export type NewRecord = { 
  title: string,
  time: number,
  created_at: string
};


