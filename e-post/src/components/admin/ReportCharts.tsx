import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"

// Sample data for charts
const monthlyData = [
  { name: "Jan", parcels: 1200, revenue: 24000 },
  { name: "Feb", parcels: 1350, revenue: 27000 },
  { name: "Mar", parcels: 1500, revenue: 30000 },
  { name: "Apr", parcels: 1650, revenue: 33000 },
  { name: "May", parcels: 1800, revenue: 36000 },
  { name: "Jun", parcels: 2000, revenue: 40000 },
  { name: "Jul", parcels: 2200, revenue: 44000 },
  { name: "Aug", parcels: 2100, revenue: 42000 },
  { name: "Sep", parcels: 1950, revenue: 39000 },
  { name: "Oct", parcels: 1800, revenue: 36000 },
  { name: "Nov", parcels: 1700, revenue: 34000 },
  { name: "Dec", parcels: 1900, revenue: 38000 },
]

const branchData = [
  { name: "New York", parcels: 3500, revenue: 70000 },
  { name: "Los Angeles", parcels: 2800, revenue: 56000 },
  { name: "Chicago", parcels: 2200, revenue: 44000 },
  { name: "Houston", parcels: 1900, revenue: 38000 },
  { name: "Miami", parcels: 1600, revenue: 32000 },
]

const statusData = [
  { name: "Delivered", value: 68 },
  { name: "In Transit", value: 25 },
  { name: "Processing", value: 5 },
  { name: "Issues", value: 2 },
]

const COLORS = ["#4ade80", "#facc15", "#60a5fa", "#f87171"]

export function ReportCharts() {
  return (
    <Tabs defaultValue="monthly" className="space-y-4">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="monthly">Monthly Trends</TabsTrigger>
        <TabsTrigger value="branch">Branch Performance</TabsTrigger>
        <TabsTrigger value="status">Status Distribution</TabsTrigger>
      </TabsList>
      <TabsContent value="monthly" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Parcel Volume & Revenue</CardTitle>
            <CardDescription>Parcel volume and revenue trends over the past year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="parcels" stroke="#3b82f6" activeDot={{ r: 8 }} />
                  <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10b981" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="branch" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Branch Performance Comparison</CardTitle>
            <CardDescription>Parcel volume and revenue by branch</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={branchData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="parcels" fill="#3b82f6" name="Parcels" />
                  <Bar dataKey="revenue" fill="#10b981" name="Revenue ($)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="status" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Parcel Status Distribution</CardTitle>
            <CardDescription>Current distribution of parcels by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

