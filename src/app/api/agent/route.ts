import { NextResponse } from 'next/server';
import { agentProfile } from '@/lib/mockData';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      agent: agentProfile
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch agent profile' },
      { status: 500 }
    );
  }
}