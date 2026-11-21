import { BRAND_INFO, CONFIRMED_SERVICES } from '../data/ghost9';

/**
 * Normalizes a list of selected service titles against the confirmed catalog,
 * preserving display order and deduplicating selections.
 */
export function resolveConfirmedServices(selectedIds: readonly string[]): string[] {
  const idSet = new Set(selectedIds);
  return CONFIRMED_SERVICES.filter((service) => idSet.has(service.id)).map(
    (service) => service.title
  );
}

/**
 * Formats the pre-filled WhatsApp message following the Ghost 9 brief.
 */
export function buildWhatsAppMessage(
  selectedServiceIds: readonly string[] = [],
  vehicleModel = ''
): string {
  const serviceNames = resolveConfirmedServices(selectedServiceIds);
  const cleanVehicle = vehicleModel.trim();

  let base: string;
  if (serviceNames.length === 0) {
    base =
      'Olá! Conheci o site da GHOST 9 e gostaria de solicitar um orçamento para meu veículo.';
  } else if (serviceNames.length === 1) {
    base = `Olá! Conheci o site da GHOST 9 e gostaria de solicitar um orçamento para meu veículo. Tenho interesse em ${serviceNames[0]}.`;
  } else {
    const last = serviceNames[serviceNames.length - 1];
    const head = serviceNames.slice(0, -1).join(', ');
    base = `Olá! Conheci o site da GHOST 9 e gostaria de solicitar um orçamento para meu veículo. Tenho interesse em ${head} e ${last}.`;
  }

  if (cleanVehicle.length > 0) {
    return `${base} Veículo: ${cleanVehicle}.`;
  }
  return base;
}

/**
 * Builds the official wa.me URL with URL-encoded message text.
 */
export function buildWhatsAppUrl(
  selectedServiceIds: readonly string[] = [],
  vehicleModel = ''
): string {
  const message = buildWhatsAppMessage(selectedServiceIds, vehicleModel);
  return `${BRAND_INFO.whatsappBaseUrl}?text=${encodeURIComponent(message)}`;
}

/**
 * Builds a general WhatsApp inquiry URL for motorcycle owners without inventing unconfirmed moto services.
 */
export function buildMotoWhatsAppUrl(): string {
  const message =
    'Olá! Conheci o site da GHOST 9 e gostaria de consultar sobre atendimento e orçamento para minha moto.';
  return `${BRAND_INFO.whatsappBaseUrl}?text=${encodeURIComponent(message)}`;
}
