import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, projectType, description } = body;

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey || apiKey === 're_123456789') {
      console.error('RESEND_API_KEY is missing or using placeholder');
      return NextResponse.json({
        error: 'API key niet geconfigureerd. Voeg uw Resend API key toe aan het .env bestand.'
      }, { status: 500 });
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'Viesa Automations <onboarding@resend.dev>',
        to: 'contact@viesa-automations.nl',
        reply_to: email,
        subject: `Nieuwe aanvraag van ${firstName} ${lastName}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <h1 style="color: #0f172a; font-size: 24px; font-weight: bold; margin-bottom: 20px; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">Nieuwe Contactaanvraag</h1>
            
            <div style="margin-bottom: 20px;">
              <p style="margin: 5px 0;"><strong>Naam:</strong> ${firstName} ${lastName}</p>
              <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <p style="margin: 5px 0;"><strong>Project Type:</strong> ${projectType}</p>
            </div>
            
            <p style="margin-bottom: 10px; font-weight: bold; color: #475569;">Beschrijving:</p>
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; color: #1e293b; line-height: 1.6;">
              ${description.replace(/\n/g, '<br/>')}
            </div>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;" />
            <p style="color: #64748b; font-size: 12px; text-align: center;">Dit is een automatisch gegenereerd bericht van de Viesa Automations website.</p>
          </div>
        `,
      }),
    });

    if (res.ok) {
      return NextResponse.json({ success: true });
    } else {
      const errorData = await res.json();
      console.error('Resend error:', errorData);

      // Provide more specific error message if available
      const message = errorData?.message || 'Failed to send email';
      return NextResponse.json({ error: message, details: errorData }, { status: res.status });
    }
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({
      error: 'An unexpected error occurred',
      message: error.message
    }, { status: 500 });
  }
}
