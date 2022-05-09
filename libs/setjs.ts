import { useEffect, useState } from 'react'
import { useSigner } from 'wagmi'
import Set from 'set.js'

// ETH Mainnet
// const SetJsEthereumMainnetAddresses = {
//   controllerAddress: '0xa4c8d221d8BB851f83aadd0223a8900A6921A349',
//   setTokenCreatorAddress: '0xeF72D3278dC3Eba6Dc2614965308d1435FFd748a',
//   basicIssuanceModuleAddress: '0x508910aA6fF3D029Dc358dD0f775877A355BA35B',
//   debtIssuanceModuleAddress: '0x338BEf3f37794dd199d6910E6109125D3eCa6048',
//   debtIssuanceModuleV2Address: '0x3C0CC7624B1c408cF2cF11b3961301949f2F7820',
//   streamingFeeModuleAddress: '0x3D8d14b7eFb8e342189ee14c3d40dCe005EB901B',
//   tradeModuleAddress: '0x45D67b9dbEA9bd51ED2B67832addEAF839628fAa',
//   navIssuanceModuleAddress: '0x33f6184b1695a8Fe344Ea6b7De11aA35A74Ec300',
//   protocolViewerAddress: '0x15D860670b7DC211714282f1583CF591Cc3A945E',
//   masterOracleAddress: '0xA60f9e1641747762aDE7FD5F881b90B691E92B0a',
//   governanceModuleAddress: '',
//   slippageIssuanceModuleAddress: '',
//   perpV2LeverageModuleAddress: '',
//   perpV2LeverageModuleViewerAddress: '',
//   perpV2BasisTradingModuleAddress: '',
//   perpV2BasisTradingModuleViewerAddress: '',
//   delegatedManagerFactoryAddress: '',
//   issuanceExtensionAddress: '',
//   tradeExtensionAddress: '',
//   streamingFeeExtensionAddress: '',
// }

// Matic
export const SetJsEthereumMainnetAddresses = {
  controllerAddress: '0x75FBBDEAfE23a48c0736B2731b956b7a03aDcfB2',
  setTokenCreatorAddress: '0x14f0321be5e581abF9d5BC76260bf015Dc04C53d',
  basicIssuanceModuleAddress: '0x38E5462BBE6A72F79606c1A0007468aA4334A92b',
  streamingFeeModuleAddress: '0x8440f6a2c42118bed0D6E6A89Bf170ffd13e21c0',
  tradeModuleAddress: '0xd04AabadEd11e92Fefcd92eEdbBC81b184CdAc82',
  protocolViewerAddress: '0x8D5CF870354ffFaE0586B639da6D4E4F6C659c69',
  masterOracleAddress: '0x9378Ad514c00E4869656eE27b634d852DD48feAD',

  debtIssuanceModuleAddress: '0x338BEf3f37794dd199d6910E6109125D3eCa6048',
  debtIssuanceModuleV2Address: '0x3C0CC7624B1c408cF2cF11b3961301949f2F7820',
  navIssuanceModuleAddress: '0x33f6184b1695a8Fe344Ea6b7De11aA35A74Ec300',
  governanceModuleAddress: '',
  slippageIssuanceModuleAddress: '',
  perpV2LeverageModuleAddress: '',
  perpV2LeverageModuleViewerAddress: '',
  perpV2BasisTradingModuleAddress: '',
  perpV2BasisTradingModuleViewerAddress: '',
  delegatedManagerFactoryAddress: '',
  issuanceExtensionAddress: '',
  tradeExtensionAddress: '',
  streamingFeeExtensionAddress: '',
}

export default function useSetJS() {
  const [{ data: signer }] = useSigner()

  const [instance, setInstance] = useState<Set>()

  useEffect(() => {
    if (!signer) {
      return
    }

    const setJsInstance = new Set({
      ethersProvider: signer.provider,
      ...SetJsEthereumMainnetAddresses,
    })

    setInstance(setJsInstance)
  }, [signer])

  return instance
}
