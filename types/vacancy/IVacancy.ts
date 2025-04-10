export type Vacancy =  {
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
}
 
export interface ICandidate {
    id: string;
    nome_completo: string;
    analise: IAnalysis;
    email: string;
    cpf: string;
    telefone: string;
    is_primeiraexperiencia: boolean;
    is_disponivel: string;
    file_perfil: string;
    file_cv: string;
    is_analizado: boolean;
    candidate: ICandidate;
}


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

 export type IAnalysis = {
    score: number;
    cv_resumo: string;
 }
