/* eslint-disable no-console */
import Head from 'next/head'
import React, { useCallback, useEffect, useState } from 'react'
import { SetDetails } from 'set.js/dist/types/src/types'
import { Navbar } from '@components/Navbar'
import useSetJS from '@libs/setjs'
import { MODULE_ADDRESSES } from '@libs/constants'
import { formatEther, parseEther } from 'ethers/lib/utils'
import PositionList from '@components/PositionList'
import { useAccount } from 'wagmi'

// TODO: Get from Backend
const SET_TOKEN_ADDR = '0x2948EA0De1eCeccC78FDA018A1036B2F81C20dcB'

const Dashboard = () => {
  const setJSInstance = useSetJS()
  const [{ data: accountData }] = useAccount()
  const [setDetails, setSetDetails] = useState<SetDetails>()
  const [quantity, setQuantity] = useState('0')
  const [redeemQuantity, setRedeemQuantity] = useState('0')

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

  useEffect(() => {
    updateSetDetails()
  }, [setJSInstance, updateSetDetails])

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

  const handleRedeem = () => {
    if (!setJSInstance || !accountData?.address || !quantity) {
      return
    }

    setJSInstance.issuance
      .redeemAsync(
        SET_TOKEN_ADDR,
        parseEther(redeemQuantity),
        accountData.address
      )
      .then((data) => {
        console.log('🚀 ~ file: dashboard.tsx ~ line 62 ~ .then ~ data', data)
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
        <div className="bg-white overflow-hidden sm:rounded-md max-w-3xl mx-auto border p-6">
          <div className="px-6 py-2">
            <h4 className="text-2xl font-medium text-indigo-600 truncate">
              Index: [{setDetails?.name ?? '...'}] Index Symbol: [
              {setDetails?.symbol ?? '...'}]
            </h4>
          </div>

          <PositionList positions={setDetails?.positions} />

          <div className="flex border-t p-6">
            <input
              type="number"
              className="focus:ring-indigo-500 focus:border-indigo-500 block sm:text-sm border-gray-300 rounded-md w-24"
              placeholder="0.1"
              onChange={(e) => setQuantity(e.target.value)}
            />
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={handleIssue}
            >
              Issue
            </button>
          </div>

          <div className="px-6 py-2">
            <h4 className="text-2xl font-medium text-indigo-600 truncate inline-flex items-center gap-2">
              Your Index Token
              <span className="font-bold text-indigo-700">
                {setDetails?.name ?? '...'}
              </span>{' '}
              balance:{' '}
              <span className="text-gray-800">
                {formatEther(setDetails?.totalSupply ?? '0')}
              </span>
            </h4>

            <div className="flex border-t pt-6">
              <input
                type="number"
                className="focus:ring-indigo-500 focus:border-indigo-500 block sm:text-sm border-gray-300 rounded-md w-24"
                placeholder="0.1"
                onChange={(e) => setRedeemQuantity(e.target.value)}
                max={formatEther(setDetails?.totalSupply ?? '0')}
                min={0.05}
                step={0.05}
              />
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={handleRedeem}
              >
                Redeem
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
