import React from 'react'

export const AdminLogo: React.FC = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 0' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/logo-full-dark.png"
        alt="PCC Post-Tension"
        style={{
          maxWidth: '100%',
          height: 'auto',
          maxHeight: '40px',
        }}
      />
    </div>
  )
}
