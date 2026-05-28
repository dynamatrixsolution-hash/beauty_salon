import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

type AppointmentWithRelations = {
  id: string;
  dateTime: Date;
  status: string;
  serviceId: string;
  serviceTitle: string;
  staffId: string | null;
  staff?: { name: string } | null;
  customer: {
    name: string;
    email: string | null;
    phone: string;
  };
  notes: string | null;
  createdAt: Date;
};

function toClientAppointment(appointment: AppointmentWithRelations, fallbackStylistName = 'Any Available Stylist') {
  return {
    ...appointment,
    customerName: appointment.customer.name,
    customerEmail: appointment.customer.email,
    customerPhone: appointment.customer.phone,
    stylistId: appointment.staffId || 'any',
    stylistName: appointment.staff?.name || fallbackStylistName,
  };
}

// 1. Create a Booking Request (Public)
export async function POST(req: Request) {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      serviceId,
      serviceTitle,
      stylistId,
      stylistName,
      dateTime,
      notes,
    } = await req.json();

    if (
      !customerName ||
      !customerEmail ||
      !customerPhone ||
      !serviceId ||
      !serviceTitle ||
      !stylistId ||
      !stylistName ||
      !dateTime
    ) {
      return NextResponse.json(
        { error: 'Missing required booking details.' },
        { status: 400 }
      );
    }

    // Parse date
    const parsedDate = new Date(dateTime);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json({ error: 'Invalid date/time format.' }, { status: 400 });
    }

    const appointment = await prisma.appointment.create({
      data: {
        serviceId,
        serviceTitle,
        staffId: stylistId === 'any' ? null : stylistId,
        dateTime: parsedDate,
        status: 'pending', // Default status is pending
        notes: notes || '',
        customer: {
          create: {
            name: customerName,
            email: customerEmail,
            phone: customerPhone,
          },
        },
      },
      include: {
        customer: true,
        staff: true,
      },
    });

    return NextResponse.json({ success: true, data: toClientAppointment(appointment, stylistName) });
  } catch (error) {
    console.error('Failed to book appointment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// 2. Fetch all appointments (Admin Only)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const appointments = await prisma.appointment.findMany({
      orderBy: { dateTime: 'asc' },
      include: {
        customer: true,
        staff: true,
      },
    });

    return NextResponse.json({ success: true, data: appointments.map((appointment) => toClientAppointment(appointment)) });
  } catch (error) {
    console.error('Failed to fetch appointments:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// 3. Update appointment status / details (Admin Only)
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, status, dateTime, notes } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Appointment ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (dateTime) {
      const parsedDate = new Date(dateTime);
      if (!isNaN(parsedDate.getTime())) {
        updateData.dateTime = parsedDate;
      }
    }
    if (notes !== undefined) updateData.notes = notes;

    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: updateData,
      include: {
        customer: true,
        staff: true,
      },
    });

    return NextResponse.json({ success: true, data: toClientAppointment(updatedAppointment) });
  } catch (error) {
    console.error('Failed to update appointment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
