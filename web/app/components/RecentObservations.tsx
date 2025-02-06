import { format } from "date-fns"

interface Observation {
  obsDt: string
  locName: string
  howMany: number
  userDisplayName: string
}

interface RecentObservationsProps {
  observations: Observation[]
  isLoading: boolean
}

export default function RecentObservations({
  observations,
  isLoading,
}: RecentObservationsProps) {
  if (isLoading) {
    return <div className="text-sm text-gray-400">Loading observations...</div>
  }

  if (observations.length === 0) {
    return (
      <div className="text-sm text-gray-400">No recent observations found</div>
    )
  }

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-sm text-gray-300">
        Recent Observations
      </h3>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {observations.map((obs, index) => (
          <div
            key={index}
            className="text-sm bg-gray-800/50 rounded p-2 border border-gray-700"
          >
            <div className="flex justify-between">
              <span className="font-medium">{obs.locName}</span>
              <span className="text-gray-400">
                {format(new Date(obs.obsDt), "MMM d, yyyy")}
              </span>
            </div>
            <div className="text-gray-300 mt-1">
              Count: {obs.howMany || "Present"}
              <span className="text-gray-500 text-xs ml-2">
                by {obs.userDisplayName}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
