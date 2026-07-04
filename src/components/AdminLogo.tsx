import React from 'react'
import Image from 'next/image'

export const AdminLogo: React.FC = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 0' }}>
      <Image
        src="/images/logo-full-dark.png"
        alt="PCC Post-Tension"
        width={150}
        height={40}
        style={{
          maxWidth: '100%',
          height: 'auto',
          maxHeight: '40px',
          objectFit: 'contain'
        }}
      />
    </div>
  )
}
