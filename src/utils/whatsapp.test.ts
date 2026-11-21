import test from 'node:test';
import assert from 'node:assert/strict';
import { CONFIRMED_SERVICES, BRAND_INFO } from '../data/ghost9';
import {
  buildMotoWhatsAppUrl,
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  resolveConfirmedServices,
} from './whatsapp';

test('catalog contains strictly the 6 confirmed services and excludes unconfirmed lavagem completa', () => {
  assert.equal(CONFIRMED_SERVICES.length, 6);
  const titles = CONFIRMED_SERVICES.map((s) => s.title.toLowerCase());
  assert.equal(
    titles.some((t) => t.includes('lavagem')),
    false,
    'Unconfirmed lavagem completa must not appear in confirmed services'
  );
});

test('resolveConfirmedServices filters unknown IDs and preserves catalog order', () => {
  const resolved = resolveConfirmedServices([
    'vitrificacao',
    'lavagem-completa',
    'polimento-automotivo',
  ]);
  assert.deepEqual(resolved, ['Polimento Automotivo', 'Vitrificação']);
});

test('buildWhatsAppMessage formats single and multi-service messages accurately', () => {
  const general = buildWhatsAppMessage([]);
  assert.match(general, /GHOST 9/);
  assert.match(general, /solicitar um orçamento/);

  const single = buildWhatsAppMessage(['espelhamento']);
  assert.equal(
    single,
    'Olá! Conheci o site da GHOST 9 e gostaria de solicitar um orçamento para meu veículo. Tenho interesse em Espelhamento.'
  );

  const multiWithVehicle = buildWhatsAppMessage(
    ['polimento-automotivo', 'vitrificacao'],
    '  Porsche 911 Carrera  '
  );
  assert.equal(
    multiWithVehicle,
    'Olá! Conheci o site da GHOST 9 e gostaria de solicitar um orçamento para meu veículo. Tenho interesse em Polimento Automotivo e Vitrificação. Veículo: Porsche 911 Carrera.'
  );
});

test('buildWhatsAppUrl uses official Ghost 9 wa.me endpoint and encodes query', () => {
  const url = buildWhatsAppUrl(['correcao-de-pintura'], 'Civic');
  assert.ok(url.startsWith(`${BRAND_INFO.whatsappBaseUrl}?text=`));
  const decoded = decodeURIComponent(url.split('?text=')[1]);
  assert.match(decoded, /Correção de Pintura/);
  assert.match(decoded, /Veículo: Civic\./);
});

test('buildMotoWhatsAppUrl builds valid general inquiry URL without unconfirmed services', () => {
  const url = buildMotoWhatsAppUrl();
  assert.ok(url.startsWith(`${BRAND_INFO.whatsappBaseUrl}?text=`));
  const decoded = decodeURIComponent(url.split('?text=')[1]);
  assert.match(decoded, /GHOST 9/);
  assert.match(decoded, /moto/);
});
