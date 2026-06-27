import React from 'react'

export const AdminLogo: React.FC = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 0' }}>
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
