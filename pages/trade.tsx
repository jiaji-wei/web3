/* eslint-disable no-console */
import Head from 'next/head'
import React, { useCallback, useEffect, Fragment, useState } from 'react'
import { Navbar } from '@components/Navbar'
import { Position, SetDetails } from 'set.js/dist/types/src/types'
import useSetJS from '@libs/setjs'
import { MODULE_ADDRESSES } from '@libs/constants'
import { parseEther } from 'ethers/lib/utils'
import PositionList from '@components/PositionList'
import { useAccount } from 'wagmi'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import useTokenList, { tokenInfo } from '@libs/hooks/TokenList'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

type TradeProps = {
  Position: Position
  Name: string
}

const SET_TOKEN_ADDR = '0x2948EA0De1eCeccC78FDA018A1036B2F81C20dcB'

const Trade = () => {
  const setJSInstance = useSetJS()
  const [{ data: accountData }] = useAccount()
  const [setDetails, setSetDetails] = useState<SetDetails>()
  const [quantity, setQuantity] = useState('0')

  const [selected, setSelected] = useState<TradeProps>()
  const [swapTo, setSwapTo] = useState<tokenInfo>()
  const [components, setComponent] = useState<TradeProps[]>()


  const listOfTokens = useTokenList(
    "https://gateway.ipfs.io/ipns/tokens.uniswap.org",
  );

  console.log('listOfTokens', listOfTokens)

  const updateSetDetails = useCallback(async () => {
    if (!setJSInstance) {
      return
    }

    setJSInstance.setToken
      .fetchSetDetailsAsync(SET_TOKEN_ADDR, MODULE_ADDRESSES)
      .then((data) => {
        console.log('🚀 ~ file: dashboard.tsx ~ line 61 ~ .then ~ data', data)
        setSetDetails(data as SetDetails)
      })
  }, [setJSInstance])


  const updatePositions = useCallback(async () => {
    if (!setDetails) {
      return
    }
    setComponent([] as TradeProps[])

    const coms = [] as TradeProps[]
    console.log('coms', coms)
    for (let i = 0; i < setDetails.positions.length; i++) {
      const symbol = await setJSInstance?.erc20.getTokenSymbolAsync(setDetails.positions[i].component) ?? ''
      coms.push({ Position: setDetails.positions[i], Name: symbol })
    }
    setComponent(coms)
  }, [setDetails, setJSInstance?.erc20])

  useEffect(() => {
    updateSetDetails()
  }, [setJSInstance, updateSetDetails])

  useEffect(() => {
    updatePositions()
  }, [setDetails, updatePositions])

  const handleIssue = () => {
    if (!setJSInstance || !accountData?.address || !quantity) {
      return
    }

    setJSInstance.issuance
      .issueAsync(SET_TOKEN_ADDR, parseEther(quantity), accountData.address)
      .then((data) => {
        console.log(
          '🚀 ~ file: dashboard.tsx ~ line 75 ~ setJSInstance.issuance.issueAsync ~ data',
          data
        )
        updateSetDetails()
      })
      .catch((error) => console.log(error))
  }



  return (
    <div>
      <Head>
        <title>Web3 </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <Navbar />
      </header>

      <main className="pt-12">
        <div className="bg-white sm:rounded-md max-w-3xl mx-auto border p-6">
          <div className="px-6 py-2">
            <h4 className="text-2xl font-medium text-indigo-600 truncate">
              Index: [{setDetails?.name ?? '...'}] Index Symbol: [
              {setDetails?.symbol ?? '...'}]
            </h4>
            <h4 className="text-xl font-medium text-gray-600 truncate">
              Trade from one token to another for all participants in your
              Index.
            </h4>
          </div>

          <div className="px-6 py-2">
            <h4 className="text-2xl font-medium text-indigo-600 truncate">
              Components:
            </h4>
            <PositionList positions={setDetails?.positions} />
          </div>

          <div className="flex border-t p-6">
            <div>
              <Listbox value={selected} onChange={setSelected}>
                {({ open }) => (
                  <>
                    <Listbox.Label className="block text-sm font-medium text-gray-700">From</Listbox.Label>

                    <div className="mt-1 relative">
                      <Listbox.Button className="relative bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm w-28 h-9">
                        <span className="flex items-center">
                          {/* <img src={selected.avatar} alt="" className="flex-shrink-0 h-6 w-6 rounded-full" /> */}
                          <span className="ml-3 block truncate">{selected?.Name}</span>
                        </span>
                        <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </span>
                      </Listbox.Button>

                      <Transition
                        show={open}
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                          {components?.map((component) => (
                            <Listbox.Option
                              key={component.Name}
                              className={({ active }) =>
                                classNames(
                                  active ? 'text-white bg-indigo-600' : 'text-gray-900',
                                  'cursor-default select-none relative py-2 pl-3 pr-9'
                                )
                              }
                              value={component}
                            >
                              {({ selected, active }) => (
                                <>
                                  <div className="flex items-center">
                                    {/* <img src={person.avatar} alt="" className="flex-shrink-0 h-6 w-6 rounded-full" /> */}
                                    <span
                                      className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                                    >
                                      {component.Name}
                                    </span>
                                  </div>

                                  {selected ? (
                                    <span
                                      className={classNames(
                                        active ? 'text-white' : 'text-indigo-600',
                                        'absolute inset-y-0 right-0 flex items-center pr-4'
                                      )}
                                    >
                                      <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                    </span>
                                  ) : null}
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </>
                )}
              </Listbox>
            </div>
            <div className='px-5'>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Amount
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="text"
                  name="price"
                  id="price"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0.00"
                  onChange={(e) => setQuantity(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <label htmlFor="currency" className="sr-only">
                    Currency
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex border-t p-6 items-center gap-4">
            <div className='space-y-4'>
              <Listbox value={swapTo} onChange={setSwapTo}>
                {({ open }) => (
                  <>
                    <Listbox.Label className="block text-sm font-medium text-gray-700">To</Listbox.Label>

                    <div className="mt-1 relative w-52">
                      <Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        <span className="flex items-center">
                          <img src={swapTo?.logoURI} alt="" className="flex-shrink-0 h-6 w-6 rounded-full" />
                          <span className="ml-3 block truncate">{swapTo?.symbol}</span>
                        </span>
                        <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </span>
                      </Listbox.Button>

                      <Transition
                        show={open}
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                          {listOfTokens?.map((token) => (
                            <Listbox.Option
                              key={token.address}
                              className={({ active }) =>
                                classNames(
                                  active ? 'text-white bg-indigo-600' : 'text-gray-900',
                                  'cursor-default select-none relative py-2 pl-3 pr-9'
                                )
                              }
                              value={token}
                            >
                              {({ selected, active }) => (
                                <>
                                  <div className="flex items-center">
                                    <img src={token.logoURI} alt="" className="flex-shrink-0 h-6 w-6 rounded-full" />
                                    <span
                                      className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                                    >
                                      {token.symbol}
                                    </span>
                                  </div>

                                  {selected ? (
                                    <span
                                      className={classNames(
                                        active ? 'text-white' : 'text-indigo-600',
                                        'absolute inset-y-0 right-0 flex items-center pr-4'
                                      )}
                                    >
                                      <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                    </span>
                                  ) : null}
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </>
                )}
              </Listbox>
              <input
                type="number"
                className="focus:ring-indigo-500 focus:border-indigo-500 block sm:text-sm border-gray-300 rounded-md w-24"
                placeholder="0.1"
                onChange={(e) => setQuantity(e.target.value)}
              />
              <button
                type="button"
                className="items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={handleIssue}
              >
                Swap
              </button>
            </div>
          </div>


        </div>
      </main>
    </div>
  )
}

export default Trade
