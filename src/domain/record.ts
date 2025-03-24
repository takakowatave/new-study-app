// Recordクラス：1つのRecord項目を表すクラス
export class Record {
    // コンストラクタ：id、タイトル、完了状態、作成日時を受け取って初期化
    constructor(
      public id: string,            // 一意なID
      public title: string,         // Recordの内容
      public done: boolean,         // 完了したかどうか
      public created_at: string     // 作成日時（YYYY/MM/DD形式になる）
    ) {}
  
    // 静的メソッド：新しいRecordを作るときに使う補助関数
    public static newRecord(
      id: string,
      title: string,
      done: boolean,
      created_at: string
    ): Record {
      // created_atの日付を整形してからインスタンスを返す
      return new Record(id, title, done, formatDate(created_at));
    }
  }
  
  // 日付文字列を「YYYY/MM/DD」形式に変換する関数
  function formatDate(dateString: string): string {
    const date = new Date(dateString);             // 文字列からDateオブジェクトを作成
    const year = date.getFullYear();              // 年を取得
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // 月（0始まりなので+1）
    const day = date.getDate().toString().padStart(2, "0");          // 日を取得
  
    return `${year}/${month}/${day}`;             // 整形して返す
  }
  