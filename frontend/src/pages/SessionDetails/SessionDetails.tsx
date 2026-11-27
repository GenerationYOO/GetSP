import { PageLayout } from '../../shared/components/PageLayout/PageLayout'
import { SurfaceCard } from '../../shared/components/SurfaceCard/SurfaceCard'
import type { CreateSessionResponse } from '../../modules/createSession';
import { useLocation } from 'react-router-dom';
import type { SessionDTO } from '../../modules/joinSession/models/joinSessionForm';

type GuestSessionState = {
  session: SessionDTO;
  guestName: string;
};

export function SessionDetails() {
  const navigationState = useLocation().state as
    | CreateSessionResponse
    | GuestSessionState
    | null;

  if (!navigationState) {
    return <p>Данные сессии недоступны</p>;
  }

  return (
    <PageLayout>
      <SurfaceCard>
        {"session" in navigationState ? (
          <>
            <h1>{navigationState.session.name}</h1>
            <p>Привет, {navigationState.guestName}!</p>
            <p>Организатор: {navigationState.session.ownerName}</p>
            <p>Статус: {navigationState.session.status}</p>
            <p>Участников: {navigationState.session.participantCount}</p>
          </>
        ) : (
          <>
            <h1>{navigationState.sessionName}</h1>
            <p>Код приглашения: {navigationState.inviteCode}</p>
            <img
              src={`data:image/png;base64,${navigationState.qrCodeBase64}`}
              alt="QR-код приглашения"
              width={200}
              height={200}
            />
          </>
        )}
      </SurfaceCard>
    </PageLayout>
  );
}