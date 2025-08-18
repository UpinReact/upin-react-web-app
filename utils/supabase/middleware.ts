import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  console.log('🔍 MIDDLEWARE: Running for', request.nextUrl.pathname);
  
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Expand public paths to prevent redirect loops
  const publicPaths = ['/reset-password', '/login', '/auth', '/signup', '/']
  if (publicPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
    console.log('✅ MIDDLEWARE: Public path, skipping auth check');
    return supabaseResponse
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ MIDDLEWARE: Missing Supabase environment variables');
    return supabaseResponse
  }

  console.log('🍪 MIDDLEWARE: Request cookies:', request.cookies.getAll().map(c => `${c.name}=${c.value?.substring(0, 10)}...`));

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        )
      },
    },
  })

  // This is the critical part - get the user
  const {
    data: { user },
    error
  } = await supabase.auth.getUser()

  console.log('👤 MIDDLEWARE: Auth check result:', {
    hasUser: !!user,
    userEmail: user?.email || 'none',
    errorMessage: error?.message || 'none'
  });

  // Only redirect if no user AND not already on auth pages
  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/auth')
  ) {
    console.log('🚫 MIDDLEWARE: No user found, redirecting to login');
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  console.log('✅ MIDDLEWARE: Auth check passed, continuing to page');
  return supabaseResponse
}