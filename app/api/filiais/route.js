import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    port: 5432,
});
export const dynamic = 'force-dynamic'; // Adicione esta linha

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const filter = searchParams.get('filter') || '';

        const query = `
            SELECT idempresa, fantasia
            FROM public.dimfilial
            WHERE idempresa IN (1, 3, 4, 8)
            AND UPPER(fantasia) LIKE UPPER($1)
        `;
        const values = [`%${filter}%`];

        const result = await pool.query(query, values);
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar filiais:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar filiais' },
            { status: 500 }
        );
    }
}
