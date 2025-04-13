import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StudyRecord } from "../domain/studyRecord";
import "@testing-library/jest-dom";

//mock関数作成
const mockInsertRecord = jest.fn();
const mockDeleteRecord = jest.fn();
const mockFetchRecord = jest.fn();

jest.mock("../utils/supabase.ts", () => ({
  __esModule: true,
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
  },
}));


jest.mock("../lib/fetchRecords.ts", () => ({
  __esModule: true,
  fetchRecord: () => mockFetchRecord(),
}));

jest.mock("../lib/insertRecords.ts", () => ({
  __esModule: true,
  insertRecord: () => mockInsertRecord(),
}));

jest.mock("../lib/deleteRecords.ts", () => ({
  __esModule: true,
  deleteRecord: () => mockDeleteRecord(),
}));

import App from "../App";

describe("App", () => {
  test("編集して登録すると更新される", async () => {
    mockFetchRecord.mockResolvedValueOnce({
      data: [
        new StudyRecord("1", "title1", 60, "2021-01-01T00:00:00Z"),
        new StudyRecord("2", "title2", 23, "2021-01-01T00:00:00Z"),
        new StudyRecord("3", "title3", 24, "2021-01-01T00:00:00Z"),
        new StudyRecord("4", "title4", 34, "2021-01-01T00:00:00Z"),
        new StudyRecord("5", "Reactの勉強", 30, "2021-01-01T00:00:00Z"),
      ],
      error: null,
    });   
    mockFetchRecord.mockResolvedValueOnce({
      data: [
        new StudyRecord("1", "title1", 60, "2021-01-01T00:00:00Z"),
        new StudyRecord("2", "title2", 23, "2021-01-01T00:00:00Z"),
        new StudyRecord("3", "title3", 24, "2021-01-01T00:00:00Z"),
        new StudyRecord("4", "title4", 34, "2021-01-01T00:00:00Z"),
        new StudyRecord("5", "Reactの勉強", 30, "2021-01-01T00:00:00Z"),
      ],
      error: null,
    });
  render(<App />);
    await waitFor(() => screen.getByTestId("editing_button_1"));
    await userEvent.click(screen.getByTestId("editing_button_1")); // ボタンがあることを確認
    const titleInput = screen.getByTestId("title_input"); // モーダルが開いたことを確認
    await userEvent.type(titleInput, "Reactの勉強");
    
    const timeInput = screen.getByTestId("time_input");// 時間が記入できることを確認
    await userEvent.type(timeInput, "30");

    const datetimeInput = screen.getByTestId("datetime_input");// 日時が記入できることを確認
    await userEvent.type(datetimeInput, "2025-04-12T15:00");
    
    await userEvent.click(screen.getByTestId("save_button"));

    await waitFor(() => {
      const rows = screen.getByTestId("table").querySelectorAll("tr");
      expect(rows.length - 1).toBe(5);  //4件 → 5件になっていればOK
    });
  });
  
  test("フォームに入力できる", async () => {
    render(<App />);
    await waitFor(() => screen.getByTestId("add_button"));
    const add_button = screen.getByTestId("add_button");
    await userEvent.click(add_button);
    const input = screen.getByTestId("title_input");
    await userEvent.type(input, "Reactの勉強");
    expect(input).toHaveValue("Reactの勉強");
  });
  test("新規登録ボタンをクリックできる", async () => {
    render(<App />);
    await waitFor(() => screen.getByTestId("add_button"));
    await userEvent.click(screen.getByTestId("add_button"));
  });
  test("新規登録ボタンがあること", async () => {
    render(<App />);
    await waitFor(() => screen.getByTestId("add_button"));
    const add_button = screen.getByTestId("add_button");
    expect(add_button).toBeInTheDocument();
  });
  
  test("モーダルのタイトルが「記録編集」になる", async () => {
    mockFetchRecord.mockResolvedValueOnce({ //App がrenderされた時点ですぐfetchRecordが呼ばれるので先に書く
      data: [
        new StudyRecord("1", "タイトル", 60, "2021-01-01T00:00:00Z"),//ダミーデータ作成
      ],
      error: null,
    });
    render(<App />);
    await waitFor(() => screen.getByTestId("editing_button_1"));
    await userEvent.click(screen.getByTestId("editing_button_1"));
    
    await waitFor(() => screen.getByTestId("modal_title"));
    expect(screen.getByTestId("modal_title")).toHaveTextContent("記録編集");
  });
  
test("削除ができる", async () => {
  mockDeleteRecord.mockResolvedValue({ error: null }); // ✅ 追加：戻り値が undefined でないように
  mockFetchRecord
    .mockResolvedValueOnce({
      data: [
        new StudyRecord("1", "title1", 60, "2021-01-01T00:00:00Z"),
        new StudyRecord("2", "title2", 23, "2021-01-01T00:00:00Z"),
        new StudyRecord("3", "title3", 24, "2021-01-01T00:00:00Z"),
        new StudyRecord("4", "title4", 34, "2021-01-01T00:00:00Z"),
      ],
      error: null,
    })
    .mockResolvedValueOnce({
      data: [
        new StudyRecord("2", "title2", 23, "2021-01-01T00:00:00Z"),
        new StudyRecord("3", "title3", 24, "2021-01-01T00:00:00Z"),
        new StudyRecord("4", "title4", 34, "2021-01-01T00:00:00Z"),
      ],
      error: null,
    })
    .mockResolvedValue({
      data: [
        new StudyRecord("2", "title2", 23, "2021-01-01T00:00:00Z"),
        new StudyRecord("3", "title3", 24, "2021-01-01T00:00:00Z"),
        new StudyRecord("4", "title4", 34, "2021-01-01T00:00:00Z"),
      ],
      error: null,
    });
  // 👇 render はモック設定の後に呼び出す
  render(<App />);
  await waitFor(() => screen.getByTestId("table")); // テーブルが画面に表示されるまで待つ
  const beforeRows = screen.getByTestId("table").querySelectorAll("tr").length;
  await waitFor(() => screen.getByTestId("delete_button_1"));
  await userEvent.click(screen.getByTestId("delete_button_1")); // 削除ボタンをクリック
  expect(mockDeleteRecord).toHaveBeenCalled(); // 削除関数が呼ばれたか確認
  await waitFor(() => {
    const afterRows = screen.getByTestId("table").querySelectorAll("tr").length;
    expect(afterRows).toBe(beforeRows - 1); // 行数が1つ減っていることを確認
  });
});


  test("学習内容があるが、学習時間が0のときにエラーが出る", async () => {
    render(<App />);
    await waitFor(() => screen.getByTestId("add_button"));
    await userEvent.click(screen.getByTestId("add_button")); // モーダルを開く
  
    await waitFor(() => screen.getByTestId("time_input"));
    const timeInput = screen.getByTestId("time_input");
    await userEvent.clear(timeInput);
    await userEvent.type(timeInput, "0");
  
    const textInput = screen.getByTestId("title_input");
    await userEvent.type(textInput, "Reactの勉強");
  
    await userEvent.click(screen.getByTestId("save_button")); // ✅ これが必要！
  
    expect(await screen.findByText("時間は1以上である必要があります")).toBeInTheDocument();
  });
  

  test("学習内容があるが、時間が未記入のときにエラーが出る", async () => {
    render(<App />);
    await waitFor(() => screen.getByTestId("add_button"));
    const add_button = screen.getByTestId("add_button"); 
    await userEvent.click(add_button);//モーダルを開く
    
    const textInput = screen.getByTestId("title_input");// 内容が記入できることを確認
    await userEvent.type(textInput, "Reactの勉強");
    
    await userEvent.click(screen.getByTestId("save_button"));
    expect(await screen.findByText("日時の入力は必須です")).toBeInTheDocument();
  });
  
  test("学習時間があるが、内容がないときにエラーが出る", async () => {
    render(<App />);
    await waitFor(() => screen.getByTestId("add_button"));
    const add_button = screen.getByTestId("add_button"); 
    await userEvent.click(add_button);//モーダルを開く
    
    const timeInput = screen.getByTestId("time_input");// 時間が記入できることを確認
    await userEvent.type(timeInput, "30");
    
    await userEvent.click(screen.getByTestId("save_button"));
    expect(await screen.findByText("内容の入力は必須です")).toBeInTheDocument();
  });
  
  test("モーダルが'新規登録'というタイトルで表示", async () => {
    render(<App />);
    await waitFor(() => screen.getByTestId("add_button"));
    await userEvent.click(screen.getByTestId("add_button"));
    expect(screen.getByTestId("modal_title")).toHaveTextContent("新規登録");
  });
  
  test("保存できる", async () => {
    mockFetchRecord.mockResolvedValueOnce({
      data: [
        new StudyRecord("1", "title1", 60, "2021-01-01T00:00:00Z"),
        new StudyRecord("2", "title2", 23, "2021-01-01T00:00:00Z"),
        new StudyRecord("3", "title3", 24, "2021-01-01T00:00:00Z"),
        new StudyRecord("4", "title4", 34, "2021-01-01T00:00:00Z"),
        new StudyRecord("5", "Reactの勉強", 30, "2021-01-01T00:00:00Z"),
      ],
      error: null,
    });   
    mockFetchRecord.mockResolvedValueOnce({
      data: [
        new StudyRecord("1", "title1", 60, "2021-01-01T00:00:00Z"),
        new StudyRecord("2", "title2", 23, "2021-01-01T00:00:00Z"),
        new StudyRecord("3", "title3", 24, "2021-01-01T00:00:00Z"),
        new StudyRecord("4", "title4", 34, "2021-01-01T00:00:00Z"),
        new StudyRecord("5", "Reactの勉強", 30, "2021-01-01T00:00:00Z"),
      ],
      error: null,
    });
  render(<App />);
    await waitFor(() => screen.getByTestId("add_button"));
    await userEvent.click(screen.getByTestId("add_button")); // ボタンがあることを確認
    const titleInput = screen.getByTestId("title_input"); // モーダルが開いたことを確認
    await userEvent.type(titleInput, "Reactの勉強");
    
    const timeInput = screen.getByTestId("time_input");// 時間が記入できることを確認
    await userEvent.type(timeInput, "30");

    const datetimeInput = screen.getByTestId("datetime_input");// 日時が記入できることを確認
    await userEvent.type(datetimeInput, "2025-04-12T15:00");
    
    await userEvent.click(screen.getByTestId("save_button"));

    await waitFor(() => {
      const rows = screen.getByTestId("table").querySelectorAll("tr");
      expect(rows.length - 1).toBe(5);  //4件 → 5件になっていればOK
    });
  });
  
  test("フォームに入力できる", async () => {
    render(<App />);
    await waitFor(() => screen.getByTestId("add_button"));
    const add_button = screen.getByTestId("add_button");
    await userEvent.click(add_button);
    const input = screen.getByTestId("title_input");
    await userEvent.type(input, "Reactの勉強");
    expect(input).toHaveValue("Reactの勉強");
  });
  test("新規登録ボタンをクリックできる", async () => {
    render(<App />);
    await waitFor(() => screen.getByTestId("add_button"));
    await userEvent.click(screen.getByTestId("add_button"));
  });
  test("新規登録ボタンがあること", async () => {
    render(<App />);
    await waitFor(() => screen.getByTestId("add_button"));
    const add_button = screen.getByTestId("add_button");
    expect(add_button).toBeInTheDocument();
  });
  
  test("ローディング画面が表示される", async () => {
    //ローディング用遅延処理
    mockFetchRecord.mockImplementationOnce(() => { //1回だけこう動いてと命令する関数
    return new Promise((resolve) => { 
      setTimeout(() => { //遅らせたい処理
        resolve({ data: [], error: null }); //resolveは処理が成功して、データを返すよという合図
        }, 100);  
      });
    });
    render(<App />);
    await waitFor(() => screen.getByTestId("loading"));
    const loading = screen.getByTestId("loading");
    expect(loading).toBeInTheDocument();
  });

  
  test("タイトルがあること", async () => {
    render(<App />);
    await waitFor(() => screen.getByTestId("table"));
    const title = screen.getByTestId("title");

    expect(title).toBeInTheDocument();
  });

  test("StudyRecordが4つ表示されること", async () => {
    mockFetchRecord.mockResolvedValueOnce({
      data: [
        new StudyRecord("1", "title1", 60, "2021-01-01T00:00:00Z"),
        new StudyRecord("2", "title2", 23, "2021-01-01T00:00:00Z"),
        new StudyRecord("3", "title3", 24, "2021-01-01T00:00:00Z"),
        new StudyRecord("4", "title4", 34, "2021-01-01T00:00:00Z"),
      ],
      error: null,
    });
  
    render(<App />);
    await waitFor(() => screen.getByTestId("table"));
    const todos = screen.getByTestId("table").querySelectorAll("tr");
  
    expect(todos.length - 1).toBe(4);
  });
});

