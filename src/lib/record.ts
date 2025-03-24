import { supabase } from "../utils/supabase";
import { Record } from "../domain/record";

export async function GetAllTodos(): Promise<Record[]> {
  const response = await supabase.from("todos").select("*");
  if (response.error) {
    throw new Error(response.error.message);
  }

  const todosData = response.data.map((Record) => {
    return Record.newTodo(Record.id, Record.title, Record.done, Record.created_at);
    // return new Record(....)
  });

  return todosData;
}