import React, { Fragment, useState } from 'react'
import { MenuIcon, XIcon } from '@heroicons/react/outline'
import { useIsMounted } from '@libs/hooks/useIsMounted'
import { useAccount, useConnect } from 'wagmi'

import ChevronDownIcon from '@heroicons/react/solid/ChevronDownIcon'
import { Menu, Transition } from '@headlessui/react'
import { NetworkSwitcher } from './NetworkSwitcher'

export const formatAddress = (address: string) =>
  `${address.slice(0, 6)}…${address.slice(38, 42)}`

export const Navbar = () => {
  const isMounted = useIsMounted()
  const [{ data, loading: loadingConenctor }, connect] = useConnect()
  const [{ data: accountData }, disconnect] = useAccount()

  const links = [
    { name: 'buy', link: '/buy' },
    { name: 'create', link: '/' }
  ].concat(
    accountData
      ? [
        { name: 'dashboard', link: '/dashboard' },
        { name: 'trade', link: '/trade' },
        { name: 'wrap', link: '/wrap' },
        { name: 'farm', link: '/farm' },
        { name: 'manage', link: '/manage' },
      ]
      : []
  )

  const handleDisconnect = () => {
    disconnect()
    if (location.href.includes('/dashboard')) {
      return (window.location.href = '/')
    }
  }

  const [open, setOpen] = useState(false)
  return (
    <div className="shadow-md w-full">
      <div className="md:flex items-center justify-between bg-white py-4 md:px-10 px-7">
        <div
          className="font-bold text-2xl cursor-pointer flex items-center font-[Poppins]
    text-gray-800"
        >
          <span>Web3</span>

          {links.map((link) => (
            <div key={link.name} className="ml-12 text-xl font-normal">
              <a
                href={link.link}
                className="text-gray-800 hover:text-gray-400 duration-500"
              >
                {link.name}
              </a>
            </div>
          ))}
        </div>

        <div
          onClick={() => setOpen(!open)}
          className="text-3xl absolute right-8 top-6 cursor-pointer md:hidden"
        >
          {!open ? <MenuIcon className="w-5" /> : <XIcon className="w-5" />}
        </div>

        <ul
          className={`flex items-center gap-4 bg-white md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in ${open ? 'top-20 ' : 'top-[-490px]'
            }`}
        >
          {isMounted && !!accountData && <NetworkSwitcher />}

          {accountData ? (
            <div>
              <div>
                {accountData?.ens?.name ?? formatAddress(accountData?.address)}
                {accountData?.ens ? ` (${accountData?.address})` : null}
              </div>

              {accountData?.ens?.avatar && (
                <img
                  src={accountData.ens.avatar}
                  style={{ height: 40, width: 40 }}
                />
              )}

              <div>
                <button onClick={handleDisconnect}>
                  Disconnect from {accountData?.connector?.name}
                </button>
              </div>
            </div>
          ) : (
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="inline-flex w-full justify-center rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                  Connect
                  <ChevronDownIcon
                    className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
                    aria-hidden="true"
                  />
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-1 py-1 ">
                    {data.connectors.map((connector) => (
                      <Menu.Item key={connector.id}>
                        {({ active }) => (
                          <button
                            className={`${active
                              ? 'bg-violet-500 text-white'
                              : 'text-gray-900'
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            onClick={() => connect(connector)}
                            disabled={isMounted && !connector.ready}
                          >
                            {connector.id === 'injected'
                              ? isMounted
                                ? connector.name
                                : connector.id
                              : connector.name}
                            {isMounted && !connector.ready && ' (unsupported)'}
                            {loadingConenctor &&
                              connector.name === connector?.name &&
                              '…'}
                          </button>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          )}
        </ul>
      </div>
    </div>
  )
}
