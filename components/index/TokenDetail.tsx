import React from 'react'
import { useToken } from 'wagmi'
import { Token } from './Create'

type TokenDetailProps = {
  token: Token
  onRemove: (token: Token) => void
  onAllocationChange: (token: Token) => void
}

const TokenDetail = (props: TokenDetailProps) => {
  const [{ data, error, loading: isLoading }] = useToken({
    address: props.token.address,
    skip: false,
  })

  if (error) {
    // eslint-disable-next-line no-console
    console.log(error)
    return null
  }

  return (
    <div key={props.token.address} className="flex gap-2 items-center">
      <div className="text-center py-2">
        {isLoading && !data ? '...' : data?.symbol}
      </div>
      <div className="mt-1 relative rounded-md shadow-sm">
        <input
          type="number"
          className="focus:ring-indigo-500 focus:border-indigo-500 block sm:text-sm border-gray-300 rounded-md"
          placeholder="0.00"
          aria-describedby="price-currency"
          value={props.token.allocation}
          onChange={(e) => {
            const value = e.target.value
            const isValidDigit = /[0-9]?[0-9]?(\.[0-9][0-9]?)?/.test(value)
            if (isValidDigit) {
              props.onAllocationChange({
                ...props.token,
                allocation: value,
              })
            }
          }}
        />
        <div className="absolute inset-y-0 right-6 pr-3 flex items-center pointer-events-none">
          <span className="text-gray-500 sm:text-sm" id="price-currency">
            %
          </span>
        </div>
      </div>
      <div className="text-center px-4">
        <button
          type="button"
          onClick={() => props.onRemove(props.token)}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Remove
        </button>
      </div>
    </div>
  )
}

export default TokenDetail
