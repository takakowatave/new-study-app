import { StudyRecord, NewRecord } from "./domain/studyRecord";
import { Button, Box, Input, Heading, Flex, Table, Thead, Tbody,Tr,Th,Td, Modal,ModalOverlay,ModalContent, ModalHeader, ModalCloseButton,ModalBody,ModalFooter } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import React from 'react';
import { supabase } from "./utils/supabase";
import { useDisclosure } from '@chakra-ui/react';
import { useForm } from "react-hook-form";

//Dataの型定義
type FormValues = {
  text: string
  time: number
  created_at: string
};

const App = () => {
  const [records, setRecords] = useState<StudyRecord[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);


  const fetchRecords = async () => { // 非同期関数を定義
    setLoading(true); // ローディング
    const { data, error } = await supabase.from("study-record").select("*"); // Supabaseからデータを参照する定義
    if (error) {
      console.error("データ取得エラー:", error); // エラーだったらメッセージ出す
      return;
    }
    setRecords(data.map(d =>
      StudyRecord.newRecord(d.id, d.title, d.time, d.created_at) //4つの引数（id, title, time, created_at）が必要
    ));
    setLoading(false); // ローディングじゃない時
  };
  
  const handleAdd = async (data: FormValues) => {
    console.log("送信されたフォームの値:", data);
    //errorの処理
    setLoading(true);
    if (data.text.trim()==="")  {
      console.error("学習内容を入力してください", error);
      return;  
    };
    //newRecord(型)をオブジェクトとして定義
    const newRecord: NewRecord = {
      title: data.text,
      time: Number(data.time),
      created_at: new Date(data.created_at).toISOString(),
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
      reset()
    }
    catch (error) {
      console.error("Supabaseエラー:", error.message);
      return;
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []); // 空の第二引数を渡して「何も依存しない」＝「初回だけ動く」ようにする

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
  <Box w="100%" h="100%" p="8">
    <Flex justify="center" align="center">
      <Heading as="h1">学習アプリ</Heading>
      <Button onClick={onOpen}>登録</Button>
    </Flex>
    <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>登録確認</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Box gap={4} display="flex" justifyContent="center" alignItems="center" h="500px" p="8">
        <Box w="400px" h="full" bg='gray.100' p="8">
          <form onSubmit={handleSubmit(handleAdd)}>
            日時
            <Input  my="2" bg='white'
              type="datetime-local"
              {...register("created_at", { required: "日時の入力は必須です" })}
            />
            {errors.createdAt && <Box color="red.500">{errors.createdAt.message}</Box>}
            内容
            <Input  my="2" bg='white'
              type="text"
              {...register("text", { required: "内容の入力は必須です"})}
            />
            {errors.text && <Box color="red.500">{errors.text.message}</Box>}
            時間
            <Input  my="2" bg='white'
              type="number"
              {...register("time", {
                required: "時間の入力は必須です",
                min: { value: 1, message: "時間は0以上である必要があります"}
              })}
            />
            {errors.time && <Box color="red.500">{errors.time.message}</Box>}
            <Button type="submit" colorScheme="teal" w="full" mt="8">保存</Button>
          </form>

        </Box>
        </Box>
      </ModalBody>
      <ModalFooter>
        <Button onClick={onClose}>閉じる</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
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
  
  );
};

export default App;
