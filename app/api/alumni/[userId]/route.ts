import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function generateStaticParams() {
  return [];
}

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const headersList = headers();
  const token = headersList.get('Authorization')?.split(' ')[1];

  try {
    const response = await fetch(
      `https://7wgbsyva7h.execute-api.ap-south-1.amazonaws.com/dev/directory/${params.userId}`,
      {
        headers: {
          'Accept': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching alumni details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alumni details' },
      { status: 500 }
    );
  }
}