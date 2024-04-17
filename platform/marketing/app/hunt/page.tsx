import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@repo/ui/alert"

export default async function Dashboard() {
  return (
    <Alert>
      <AlertTitle>Success!</AlertTitle>
      <AlertDescription>
        This is a success alert.
      </AlertDescription>
    </Alert>
  )
}
