import { NextRequest, NextResponse } from 'next/server';

const SERVICE_URL = process.env.YOURPOST_SERVICE_URL || 'http://localhost:9001';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  const path = resolvedParams.path.join('/');
  const url = `${SERVICE_URL}/api/service/${path}`;

  console.log(`Proxying POST to: ${url}`);

  try {
    const body = await request.text();
    const headers = new Headers();
    
    // Forward authorization header
    const auth = request.headers.get('authorization');
    if (auth) {
      headers.set('Authorization', auth);
    }
    
    headers.set('Content-Type', request.headers.get('content-type') || 'application/json');

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });

    const responseBody = await response.text();
    
    return new NextResponse(responseBody, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy request to service API' },
      { status: 502 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  const path = resolvedParams.path.join('/');
  const url = `${SERVICE_URL}/api/service/${path}`;

  console.log(`Proxying GET to: ${url}`);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': request.headers.get('authorization') || '',
      },
    });

    const responseBody = await response.text();
    
    return new NextResponse(responseBody, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy request to service API' },
      { status: 502 }
    );
  }
}
