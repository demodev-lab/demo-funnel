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

    // NOTE: UTC 시간에 9시간을 더해서 한국 시간으로 변환
    const koreanTime = new Date(data);
    koreanTime.setHours(koreanTime.getHours() + 9);
    const koreanTimeString = koreanTime.toISOString();

    return NextResponse.json({ serverTime: koreanTimeString });
  } catch (error) {
    return NextResponse.json(
      { error: '서버 시간을 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
} 