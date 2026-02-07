import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const BASIC_PREFIX = 'Basic '
const REALM_HEADER = 'Basic realm="Mission Control"'

const isTruthy = (value: string | undefined): value is string =>
  typeof value === 'string' && value.length > 0

const firstIp = (value: string | null): string | undefined => {
  if (!value) return undefined
  const [ip] = value.split(',')
  return ip?.trim() || undefined
}

const getClientIp = (request: NextRequest): string | undefined => {
  return (
    (request as NextRequest & { ip?: string }).ip ||
    firstIp(request.headers.get('x-forwarded-for')) ||
    request.headers.get('x-real-ip') ||
    undefined
  )
}

const isLocalhost = (ip: string | undefined): boolean => {
  if (!ip) return false
  const normalized = ip.toLowerCase()
  return (
    normalized === '127.0.0.1' ||
    normalized === '::1' ||
    normalized === '0:0:0:0:0:0:0:1' ||
    normalized.startsWith('::ffff:127.0.0.1')
  )
}

const parseBasicAuth = (
  header: string | null
): { user: string; pass: string } | null => {
  if (!header || !header.startsWith(BASIC_PREFIX)) return null
  const encoded = header.slice(BASIC_PREFIX.length).trim()
  if (!encoded) return null
  try {
    const decoded = atob(encoded)
    const separatorIndex = decoded.indexOf(':')
    if (separatorIndex === -1) return null
    return {
      user: decoded.slice(0, separatorIndex),
      pass: decoded.slice(separatorIndex + 1),
    }
  } catch {
    return null
  }
}

const unauthorizedResponse = () =>
  new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': REALM_HEADER,
    },
  })

export function middleware(request: NextRequest) {
  const authUser = process.env.DASH_AUTH_USER
  const authPass = process.env.DASH_AUTH_PASS
  const hasCredentials = isTruthy(authUser) && isTruthy(authPass)

  if (!hasCredentials) {
    // When auth vars are not set, allow ONLY localhost access.
    // This makes local dev easy while preventing accidental public exposure.
    const host = request.nextUrl.hostname
    const clientIp = getClientIp(request)
    const isLocal = host === 'localhost' || host === '127.0.0.1' || isLocalhost(clientIp)

    if (isLocal) return NextResponse.next()
    return unauthorizedResponse()
  }

  const auth = parseBasicAuth(request.headers.get('authorization'))
  if (!auth) return unauthorizedResponse()

  if (auth.user !== authUser || auth.pass !== authPass) {
    return unauthorizedResponse()
  }

  return NextResponse.next()
}
