import React, { useState, useEffect } from 'react';
import {
    Modal,
    Form,
    Input,
    Radio,
    DatePicker,
    Button,
    message,
    Spin,
} from 'antd';
import { ICandidate } from '@/types/vacancy/ICandidate';
import {
    EmailAprovado,
    EmailEntrevista,
    EmailRecusado,
    TipoEmail,
} from '@/types/vacancy/IEmail';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/hooks/store';
import {
    sendEmailAprovado,
    sendEmailRecusado,
    sendEmailEntrevista,
    resetEmailStatus,
} from '@/hooks/slices/vacancySlice';
import dayjs from 'dayjs';
import { useSearchParams } from 'next/navigation';

interface EmailModalProps {
    isVisible: boolean;
    onClose: () => void;
    candidate: ICandidate;
    vacancyId: string;
    candidateId: string;
    vacancyName: string;
}

const EmailModal: React.FC<EmailModalProps> = ({
    isVisible,
    onClose,
    candidate,
    vacancyId,
    candidateId,
}) => {
    const [form] = Form.useForm();
    const searchParams = useSearchParams();
    const vacancyName = searchParams.get('vacancyName');

    const [tipoEmail, setTipoEmail] = useState<TipoEmail>('entrevista');
    const dispatch = useDispatch<AppDispatch>();
    const { emailStatus } = useSelector((state: RootState) => state.vacancy);

    useEffect(() => {
        if (candidate && isVisible) {
            const candidateData = candidate.candidate || candidate;
            form.setFieldsValue({
                para: candidateData.email,
                nome: candidateData.nome_completo,
                vaga: vacancyName,
            });
        }
    }, [candidate, form, isVisible, vacancyName]);

    useEffect(() => {
        if (!isVisible) {
            dispatch(resetEmailStatus());
        }
    }, [isVisible, dispatch]);

    useEffect(() => {
        if (emailStatus.success) {
            message.success('E-mail enviado com sucesso!');
            onClose();
        }

        if (emailStatus.error) {
            message.error(`Erro ao enviar e-mail: ${emailStatus.error}`);
        }
    }, [emailStatus, onClose]);

    const handleTipoEmailChange = (e: any) => {
        setTipoEmail(e.target.value);
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            switch (tipoEmail) {
                case 'aprovado': {
                    const aprovadoData: EmailAprovado = {
                        vaga_id: vacancyId,
                        candidato_id: candidateId,
                        para: values.para,
                        nome: values.nome,
                        vaga: values.vaga,
                        loja: values.loja,
                        horario: values.horario,
                        escala: values.escala,
                        modalidade: values.modalidade,
                        data_exame: values.data_exame
                            ? dayjs(values.data_exame).format('DD/MM/YYYY')
                            : '',
                    };
                    dispatch(sendEmailAprovado(aprovadoData));
                    break;
                }

                case 'recusado': {
                    const recusadoData: EmailRecusado = {
                        vaga_id: vacancyId,
                        candidato_id: candidateId,
                        para: values.para,
                        nome: values.nome,
                        vaga: values.vaga,
                    };
                    dispatch(sendEmailRecusado(recusadoData));
                    break;
                }

                case 'entrevista': {
                    const entrevistaData: EmailEntrevista = {
                        vaga_id: vacancyId,
                        candidato_id: candidateId,
                        para: values.para,
                        nome: values.nome,
                        vaga: values.vaga,
                        dia_hora_entrevista: values.dia_hora_entrevista
                            ? dayjs(values.dia_hora_entrevista).format(
                                  'DD/MM/YYYY HH:mm'
                              )
                            : '',
                        escala: values.escala,
                        salario: values.salario,
                    };
                    dispatch(sendEmailEntrevista(entrevistaData));
                    break;
                }
            }
        } catch (error) {
            console.error('Erro ao validar formulário:', error);
        }
    };

    const renderFormFields = () => {
        switch (tipoEmail) {
            case 'aprovado': {
                return (
                    <>
                        <Form.Item
                            name="loja"
                            label="Loja"
                            rules={[
                                {
                                    required: true,
                                    message: 'Por favor, informe a loja',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="horario"
                            label="Horário"
                            rules={[
                                {
                                    required: true,
                                    message: 'Por favor, informe o horário',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="escala"
                            label="Escala"
                            rules={[
                                {
                                    required: true,
                                    message: 'Por favor, informe a escala',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="modalidade"
                            label="Modalidade"
                            rules={[
                                {
                                    required: true,
                                    message: 'Por favor, informe a modalidade',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="data_exame"
                            label="Data do Exame"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        'Por favor, informe a data do exame',
                                },
                            ]}
                        >
                            <DatePicker
                                format="DD/MM/YYYY"
                                placeholder="Selecione a data"
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                    </>
                );
            }

            case 'entrevista': {
                return (
                    <>
                        <Form.Item
                            name="dia_hora_entrevista"
                            label="Data e Hora da Entrevista"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        'Por favor, informe a data e hora da entrevista',
                                },
                            ]}
                        >
                            <DatePicker
                                format="DD/MM/YYYY HH:mm"
                                showTime={{ format: 'HH:mm' }}
                                placeholder="Selecione a data e hora"
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                        <Form.Item
                            name="escala"
                            label="Escala"
                            rules={[
                                {
                                    required: true,
                                    message: 'Por favor, informe a escala',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="salario"
                            label="Salário"
                            rules={[
                                {
                                    required: true,
                                    message: 'Por favor, informe o salário',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </>
                );
            }

            case 'recusado': {
                return null;
            }

            default: {
                return null;
            }
        }
    };

    return (
        <Modal
            title="Enviar E-mail ao Candidato"
            open={isVisible}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Cancelar
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    onClick={handleSubmit}
                    loading={emailStatus.loading}
                    className="bg-[#11833b] hover:bg-[#11833b]"
                >
                    Enviar E-mail
                </Button>,
            ]}
            width={600}
        >
            {emailStatus.loading ? (
                <div className="flex justify-center items-center py-12">
                    <Spin size="large" />
                    <p className="ml-3">Enviando e-mail...</p>
                </div>
            ) : (
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="tipoEmail"
                        label="Tipo de E-mail"
                        initialValue={tipoEmail}
                    >
                        <Radio.Group
                            onChange={handleTipoEmailChange}
                            value={tipoEmail}
                        >
                            <Radio.Button value="entrevista">
                                Entrevista
                            </Radio.Button>
                            <Radio.Button value="aprovado">
                                Aprovado
                            </Radio.Button>
                            <Radio.Button value="recusado">
                                Recusado
                            </Radio.Button>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        name="para"
                        label="Para"
                        rules={[
                            {
                                required: true,
                                type: 'email',
                                message: 'Por favor, informe um e-mail válido',
                            },
                        ]}
                    >
                        <Input disabled />
                    </Form.Item>

                    <Form.Item
                        name="nome"
                        label="Nome do Candidato"
                        rules={[
                            {
                                required: true,
                                message:
                                    'Por favor, informe o nome do candidato',
                            },
                        ]}
                    >
                        <Input disabled />
                    </Form.Item>

                    <Form.Item
                        name="vaga"
                        label="Vaga"
                        rules={[
                            {
                                required: true,
                                message: 'Por favor, informe a vaga',
                            },
                        ]}
                    >
                        <Input disabled />
                    </Form.Item>

                    {renderFormFields()}
                </Form>
            )}
        </Modal>
    );
};

export default EmailModal;
