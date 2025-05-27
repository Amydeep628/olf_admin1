import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function generateStaticParams() {
  return [];
}

export async function GET(request: Request) {
  const { searchParams, pathname } = new URL(request.url);
  const headersList = headers();
  const token = headersList.get('Authorization')?.split(' ')[1];

  // Extract userId from path if it exists
  const userId = pathname.split('/').pop();
  
  try {
    let apiUrl = 'https://7wgbsyva7h.execute-api.ap-south-1.amazonaws.com/dev/directory';
    
    // If userId exists, fetch specific alumni details
    if (userId && userId !== 'alumni') {
      apiUrl = `${apiUrl}/${userId}`;
    } else {
      // Add query parameters for directory listing
      const page = searchParams.get('page') || '1';
      const name = searchParams.get('name') || '';
      apiUrl = `${apiUrl}?page=${page}&limit=20&name=${encodeURIComponent(name)}`;
    }

    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching alumni data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alumni data' },
      { status: 500 }
    );
  }
}