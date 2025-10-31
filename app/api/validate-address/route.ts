import { NextResponse } from 'next/server';
import { validateAddressServer } from '@/lib/addressValidation';

export async function POST(request: Request) {
  try {
    const { address } = await request.json();

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
    return NextResponse.json(
      { 
        isValid: false, 
        message: error.message || 'Error al validar dirección' 
      },
      { status: 500 }
    );
  }
}

