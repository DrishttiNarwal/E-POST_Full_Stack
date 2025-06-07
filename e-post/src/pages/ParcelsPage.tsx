import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { ParcelList } from "../components/parcels/ParcelList";
import { useParcels } from "../components/parcel-provider";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Scan, QrCode } from "lucide-react";
import { QrReader } from "react-qr-reader";
import api from "../lib/api";
import { toastSuccess, toastError } from "../lib/toast";
import { ToastContainer } from "react-toastify";

const initialParcel = {
  senderAddress: "",
  senderPin: "",
  receiverName: "",
  receiverAddress: "",
  receiverPhone: "",
  location: "",
  status: "pending",
};

export default function ParcelsPage() {
  // Add Parcel state
  const { createParcel, fetchParcels } = useParcels();
  const [parcel, setParcel] = useState(initialParcel);

  // Update Parcel state
  const [trackingId, setTrackingId] = useState("");
  const [updateLocation, setUpdateLocation] = useState("");
  const [status, setStatus] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  // Field-wise validation for Add Parcel
  const validateReceiverName = () => {
    if (!parcel.receiverName.trim()) {
      toastError("Receiver Name is required.");
      return false;
    }
    return true;
  };
  const validateReceiverAddress = () => {
    if (!parcel.receiverAddress.trim()) {
      toastError("Receiver Address is required.");
      return false;
    }
    return true;
  };
  const validateReceiverPhone = () => {
    if (!parcel.receiverPhone.trim()) {
      toastError("Receiver Phone is required.");
      return false;
    }
    // Optionally add phone format validation here
    return true;
  };
  const validateSenderAddress = () => {
    if (!parcel.senderAddress.trim()) {
      toastError("Sender Address is required.");
      return false;
    }
    return true;
  };
  const validateSenderPin = () => {
    if (!parcel.senderPin.trim()) {
      toastError("Sender Pin Code is required.");
      return false;
    }
    // Optionally add pin format validation here
    return true;
  };
  const validateLocation = () => {
    if (!parcel.location.trim()) {
      toastError("Current Location is required.");
      return false;
    }
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setParcel((prev) => ({ ...prev, [name]: value }));
  };

  const isParcelFormComplete = () =>
    validateReceiverName() &&
    validateReceiverAddress() &&
    validateReceiverPhone() &&
    validateSenderAddress() &&
    validateSenderPin() &&
    validateLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isParcelFormComplete()) {
      toastError("All Fields are required.");
      return;
    }
    try {
      const payload = {
        sender: {
          address: parcel.senderAddress,
          pin: parcel.senderPin,
        },
        receiver: {
          name: parcel.receiverName,
          address: parcel.receiverAddress,
          phone: parcel.receiverPhone,
        },
        location: parcel.location,
      };
      const res = await createParcel(payload);
      if (res) {
        toastSuccess("Parcel added successfully!");
        await fetchParcels();
        setParcel(initialParcel);
      }
    } catch (err) {
      toastError("Failed to add parcel.");
    }
  };

  // Update Parcel handlers
  const handleScan = (data: any) => {
    if (data) {
      setTrackingId(data);
      setIsScanning(false);
    } else {
      handleError(data);
    }
  };

  const handleError = (err: any) => {
    toastError("QR Scan Error: " + (err?.message || "Unknown error"));
    setIsScanning(false);
  };

  const handleUpdate = async () => {
    if (!trackingId || !updateLocation) {
      toastError("Tracking ID and location are required.");
      return;
    }
    try {
      await api.put(`/parcels/update/${trackingId}`, { location: updateLocation, status: status });
      toastSuccess("Parcel location updated successfully!");
      setUpdateLocation("");
      setTrackingId("");
      await fetchParcels();
    } catch (err: any) {
      toastError(
        err?.response?.data?.message || "Failed to update parcel location."
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <ToastContainer/>
      <Tabs defaultValue="add" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="add">Add Parcel</TabsTrigger>
          <TabsTrigger value="update">Update Parcel</TabsTrigger>
        </TabsList>
        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Add Parcel</CardTitle>
              <CardDescription>Fill in the details to add a new parcel.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <Input
                  className="border rounded px-3 py-2 bg-background"
                  type="text"
                  name="receiverName"
                  placeholder="Receiver Name"
                  value={parcel.receiverName}
                  onChange={handleChange}
                  onBlur={validateReceiverName}
                  required
                />
                <Input
                  className="border rounded px-3 py-2 bg-background"
                  type="text"
                  name="receiverAddress"
                  placeholder="Receiver Address"
                  value={parcel.receiverAddress}
                  onChange={handleChange}
                  onBlur={validateReceiverAddress}
                  required
                />
                <Input
                  className="border rounded px-3 py-2 bg-background"
                  type="text"
                  name="receiverPhone"
                  placeholder="Receiver Phone"
                  value={parcel.receiverPhone}
                  onChange={handleChange}
                  onBlur={validateReceiverPhone}
                  required
                />
                <Input
                  className="border rounded px-3 py-2 bg-background"
                  type="text"
                  name="senderAddress"
                  placeholder="Sender Address"
                  value={parcel.senderAddress}
                  onChange={handleChange}
                  onBlur={validateSenderAddress}
                  required
                />
                <Input
                  className="border rounded px-3 py-2 bg-background"
                  type="text"
                  name="senderPin"
                  placeholder="Sender Pin Code"
                  value={parcel.senderPin}
                  onChange={handleChange}
                  onBlur={validateSenderPin}
                  required
                />
                <Input
                  className="border rounded px-3 py-2 bg-background"
                  type="text"
                  name="location"
                  placeholder="Current Location"
                  value={parcel.location}
                  onChange={handleChange}
                  onBlur={validateLocation}
                  required
                />
                <Button type="submit" className="w-full md:w-auto">
                  Add Parcel
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="update">
          <Card>
            <CardHeader>
              <CardTitle>Update Parcel Location</CardTitle>
              <CardDescription>
                Scan the parcel QR code or enter the tracking ID to update its current location.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Label htmlFor="tracking-id">Tracking ID</Label>
                <div className="flex space-x-2 mt-2">
                  <Input
                    id="tracking-id"
                    placeholder="Scan or enter tracking ID"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    disabled={isScanning}
                  />
                  <Button type="button" onClick={() => setIsScanning(true)} disabled={isScanning}>
                    {isScanning ? (
                      <>
                        <Scan className="mr-2 h-4 w-4 animate-pulse" />
                        Scanning...
                      </>
                    ) : (
                      <>
                        <QrCode className="mr-2 h-4 w-4" />
                        Scan QR
                      </>
                    )}
                  </Button>
                </div>
                {isScanning && (
                  <div className="mt-4">
                    <QrReader
                      scanDelay={300}
                      onResult={handleScan}
                      videoContainerStyle={{ width: "100%" }}
                      constraints={{ facingMode: "environment" }}
                    />
                    <Button type="button" className="mt-2" onClick={() => setIsScanning(false)}>
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
                <div className="mb-6">
                  <Label htmlFor="location">Location</Label>
                  <Input
                  id="location"
                  className="border rounded px-3 py-2 bg-background w-full"
                  placeholder="Enter new location"
                  value={updateLocation}
                  onChange={(e) => setUpdateLocation(e.target.value)}
                  />
                </div>
                <div className="mb-6">
                  <Label htmlFor="status">Status</Label>
                  <select
                  id="status"
                  className="border rounded px-3 py-2 bg-background w-full"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  >
                  <option value="pending">
                    Select status
                  </option>
                  <option value="pending">Pending</option>
                  <option value="in-transit">In Transit</option>
                  <option value="delivered">Delivered</option>
                  </select>
                </div>
              <Button type="button" className="w-full" onClick={handleUpdate}>
                Update Parcel
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <div className="bg-white dark:bg-[hsl(var(--card))] rounded-lg shadow p-6 mt-8">
        <ParcelList />
      </div>
    </div>
  );
}