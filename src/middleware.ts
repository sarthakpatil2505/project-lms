import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname;

    // Public routes — always allow without running Supabase auth check
    const publicPaths = [
      '/',
      '/login',
      '/register',
      '/courses',
      '/verify',
      '/auth',
      '/_next',
      '/favicon.ico',
    ];

    if (publicPaths.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
      return NextResponse.next();
    }

    // Check if Supabase URL is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // If Supabase environment variables are missing (e.g. initial deployment),
    // allow navigation so the site does not crash
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.next();
    }

    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
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

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Protected route check
    const isProtected = [
      '/dashboard',
      '/instructor',
      '/admin',
      '/course',
      '/assignments',
      '/certificates',
      '/forums',
    ].some((p) => pathname.startsWith(p));

    if (isProtected && !user) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/login';
      loginUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Role-based protection for authenticated users
    if (user && (pathname.startsWith('/instructor') || pathname.startsWith('/admin'))) {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        const role = profile?.role ?? 'student';

        if (pathname.startsWith('/instructor') && !['instructor', 'admin'].includes(role)) {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }

        if (pathname.startsWith('/admin') && role !== 'admin') {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      } catch (err) {
        console.warn('[Middleware RBAC Check Warning]', err);
      }
    }

    // Enrollment check for course learning room
    if (user && pathname.match(/^\/course\/[^/]+\/learn/)) {
      try {
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
      } catch (err) {
        console.warn('[Middleware Enrollment Check Warning]', err);
      }
    }

    return supabaseResponse;
  } catch (criticalError) {
    // Failsafe: Under no circumstance let middleware crash the application on edge
    console.error('[Routing Middleware Failsafe Triggered]', criticalError);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
