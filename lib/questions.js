export const INITIAL_QUESTIONS = [
      {
        id: 1,
        question: "Qual é o principal fenômeno meteorológico gerado pela evapotranspiração da Floresta Amazônica?",
        options: ["Ventos Alísios do Sul", "Rios Voadores", "Frentes Frias Polares", "Ciclones Tropicais"],
        correctIndex: 1,
        explanation: "Os 'Rios Voadores' são cursos de água atmosféricos invisíveis que levam umidade da Bacia Amazônica para o Centro-Oeste, Sudeste e Sul do Brasil.",
        category: "Amazônia",
        difficulty: "Médio"
      },
      {
        id: 2,
        question: "Qual porcentagem mínima da propriedade rural na Amazônia Legal deve ser mantida como Reserva Legal segundo o Código Florestal?",
        options: ["20%", "35%", "50%", "80%"],
        correctIndex: 3,
        explanation: "O Código Florestal Brasileiro exige que propriedades rurais no bioma Amazônia preservem 80% de sua área nativa como Reserva Legal.",
        category: "Preservação",
        difficulty: "Difícil"
      },
      {
        id: 3,
        question: "Qual é a causa direta da imensa maioria das queimadas na Floresta Amazônica?",
        options: ["Combustão espontânea pelo sol", "Ação humana associada ao desmatamento", "Erupções vulcânicas", "Queda frequente de raios"],
        correctIndex: 1,
        explanation: "A Floresta Amazônica é úmida e não pega fogo naturally de forma espontânea. As queimadas são iniciadas pela ação humana para limpeza de pastos e abertura de áreas desmatadas.",
        category: "Queimadas",
        difficulty: "Fácil"
      },
      {
        id: 4,
        question: "Qual sistema do INPE fornece alertas diários em tempo real para orientar a fiscalização do desmatamento?",
        options: ["PRODES", "DETER", "SIGAM", "BDQueimadas"],
        correctIndex: 1,
        explanation: "O DETER (Detecção de Desmatamento em Tempo Real) emite alertas diários para direcionar a fiscalização em campo do IBAMA e ICMBio.",
        category: "Preservação",
        difficulty: "Médio"
      },
      {
        id: 5,
        question: "Por que a Amazônia desempenha um papel crucial no combate às mudanças climáticas globais?",
        options: ["Ela reflete toda a luz solar de volta ao espaço", "Ela estoca bilhões de toneladas de carbono na sua biomassa", "Ela produz o ozônio necessário para a atmosfera", "Ela resfria os oceanos do sul"],
        correctIndex: 1,
        explanation: "A floresta retém enormes quantidades de dióxido de carbono. Quando queimada ou desmatada, esse carbono é liberado na atmosfera, acelerando o aquecimento global.",
        category: "Clima",
        difficulty: "Fácil"
      },
      {
        id: 6,
        question: "Qual destas espécies de mamíferos aquáticos é endêmica dos rios da Bacia Amazônica e ameaçada pelo garimpo?",
        options: ["Boto-Cor-de-Rosa", "Baleia-Jubarte", "Peixe-Boi Marinho", "Foca-Monge"],
        correctIndex: 0,
        explanation: "O Boto-Cor-de-Rosa vive exclusivamente nas bacias dos rios Amazônia e Orinoco e sofre com a poluição por mercúrio e contaminação do garimpo.",
        category: "Biodiversidade",
        difficulty: "Fácil"
      },
      {
        id: 7,
        question: "Qual das alternativas representa o impacto da fumaça das queimadas na saúde pública da população?",
        options: ["Aumento da oxigenação pulmonar", "Problemas respiratórios severos devido às partículas PM2.5", "Melhoria na qualidade do sono", "Redução de alergias"],
        correctIndex: 1,
        explanation: "O material particulado fino (PM2.5) presente na fumaça penetra profundamente nos pulmões, provocando crises respiratórias sérias em crianças e idosos.",
        category: "Queimadas",
        difficulty: "Médio"
      },
      {
        id: 8,
        question: "O que é o processo conhecido como 'Savanização da Amazônia'?",
        options: ["Plantação de savanas artificiais para pecuária", "Transformação da floresta tropical em uma vegetação seca degradada pelo desmatamento e aquecimento", "Crescimento de árvores gigantes", "Aumento no volume dos rios"],
        correctIndex: 1,
        explanation: "Se o desmatamento ultrapassar um ponto de não retorno (tipping point de 20-25%), a floresta perde capacidade de produzir chuva e se degrada em uma savana empobrecida.",
        category: "Clima",
        difficulty: "Difícil"
      },
      {
        id: 9,
        question: "Qual órgão é o responsável federal pelas brigadas do Prevfogo no combate direto aos incêndios florestais?",
        options: ["IBAMA", "INPA", "ANATEL", "CONAB"],
        correctIndex: 0,
        explanation: "O IBAMA coordena o Centro Nacional de Prevenção e Combate aos Incêndios Florestais (Prevfogo), atuando no combate direto ao fogo.",
        category: "Preservação",
        difficulty: "Médio"
      },
      {
        id: 10,
        question: "A Amazônia abriga aproximadamente qual fração da biodiversidade conhecida do planeta Terra?",
        options: ["1 em cada 10 espécies conhecidas", "50% de todos os seres vivos", "Menos de 1%", "90% das mamíferos terrestres"],
        correctIndex: 0,
        explanation: "Estima-se que a Amazônia seja o lar de pelo menos 10% (1 em cada 10) de todas as espécies de plantas e animais descritas no mundo.",
        category: "Biodiversidade",
        difficulty: "Médio"
      },
      {
        id: 11,
        question: "Qual é a função do sistema PRODES mantido pelo INPE?",
        options: ["Prever a chuva diária em Manaus", "Calcular a taxa anual consolidada de desmatamento por corte raso na Amazônia", "Monitorar navios no Oceano Atlântico", "Contar o número de turistas"],
        correctIndex: 1,
        explanation: "O PRODES calcula a taxa oficial anual de desmatamento por corte raso no Brasil com altíssima precisão espacial.",
        category: "Preservação",
        difficulty: "Difícil"
      },
      {
        id: 12,
        question: "Qual destas ações individuais ajuda diretamente no combate ao desmatamento ilegal e queimadas?",
        options: ["Exigir rastreabilidade da madeira e carne consumidas", "Aumentar o desperdício de papel", "Realizar queimadas sem autorização ambiental", "Ignorar alertas de focos de incêndio"],
        correctIndex: 0,
        explanation: "O consumo consciente de produtos certificados evita financiar a cadeia ilegal de desmatamento e grilagem de terras.",
        category: "Recursos naturais",
        difficulty: "Fácil"
      }
    ];
