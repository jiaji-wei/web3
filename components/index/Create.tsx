import React, { useState } from 'react'
import { utils, BigNumber } from 'ethers'
import TokenDetail from './TokenDetail'
import useSetJS from '@libs/setjs'
import { useAccount } from 'wagmi'
import { useCoinGecko } from '@libs/hooks/useCoinGecko'
import { MODULE_ADDRESSES } from '@libs/constants'

const { isAddress } = utils

export type Token = {
  address: string
  allocation: string
}

type Address = string

type Set = {
  componentAddresses?: Address[]
  units?: BigNumber[]
  moduleAddresses?: Address[]
  managerAddress?: Address
  name?: string
  symbol?: string
  // Starting price
  price?: string
}

export default function Create() {
  const [tokenSet, setTokenSet] = useState<Token[]>([])
  const [setData, setSetData] = useState<Set>()

  const [addContractData, setAddContractData] = useState({
    contractAddress: '',
  })

  const handleRemoveTokenClick = (newToken: Token) => {
    const newTokenSet = tokenSet.filter(
      (token) => token.address !== newToken.address
    )
    setTokenSet(newTokenSet)
  }

  const handleAddTokenChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    e.preventDefault()
    const { value } = e.target
    setAddContractData({ contractAddress: value })
  }

  const handleAddTokenSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    const { contractAddress } = addContractData

    if (
      contractAddress &&
      isAddress(contractAddress) &&
      !tokenSet.find((token) => token.address === contractAddress)
    ) {
      setTokenSet([...tokenSet, { address: contractAddress, allocation: '0' }])
    }
  }

  const handleAllocationChange = (newToken: Token) => {
    const newDataSet = tokenSet.map((token) => {
      if (token.address === newToken.address) {
        return { ...token, allocation: newToken.allocation }
      }
      return token
    })
    setTokenSet(newDataSet)
  }

  const setJSInstance = useSetJS()
  const coingecko = useCoinGecko()
  const [{ data: accountData }] = useAccount()

  const handleSetSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !setJSInstance ||
      !accountData?.address ||
      !coingecko ||
      !setData?.price ||
      !setData?.name ||
      !setData?.symbol
    ) {
      return
    }

    try {
      const ids = await Promise.all(
        tokenSet.map((token) =>
          coingecko
            .contract({
              // @ts-expect-error, package has wrong id type
              id: 'polygon-pos',
              contract_address: token.address.toLowerCase(),
            })
            .then((v) => v.id)
        )
      )

      const idPairs = ids.reduce((acc, id, i) => {
        return {
          ...acc,
          [tokenSet[i].address.toLowerCase()]: id,
        }
      }, {}) as { [address: string]: string }

      const currency = 'usd'

      const prices = await coingecko.simplePrice({
        ids: ids.join(','),
        vs_currencies: currency.toUpperCase(),
      })

      const givenPrice = setData?.price

      // 1/tokenPrice * givenPrice * percent
      // unit = givenPrice * percent / tokenPrice
      const units = tokenSet.map((token) => {
        const id = idPairs[token.address.toLowerCase()]
        const tokenPrice = prices[id][currency]

        if (!tokenPrice) {
          throw new Error(`No price for ${id}`)
        }
        const noDecimalTokenPrice = BigNumber.from(tokenPrice * 1_000_000).div(
          1_000_000
        )

        // TODO: Use decimal from token instead of hardcoded address
        const isWbtc =
          token.address === '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6'
        const decimal = isWbtc ? 8 : 18

        const unit = BigNumber.from(givenPrice)
          .mul('1'.padEnd(decimal + 1, '0'))
          .div(noDecimalTokenPrice)
          .mul(token.allocation)
          .div(100)
        return unit
      })

      const componentAddresses = tokenSet.map((token) => token.address)
      const { name, symbol } = setData

      setJSInstance.setToken.createAsync(
        componentAddresses,
        units,
        MODULE_ADDRESSES,
        accountData.address,
        name,
        symbol
      )
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(
        '🚀 ~ file: Create.tsx ~ line 147 ~ handleSetSubmit ~ error',
        error
      )
    }
  }

  return (
    <div className="px-1 py-10">
      <div className="flex justify-center pt-5">
        <div className="divide-y-2 space-y-4">
          <div className="">
            <div>
              <h2 className="text-2xl">Add a Token</h2>
            </div>
            <div className="py-1">
              <form
                className="space-y-8 divide-y divide-gray-200"
                onSubmit={handleAddTokenSubmit}
              >
                <div className="space-y-8 divide-y divide-gray-200">
                  <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-4">
                      <label
                        htmlFor="token"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Token address
                      </label>
                      <div className="flex items-center">
                        <input
                          type="text"
                          name="token"
                          id="token"
                          autoComplete="token"
                          className="flex-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full min-w-0 rounded sm:text-sm border-gray-300"
                          onChange={handleAddTokenChange}
                        />
                        <button
                          type="submit"
                          className="ml-1 bg-indigo-500 text-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="">
            <div className="flex gap-4">
              <div className="text-center font-normal mr-4 py-6">
                Token Name
              </div>
              <div className="text-center font-normal mr-4 py-6">
                Allocation
              </div>
              <div className="text-center font-normal mr-4 py-6">Action</div>
            </div>
            {tokenSet.length ? (
              <div className="text-center">
                {tokenSet.map((data) => (
                  <TokenDetail
                    token={data}
                    key={data.address}
                    onRemove={handleRemoveTokenClick}
                    onAllocationChange={handleAllocationChange}
                  />
                ))}
              </div>
            ) : (
              <span>Empty</span>
            )}
          </div>

          <form onSubmit={handleSetSubmit} className="py-4">
            <div className="mb-6">
              <label className="block mb-1 text-base font-medium text-gray-900 dark:text-gray-300">
                Create a name for your Index
              </label>
              <label className="block mb-2 text-sm font-medium text-gray-400 dark:text-gray-300">
                Great Index names are unique, short, and easy to remember. They
                must be 32 characters or less.
              </label>
              <input
                id="name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="e.g. Ethereum Volatility Index"
                onChange={(e) =>
                  setSetData((ps) => ({ ...ps, name: e.target.value }))
                }
                required
              />
            </div>
            <div className="mb-6">
              <label className="block mb-1 text-base font-medium text-gray-900 dark:text-gray-300">
                Create a symbol for your Index
              </label>
              <label className="block mb-2 text-sm font-medium text-gray-400 dark:text-gray-300">
                Symbols are a 3 to 5 character name to represent your trading
                pool, e.g. ETH or BTC.
              </label>
              <input
                id="symbol"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="EVOLI"
                onChange={(e) =>
                  setSetData((ps) => ({ ...ps, symbol: e.target.value }))
                }
                required
              />
            </div>
            <div className="mb-6">
              <label className="block mb-1 text-base font-medium text-gray-900 dark:text-gray-300">
                Select a starting price
              </label>
              <label className="block mb-2 text-sm font-medium text-gray-400 dark:text-gray-300">
                This will be the starting price of your Index in USD once{' '}
                {"it's"}
                been created.
              </label>
              <input
                id="price"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="100"
                onChange={(e) =>
                  setSetData((ps) => ({ ...ps, price: e.target.value }))
                }
                required
              />
            </div>
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
