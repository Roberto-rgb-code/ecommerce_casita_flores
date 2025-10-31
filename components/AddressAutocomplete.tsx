"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    google: any;
  }
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string) => void;
  onPlaceSelect?: (place: any) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
  required?: boolean;
}

export default function AddressAutocomplete({
  value,
  onChange,
  onPlaceSelect,
  placeholder = "Calle, número, interior, colonia... (Empieza a escribir para autocompletar)",
  className = "",
  rows = 2,
  required = false,
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const autocompleteRef = useRef<any>(null);
  const [showTextarea, setShowTextarea] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Cargar Google Places API si no está cargada
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      console.warn('Google Maps API key no configurada para autocompletado');
      return;
    }

    if (!window.google || !window.google.maps || !window.google.maps.places) {
      // Verificar si el script ya está cargándose
      const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
      if (existingScript) {
        existingScript.addEventListener('load', initializeAutocomplete);
        return;
      }

      // Cargar script de Google Places
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=es`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      script.onload = () => {
        setIsLoaded(true);
        initializeAutocomplete();
      };
    } else {
      setIsLoaded(true);
      initializeAutocomplete();
    }

    function initializeAutocomplete() {
      if (!inputRef.current || !window.google?.maps?.places) {
        // Reintentar después de un breve delay
        setTimeout(initializeAutocomplete, 100);
        return;
      }

      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ["address"],
        componentRestrictions: { country: "mx" },
        fields: ["formatted_address", "geometry", "address_components"],
      });

      autocompleteRef.current = autocomplete;

      // Cuando se selecciona un lugar
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();

        if (!place.geometry) {
          console.warn("No se encontró el lugar seleccionado");
          return;
        }

        // Usar la dirección formateada
        const formattedAddress = place.formatted_address;
        onChange(formattedAddress);
        
        // Cambiar a textarea para permitir edición
        setShowTextarea(true);

        // Llamar callback si existe
        if (onPlaceSelect) {
          onPlaceSelect(place);
        }
      });

      // Detectar cuando el usuario empieza a escribir manualmente
      inputRef.current?.addEventListener("input", (e: any) => {
        const inputValue = e.target.value;
        if (inputValue.length > 0) {
          onChange(inputValue);
        }
      });
    }

    return () => {
      if (autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [onChange, onPlaceSelect, isLoaded]);

  // Si el usuario ya escribió algo manualmente, mostrar textarea
  useEffect(() => {
    if (value && value.length > 0 && !value.includes(',')) {
      // Si tiene varias palabras pero no parece una dirección formateada, permitir edición
      const wordCount = value.split(' ').length;
      if (wordCount > 5) {
        setShowTextarea(true);
      }
    }
  }, [value]);

  // Si el usuario cambia manualmente a textarea
  const handleToggleToTextarea = () => {
    setShowTextarea(true);
  };

  if (showTextarea || (value && value.length > 50)) {
    return (
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={className}
          rows={rows}
          required={required}
        />
        <button
          type="button"
          onClick={() => setShowTextarea(false)}
          className="absolute top-2 right-2 text-xs text-pink-600 hover:text-pink-700 underline"
        >
          Usar autocompletado
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={className.replace('rows', '') + " min-h-[3rem]"}
        required={required}
        autoComplete="off"
      />
      <button
        type="button"
        onClick={handleToggleToTextarea}
        className="absolute top-2 right-2 text-xs text-gray-500 hover:text-gray-700 underline"
      >
        Escribir manualmente
      </button>
      <p className="text-xs text-gray-500 mt-1">
        💡 Empieza a escribir y selecciona una dirección sugerida
      </p>
    </div>
  );
}

