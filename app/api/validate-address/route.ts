import { NextResponse } from 'next/server';
import { validateAddressServer } from '@/lib/addressValidation';

export async function POST(request: Request) {
  let address = '';
  
  try {
    const body = await request.json();
    address = body.address;

    if (!address || address.length < 5) {
      return NextResponse.json(
        { 
          isValid: false, 
          message: 'La dirección es demasiado corta' 
        },
        { status: 400 }
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { 
          isValid: false, 
          message: 'API key no configurada' 
        },
        { status: 500 }
      );
    }

    const result = await validateAddressServer(address, apiKey);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error en validate-address API:', error);
    
    // Si el error es que la API no está habilitada, permitir continuar
    const errorMessage = error.message || '';
    if (errorMessage.includes('not been used') || 
        errorMessage.includes('is disabled') ||
        errorMessage.includes('not enabled')) {
      return NextResponse.json({
        isValid: true, // Permitir continuar
        formattedAddress: address || '',
        message: 'Dirección aceptada (validación automática no disponible)',
        confidence: 'UNCONFIRMED_BUT_PLAUSIBLE'
      });
    }
    
    return NextResponse.json(
      { 
        isValid: false, 
        message: 'Error al validar dirección. Por favor verifica que la dirección sea correcta.' 
      },
      { status: 500 }
    );
  }
}

