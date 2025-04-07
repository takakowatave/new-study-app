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


describe("App", () => {
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
