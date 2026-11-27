import { PageLayout } from "../../shared/components/PageLayout/PageLayout";
import { SurfaceCard } from "../../shared/components/SurfaceCard/SurfaceCard";
import { JoinSessionForm } from "../../modules/joinSession";
import { Header } from "../../shared/components/Header/Header";

export function JoinSession() {
  return (
    <PageLayout>
      <Header />
      <SurfaceCard className="joinSessionCard">
        <JoinSessionForm />
      </SurfaceCard>
    </PageLayout>
  );
}