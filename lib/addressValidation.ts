/**
 * Google Address Validation API
 * Valida direcciones usando el servicio de validación de Google
 */

export interface AddressValidationResult {
  isValid: boolean;
  formattedAddress?: string;
  addressComponents?: {
    city?: string;
    zipCode?: string;
    state?: string;
    country?: string;
  };
  confidence?: 'CONFIRMED' | 'UNCONFIRMED_BUT_PLAUSIBLE' | 'UNCONFIRMED_AND_SUSPICIOUS';
  message?: string;
}

/**
 * Valida una dirección usando Google Address Validation API
 */
export async function validateAddress(address: string): Promise<AddressValidationResult> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    console.warn('Google Maps API key no configurada para validación');
    return {
      isValid: false,
      message: 'API key no configurada'
    };
  }

  try {
    const response = await fetch('/api/validate-address', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ address }),
    });

    if (!response.ok) {
      throw new Error('Error en validación de dirección');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error validando dirección:', error);
    return {
      isValid: false,
      message: 'Error al validar la dirección'
    };
  }
}

/**
 * Valida una dirección directamente usando Google Address Validation API (server-side)
 */
export async function validateAddressServer(address: string, apiKey: string): Promise<AddressValidationResult> {
  try {
    const response = await fetch(
      `https://addressvalidation.googleapis.com/v1:validateAddress?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: {
            addressLines: [address],
            regionCode: 'MX', // México
          },
          enableUspsCass: false, // Deshabilitado para direcciones fuera de US
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.error?.message || 'Error en validación';
      
      // Detectar si la API no está habilitada
      if (errorMessage.includes('not been used') || 
          errorMessage.includes('is disabled') ||
          errorMessage.includes('not enabled')) {
        // Retornar que la dirección es válida pero sin validación estricta
        // Esto permite que el usuario continúe sin la validación de Google
        return {
          isValid: true, // Permitir continuar
          formattedAddress: address,
          message: 'Dirección aceptada (validación automática no disponible)',
          confidence: 'UNCONFIRMED_BUT_PLAUSIBLE'
        };
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();

    // Interpretar resultado
    const result = data.result;
    const verdict = result.verdict;
    const addressComplete = result.address?.formattedAddress;
    
    // Extraer componentes de dirección
    const components: any = {};
    result.address?.addressComponents?.forEach((component: any) => {
      const types = component.componentTypes || [];
      if (types.includes('locality') || types.includes('administrative_area_level_2')) {
        components.city = component.componentName?.text || '';
      }
      if (types.includes('postal_code')) {
        components.zipCode = component.componentName?.text || '';
      }
      if (types.includes('administrative_area_level_1')) {
        components.state = component.componentName?.text || '';
      }
      if (types.includes('country')) {
        components.country = component.componentName?.text || '';
      }
    });

    // Determinar si es válida
    const isValid = 
      verdict?.validationGranularity === 'SUB_PREMISE' ||
      verdict?.validationGranularity === 'PREMISE' ||
      verdict?.validationGranularity === 'ROUTE' ||
      verdict?.inputGranularity === 'OTHER' ||
      verdict?.hasUnconfirmedComponents === false;

    // Nivel de confianza
    let confidence: 'CONFIRMED' | 'UNCONFIRMED_BUT_PLAUSIBLE' | 'UNCONFIRMED_AND_SUSPICIOUS' = 'UNCONFIRMED_AND_SUSPICIOUS';
    
    if (verdict?.validationGranularity === 'PREMISE' || verdict?.validationGranularity === 'SUB_PREMISE') {
      confidence = 'CONFIRMED';
    } else if (verdict?.hasUnconfirmedComponents === false) {
      confidence = 'UNCONFIRMED_BUT_PLAUSIBLE';
    }

    return {
      isValid,
      formattedAddress: addressComplete || address,
      addressComponents: components,
      confidence,
      message: isValid 
        ? 'Dirección válida' 
        : 'Por favor verifica la dirección ingresada'
    };
  } catch (error: any) {
    console.error('Error validando dirección:', error);
    return {
      isValid: false,
      message: error.message || 'Error al validar la dirección'
    };
  }
}

