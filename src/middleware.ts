import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;

  // Public routes — always allow
  const publicPaths = ['/', '/login', '/register', '/courses', '/verify', '/auth', '/_next', '/favicon.ico'];
  if (publicPaths.some(p => pathname.startsWith(p))) {
    return supabaseResponse;
  }

  // Requires authentication
  if (!user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Fetch user role from profiles
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const role = profile?.role ?? 'student';

  // Role-based route protection
  if (pathname.startsWith('/instructor') && !['instructor', 'admin'].includes(role)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Enrollment check for learning room
  if (pathname.match(/^\/course\/[^/]+\/learn/)) {
    const slugMatch = pathname.match(/^\/course\/([^/]+)\/learn/);
    if (slugMatch) {
      const slug = slugMatch[1];
      const { data: course } = await supabase
        .from('courses')
        .select('id')
        .eq('slug', slug)
        .single();

      if (course) {
        const { data: enrollment } = await supabase
          .from('enrollments')
          .select('id')
          .eq('user_id', user.id)
          .eq('course_id', course.id)
          .single();

        if (!enrollment) {
          return NextResponse.redirect(new URL(`/courses/${slug}`, request.url));
        }
      }
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
