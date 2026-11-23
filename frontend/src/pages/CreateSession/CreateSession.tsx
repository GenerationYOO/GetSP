import { PageLayout } from "../../shared/components/PageLayout/PageLayout"
import { SurfaceCard } from "../../shared/components/SurfaceCard/SurfaceCard"
import { CreateSessionForm } from "../../modules/createSession";


export function SessionCreation() {
  return (
    <PageLayout>
      <SurfaceCard>
        <CreateSessionForm />
      </SurfaceCard>
    </PageLayout>
  )
}
