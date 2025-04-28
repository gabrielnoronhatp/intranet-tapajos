export interface EmailAprovado {
    para: string;
    vaga_id: string;
    candidato_id: string;
    nome: string;
    vaga: string;
    loja: string;
    horario: string;
    escala: string;
    modalidade: string;
    data_exame: string;
}

export interface EmailRecusado {
    para: string;
    nome: string;
    vaga: string;
    vaga_id: string;
    candidato_id: string;
}

export interface EmailEntrevista {
    para: string;
    vaga_id: string;
    candidato_id: string;
    nome: string;
    vaga: string;
    dia_hora_entrevista: string;
    escala: string;
    salario: string;
}

export type TipoEmail = 'aprovado' | 'recusado' | 'entrevista';
