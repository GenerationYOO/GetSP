import { PageLayout } from '../../shared/components/PageLayout/PageLayout'
import { SurfaceCard } from '../../shared/components/SurfaceCard/SurfaceCard'
import type { CreateSessionResponse } from '../../modules/createSession';
import { useLocation } from 'react-router-dom';

export function SessionDetails() {
  const state = useLocation();

  const session = state.state as CreateSessionResponse | null;
  if (!session) {
    return <p>Данные сессии недоступны</p>
  }

  return (
    <PageLayout>
      <SurfaceCard>
        <h1>{session.sessionName}</h1>
        <p>Код приглашения: {session.inviteCode}</p>
        <img
          src={`data:image/png;base64,${session.qrCodeBase64}`}
          alt="QR-код приглашения"
          width={200}
          height={200}
        />
      </SurfaceCard>
    </PageLayout>
  );
}