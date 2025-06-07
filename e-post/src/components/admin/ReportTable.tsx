"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Button } from "../ui/button"
import { ChevronLeft, ChevronRight, Download } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"

// Sample data for report table
const reportData = [
  {
    id: 1,
    date: "2023-04-01",
    branch: "New York Central",
    parcels: 120,
    delivered: 112,
    inTransit: 8,
    issues: 0,
    revenue: 2400,
  },
  {
    id: 2,
    date: "2023-04-02",
    branch: "Los Angeles Hub",
    parcels: 95,
    delivered: 88,
    inTransit: 6,
    issues: 1,
    revenue: 1900,
  },
  {
    id: 3,
    date: "2023-04-03",
    branch: "Chicago North",
    parcels: 78,
    delivered: 72,
    inTransit: 5,
    issues: 1,
    revenue: 1560,
  },
  {
    id: 4,
    date: "2023-04-04",
    branch: "Houston Central",
    parcels: 65,
    delivered: 60,
    inTransit: 4,
    issues: 1,
    revenue: 1300,
  },
  {
    id: 5,
    date: "2023-04-05",
    branch: "Miami Beach",
    parcels: 52,
    delivered: 48,
    inTransit: 4,
    issues: 0,
    revenue: 1040,
  },
  {
    id: 6,
    date: "2023-04-06",
    branch: "Seattle Downtown",
    parcels: 43,
    delivered: 40,
    inTransit: 3,
    issues: 0,
    revenue: 860,
  },
  {
    id: 7,
    date: "2023-04-07",
    branch: "Denver Heights",
    parcels: 38,
    delivered: 35,
    inTransit: 2,
    issues: 1,
    revenue: 760,
  },
  {
    id: 8,
    date: "2023-04-08",
    branch: "Boston Harbor",
    parcels: 47,
    delivered: 43,
    inTransit: 3,
    issues: 1,
    revenue: 940,
  },
  {
    id: 9,
    date: "2023-04-09",
    branch: "New York Central",
    parcels: 115,
    delivered: 107,
    inTransit: 7,
    issues: 1,
    revenue: 2300,
  },
  {
    id: 10,
    date: "2023-04-10",
    branch: "Los Angeles Hub",
    parcels: 92,
    delivered: 85,
    inTransit: 6,
    issues: 1,
    revenue: 1840,
  },
]

export function ReportTable() {
  const [page, setPage] = useState(1)

  const itemsPerPage = 5
  const totalPages = Math.ceil(reportData.length / itemsPerPage)
  const startIndex = (page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = reportData.slice(startIndex, endIndex)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Detailed Report Data</CardTitle>
          <CardDescription>Daily breakdown of parcel activity and revenue</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead className="text-right">Parcels</TableHead>
                <TableHead className="text-right">Delivered</TableHead>
                <TableHead className="text-right">In Transit</TableHead>
                <TableHead className="text-right">Issues</TableHead>
                <TableHead className="text-right">Revenue ($)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.branch}</TableCell>
                  <TableCell className="text-right">{row.parcels}</TableCell>
                  <TableCell className="text-right">{row.delivered}</TableCell>
                  <TableCell className="text-right">{row.inTransit}</TableCell>
                  <TableCell className="text-right">{row.issues}</TableCell>
                  <TableCell className="text-right">${row.revenue.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
            <span className="font-medium">{Math.min(endIndex, reportData.length)}</span> of{" "}
            <span className="font-medium">{reportData.length}</span> entries
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={() => setPage(page - 1)} disabled={page === 1}>
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            <Button variant="outline" size="icon" onClick={() => setPage(page + 1)} disabled={page === totalPages}>
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

