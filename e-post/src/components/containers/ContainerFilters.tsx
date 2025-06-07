import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Search, SlidersHorizontal } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"
import { Label } from "../ui/label"
import { Checkbox } from "../ui/checkbox"
import { DatePicker } from "../ui/date-picker"

export function ContainerFilters() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search containers..."
            className="w-full pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
          />
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0">
              <SlidersHorizontal className="h-4 w-4" />
              <span className="sr-only">Filter</span>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filter Containers</SheetTitle>
              <SheetDescription>Adjust the filters to find specific containers</SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select defaultValue="all">
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="loaded">Loaded</SelectItem>
                    <SelectItem value="in-transit">In Transit</SelectItem>
                    <SelectItem value="unloaded">Unloaded</SelectItem>
                    <SelectItem value="issue">Issue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date Range</Label>
                <div className="grid gap-2">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="from" className="text-right">
                      From
                    </Label>
                    <div className="col-span-3">
                      <DatePicker />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="to" className="text-right">
                      To
                    </Label>
                    <div className="col-span-3">
                      <DatePicker />
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Size</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="size-20ft" />
                    <Label htmlFor="size-20ft">20 ft</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="size-40ft" />
                    <Label htmlFor="size-40ft">40 ft</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="size-45ft" />
                    <Label htmlFor="size-45ft">45 ft</Label>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline">Reset</Button>
              <Button>Apply Filters</Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <div className="flex items-center space-x-2">
        <Select defaultValue="all">
          <SelectTrigger id="status-filter" className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="loaded">Loaded</SelectItem>
            <SelectItem value="in-transit">In Transit</SelectItem>
            <SelectItem value="unloaded">Unloaded</SelectItem>
            <SelectItem value="issue">Issue</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="newest">
          <SelectTrigger id="sort" className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="size-asc">Size (Small to Large)</SelectItem>
            <SelectItem value="size-desc">Size (Large to Small)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
