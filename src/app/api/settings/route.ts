import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { promises as fs } from 'fs';
import path from 'path';

const getFilePath = () => path.join(process.cwd(), 'src', 'data', 'settings.json');

async function readSettings() {
  const filePath = getFilePath();
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const parsed = JSON.parse(data);
    return {
      salon_status_override: parsed.salon_status_override || 'auto',
      auto_open_hour: parsed.auto_open_hour !== undefined ? parseInt(parsed.auto_open_hour) : 10,
      auto_close_hour: parsed.auto_close_hour !== undefined ? parseInt(parsed.auto_close_hour) : 20,
    };
  } catch (error) {
    // Return default settings if file doesn't exist
    return {
      salon_status_override: 'auto',
      auto_open_hour: 10,
      auto_close_hour: 20,
    };
  }
}

async function writeSettings(settings: any) {
  const filePath = getFilePath();
  const dir = path.dirname(filePath);
  try {
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(settings, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Failed to write settings:', error);
    return false;
  }
}

// 1. Get Settings
export async function GET() {
  try {
    const settings = await readSettings();
    return NextResponse.json({
      success: true,
      value: settings.salon_status_override,
      autoOpenHour: settings.auto_open_hour,
      autoCloseHour: settings.auto_close_hour,
    });
  } catch (error) {
    console.error('Failed to fetch salon settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// 2. Update Settings (Admin Only)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { value, autoOpenHour, autoCloseHour } = body;

    const settings = await readSettings();

    // 1. Validate and Update override status if passed
    if (value !== undefined) {
      if (!['auto', 'open', 'closed'].includes(value)) {
        return NextResponse.json({ error: 'Invalid override value' }, { status: 400 });
      }
      settings.salon_status_override = value;
    }

    // 2. Validate and Update hours if passed
    if (autoOpenHour !== undefined) {
      const openHourNum = parseInt(autoOpenHour);
      if (isNaN(openHourNum) || openHourNum < 0 || openHourNum > 23) {
        return NextResponse.json({ error: 'Opening hour must be between 0 and 23' }, { status: 400 });
      }
      settings.auto_open_hour = openHourNum;
    }

    if (autoCloseHour !== undefined) {
      const closeHourNum = parseInt(autoCloseHour);
      if (isNaN(closeHourNum) || closeHourNum < 0 || closeHourNum > 23) {
        return NextResponse.json({ error: 'Closing hour must be between 0 and 23' }, { status: 400 });
      }
      settings.auto_close_hour = closeHourNum;
    }

    const success = await writeSettings(settings);
    if (!success) {
      return NextResponse.json({ error: 'Failed to write settings' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      value: settings.salon_status_override,
      autoOpenHour: settings.auto_open_hour,
      autoCloseHour: settings.auto_close_hour,
    });
  } catch (error) {
    console.error('Failed to update salon settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
