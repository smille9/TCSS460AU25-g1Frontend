import { getServerSession } from 'next-auth';
import { authOptions } from 'utils/authOptions';
import { NextResponse } from 'next/server';
import { Pool } from 'pg';

export async function GET(request: Request, { params }: { params: Promise<{ type: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { type } = await params;

  if (type !== 'movies' && type !== 'tv') {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }

  const pool = new Pool({
    connectionString: process.env.SUPABASE_CONNECTION_STRING,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const column = type === 'tv' ? 'series' : 'movies';
    const result = await pool.query(`SELECT w.${column} FROM watchlist w WHERE w.email = $1`, [session.user.email]);

    const data = result.rows.length > 0 ? result.rows[0][column] : [];
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    return NextResponse.json({ error: 'Failed to fetch watchlist' }, { status: 500 });
  }
}
