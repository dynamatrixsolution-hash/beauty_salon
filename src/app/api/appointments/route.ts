import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

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
        customerName,
        customerEmail,
        customerPhone,
        serviceId,
        serviceTitle,
        stylistId,
        stylistName,
        dateTime: parsedDate,
        status: 'pending', // Default status is pending
        notes: notes || '',
      },
    });

    return NextResponse.json({ success: true, data: appointment });
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
    });

    return NextResponse.json({ success: true, data: appointments });
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
    });

    return NextResponse.json({ success: true, data: updatedAppointment });
  } catch (error) {
    console.error('Failed to update appointment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
