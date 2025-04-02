import { StudyRecord, NewRecord } from "./domain/studyRecord";
import { Button, Box, Input, Heading, Flex, Table, Thead, Tbody,Tr,Th,Td, } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import React from 'react';
import { supabase } from "./utils/supabase";

const App = () => {
  const [records, setRecords] = useState<StudyRecord[]>([]);
  const [time, setTime] = useState('');
  const [text, setText] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');


  const fetchRecords = async () => { // 非同期関数を定義
    setLoading(true); // ローディング
    const { data, error } = await supabase.from("study-record").select("*"); // Supabaseからデータを参照する定義
    if (error) {
      setErrorMessage(error.message); // エラーだったらメッセージ出す
      return;
    }
    setRecords(data);
    setLoading(false); // ローディングじゃない時
  };
  
  const handleAdd = async () => {
    //errorの処理
    setLoading(true);
    if (text.trim()==="")  {
      setErrorMessage("学習内容を入力してください");
      return;  
    }
    //newRecord(型)をオブジェクトとして定義
    const newRecord: NewRecord = {
      title: text,
      time: Number(time),
      created_at: new Date(createdAt).toISOString(),
    };
    console.log("送信データ", newRecord);
    //supabaseの処理
    try {
    const { data, error } = await supabase
      .from("study-record")
      .insert([newRecord])
      .select();
      if (!data) {
        throw new Error("サーバーでエラーが発生しました");
      }
    //studyRecord クラスを使いそのコンストラクタに data[0] を渡すことでインスタンス化する
    const inserted = StudyRecord.newRecord(
      data[0].id,
      data[0].title,
      data[0].time,
      data[0].created_at
    ); 
    await fetchRecords();
    setText('')
    setTime('')
    setCreatedAt('')
    }
    catch (error) {
      console.error("Supabaseエラー:", error.message);
      setErrorMessage("データの保存に失敗しました: " + error.message);
      return;
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []); // 空の第二引数を渡して「何も依存しない」＝「初回だけ動く」ようにする

  return (
  <Box w="100%" h="100%" p="8">
    <Flex justify="center" align="center">
      <Heading as="h1">学習アプリ</Heading>
  </Flex>
    <Box gap={4} display="flex" justifyContent="center" alignItems="center" h="500px" p="8">
      <Box w="400px" h="full" bg='gray.100' p="8">
        <form>
          日時
          <Input  my="2" bg='white'
            type="datetime-local"
            value={createdAt}
            onChange={(e) => setCreatedAt(e.target.value)}
          />
        </form>
        <form>
          内容
          <Input  my="2" bg='white'
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </form>
        <form>
          時間
          <Input  my="2" bg='white'
            type="number"
            value={time}
            min="0"
            onChange={(e) => setTime(e.target.value)}
          />
        </form>
        <Button
          onClick={handleAdd}
          colorScheme="teal" w="full" mt="8">保存</Button>
      </Box>
      <Box w="400px" p="8"  h="full" justifyContent="center" alignItems="center">
        <Table variant="simple">
        <Thead>
          <Tr>
            <Th>日時</Th>
            <Th>内容</Th>
            <Th>時間</Th>
          </Tr>
        </Thead>
        <Tbody>
          {records.map((r) => (
          <Tr key={r.id}>
            <Td>{r.created_at}</Td>
            <Td>{r.title}</Td>
            <Td>{r.time}</Td>
          </Tr>
          ))}
        </Tbody>
      </Table>
      </Box>
    </Box>
  </Box>
  );
};

export default App;
