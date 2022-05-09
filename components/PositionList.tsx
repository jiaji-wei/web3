import { useTokenAllowance } from '@libs/hooks/useTokenAllowance'
import { useTokenBalance } from '@libs/hooks/useTokenBalance'
import { SetJsEthereumMainnetAddresses } from '@libs/setjs'
import { BigNumber } from 'ethers'
import React from 'react'
import { Position as IPosition, SetDetails } from 'set.js/dist/types/src/types'
import { erc20ABI, useContractWrite, useToken } from 'wagmi'

const POSITION_SPENDER_ADDR =
  SetJsEthereumMainnetAddresses.basicIssuanceModuleAddress

const Position = ({ position }: { position: IPosition }) => {
  const allowanceData = useTokenAllowance(position.component)

  const balanceData = useTokenBalance(position.component)

  const [{ data }] = useToken({
    address: position.component,
    skip: false,
  })

  const [, write] = useContractWrite(
    {
      addressOrName: position.component,
      contractInterface: erc20ABI,
    },
    'approve'
  )

  const needsApproval = allowanceData.allowance?.value.lte(0)

  const handleApprove = () => {
    write({
      args: [
        POSITION_SPENDER_ADDR,
        BigNumber.from(
          '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
        ),
      ],
    }).then((res) => {
      // eslint-disable-next-line no-console
      console.log(res)
    })
  }

  return (
    <li key={position.component}>
      <a href="#" className="block hover:bg-gray-50">
        <div className="px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="ml-2 flex-shrink-0 flex gap-2 items-center">
              <p className="text-sm text-gray-600">Token: {data?.symbol} </p>

              <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                balance: {balanceData.balance?.formatted}
              </p>

              <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                {/* {formatEther(position.unit)} */}
                Unit: {position.unit.toString()}
              </p>
            </div>

            {needsApproval && (
              <button
                onClick={handleApprove}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Approve
              </button>
            )}
          </div>
        </div>
      </a>
    </li>
  )
}

type PositionListProps = {
  positions?: SetDetails['positions']
}

const PositionList = ({ positions }: PositionListProps) => {
  if (!positions || !positions.length) {
    return null
  }

  return (
    <ul role="list" className="divide-y divide-gray-200">
      {positions.map((position) => (
        <Position key={position.component} position={position} />
      ))}
    </ul>
  )
}

export default PositionList
