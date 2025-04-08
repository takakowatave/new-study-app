//AppComponent.spec.tsx

import { render, screen, waitFor } from "@testing-library/react";
import App from "../App";
import { StudyRecord } from "../domain/studyRecord";

//mock関数作成
const mockInsertRecord = jest.fn();
const mockDeleteRecord = jest.fn();
const mockFetchRecord = jest.fn().mockResolvedValue({
  data: [
    new StudyRecord("1", "title1", 60, "2021-01-01T00:00:00Z"),
    new StudyRecord("2", "title2", 23, "2021-01-01T00:00:00Z"),
    new StudyRecord("3", "title3", 24, "2021-01-01T00:00:00Z"),
    new StudyRecord("4", "title4", 34, "2021-01-01T00:00:00Z"),
  ],
  error: null,
});

//ローディング用遅延処理
mockFetchRecord.mockImplementationOnce(() => { //1回だけこう動いてと命令する関数
return new Promise((resolve) => { 
  setTimeout(() => { //遅らせたい処理
    resolve({ data: [], error: null }); //resolveは処理が成功して、データを返すよという合図
  }, 100);
  });
});


jest.mock("../lib/fetchRecords", () => ({
  __esModule: true,
  fetchRecord: () => mockFetchRecord(),
}));

jest.mock("../lib/insertRecords", () => ({
  __esModule: true,
  insertRecord: () => mockInsertRecord(),
}));

jest.mock("../lib/deleteRecords", () => ({
  __esModule: true,
  deleteRecord: () => mockDeleteRecord(),
}));


describe("App", () => {
  test("新規登録ボタンがあること", async () => {
    render(<App />);
    await waitFor(() => screen.getByTestId("add_button"));
    const title = screen.getByTestId("add_button");

    expect(title).toBeInTheDocument();
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
    render(<App />);

    await waitFor(() => screen.getByTestId("table"));
    const todos = screen.getByTestId("table").querySelectorAll("tr");

    expect(todos.length - 1).toBe(4);
  });
});