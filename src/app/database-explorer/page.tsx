'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Loader, RefreshCw, AlertCircle, Search, Download } from 'lucide-react'

export default function DatabaseTableComponent() {
  const [tables, setTables] = useState<any[]>([])
  const [selectedTable, setSelectedTable] = useState<string>('')
  const [tableData, setTableData] = useState<any[]>([])
  const [columns, setColumns] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredData, setFilteredData] = useState<any[]>([])

  // Fetch list of tables from database
  useEffect(() => {
    fetchTables()
  }, [])

  // Fetch tables function
  const fetchTables = async () => {
    try {
      setLoading(true)
      setError('')

      // Get list of tables from information_schema
      const { data, error: err } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')

      if (err) {
        // Fallback: Query known tables
        const knownTables = [
          'users',
          'user_expertise',
          'user_hobbies',
          'activity_logs',
          'messages',
          'user_badges',
          'user_practice_progress',
          'admin_notifications',
          'admins',
          'profiles'
        ]
        setTables(knownTables.map(name => ({ table_name: name })))
      } else {
        setTables(data || [])
      }
    } catch (err: any) {
      setError(`Error fetching tables: ${err.message}`)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch table data
  const fetchTableData = async (tableName: string) => {
    try {
      setLoading(true)
      setError('')
      setSelectedTable(tableName)

      const { data, error: err } = await supabase
        .from(tableName)
        .select('*')
        .limit(100)

      if (err) {
        setError(`Error fetching data from ${tableName}: ${err.message}`)
        setTableData([])
        setColumns([])
      } else {
        setTableData(data || [])
        
        // Extract column names from first row
        if (data && data.length > 0) {
          setColumns(Object.keys(data[0]))
        } else {
          setColumns([])
        }
        
        setFilteredData(data || [])
        setSearchTerm('')
      }
    } catch (err: any) {
      setError(`Error: ${err.message}`)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Search functionality
  useEffect(() => {
    if (!searchTerm) {
      setFilteredData(tableData)
    } else {
      const filtered = tableData.filter(row =>
        Object.values(row).some(val =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
      setFilteredData(filtered)
    }
  }, [searchTerm, tableData])

  // Export to CSV
  const exportToCSV = () => {
    if (filteredData.length === 0) {
      alert('No data to export')
      return
    }

    const csv = [
      columns.join(','),
      ...filteredData.map(row =>
        columns.map(col => {
          const val = row[col]
          if (val === null || val === undefined) return ''
          if (typeof val === 'string' && val.includes(',')) return `"${val}"`
          return val
        }).join(',')
      )
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${selectedTable}-export.csv`
    a.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-lg">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Database Explorer</h1>
              <p className="text-gray-300">Connected to: {process.env.NEXT_PUBLIC_SUPABASE_URL?.split('/')[2]}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Table List */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 sticky top-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-white">Tables</h2>
                <button
                  onClick={fetchTables}
                  className="p-2 hover:bg-white/10 rounded-lg transition"
                  title="Refresh tables"
                >
                  <RefreshCw className="w-4 h-4 text-gray-300" />
                </button>
              </div>

              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {tables.map((table: any) => (
                  <button
                    key={table.table_name}
                    onClick={() => fetchTableData(table.table_name)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm font-medium ${
                      selectedTable === table.table_name
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <span className="truncate">{table.table_name}</span>
                  </button>
                ))}
              </div>

              {tables.length === 0 && !loading && (
                <p className="text-gray-400 text-sm text-center py-4">No tables found</p>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Error Alert */}
            {error && (
              <div className="mb-4 bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-red-400 font-semibold">Error</h3>
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-12 flex flex-col items-center justify-center gap-4">
                <Loader className="w-8 h-8 text-blue-400 animate-spin" />
                <p className="text-gray-300">Loading data...</p>
              </div>
            )}

            {/* Data Display */}
            {!loading && selectedTable && tableData.length > 0 && (
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden">
                {/* Toolbar */}
                <div className="bg-white/5 border-b border-white/10 p-4 flex flex-col sm:flex-row gap-4 justify-between">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search data..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    onClick={exportToCSV}
                    className="flex items-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-4 py-2 rounded-lg transition border border-blue-400/50"
                  >
                    <Download className="w-4 h-4" />
                    Export CSV
                  </button>
                </div>

                {/* Table Info */}
                <div className="bg-white/5 border-b border-white/10 px-4 py-3 text-sm text-gray-400">
                  <span className="font-semibold text-white">{selectedTable}</span>
                  <span className="mx-2">•</span>
                  <span>{filteredData.length} rows</span>
                  {searchTerm && (
                    <>
                      <span className="mx-2">•</span>
                      <span>Search: {searchTerm}</span>
                    </>
                  )}
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/5">
                        {columns.map(col => (
                          <th
                            key={col}
                            className="px-4 py-3 text-left font-semibold text-gray-300 whitespace-nowrap"
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((row, idx) => (
                        <tr
                          key={idx}
                          className="border-b border-white/5 hover:bg-white/5 transition"
                        >
                          {columns.map(col => (
                            <td key={`${idx}-${col}`} className="px-4 py-3 text-gray-300">
                              {typeof row[col] === 'object'
                                ? JSON.stringify(row[col]).substring(0, 50) + '...'
                                : String(row[col]).substring(0, 50)}
                              {String(row[col]).length > 50 && '...'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Empty State */}
                {filteredData.length === 0 && (
                  <div className="p-12 text-center">
                    <p className="text-gray-400">No rows found</p>
                  </div>
                )}
              </div>
            )}

            {/* No Table Selected */}
            {!loading && !selectedTable && (
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-12 text-center">
                <p className="text-gray-400">Select a table from the list to view data</p>
              </div>
            )}

            {/* Empty Table */}
            {!loading && selectedTable && tableData.length === 0 && !error && (
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-12 text-center">
                <p className="text-gray-400">This table is empty</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Icon component
function Database({ className }: { className: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7m0 0c0 2.21-3.582 4-8 4s-8-1.79-8-4m0 0C4 4.79 7.582 3 12 3s8 1.79 8 4m0 6c0 2.21-3.582 4-8 4s-8-1.79-8-4"
      />
    </svg>
  )
}
