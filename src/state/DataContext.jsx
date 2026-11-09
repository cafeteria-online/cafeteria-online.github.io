import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { api } from '../lib/api.js'

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const [state, setState] = useState({ settings: null, sections: [], products: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const reload = useCallback(async () => {
    try {
      setState(await api.loadAll())
      setError('')
    } catch (e) {
      setError(e.message || 'No se pudo cargar el menú.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  useEffect(() => {
    if (state.settings?.businessName) document.title = state.settings.businessName
  }, [state.settings?.businessName])

  return (
    <DataContext.Provider value={{ ...state, loading, error, reload }}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)
