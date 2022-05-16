import { useState, useEffect } from 'react'
import { useProvider, erc20ABI } from 'wagmi'
import { Contract, BigNumber, utils } from 'ethers'
const { formatEther } = utils

export const useTokenBalance = (tokenAddress?: string, userAddress?: string) => {
  const provider = useProvider()

  const [balance, setBalance] = useState<{
    value: BigNumber
    formatted: string
  }>()

  const [isLoading, setIsLoading] = useState(false)

  const shouldFetch = !!userAddress && !!tokenAddress

  useEffect(() => {
    if (!shouldFetch) {
      return
    }

    const tokenContract = new Contract(tokenAddress, erc20ABI, provider)

    if (tokenContract) {
      setIsLoading(true)

      tokenContract
        .balanceOf(userAddress)
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
  }, [userAddress, provider, shouldFetch, tokenAddress])

  return { balance, isLoading }
}
