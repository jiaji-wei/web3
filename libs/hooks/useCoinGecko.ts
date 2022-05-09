import { useEffect, useState } from 'react'
import { CoinGeckoClient } from 'coingecko-api-v3'

export const useCoinGecko = () => {
  const [coingecko, setCoingecko] = useState<CoinGeckoClient>()

  useEffect(() => {
    try {
      const client = new CoinGeckoClient({
        timeout: 10000,
        autoRetry: true,
      })
      setCoingecko(client)
    } catch (e) {
      console.error(e)
    }
  }, [])

  return coingecko
}
