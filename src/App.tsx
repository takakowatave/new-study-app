import { StudyRecord, NewRecord } from "./domain/studyRecord";
import { Button, Box, NumberInputField, NumberInput, NumberDecrementStepper, NumberIncrementStepper, NumberInputStepper, Input, Heading, Flex, Table, Thead, Tbody,Tr,Th,Td, Modal,ModalOverlay,ModalContent, ModalHeader, ModalCloseButton,ModalBody,ModalFooter } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useDisclosure, useToast } from '@chakra-ui/react';
import { useForm,Controller } from "react-hook-form";
import { CloseIcon } from '@chakra-ui/icons'
import { fetchRecord } from "./lib/fetchRecords";
import { insertRecord } from "./lib/insertRecords";
import { deleteRecord } from "./lib/deleteRecords";

//Dataの型定義
type FormValues = {
  text: string
  time: number
  created_at: string
};

const App = () => {
  const [records, setRecords] = useState<StudyRecord[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<FormValues>();
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleClose = () => {
    reset();       // フォーム内容・エラーの初期化
    onClose();     // モーダルを閉じる
  };

  const loadRecords = async () => { // 非同期関数を定義
    setLoading(true); // ローディング
    try {
      const { data, error } = await fetchRecord();
      if (error || !data) {
        throw new Error("データ取得に失敗しました");
      }
    setRecords(data.map(d =>
      StudyRecord.newRecord(d.id, d.title, d.time, d.created_at)) //4つの引数（id, title, time, created_at）が必要
    );
      } catch (err) {
        if (err instanceof Error) {
          console.error(err.message);
        } else {
          console.error("予期しないエラーが発生しました");
        }
      } finally {
        setLoading(false); 
      }
  };
  
  const handleAdd = async (data: FormValues) => {
    console.log("送信されたフォームの値:", data);
    //errorの処理
    setLoading(true);
    //newRecord(型)をオブジェクトとして定義
    const newRecord: NewRecord = {
      title: data.text,
      time: Number(data.time),
      created_at: new Date(data.created_at).toISOString(),
    };
    console.log("送信データ", newRecord);
    //supabaseの処理
    try {
    const { data, error } = await insertRecord(newRecord);
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
    await loadRecords();
      reset()
      onClose();
      toast({
        title: "追加しました",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
    catch (error) {
      console.error("Supabaseエラー:", error.message);
      return;
    }
    finally {
      setLoading(false);
    }
  };

  const handleDelete = async (record: StudyRecord) => {
    const { error } = await deleteRecord(record.id);
    if (error) {
      console.error("Supabaseエラー:", error.message);
      return;
    }
    await loadRecords();
  };

  useEffect(() => {
    loadRecords();
  }, []); // 空の第二引数を渡して「何も依存しない」＝「初回だけ動く」ようにする
  if (loading) {
    return <Box alignItems="center" h="100vh" display="flex" justifyContent="center"><p data-testid="loading">Loading...</p></Box>;
  }

  return (
  <Box mx="auto" flexDirection="column" display="flex" w="600px" alignItems="center" h="100vh" p="8">
    <Flex alignItems="center" justifyContent="space-between" w="100%">
      <Heading as="h1" data-testid="title">学習アプリ</Heading>
      <Button  data-testid="add_button" colorScheme="teal" onClick={onOpen}>登録</Button>
    </Flex>
    <Modal isOpen={isOpen} onClose={handleClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>登録確認</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Box gap={4} justifyContent="center" p="4">
        <Box w="100%">
          <form onSubmit={handleSubmit(handleAdd)}>
            日時
            <Input  my="2" bg='white'
              type="datetime-local"
              {...register("created_at", { required: "日時の入力は必須です" })}
            />
            {errors.created_at && <Box color="red.500">{errors.created_at.message}</Box>}
            内容
            <Input  my="2" bg='white'
              type="text"
              {...register("text", { required: "内容の入力は必須です"})}
            />
            {errors.text && <Box color="red.500">{errors.text.message}</Box>}
            時間
            <Controller
              name="time"
              control={control}
              rules={{
                required: "時間の入力は必須です",
                min: { value: 1, message: "時間は1以上である必要があります" },
              }}              
              render={({ field }) => (
                <NumberInput
                  value={field.value} //値を反映
                  onChange={(valueString) => field.onChange(Number(valueString))} //型を合わせる
                  min={1}
                  >
                  <NumberInputField bg="white" my="1"/>
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
              )}
            />
            {errors.time && <Box color="red.500">{errors.time.message}</Box>}
            <Button type="submit" colorScheme="teal" w="100%" my="4">保存</Button>
          </form>

        </Box>
        </Box>
      </ModalBody>
    </ModalContent>
  </Modal>
  <Box display="flex"  mx="auto" w="100%" my="8" justifyContent="center">
          <Table variant="simple" data-testid="table">
          <Thead>
            <Tr>
              <Th>日時</Th>
              <Th>内容</Th>
              <Th>時間</Th>
              <Th>編集</Th>
            </Tr>
          </Thead>
          <Tbody>
            {records.map((record: StudyRecord) => (
            <Tr key={record.id}>
              <Td>{record.created_at}</Td>
              <Td>{record.title}</Td>
              <Td>{record.time}</Td>
              <Td>
                <Button 
                    size="sm" 
                    bg="red.50"
                    color="red.500" 
                    onClick= {() => handleDelete(record)}>
                      {<CloseIcon />}
                </Button> 
              </Td>
            </Tr>
            ))}
          </Tbody>
        </Table>
        </Box>
  </Box> 
  );
};

export default App;

