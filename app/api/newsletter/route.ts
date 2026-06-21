import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, firstName } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email inválido. Revisa el formato.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.BREVO_API_KEY;

    if (!apiKey) {
      console.error('Falta la variable de entorno BREVO_API_KEY');
      return NextResponse.json(
        { error: 'Error de configuración del servidor.' },
        { status: 500 }
      );
    }

    // Usamos el list ID 2 por defecto, pero se puede configurar en .env
    const listId = process.env.BREVO_LIST_ID ? parseInt(process.env.BREVO_LIST_ID) : 2;

    const bodyPayload: any = {
      email: email,
      listIds: [listId],
      updateEnabled: true // Si ya existe, simplemente lo actualiza
    };

    if (firstName) {
      bodyPayload.attributes = { FIRSTNAME: firstName };
    }

    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify(bodyPayload),
    });

    if (response.status === 204) {
      // Brevo returns 204 No Content when the contact already existed and was just updated.
      // There is no JSON body to parse.
      return NextResponse.json({ success: true, updated: true });
    }

    const data = await response.json();

    if (!response.ok) {
      // Brevo devuelve 400 si el email ya está en la lista u otros errores
      // Manejamos gracefully el "Contact already exist"
      if (data.code === 'duplicate_parameter') {
         // Podemos devolver success igual si queremos que vuelva a mandarle el mail,
         // pero por lo general, si updateEnabled: true, no da duplicate_parameter.
         return NextResponse.json({ success: true, message: 'Actualizado' });
      }

      console.error('Brevo API error:', data);
      return NextResponse.json(
        { error: data.message || 'Error al conectar con Brevo.' },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, data });

  } catch (error) {
    console.error('Newsletter API error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor.' },
      { status: 500 }
    );
  }
}
