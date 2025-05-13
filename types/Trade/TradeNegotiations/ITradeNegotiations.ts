export interface INegociacaoVarejo {
  id?: number;
  descricao: string;
  data_inicial: string;
  data_final: string;
  usuario: string;
  last_update?: string;
}

export interface INegociacaoVarejoItem {
  id?: number;
  id_negociacao: number;
  descricao: string;
  last_update?: string;
}

export interface INegociacaoEmpresa {
  id?: number;
  id_negociacao: number;
  id_item: number;
  id_empresa: number;
  descricao: string; 
  last_update?: string;
  meta?: number;
  premiacao?: string;
  id_item_original?: number;
}


export interface INegociacaoProduto {
  id?: number;
  id_negociacao: number;
  id_item: number;
  id_produto: number;
  descricao: string; 
  unidades: number;
  last_update?: string;
  valor?: number;
  id_item_original?: number;
}

export interface INegociacaoContato {
  id?: number;
  id_negociacao: number;
  nome: string;
  email: string;
  telefone: string;
  last_update?: string;
}

export interface IItemCampanha {
  id: number;
  descricao: string;
  empresas: INegociacaoEmpresa[];
  produtos: INegociacaoProduto[];
}

export interface IFilial {
  id: number;
  codigo: string;
  descricao: string;
}

export interface IProduto {
  id: number;
  codigo: string;
  descricao: string;
}

export interface ITabelaCampanha {
  id: number;
  itemId?: number;
  descricao: string;
  tipoAtivo: 'loja' | 'produtos';
  empresasSelecionadas: INegociacaoEmpresa[];
  produtosSelecionados: INegociacaoProduto[];
}


export interface ICriarNegociacaoPayload {
  negociacao: INegociacaoVarejo;
  itens: INegociacaoVarejoItem[];
  empresas: INegociacaoEmpresa[];
  produtos: INegociacaoProduto[];
  contatos: {
    nome: string;
    email: string;
    celular: string;
  }[];
}
