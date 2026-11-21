/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { AutomotiveUniverse3D } from './components/AutomotiveUniverse3D';
import { ContactBookingSection } from './components/ContactBookingSection';
import { CustomCursor } from './components/CustomCursor';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Footer } from './components/Footer';
import { GallerySection } from './components/GallerySection';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ServicesSection } from './components/ServicesSection';
import { StudioAtmosphereCanvas } from './components/StudioAtmosphereCanvas';
import { TransformationSection } from './components/TransformationSection';
import { VehiclesSegmentsSection } from './components/VehiclesSegmentsSection';
import { WhatsAppModal } from './components/WhatsAppModal';

export default function App() {
  const [selectedServices, setSelectedServices] = useState<string[]>([
    'polimento-automotivo',
  ]);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  const handleToggleService = useCallback((serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  }, []);

  const handleSelectSingleServiceAndOpen = useCallback((serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId) ? prev : [...prev, serviceId]
    );
    setBookingModalOpen(true);
  }, []);

  const handleOpenBooking = useCallback(() => {
    setBookingModalOpen(true);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen bg-[#050507] text-[#F4F5F7]">
        <StudioAtmosphereCanvas />
        <CustomCursor />

        <Header onOpenBooking={handleOpenBooking} />

        <main className="relative z-10">
          <HeroSection onOpenBooking={handleOpenBooking} />
          <ServicesSection onSelectService={handleSelectSingleServiceAndOpen} />
          <VehiclesSegmentsSection onSelectCarService={handleSelectSingleServiceAndOpen} />
          <TransformationSection />
          <AutomotiveUniverse3D />
          <GallerySection />
          <ContactBookingSection
            selectedServices={selectedServices}
            onToggleService={handleToggleService}
          />
        </main>

        <Footer />

        <FloatingWhatsApp onClick={handleOpenBooking} />

        <WhatsAppModal
          open={bookingModalOpen}
          selectedServices={selectedServices}
          onToggleService={handleToggleService}
          onClose={() => setBookingModalOpen(false)}
        />
      </div>
    </MotionConfig>
  );
}
