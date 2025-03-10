export const dynamic = 'force-dynamic';

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
    const client = await pool.connect();
    
    try {
        // Extrair parâmetros da URL
        const { searchParams } = new URL(request.url);
        const name = searchParams.get('name') || '';
        const type = searchParams.get('type') || '';
        
        console.log(`Buscando operadores com name=${name} e type=${type}`);
        
        let query = `
            SELECT id, nome, tipo 
            FROM intra.operadores 
            WHERE 1=1
        `;
        
        const queryParams = [];
        let paramIndex = 1;
        
        if (name) {
            query += ` AND nome ILIKE $${paramIndex}`;
            queryParams.push(`%${name}%`);
            paramIndex++;
        }
        
        if (type) {
            query += ` AND tipo = $${paramIndex}`;
            queryParams.push(type);
            paramIndex++;
        }
        
        query += ` ORDER BY nome LIMIT 50`;
        
        const result = await client.query(query, queryParams);
        
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar operadores:', error.message, error.stack);
        return NextResponse.json(
            { error: 'Erro ao buscar operadores', details: error.message },
            { status: 500 }
        );
    } finally {
        client.release();
    }
}
