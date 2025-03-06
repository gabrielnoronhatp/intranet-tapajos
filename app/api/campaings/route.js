import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    port: 5432,
});

export async function POST(request) {
    try {
        const campaignData = await request.json();
        const {
            nome,
            filial,
            datainicial,
            datafinal,
            valor_total,
            userlanc,
            datalanc,
            status,
            participantes,
            itens
        } = campaignData;

        console.log('Campaign Data:', campaignData);

        if (!nome) {
            return NextResponse.json(
                { error: 'O campo nome é obrigatório' },
                { status: 400 }
            );
        }

        // Start a transaction
        await pool.query('BEGIN');

        const campaignQuery = `
            INSERT INTO intra.trd_campanha_distribuicao (idempresa, nome, datainicial,  datafinal, valor_total, userlanc, datalanc, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id
        `;
        const campaignValues = [
            filial,
            nome,
            datainicial,
            datafinal,
            valor_total,
            userlanc,
            datalanc,
            status,
        ];
        const campaignResult = await pool.query(campaignQuery, campaignValues);
        const campaignId = campaignResult.rows[0].id;

        const participantQuery = `
        INSERT INTO intra.trd_campanha_distribuicao_participantes (idcampanha_distribuicao, modelo, meta, idparticipante, premiacao, meta_valor, meta_quantidade)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    for (const participant of participantes) {
        if (!participant.idparticipante) {
            await pool.query('ROLLBACK');
            return NextResponse.json(
                { error: 'ID do participante é obrigatório' },
                { status: 400 }
            );
        }
    
        const participantValues = [
            campaignId,
            participant.modelo,
            participant.meta,
            participant.idparticipante,
            participant.premiacao,
            participant.meta_valor,
            participant.meta_quantidade,
        ];
        await pool.query(participantQuery, participantValues);
    }

        const itemQuery = `
            INSERT INTO intra.trd_campanha_distribuicao_itens (idcampanha_distribuicao, metrica, iditem)
            VALUES ($1, $2, $3)
        `;
        for (const item of itens) {
            const itemValues = [campaignId, item.metrica, item.iditem];
            await pool.query(itemQuery, itemValues);
        }

        await pool.query('COMMIT');

        return NextResponse.json({ success: true, id: campaignId });
    } catch (error) {
        console.error('Erro ao criar campanha:', error);
        await pool.query('ROLLBACK');
        return NextResponse.json(
            { error: 'Erro ao criar campanha' },
            { status: 500 }
        );
    }
}


