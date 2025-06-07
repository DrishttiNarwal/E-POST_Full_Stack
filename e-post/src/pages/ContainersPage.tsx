import { ContainerList } from "../components/containers/ContainerList"
import { ContainerFilters } from "../components/containers/ContainerFilters"
import { Button } from "../components/ui/button"
import { Plus } from "lucide-react"
import { Link } from "react-router-dom"

export default function ContainersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Containers</h1>
        <Button asChild>
          <Link to="/dashboard/containers/new">
            <Plus className="mr-2 h-4 w-4" />
            New Container
          </Link>
        </Button>
      </div>
      <ContainerFilters />
      <ContainerList />
    </div>
  )
}

