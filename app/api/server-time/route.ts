import { NextResponse } from 'next/server';
import { supabase } from '@/apis/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase.rpc('get_server_time');
    
    if (error) {
      return NextResponse.json(
        { error: '서버 시간을 가져오는데 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ serverTime: data });
  } catch (error) {
    return NextResponse.json(
      { error: '서버 시간을 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
} 