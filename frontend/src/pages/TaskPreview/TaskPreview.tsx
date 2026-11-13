import "./TaskPreview.css"
import { PageLayout } from "../../components/PageLayout/PageLayout"
import { SurfaceCard } from "../../components/SurfaceCard/SurfaceCard"

export function TaskPreview() {
  return (
    <PageLayout>
      <SurfaceCard className="taskPreviewCard">
        <h2>Task Preview</h2>

      </SurfaceCard>
    </PageLayout>
  )
}