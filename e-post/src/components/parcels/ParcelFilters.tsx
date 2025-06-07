import { Input } from "../ui/input";

interface ParcelFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
}

export function ParcelFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
}: ParcelFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-4">
      <Input
        type="search"
        placeholder="Search parcels..."
        className="w-full md:w-64"
        value={search}
        onChange={e => onSearchChange(e.target.value)}
      />
      <select
        className="border rounded px-3 py-2 bg-background"
        value={status}
        onChange={e => onStatusChange(e.target.value)}
      >
        <option value="">All Statuses</option>
        <option value="processing">Processing</option>
        <option value="in-transit">In Transit</option>
        <option value="delivered">Delivered</option>
        <option value="issue">Issue</option>
      </select>
    </div>
  );
}