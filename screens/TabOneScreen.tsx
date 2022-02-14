import { useState, useCallback, useEffect } from 'react'
import { StyleSheet } from 'react-native';
import { ethers } from 'ethers'
import { useToast, Button, Box, Center, Text } from 'native-base'
import { RootTabScreenProps } from '../types';

const MNEMONIC =
  "post finish turkey bulb glory banner hybrid sock scout outdoor close planet";
const provider = new ethers.providers.JsonRpcProvider(
  "https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
);
const hdNode = ethers.utils.HDNode.fromMnemonic(MNEMONIC);
const child = hdNode.derivePath("m/44'/60'/0'/0/0");
const wallet = new ethers.Wallet(child.privateKey, provider);
const address = child.address;

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const [values, setValue] = useState("0");
  const [loading, setLoading] = useState(false)
  const [txid, setTxid] = useState('')
  const toast = useToast()
  useEffect(() => {
    provider.getBalance(address).then((res) => {
      const result = ethers.utils.formatUnits(res, "ether");
      console.log("result", result);
      setValue(result);
    });
  }, []);
  const sendEther = useCallback(async () => {
    setLoading(true)
    setTxid('')
    try {
      const res = await wallet.sendTransaction({
        to: "0x56820e4a871c7fbe20c348718bfbb91af496d6a3",
        value: ethers.utils.parseEther("0.001"),
        gasLimit: 21000,
      });
      setTxid(res.hash)
      toast.show({ description: 'success!!' })
      console.log('res', res)
    } finally {
      setLoading(false)
    }
  }, []);
  return (
    <Center w='full' h='full'>
      <Box><Text>MNEMONIC: {MNEMONIC}</Text></Box>
      <Box><Text> m/44'/60'/0'/0/0 address: {address}</Text></Box>
      <Box><Text>balance: ${values} ether</Text></Box>
      <Button onPress={sendEther} isLoading={loading}>send 0x56820e4a871c7fbe20c348718bfbb91af496d6a3 0.001 ether</Button>
      { txid && <Box><Text>txid: {txid}</Text></Box> }
    </Center>
  );
}
