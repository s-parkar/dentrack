import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const SRC_DATA_PATH = path.join(process.cwd(), 'src', 'data', 'users.json');
const PUBLIC_DATA_PATH = path.join(process.cwd(), 'public', 'users.json');

function getUsersFilePath(): string {
  if (fs.existsSync(SRC_DATA_PATH)) return SRC_DATA_PATH;
  if (fs.existsSync(PUBLIC_DATA_PATH)) return PUBLIC_DATA_PATH;
  return SRC_DATA_PATH;
}

export async function GET() {
  try {
    const filePath = getUsersFilePath();
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, 'utf-8');
      const users = JSON.parse(fileData);
      return NextResponse.json(users);
    }
  } catch (error) {
    console.error('Error reading users.json from backend:', error);
  }

  // Fallback default users
  return NextResponse.json([
    {
      id: 'usr-doctor-1',
      name: 'Dr. Sarah Jenkins',
      email: 'doctor@dentrack.com',
      password: 'doctor123',
      role: 'Doctor',
      title: 'Lead Dentist & Surgeon',
    },
    {
      id: 'usr-doctor-2',
      name: 'Dr. Sneha Rao',
      email: 'sneha@dentrack.com',
      password: 'doctor123',
      role: 'Doctor',
      title: 'Senior Dentist & Endodontist',
    },
    {
      id: 'usr-doctor-3',
      name: 'Dr. Karan Malhotra',
      email: 'karan@dentrack.com',
      password: 'doctor123',
      role: 'Doctor',
      title: 'Orthodontic Specialist',
    },
    {
      id: 'usr-doctor-4',
      name: 'Dr. Meera Pillai',
      email: 'meera@dentrack.com',
      password: 'doctor123',
      role: 'Doctor',
      title: 'Pediatric & Cosmetic Dentist',
    },
    {
      id: 'usr-reception-1',
      name: 'Alex Rivers',
      email: 'receptionist@dentrack.com',
      password: 'reception123',
      role: 'Receptionist',
      title: 'Front Desk & Practice Coordinator',
    },
  ]);
}

export async function POST(request: Request) {
  try {
    const newUser = await request.json();
    const filePath = getUsersFilePath();
    let currentUsers = [];

    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, 'utf-8');
      currentUsers = JSON.parse(fileData);
    }

    // Ensure dir exists before writing
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    currentUsers.push(newUser);
    fs.writeFileSync(filePath, JSON.stringify(currentUsers, null, 2));

    // Also sync public/users.json if it exists
    try {
      fs.writeFileSync(PUBLIC_DATA_PATH, JSON.stringify(currentUsers, null, 2));
    } catch {
      /* ignore */
    }

    return NextResponse.json({ success: true, user: newUser });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to write user to backend database.' }, { status: 500 });
  }
}
