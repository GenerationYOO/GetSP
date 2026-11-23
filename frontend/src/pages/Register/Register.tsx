import { PageLayout } from '../../shared/components/PageLayout/PageLayout'
import { SurfaceCard } from '../../shared/components/SurfaceCard/SurfaceCard'

import { RegisterForm } from '../../modules/auth'

export function Register() {
  return (
    <PageLayout>
      <SurfaceCard>
        <RegisterForm />
      </SurfaceCard>
    </PageLayout>
  )
}