import { Navbar } from '@components/Navbar'
import Head from 'next/head'
import React, { useCallback, useEffect, useState } from 'react'
import useSetJS from '@libs/setjs'
import { SetJsEthereumMainnetAddresses } from '@libs/setjs'

const Buy = () => {

    const setJSInstance = useSetJS()
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
                
            </main>
        </div>
    )
}

export default Buy
