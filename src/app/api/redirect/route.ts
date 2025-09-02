import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url');
  
  if (!url) {
    return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
  }
  
  // Create an HTML page that redirects using JavaScript (no referrer)
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Redirecting...</title>
        <meta name="referrer" content="no-referrer">
        <style>
          body {
            font-family: system-ui, -apple-system, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            background: #f3f4f6;
          }
          .loader {
            text-align: center;
          }
          .spinner {
            border: 3px solid #e5e7eb;
            border-top: 3px solid #3b82f6;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 16px;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      </head>
      <body>
        <div class="loader">
          <div class="spinner"></div>
          <p>Redirecting to Property24...</p>
        </div>
        <script>
          // Use meta refresh as backup
          setTimeout(function() {
            window.location.replace('${url}');
          }, 100);
        </script>
        <meta http-equiv="refresh" content="0; url=${url}">
      </body>
    </html>
  `;
  
  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Referrer-Policy': 'no-referrer'
    },
  });
}