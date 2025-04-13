import { StudyRecord, NewRecord, formatDateForInput } from "./domain/studyRecord";
import { Button, Box, NumberInputField, NumberInput, NumberDecrementStepper, NumberIncrementStepper, NumberInputStepper, Input, Heading, Flex, Table, Thead, Tbody,Tr,Th,Td, Modal,ModalOverlay,ModalContent, ModalHeader, ModalCloseButton,ModalBody } from '@chakra-ui/react';
import { useState, useEffect, useCallback } from 'react';
import { useDisclosure, useToast } from '@chakra-ui/react';
import { useForm,Controller } from "react-hook-form";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { fetchRecord } from "./lib/fetchRecords";
import { insertRecord } from "./lib/insertRecords";
import { deleteRecord } from "./lib/deleteRecords";
import { updateRecord } from "./lib/updateRecords";

//Dataの型定義
export type FormValues = {
  text: string
  time: number
  created_at: string
};

const App = () => {
  const [records, setRecords] = useState<StudyRecord[]>([]);
  const [editingRecord, setEditingRecord] = useState<StudyRecord | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<FormValues>();
  const [loading, setLoading] = useState(false);
  const toast = useToast();

const getModalTitle = () => {
  return editingRecord ? "記録編集" : "新規登録"; //editingRecord が存在すれば記録編集、存在しなければ新規登録を返す
};
  
const handleClose = () => {
  setEditingRecord(null); 
  reset({
    text: "",
    time: 0,
    created_at: formatDateForInput(new Date().toString())
  });       
  onClose();
  return;
};

const onSubmit = async (data: FormValues) => {
if (editingRecord) {
  await updateRecord(editingRecord.id, data);
  loadRecords();
  console.log("更新完了")
  onClose();
  toast({
    title: "保存しました",
    status: "success",
    duration: 3000,
    isClosable: true,
    position: "top",
  });
  // 成功時：reset(), onClose(), toast など
} else {
  await handleAdd(data); // 新規登録時はそのまま使う
}
};

const loadRecords = useCallback(async () => { //一覧をデータベースの最新に合わせて更新する
  setLoading(true); // ローディング
  try {
    const { error, data } = await fetchRecord();
    if (error) {
      reset()
      onClose();
      toast({
        title: "エラーが起こりました",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }
  setRecords(
    data ? data.map(d => // data が null じゃなかったら map してセット。null だったら空の配列をセット
    StudyRecord.newRecord(d.id, d.title, d.time, d.created_at) //4つの引数（id, title, time, created_at）が必要
  ): []);
    } catch (err) {
    if (err) {
      reset()
      onClose();
      toast({
        title: "エラーが起こりました",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    } finally {
      setLoading(false); 
    }
}, [onClose, reset, toast]);

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
  const { error } = await insertRecord(newRecord);
    if (error) {
      reset()
      onClose();
      toast({
        title: "supabaseでエラーが起こりました",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

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
    return;
  }
  catch (error) {
    if (error) {
      reset()
      onClose();
      toast({
        title: "supabaseでエラーが起こりました",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    return;
  }}
  finally {
    setLoading(false);
  }
};

const handleDelete = async (record: StudyRecord) => {
  const { error } = await deleteRecord(record.id);
    if (error) {
      reset()
      onClose();
      toast({
        title: "supabaseでエラーが起こりました",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    return;
  }
  await loadRecords();
};

useEffect(() => {
  loadRecords();
}, [loadRecords]); // 空の第二引数を渡して「何も依存しない」＝「初回だけ動く」ようにする

useEffect(() => { //編集ボタン押下後、フォームに初期値をセットする
if (editingRecord) {
  reset({
    created_at: formatDateForInput(editingRecord.created_at),
    text: editingRecord.title,
    time: editingRecord.time,
  });
}
}, [editingRecord, reset]);

if (loading) {
  return <Box alignItems="center" h="100vh" display="flex" justifyContent="center"><p data-testid="loading">Loading...</p></Box>;
}


  return (
  <Box mx="auto" flexDirection="column" display="flex" w="600px" alignItems="center" h="100vh" p="8">
    <Flex alignItems="center" justifyContent="space-between" w="100%">
      <Heading as="h1" data-testid="title">学習アプリ</Heading>
      <Button data-testid="add_button" colorScheme="teal" onClick={onOpen}>新規登録</Button>
    </Flex>
    <Modal isOpen={isOpen} onClose={handleClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader data-testid="modal_title">{getModalTitle()}</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Box gap={4} justifyContent="center" p="4">
        <Box w="100%">
          <form onSubmit={handleSubmit(onSubmit)}>
            日時
            <Input my="2" bg='white'
              data-testid="datetime_input"
              type="datetime-local"
              {...register("created_at", { required: "日時の入力は必須です" })}
            />
            {errors.created_at && <Box color="red.500">{errors.created_at.message}</Box>}
            内容
            <Input data-testid="title_input" my="2" bg='white'
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
                  min={0}
                  >
                  <NumberInputField data-testid="time_input" bg="white" my="1"/>
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
              )}
            />
            {errors.time && <Box color="red.500">{errors.time.message}</Box>}
            <Button data-testid="save_button" type="submit" colorScheme="teal" w="100%" my="4">保存</Button>
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
                <Button data-testid={`delete_button_${record.id}`} //テスト側から個別の削除ボタンを正確に指定できるように
                    size="sm" 
                    bg="white"
                    color="gray.500" 
                    onClick= {() => handleDelete(record)}>
                      <MdDelete />
                </Button>
                <Button data-testid={`editing_button_${record.id}`} //テスト側から個別の削除ボタンを正確に指定できるように
                    size="sm" 
                    bg="white"
                    color=" gray.500" 
                    onClick= {() => { setEditingRecord(record); onOpen(); }}>
                      <MdEdit />
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
