"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Search, QrCode } from "lucide-react"
import { QrReader } from "react-qr-reader"
import { ParcelQRCode } from "../tracking/ParcelQRCode" // ✅ make sure this path is correct

type TrackingSearchProps = {
  onSearch: (trackingId: string) => void;
  loading?: boolean;
  parcel?: any;
};

export function TrackingSearch({ onSearch, loading, parcel }: TrackingSearchProps) {
  const [trackingId, setTrackingId] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [activeTab, setActiveTab] = useState("tracking-id")
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleSearch = () => {
    if (trackingId) onSearch(trackingId)
  }

  const handleScan = (result: any) => {
    if (result?.text) {
      setTrackingId(result.text)
      setIsScanning(false)
      setActiveTab("tracking-id")
      onSearch(result.text)
    }
  }

  const handleCancelScan = () => {
    setIsScanning(false)
    setActiveTab("tracking-id")
  }

  useEffect(() => {
    if (isScanning) {
      timeoutRef.current = setTimeout(() => {
        setIsScanning(false)
        setActiveTab("tracking-id")
      }, 30000)
    } else if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [isScanning])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Track Your Parcel</CardTitle>
        <CardDescription>
          Enter your tracking number or scan QR code to track your parcel
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tracking-id">Tracking ID</TabsTrigger>
            <TabsTrigger value="qr-code">QR Code</TabsTrigger>
          </TabsList>

          {/* --- Tracking ID Tab --- */}
          <TabsContent value="tracking-id" className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="tracking-id">Tracking ID</Label>
              <div className="flex space-x-2">
                <Input
                  id="tracking-id"
                  placeholder="Enter tracking ID (e.g., EPOST1234567890)"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  disabled={loading}
                />
                <Button onClick={handleSearch} disabled={loading || !trackingId}>
                  <Search className="mr-2 h-4 w-4" />
                  {loading ? "Searching..." : "Track"}
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* --- QR Code Tab --- */}
          <TabsContent value="qr-code" className="space-y-4">
            <div className="flex flex-col items-center space-y-4">

              {/* This is the box where QR code will show or scanning will happen */}
              <div className="w-full max-w-md aspect-square border-2 border-dashed rounded-md flex items-center justify-center p-4">
                {isScanning ? (
                  <QrReader
                    scanDelay={300}
                    onResult={handleScan}
                    videoContainerStyle={{ width: "100%" }}
                    constraints={{ facingMode: "environment" }}
                  />
                ) : parcel?.trackingId ? (
                  <ParcelQRCode trackingId={parcel.trackingId} />
                ) : (
                  <QrCode className="h-16 w-16 text-muted-foreground" />
                )}
              </div>

              {/* Buttons below the box */}
              {isScanning ? (
                <Button type="button" className="mt-2" onClick={handleCancelScan}>
                  Cancel
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setIsScanning(true)
                    setActiveTab("qr-code")
                  }}
                  disabled={loading}
                >
                  Scan QR Code
                </Button>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
