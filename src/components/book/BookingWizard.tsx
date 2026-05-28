'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Sparkles, Calendar, Clock, User, Check, 
  ArrowLeft, ArrowRight, Phone, Mail, FileText, CheckCircle2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BookingWizardProps {
  services: any[];
}

const TIME_SLOTS = [
  '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', 
  '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'
];

export default function BookingWizard({ services }: BookingWizardProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialServiceId = searchParams.get('service') || '';

  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [selectedStylist, setSelectedStylist] = useState<any | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [bookingResult, setBookingResult] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Pre-select service if passed in query string
  useEffect(() => {
    if (initialServiceId && services.length > 0) {
      const match = services.find(s => s.id === initialServiceId);
      if (match) {
        setSelectedService(match);
        setStep(2);
      }
    }
  }, [initialServiceId, services]);

  // Generate next 7 days for booking calendar
  const getNextDays = () => {
    const days = [];
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 1; i <= 8; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push({
        dayName: weekdays[date.getDay()],
        dayNum: date.getDate(),
        monthName: months[date.getMonth()],
        fullString: date.toISOString().split('T')[0] // yyyy-mm-dd
      });
    }
    return days;
  };
  const availableDays = getNextDays();

  // Navigation handlers
  const handleServiceSelect = (service: any) => {
    setSelectedService(service);
    setStep(2);
  };

  const handleStylistSelect = (stylist: any) => {
    setSelectedStylist(stylist);
    setStep(3);
  };

  const handleDateTimeConfirm = () => {
    if (!selectedDate || !selectedTime) return;
    setStep(4);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactData.name || !contactData.email || !contactData.phone) return;
    setLoading(true);
    setErrorMsg('');

    // Combine date and time strings to create complete ISO date string
    // selectedDate format is yyyy-mm-dd. selectedTime is HH:MM AM/PM
    const timeMatch = selectedTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
    let hours = 10;
    let minutes = 0;
    if (timeMatch) {
      hours = parseInt(timeMatch[1]);
      minutes = parseInt(timeMatch[2]);
      const ampm = timeMatch[3].toUpperCase();
      if (ampm === 'PM' && hours < 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;
    }
    
    const appointmentDate = new Date(selectedDate);
    appointmentDate.setHours(hours, minutes, 0, 0);

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: contactData.name,
          customerEmail: contactData.email,
          customerPhone: contactData.phone,
          serviceId: selectedService.id,
          serviceTitle: selectedService.title,
          stylistId: selectedStylist?.id || 'any',
          stylistName: selectedStylist?.name || 'Any Available Stylist',
          dateTime: appointmentDate.toISOString(),
          notes: contactData.notes,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setBookingResult(data.data);
        setStep(5);
      } else {
        setErrorMsg(data.error || 'Failed to complete booking. Please try again.');
      }
    } catch {
      setErrorMsg('Network error. Failed to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppShare = () => {
    if (!bookingResult) return;
    const formattedDate = new Date(bookingResult.dateTime).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
    const message = encodeURIComponent(
      `Hello Glow & Grace Studio!\n\nI have booked an appointment:\n` +
      `- Booking ID: ${bookingResult.id.substring(0, 8).toUpperCase()}\n` +
      `- Service: ${bookingResult.serviceTitle}\n` +
      `- Specialist: ${bookingResult.stylistName}\n` +
      `- Date & Time: ${formattedDate}\n` +
      `- Customer: ${bookingResult.customerName} (${bookingResult.customerPhone})\n\n` +
      `Please let me know if this is confirmed.`
    );
    window.open(`https://wa.me/9779800000000?text=${message}`, '_blank');
  };

  return (
    <div className="py-28 bg-gradient-to-b from-brand-beige to-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col gap-8">
        
        {/* Header (Hide in confirmation screen) */}
        {step < 5 && (
          <div className="text-center flex flex-col items-center gap-3">
            <h1 className="font-serif text-3xl sm:text-5xl font-light text-brand-charcoal">
              Book Your <span className="font-normal italic text-rose-gold-gradient">Radiance</span>
            </h1>
            
            {/* Steps indicator */}
            <div className="flex justify-center items-center gap-6 mt-6 text-xs font-semibold text-brand-charcoal/50">
              <span className={step === 1 ? 'text-brand-rosegold-dark font-bold' : ''}>1. Service</span>
              <span className="text-brand-charcoal/20">/</span>
              <span className={step === 2 ? 'text-brand-rosegold-dark font-bold' : ''}>2. Specialist</span>
              <span className="text-brand-charcoal/20">/</span>
              <span className={step === 3 ? 'text-brand-rosegold-dark font-bold' : ''}>3. Schedule</span>
              <span className="text-brand-charcoal/20">/</span>
              <span className={step === 4 ? 'text-brand-rosegold-dark font-bold' : ''}>4. Details</span>
            </div>
          </div>
        )}

        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-brand-pink-accent/25 shadow-lg bg-white/70 min-h-[400px] flex flex-col">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Select Service */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="flex flex-col gap-6"
              >
                <div className="text-left">
                  <h2 className="font-serif text-xl font-semibold text-brand-charcoal">Select Treatment</h2>
                  <p className="text-xs text-brand-charcoal/60 mt-0.5 font-light">Choose the signature treatment you want to book.</p>
                </div>
                <div className="flex flex-col gap-3.5">
                  {services.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleServiceSelect(s)}
                      className="w-full flex items-center justify-between p-4 rounded-2xl border border-brand-pink-accent/20 bg-white/40 hover:bg-brand-pink-medium/10 hover:border-brand-rosegold/50 text-left transition-all group cursor-pointer"
                    >
                      <div className="flex flex-col gap-1 pr-4">
                        <span className="font-serif text-sm sm:text-base font-semibold text-brand-charcoal group-hover:text-brand-rosegold transition-colors">
                          {s.title}
                        </span>
                        <div className="flex gap-3 text-[10px] text-brand-charcoal/50 font-medium">
                          <span>{s.duration} Mins</span>
                          <span>•</span>
                          <span className="capitalize">{s.category}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-serif font-bold text-brand-rosegold-dark text-xs sm:text-sm">
                          NPR {s.pricing.toLocaleString()}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-brand-pink-light group-hover:bg-brand-rosegold group-hover:text-brand-charcoal-dark flex items-center justify-center transition-colors">
                          <ArrowRight className="w-4 h-4 text-brand-rosegold-dark" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 2: Salon-assigned specialist */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="flex flex-col gap-6"
              >
                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => setStep(1)} 
                    className="flex items-center gap-1 text-xs font-semibold text-brand-charcoal/50 hover:text-brand-charcoal cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>
                  <span className="text-[10px] uppercase font-bold text-brand-rosegold-dark tracking-wide">
                    Service: {selectedService?.title}
                  </span>
                </div>

                <div className="text-left">
                  <h2 className="font-serif text-xl font-semibold text-brand-charcoal">Salon Assigned Specialist</h2>
                  <p className="text-xs text-brand-charcoal/60 mt-0.5 font-light">Our staff will assign the best available specialist for your selected service and slot.</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <button
                    onClick={() => handleStylistSelect(null)}
                    className="flex items-center gap-4 p-4 rounded-2xl border border-brand-pink-accent/20 bg-white/40 hover:bg-brand-pink-medium/10 hover:border-brand-rosegold text-left cursor-pointer transition-all"
                  >
                    <div className="w-12 h-12 rounded-full bg-brand-pink-medium flex items-center justify-center text-brand-rosegold-dark shrink-0">
                      <User className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm text-brand-charcoal">Any Available Specialist</span>
                      <span className="text-[10px] text-brand-charcoal/50">Personal team member selection is not available online.</span>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Select Date & Time */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="flex flex-col gap-6"
              >
                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => setStep(2)} 
                    className="flex items-center gap-1 text-xs font-semibold text-brand-charcoal/50 hover:text-brand-charcoal cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>
                  <div className="flex flex-col text-right">
                    <span className="text-[10px] uppercase font-bold text-brand-rosegold-dark tracking-wide">
                      Ritual: {selectedService?.title}
                    </span>
                    <span className="text-[9px] text-brand-charcoal/50">
                      Stylist: {selectedStylist ? selectedStylist.name : 'First Available'}
                    </span>
                  </div>
                </div>

                <div className="text-left">
                  <h2 className="font-serif text-xl font-semibold text-brand-charcoal">Select Date &amp; Time</h2>
                  <p className="text-xs text-brand-charcoal/60 mt-0.5 font-light">Pick your preferred day and hourly slot.</p>
                </div>

                {/* Calendar grid */}
                <div className="flex flex-col gap-4 text-left">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-brand-charcoal/50">Available Days</span>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {availableDays.map((day) => {
                      const isSelected = selectedDate === day.fullString;
                      return (
                        <button
                          key={day.fullString}
                          onClick={() => {
                            setSelectedDate(day.fullString);
                            setSelectedTime(''); // Reset time when date changes
                          }}
                          className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-brand-charcoal text-white border-brand-charcoal'
                              : 'bg-white/50 border-brand-pink-accent/20 text-brand-charcoal hover:bg-brand-pink-light'
                          }`}
                        >
                          <span className="text-[9px] font-bold uppercase opacity-60">{day.dayName}</span>
                          <span className="text-sm font-serif font-bold my-0.5">{day.dayNum}</span>
                          <span className="text-[9px] uppercase font-bold opacity-60">{day.monthName}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time Slots grid */}
                {selectedDate && (
                  <div className="flex flex-col gap-4 text-left">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-brand-charcoal/50">Available Time Slots</span>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                      {TIME_SLOTS.map((time) => {
                        const isSelected = selectedTime === time;
                        return (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`py-2 px-3 rounded-lg border text-xs font-semibold tracking-wide transition-all cursor-pointer text-center ${
                              isSelected
                                ? 'bg-brand-rosegold text-brand-charcoal-dark border-brand-rosegold font-bold shadow-sm'
                                : 'bg-white/50 border-brand-pink-accent/20 text-brand-charcoal hover:bg-brand-pink-light'
                            }`}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Confirm step button */}
                <button
                  onClick={handleDateTimeConfirm}
                  disabled={!selectedDate || !selectedTime}
                  className="mt-4 flex items-center justify-center gap-1.5 bg-brand-charcoal hover:bg-brand-charcoal-dark text-white font-semibold py-3 rounded-xl text-xs uppercase tracking-wider cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                >
                  Continue to Booking details
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* STEP 4: Confirm Contact Details */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="flex flex-col gap-6"
              >
                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => setStep(3)} 
                    className="flex items-center gap-1 text-xs font-semibold text-brand-charcoal/50 hover:text-brand-charcoal cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>
                  <span className="text-[10px] uppercase font-bold text-brand-rosegold-dark tracking-wide">
                    Review Reservation Details
                  </span>
                </div>

                {/* Booking summary card */}
                <div className="bg-brand-pink-light/30 border border-brand-pink-accent/25 p-5 rounded-2xl text-left grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] uppercase tracking-wider text-brand-charcoal/40 font-bold">Treatment</span>
                    <span className="text-xs font-semibold text-brand-charcoal">{selectedService?.title}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] uppercase tracking-wider text-brand-charcoal/40 font-bold">Specialist</span>
                    <span className="text-xs font-semibold text-brand-charcoal">{selectedStylist ? selectedStylist.name : 'First Available'}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] uppercase tracking-wider text-brand-charcoal/40 font-bold">Date &amp; Time</span>
                    <span className="text-xs font-semibold text-brand-charcoal">{selectedDate} @ {selectedTime}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] uppercase tracking-wider text-brand-charcoal/40 font-bold">Total Starts At</span>
                    <span className="text-xs font-serif font-bold text-brand-rosegold-dark">NPR {selectedService?.pricing.toLocaleString()}</span>
                  </div>
                </div>

                <div className="text-left">
                  <h2 className="font-serif text-xl font-semibold text-brand-charcoal">Your Contact Info</h2>
                  <p className="text-xs text-brand-charcoal/60 mt-0.5 font-light">Please enter details so we can save your session.</p>
                </div>

                <form onSubmit={handleBookingSubmit} className="flex flex-col gap-4 text-left">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-brand-charcoal/50 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-brand-rosegold" /> Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Prerna Shrestha"
                      value={contactData.name}
                      onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                      className="w-full px-4 py-2.5 border border-brand-pink-accent/30 rounded-lg text-xs focus:outline-none focus:border-brand-rosegold text-brand-charcoal bg-white/50"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-charcoal/50 flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-brand-rosegold" /> Email
                      </label>
                      <input
                        type="email"
                        placeholder="prerna@gmail.com"
                        value={contactData.email}
                        onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                        className="w-full px-4 py-2.5 border border-brand-pink-accent/30 rounded-lg text-xs focus:outline-none focus:border-brand-rosegold text-brand-charcoal bg-white/50"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-charcoal/50 flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-brand-rosegold" /> Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        placeholder="980XXXXXXX"
                        value={contactData.phone}
                        onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                        className="w-full px-4 py-2.5 border border-brand-pink-accent/30 rounded-lg text-xs focus:outline-none focus:border-brand-rosegold text-brand-charcoal bg-white/50"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-brand-charcoal/50 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-brand-rosegold" /> Add Notes / Requests (Optional)
                    </label>
                    <textarea
                      placeholder="Add any specific requests (e.g. hair length details, skin sensitivities, or request silent service)..."
                      value={contactData.notes}
                      onChange={(e) => setContactData({ ...contactData, notes: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2.5 border border-brand-pink-accent/30 rounded-lg text-xs focus:outline-none focus:border-brand-rosegold text-brand-charcoal bg-white/50 resize-none"
                    />
                  </div>

                  {errorMsg && (
                    <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs font-semibold">
                      {errorMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 w-full flex items-center justify-center gap-1.5 bg-brand-charcoal hover:bg-brand-charcoal-dark text-white font-semibold py-3 rounded-xl text-xs uppercase tracking-wider cursor-pointer disabled:opacity-50"
                  >
                    {loading ? 'Processing Reservation...' : 'Complete Appointment Reservation'}
                  </button>
                </form>
              </motion.div>
            )}

            {/* STEP 5: Success Confirmation Screen */}
            {step === 5 && bookingResult && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center gap-6 py-6"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 font-sans">
                    Booking Successful!
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl text-brand-charcoal">
                    Your Session is Scheduled
                  </h2>
                  <p className="text-xs text-brand-charcoal/60 max-w-md font-light leading-relaxed">
                    We have received your appointment request. The booking is currently **pending** while our staff confirms schedule matching.
                  </p>
                </div>

                {/* Details list card */}
                <div className="w-full max-w-md bg-white border border-brand-pink-accent/25 rounded-2xl p-6 shadow-sm flex flex-col gap-4 text-left font-sans text-xs text-brand-charcoal/80">
                  <div className="flex justify-between items-center pb-2 border-b border-brand-pink-accent/10">
                    <span className="font-semibold text-brand-charcoal/40">Reservation ID</span>
                    <span className="font-mono font-bold text-brand-charcoal-dark">{bookingResult.id.substring(0, 8).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-brand-charcoal/40">Client Name</span>
                    <span className="font-bold">{bookingResult.customerName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-brand-charcoal/40">Beauty Ritual</span>
                    <span className="font-bold text-brand-rosegold-dark">{bookingResult.serviceTitle}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-brand-charcoal/40">Specialist</span>
                    <span>{bookingResult.stylistName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-brand-charcoal/40">Schedule Date/Time</span>
                    <span className="font-bold text-brand-charcoal-dark">
                      {new Date(bookingResult.dateTime).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })} @ {selectedTime}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                  <button
                    onClick={handleWhatsAppShare}
                    className="grow flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl text-xs uppercase tracking-wider cursor-pointer transition-colors shadow-sm"
                  >
                    Confirm via WhatsApp
                  </button>
                  <button
                    onClick={() => router.push('/')}
                    className="grow border border-brand-charcoal/20 hover:bg-brand-charcoal/5 text-brand-charcoal py-3 rounded-xl text-xs uppercase tracking-wider cursor-pointer transition-all"
                  >
                    Return to Homepage
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
