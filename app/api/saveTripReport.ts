// pages/api/saveTripReport.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

type ApiResponse = {
  id?: number;
  message?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method === 'POST') {
    const { full_text, location, substance, mood } = req.body;

    try {
      const queryText = 'INSERT INTO trip_reports(full_text, location, substance, mood) VALUES($1, $2, $3, $4) RETURNING id';
      const values = [full_text, location, substance, mood];
      const response = await pool.query(queryText, values);

      res.status(200).json({ id: response.rows[0].id, message: "Trip report saved successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to save trip report" });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
