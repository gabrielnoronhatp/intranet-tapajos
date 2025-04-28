import { formatCpf } from '@/lib/utils';
import { Button, message, Tag } from 'antd';
import {  SearchOutlined } from '@ant-design/icons';

interface TalentCandidate {
    id: string;
    cpf: string;
    nome_completo: string;
    email: string;
    telefone: string;
    is_primeiraexperiencia: boolean;
    is_disponivel: string;
    file_perfil: string;
    file_cv?: string;
    is_analizado: boolean;
}

interface TalentAnalysis {
    score: number | string;
    cv_resumo: string;
}

interface TalentData {
    candidate: TalentCandidate;
    analise: TalentAnalysis;
}

export const talentsColumns = [
    {
        title: 'Nome',
        dataIndex: ['candidate', 'nome_completo'],
        key: 'nome_completo',
        sorter: (a: TalentData, b: TalentData) =>
            (a.candidate?.nome_completo || '').localeCompare(
                b.candidate?.nome_completo || ''
            ),
    },
    {
        title: 'CPF',
        dataIndex: ['candidate', 'cpf'],
        key: 'cpf',
        render: (text: string) => formatCpf(text),
    },
    {
        title: 'Email',
        dataIndex: ['candidate', 'email'],
        key: 'email',
    },
    {
        title: 'Telefone',
        dataIndex: ['candidate', 'telefone'],
        key: 'telefone',
    },
    {
        title: 'Primeira Experiência',
        dataIndex: ['candidate', 'is_primeiraexperiencia'],
        key: 'is_primeiraexperiencia',
        render: (value: boolean) => (
            <Tag color={value ? 'blue' : 'green'}>{value ? 'Sim' : 'Não'}</Tag>
        ),
        filters: [
            { text: 'Sim', value: true },
            { text: 'Não', value: false },
        ],
        onFilter: (value: boolean, record: TalentData) =>
            record.candidate?.is_primeiraexperiencia === value,
    },
    {
        title: 'Disponível',
        dataIndex: ['candidate', 'is_disponivel'],
        key: 'is_disponivel',

        filters: [
            { text: 'Sim', value: 'sim' },
            { text: 'Não', value: 'não' },
        ],
        onFilter: (value: string, record: TalentData) =>
            record.candidate?.is_disponivel === value,
    },
    {
        title: 'Analisado',
        dataIndex: ['candidate', 'is_analizado'],
        key: 'is_analizado',
        render: (value: boolean) => (
            <Tag color={value ? 'green' : 'orange'}>
                {value ? 'Sim' : 'Não'}
            </Tag>
        ),
        filters: [
            { text: 'Sim', value: true },
            { text: 'Não', value: false },
        ],
        onFilter: (value: boolean, record: TalentData) =>
            record.candidate?.is_analizado === value,
    },
    {
        title: 'Score',
        dataIndex: ['analise', 'score'],
        key: 'score',
        render: (score: number | string) => {
            let color = 'green';
            const numScore =
                typeof score === 'string' ? parseFloat(score) : score || 0;

            if (numScore < 5) color = 'red';
            else if (numScore < 7) color = 'orange';

            return <Tag color={color}>{score || 'N/A'}</Tag>;
        },
        sorter: (a: TalentData, b: TalentData) => {
            const scoreA = a.analise?.score
                ? typeof a.analise.score === 'string'
                    ? parseFloat(a.analise.score)
                    : a.analise.score
                : 0;
            const scoreB = b.analise?.score
                ? typeof b.analise.score === 'string'
                    ? parseFloat(b.analise.score)
                    : b.analise.score
                : 0;
            return scoreA - scoreB;
        },
    },
    {
        title: 'Ações',
        key: 'actions',
        render: (_: TalentData, record: TalentData) => (
            <div className="flex space-x-2">
                <Button
                    type="primary"
                    icon={<SearchOutlined />}
                    onClick={() => {
                        if (record.candidate?.file_cv) {
                            window.open(
                                `https://api.rh.grupotapajos.com.br//candidato/cv/${record.candidate.file_cv}`,
                                '_blank'
                            );
                        } else {
                            message.warning('Currículo não disponível');
                        }
                    }}
                    className="bg-[#11833b] hover:bg-[#11833b]"
                    size="small"
                />
            </div>
        ),
    },
];
