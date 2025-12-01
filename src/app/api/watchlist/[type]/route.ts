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
  } finally {
    await pool.end();
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ type: string }> }) {
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
    const body = await request.json();
    const { id, action } = body;

    if (!id || typeof id !== 'number') {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    if (action !== 'add' && action !== 'remove') {
      return NextResponse.json({ error: 'Invalid action. Must be "add" or "remove"' }, { status: 400 });
    }

    const column = type === 'tv' ? 'series' : 'movies';
    const email = session.user.email;

    // Check if user has a watchlist row
    const checkResult = await pool.query('SELECT email FROM watchlist WHERE email = $1', [email]);

    if (checkResult.rows.length === 0) {
      // Create new watchlist row with the item
      if (action === 'add') {
        await pool.query(`INSERT INTO watchlist (email, ${column}) VALUES ($1, $2)`, [email, [id]]);
        return NextResponse.json({ success: true, message: 'Item added to watchlist' });
      } else {
        return NextResponse.json({ success: true, message: 'Nothing to remove' });
      }
    }

    // Update existing watchlist
    if (action === 'add') {
      // Add item if not already in array
      await pool.query(
        `UPDATE watchlist 
         SET ${column} = array_append(${column}, $1) 
         WHERE email = $2 
         AND NOT ($1 = ANY(${column}))`,
        [id, email]
      );
      return NextResponse.json({ success: true, message: 'Item added to watchlist' });
    } else {
      // Remove item from array
      await pool.query(
        `UPDATE watchlist 
         SET ${column} = array_remove(${column}, $1) 
         WHERE email = $2`,
        [id, email]
      );
      return NextResponse.json({ success: true, message: 'Item removed from watchlist' });
    }
  } catch (error) {
    console.error('Error updating watchlist:', error);
    return NextResponse.json({ error: 'Failed to update watchlist' }, { status: 500 });
  } finally {
    await pool.end();
  }
}