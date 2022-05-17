import { Navbar } from '@components/Navbar'
import Head from 'next/head'
import React, { useCallback, useEffect, useState } from 'react'
import useSetJS from '@libs/setjs'
import { MODULE_ADDRESSES } from '@libs/constants'
import { SetDetails } from 'set.js/dist/types/src/types'
import { SetJsEthereumMainnetAddresses } from '@libs/setjs'

const Manage = () => {

    const setJSInstance = useSetJS()
    const [setDetails, setSetDetails] = useState<SetDetails>()
    const [indexToken, setIndexToken] = useState('0xEc1d135B4979779Ce172262F216BfB3d89bEa41D')

    const [enableIssuance, setEnableIssuance] = useState(false)
    const [enableTrade, setEnableTrade] = useState(false)
    const [enableFee, setEnableFee] = useState(false)
    const [enableWrap, setEnableWrap] = useState(false)
    const [enableFarm, setEnableFarm] = useState(false)


    const updateSetDetails = useCallback(async () => {
        if (!setJSInstance) {
            return
        }
        setJSInstance.setToken.getModulesAsync(indexToken).then(async (modules) => {
            for (const module of modules) {
                console.log('🚀 ~ file: dashboard.tsx ~ line 67 ~ .then ~ module', module)
                switch (module) {
                    case SetJsEthereumMainnetAddresses.basicIssuanceModuleAddress:
                        setEnableIssuance(true)
                        break
                    case SetJsEthereumMainnetAddresses.tradeModuleAddress:
                        setEnableTrade(true)
                        break
                    case SetJsEthereumMainnetAddresses.streamingFeeModuleAddress:
                        setEnableFee(true)
                        break
                    case SetJsEthereumMainnetAddresses.wrappedSetModuleAddress:
                        setEnableWrap(true)
                        break
                    case SetJsEthereumMainnetAddresses.delegatedManagerFactoryAddress:
                        setEnableFarm(true)
                        break
                }
            }

        })
    }, [setJSInstance])

    const triggerSetEnableIssuance = () => {
        setEnableIssuance(!enableIssuance)
    }

    const triggerSetTrade = () => {
        setEnableTrade(!enableTrade)
    }

    const triggerSetEnableFee = () => {
        setEnableFee(!enableFee)
    }

    const triggerSetEnableWrap = () => {
        setEnableWrap(!enableWrap)
    }

    const triggerSetEnableFarm = () => {
        setEnableFarm(!enableFarm)
    }

    const updateEnableTrade = useCallback(async () => {
        if (!setJSInstance) {
            return
        }

        if (enableTrade) {
            return
        }

        setJSInstance.trade.
            initializeAsync(indexToken)
            .then(() => {
                console.log('🚀 ~ file: dashboard.tsx ~ line 93 ~ .then')
                updateSetDetails()
            })

    }, [enableTrade])


    useEffect(() => {
        updateSetDetails()
    }, [setJSInstance, updateSetDetails])

    useEffect(() => {
        updateEnableTrade()
    }, [setJSInstance, updateEnableTrade])


    const handleIndexLoad = () => {
        if (!setJSInstance) {
            return
        }
        updateSetDetails()
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
                    <div className='flex justify-center'>

                        <div className="flex justify-around flex-col">
                            <div className='flex justify-center pb-6'>
                                <h1 className="text-2xl font-bold text-gray-800">Manager Actions</h1>
                            </div>

                            <div className='p-3 flex flex-row'>
                                <input
                                    type="text"
                                    name="price"
                                    id="price"
                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                                    placeholder={indexToken}
                                    onChange={(e) => setIndexToken(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="items-center m-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    onClick={handleIndexLoad}
                                >
                                    Load
                                </button>
                            </div>

                            <label className="relative inline-flex items-center mb-4 cursor-pointer">
                                <input onChange={triggerSetEnableIssuance} type="checkbox" checked={enableIssuance} id="default-toggle" className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Issuance Module</span>
                            </label>
                            <label className="relative inline-flex items-center mb-4 cursor-pointer">
                                <input onChange={triggerSetTrade} type="checkbox" checked={enableTrade} id="default-toggle" className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Trade Module</span>
                            </label>
                            <label className="relative inline-flex items-center mb-4 cursor-pointer">
                                <input onChange={triggerSetEnableFee} type="checkbox" checked={enableFee} id="checked-toggle" className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Stream Fee Module</span>
                            </label>

                            <label className="relative inline-flex items-center mb-3 cursor-pointer">
                                <input onChange={triggerSetEnableWrap} type="checkbox" checked={enableWrap} id="disabled-toggle" className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Wrap Module</span>
                            </label>
                            <label className="relative inline-flex items-center mb-3 cursor-pointer">
                                <input onChange={triggerSetEnableFarm} type="checkbox" checked={enableFarm} id="disabled-toggle" className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Farm Module</span>
                            </label>

                            <button
                                type="button"
                                className="items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            // onClick={handleIssue}
                            >
                                Enable All
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Manage
