import { Record } from "./domain/record";
import { Button, Box, Input, Heading, Flex, Table, Thead, Tbody,Tr,Th,Td, } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import React from 'react';
import { supabase } from "./utils/supabase";

const App = () => {
  const [record, setRecord] = useState<Record[]>([]);
  const [time, setTime] = useState('');
  const [text, setText] = useState('');
  const [createdAt, setcreatedAt] = useState('');
  const [loeading, setLoeading] = useState([]);
  const [errorMessage, setErrorMessage] = useState([]);

  const handleAdd = async () => {
  //errorの処理
    const message ="";
    if (text.trim()==="")  {
      message = "学習内容を入力してください";
    }
    if (message)  {
      setErrorMessage(message);
      return;
    }
  //インスタンスの初期化
  const newRecord = new Record(
    text,
    time,
    createdAt
  );
  
  console.log("newRecord の中身:", newRecord);
  //supabaseの処理
  const { data, error } = await supabase.from("study-record").insert([newRecord]);
    if (error) {
      setErrorMessage(message);
      return;
    }
    setRecord([...record, newRecord]);
  };

  return (
  <Box w="100%" h="100%" p="8">
    <Flex justify="center" align="center">
      <Heading as="h1">学習アプリ</Heading>
  </Flex>
    <Box  gap={4} display="flex" justifyContent="center" alignItems="center" h="500px" p="8">
      <Box w="400px" h="full" bg='gray.100' p="8">
        <form>
          日時
          <Input  my="2" bg='white'
            type="time"
            value={createdAt}
            onChange={(e) => setcreatedAt(e.target.value)}
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
          {record.map((r) => (
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
