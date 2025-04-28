export type Vacancy = {
    departamento_vaga: string;
    diferencial: string;
    imagem_capa: string;
    isInternalSelection: boolean;
    data_final: string | null;
    criado_por: string | null;
    data_update: string;
    nome_vaga: string;
    id: string;
    is_ativo: boolean;
    requisitos: string;
    url_link: string | null;
    limit_candidatos: number;
    data_inicial: string;
    data_criacao: string;
};

export interface CreateVacancyPayload {
    nome_vaga: string;
    departamento_vaga: string;
    requisitos: string;
    diferencial: string;
    limit_candidatos: number;
    data_inicial: string;
    data_final: string | null;
    isInternalSelection: boolean;
    imagem_capa?: File | null;
    url_link?: string | null;
    criado_por?: string | null;
}
