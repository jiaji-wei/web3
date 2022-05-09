import { useState, useEffect } from 'react'
import { useProvider, useAccount, erc20ABI } from 'wagmi'
import { Contract, BigNumber, utils } from 'ethers'
const { formatEther } = utils

export const useTokenBalance = (tokenAddress?: string) => {
  const provider = useProvider()

  const [{ data: accountData }] = useAccount()
  const address = accountData?.address

  const [balance, setBalance] = useState<{
    value: BigNumber
    formatted: string
  }>()

  const [isLoading, setIsLoading] = useState(false)

  const shouldFetch = !!address && !!tokenAddress

  useEffect(() => {
    if (!shouldFetch) {
      return
    }

    const tokenContract = new Contract(tokenAddress, erc20ABI, provider)

    if (tokenContract) {
      setIsLoading(true)

      tokenContract
        .balanceOf(address)
        .then((balance: BigNumber) => {
          const formatted = formatEther(balance)
          setBalance({
            value: balance,
            formatted,
          })
        })
        .catch((error: any) => {
          // eslint-disable-next-line no-console
          console.log(error)
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [address, provider, shouldFetch, tokenAddress])

  return { balance, isLoading }
}
