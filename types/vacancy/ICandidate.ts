import { IAnalysis } from './IAnalysis';

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
    candidate?: ICandidate;
}
