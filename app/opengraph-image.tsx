import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Mission Control - Personal Dashboard'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#09090b',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 80,
            fontWeight: 'bold',
            color: '#ffffff',
            marginBottom: 20,
          }}
        >
          Mission Control
        </div>
        <div
          style={{
            fontSize: 32,
            color: '#a1a1aa',
          }}
        >
          Your Personal Command Center
        </div>
        <div
          style={{
            marginTop: 40,
            display: 'flex',
            gap: 20,
          }}
        >
          <div
            style={{
              padding: '12px 24px',
              background: '#22c55e',
              borderRadius: 8,
              color: '#09090b',
              fontWeight: 'bold',
            }}
          >
            Projects
          </div>
          <div
            style={{
              padding: '12px 24px',
              background: '#3b82f6',
              borderRadius: 8,
              color: '#ffffff',
              fontWeight: 'bold',
            }}
          >
            Tasks
          </div>
          <div
            style={{
              padding: '12px 24px',
              background: '#a855f7',
              borderRadius: 8,
              color: '#ffffff',
              fontWeight: 'bold',
            }}
          >
            Analytics
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
