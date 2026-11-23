import { PageLayout } from '../../shared/components/PageLayout/PageLayout'
import { SurfaceCard } from '../../shared/components/SurfaceCard/SurfaceCard'
import { LoginForm } from '../../modules/login'


export function Login() {
  return (
    <PageLayout>
      <SurfaceCard>
        <LoginForm />
      </SurfaceCard>
    </PageLayout>
  )
}