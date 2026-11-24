import "./TaskPreview.css"
import { PageLayout } from "../../shared/components/PageLayout/PageLayout"
import { SurfaceCard } from "../../shared/components/SurfaceCard/SurfaceCard"
import { TaskPreviewWorkspace } from "../../modules/createSession"

export function TaskPreview() {
  return (
    <PageLayout>
      <SurfaceCard className="taskPreviewCard">
        <TaskPreviewWorkspace />
      </SurfaceCard>
    </PageLayout >
  )
}