import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
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