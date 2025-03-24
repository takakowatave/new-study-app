import { Button, Box, Input, Heading } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import React from 'react';
import { supabase } from "./supabaseClient.js";

const A = () => {
  const [record, setRecord] = useState([]);
  const [time, setTime] = useState('');
  const [text, setText] = useState('');
  const [loeading, setLoeading] = useState([]);
  const [errorMessage, setErrorMessage] = useState([]);


  return (
    <Box bg='gray.50' display="flex" flexDirection="column" alignItems="center" justifyContent="center" my="8" p="8">
      <Heading as="h1" size="xl" my="4">学習アプリ</Heading>
      <form>
        学習内容<Input  my="2" bg='white'
          type="text"
          value={text}
        />
      </form>
      <form>
        学習時間<Input  my="2" bg='white'
          type="number"
          value={time}
        />
      </form>
      <Button colorScheme="teal">保存</Button>
    </Box>
  );
};

export default A;
