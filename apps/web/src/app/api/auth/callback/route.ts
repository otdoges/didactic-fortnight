import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        return NextResponse.redirect(`${request.nextUrl.origin}/auth/signin?error=${error.message}`)
      }
      
      return NextResponse.redirect(`${request.nextUrl.origin}/dashboard`)
    } catch (error) {
      return NextResponse.redirect(`${request.nextUrl.origin}/auth/signin?error=Authentication failed`)
    }
  }

  return NextResponse.redirect(`${request.nextUrl.origin}/auth/signin`)
}