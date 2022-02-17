import { StyleSheet } from 'react-native';

import * as bitcoin from "bitcoinjs-lib";
import * as bip39 from "bip39"
import { Box, Center, Text } from 'native-base'
import { useEffect, useState } from 'react';

const network = bitcoin.networks.regtest

const MNEMONIC =
  "post finish turkey bulb glory banner hybrid sock scout outdoor close planet";
  const seed0 = bip39.mnemonicToSeedSync(MNEMONIC)
  const master0 = bitcoin.bip32.fromSeed(seed0);
  const child0 = master0.derivePath("m/44'/0'/0'/0/0")

  let user0p2pkh = bitcoin.payments.p2pkh({ pubkey: child0.publicKey, network })
  let user0p2wpkh = bitcoin.payments.p2wpkh({ pubkey: child0.publicKey, network })
  let user0p2sh = bitcoin.payments.p2sh({ redeem: user0p2wpkh })

export default function TabTwoScreen() {
  const [val, setVal] = useState('0')
  useEffect(() => {
    fetch(`https://tbtc1.trezor.io/api/v1/utxo/${user0p2pkh.address}`).then(res => {
      return res.json()
    }).then(json => {
      if (Array.isArray(json)) {
        const total = json.reduce((a, b) => {
          return +a + (+b.amount)
        }, 0)
        setVal(total)
      }
    })
  }, [])

  return (
    <Center style={styles.container}>
      <Center mb='4'>
        <Box><Text>MNEMONIC:</Text></Box>
        <Box><Text textAlign={'center'}>{MNEMONIC}</Text></Box>
      </Center>
      <Center mb='4'>
        <Box><Text>m/44'/0'/0'/0/0 p2pkh address::</Text></Box>
        <Box>{user0p2pkh.address}</Box>
      </Center>
      <Center mb='4'>
        <Box><Text>m/44'/0'/0'/0/0 p2wpkh address</Text></Box>
        <Box>{user0p2wpkh.address}</Box>
      </Center>
      <Center mb='4'>
        <Box><Text>m/44'/0'/0'/0/0 p2sh address balace:</Text></Box>
        <Box><Text> {val} BTC</Text></Box>
      </Center>
    </Center>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
