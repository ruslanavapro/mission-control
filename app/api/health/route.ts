import { NextResponse } from 'next/server'

export async function GET() {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: process.uptime(),
    env: {
      node: process.version,
      platform: process.platform,
    },
  }

  return NextResponse.json(health)
}
