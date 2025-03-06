import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    port: 5432, 
});

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');
        const searchTerm = searchParams.get('name') || '';

        let query;
        let values = [`%${searchTerm}%`];

        if (type === 'vendedor') {
            query = `
                SELECT codusur, nome
                FROM wint.pcusuari
                WHERE dttermino IS NULL
                AND UPPER(CONCAT(codusur, '-', nome)) LIKE UPPER($1)
            `;
        } else if (type === 'teleoperador') {
            query = `
                SELECT e.matricula, e.nome
                FROM wint.pcempr e
                WHERE EXISTS (
                    SELECT 1 FROM wint.pcpedc 
                    WHERE codemitente = e.matricula AND condvenda = 1
                    AND posicao = 'F'
                    AND data >= (CURRENT_DATE - INTERVAL '45 day')
                )
                AND UPPER(CONCAT(e.matricula, '-', e.nome)) LIKE UPPER($1)
            `;
        } else {
            return NextResponse.json(
                { error: 'Invalid type parameter' },
                { status: 400 }
            );
        }

        const result = await pool.query(query, values);
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Erro na consulta ao banco de dados:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
} 