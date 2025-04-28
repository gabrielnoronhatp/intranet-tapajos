export type IAnalysis = {
    score: number;
    cv_resumo: string;
    status?: 'entrevista' | 'aprovado' | 'recusado' | null;
};
