import React from 'react'
import { Calendar, Download, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

const ReportsHeader = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
      <h1 className="font-playfair text-2xl font-semibold text-gray-900">Reports</h1>
      
      <div className="flex items-center gap-3">
        {/* Mock Date Range Picker */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-green transition-colors text-sm text-gray-700">
          <Calendar className="w-4 h-4 text-green" />
          <span>Oct 1, 2023 - Oct 31, 2023</span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
        
        <Button className="bg-green hover:bg-green/90 text-white flex items-center gap-2 group">
          <Download className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
          <span>Export Report</span>
        </Button>
      </div>
    </div>
  )
}

export default ReportsHeader
