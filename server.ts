import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.PG_HOST || 'localhost',
  port: Number(process.env.PG_PORT || 5432),
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || '',
  database: process.env.PG_DATABASE || 'library_db',
});

const runQuery = async (text: string, params: any[] = []) => {
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
};

const withClient = async <T>(cb: (client: import('pg').PoolClient) => Promise<T>) => {
  const client = await pool.connect();
  try {
    return await cb(client);
  } finally {
    client.release();
  }
};

app.get('/api/health', (_, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/books', async (_, res) => {
  try {
    const result = await runQuery('SELECT * FROM books ORDER BY title');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load books' });
  }
});

app.post('/api/books', async (req, res) => {
  const { title, author, genre, totalCount, color } = req.body;
  if (!title || !author || typeof totalCount !== 'number') {
    return res.status(400).json({ error: 'Invalid book payload' });
  }

  const id = crypto.randomUUID();
  const availableCount = totalCount;

  try {
    await runQuery(
      `INSERT INTO books(id, title, author, genre, available_count, total_count, color)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [id, title, author, genre, availableCount, totalCount, color || 'bg-slate-900']
    );
    res.status(201).json({ id, title, author, genre, availableCount, totalCount, color: color || 'bg-slate-900' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create book' });
  }
});

app.put('/api/books/:id', async (req, res) => {
  const { id } = req.params;
  const { title, author, genre, availableCount, totalCount, color } = req.body;

  try {
    await runQuery(
      `UPDATE books SET title=$1, author=$2, genre=$3, available_count=$4, total_count=$5, color=$6 WHERE id=$7`,
      [title, author, genre, availableCount, totalCount, color, id]
    );
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update book' });
  }
});

app.delete('/api/books/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await runQuery('DELETE FROM books WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete book' });
  }
});

app.get('/api/members', async (_, res) => {
  try {
    const result = await runQuery('SELECT * FROM members ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load members' });
  }
});

app.post('/api/members', async (req, res) => {
  const { name, email, phone, joinedDate, status, borrowedCount } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'Invalid member payload' });
  }

  const id = crypto.randomUUID();

  try {
    await runQuery(
      `INSERT INTO members(id, name, email, phone, joined_date, status, borrowed_count)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [id, name, email, phone, joinedDate || new Date().toDateString(), status || 'active', borrowedCount || 0]
    );
    res.status(201).json({ id, name, email, phone, joinedDate: joinedDate || new Date().toDateString(), status: status || 'active', borrowedCount: borrowedCount || 0 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create member' });
  }
});

app.put('/api/members/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, joinedDate, status, borrowedCount } = req.body;
  try {
    await runQuery(
      `UPDATE members SET name=$1, email=$2, phone=$3, joined_date=$4, status=$5, borrowed_count=$6 WHERE id=$7`,
      [name, email, phone, joinedDate, status, borrowedCount, id]
    );
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update member' });
  }
});

app.delete('/api/members/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await runQuery('DELETE FROM members WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete member' });
  }
});

app.get('/api/loans', async (_, res) => {
  try {
    const result = await runQuery('SELECT * FROM loans ORDER BY borrowed_date DESC');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load loans' });
  }
});

app.post('/api/loans', async (req, res) => {
  const { bookId, memberId } = req.body;
  if (!bookId || !memberId) {
    return res.status(400).json({ error: 'Invalid loan payload' });
  }

  try {
    const bookResult = await runQuery('SELECT * FROM books WHERE id = $1', [bookId]);
    const memberResult = await runQuery('SELECT * FROM members WHERE id = $1', [memberId]);
    const book = bookResult.rows[0];
    const member = memberResult.rows[0];

    if (!book || !member) {
      return res.status(404).json({ error: 'Book or member not found' });
    }
    if (book.available_count <= 0) {
      return res.status(400).json({ error: 'Book is not available' });
    }

    const id = crypto.randomUUID();
    const borrowedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    await withClient(async (client) => {
      try {
        await client.query('BEGIN');
        await client.query(
          `INSERT INTO loans(id, book_title, author, member_name, borrowed_date, due_date, is_overdue)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [id, book.title, book.author, member.name, borrowedDate, dueDate, false]
        );
        await client.query('UPDATE books SET available_count = available_count - 1 WHERE id = $1', [bookId]);
        await client.query('UPDATE members SET borrowed_count = borrowed_count + 1 WHERE id = $1', [memberId]);
        await client.query('COMMIT');
      } catch (transactionError) {
        await client.query('ROLLBACK').catch(() => undefined);
        throw transactionError;
      }
    });

    res.status(201).json({ id, bookTitle: book.title, author: book.author, memberName: member.name, borrowedDate, dueDate, isOverdue: false });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create loan' });
  }
});

app.delete('/api/loans/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const loanResult = await runQuery('SELECT * FROM loans WHERE id = $1', [id]);
    const loan = loanResult.rows[0];
    if (!loan) return res.status(404).json({ error: 'Loan not found' });

    await runQuery('DELETE FROM loans WHERE id = $1', [id]);
    await runQuery('UPDATE books SET available_count = available_count + 1 WHERE title = $1', [loan.book_title]);
    await runQuery('UPDATE members SET borrowed_count = GREATEST(borrowed_count - 1, 0) WHERE name = $1', [loan.member_name]);

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete loan' });
  }
});

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  console.log(`PostgreSQL API server listening on http://localhost:${port}`);
});
