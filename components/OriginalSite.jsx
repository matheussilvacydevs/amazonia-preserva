"use client";
import React, {useState,useEffect,useRef,useMemo} from "react";
import {INITIAL_QUESTIONS} from "../lib/questions";
import {MultiplayerQuizEngine} from "./MultiplayerQuizEngine";
    // --- MAIN APP COMPONENT ---
    function App() {
      const [currentTab, setCurrentTab] = useState('home');
      const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
      const [darkMode, setDarkMode] = useState(false);

      useEffect(() => {
        const saved = localStorage.getItem('amazonia-theme');
        const dark = saved === 'dark';
        setDarkMode(dark);
        document.documentElement.classList.toggle('dark-theme', dark);
      }, []);

      const toggleTheme = () => {
        setDarkMode(prev => {
          const next = !prev;
          document.documentElement.classList.toggle('dark-theme', next);
          localStorage.setItem('amazonia-theme', next ? 'dark' : 'light');
          return next;
        });
      };
      const [questionsList, setQuestionsList] = useState(INITIAL_QUESTIONS);

      // Quiz mode state
      const [quizMode, setQuizMode] = useState(null); // 'solo', 'multiplayer', or null

      return (
        <div className="site-shell min-h-screen flex flex-col justify-between bg-stone-50 text-stone-800">
          {/* NAVIGATION BAR */}
          <header className="sticky top-0 z-50 bg-amazon-950/95 backdrop-blur-md text-white border-b border-amazon-900 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
              <div className="flex items-center space-x-3 cursor-pointer" onClick={() => { setCurrentTab('home'); setQuizMode(null); }}>
                <div className="w-10 h-10 bg-amazon-600 rounded-2xl flex items-center justify-center text-xl shadow-md border border-amazon-400/30">
                  🌳
                </div>
                <div>
                  <h1 className="font-extrabold text-base sm:text-lg tracking-tight leading-tight text-white">
                    AMAZÔNIA <span className="text-amazon-400 font-light">PRESERVA</span>
                  </h1>
                  <p className="text-[10px] text-amazon-300 uppercase tracking-wider">Combate a Queimadas</p>
                </div>
              </div>

              {/* Desktop Nav */}
              <nav className="hidden lg:flex items-center space-x-1">
                {[
                  { id: 'home', label: 'Início', icon: 'fa-house' },
                  { id: 'amazonia', label: 'Amazônia', icon: 'fa-tree' },
                  { id: 'queimadas', label: 'Queimadas', icon: 'fa-fire' },
                  { id: 'preservacao', label: 'Preservação', icon: 'fa-shield-halved' },
                  { id: 'biodiversidade', label: 'Biodiversidade', icon: 'fa-paw' },
                  { id: 'ajudar', label: 'Como Ajudar', icon: 'fa-hand-holding-heart' },
                  { id: 'quiz', label: 'Quiz', icon: 'fa-gamepad', highlight: true },
                  { id: 'fontes', label: 'Fontes', icon: 'fa-book' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setCurrentTab(item.id); setQuizMode(null); }}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-2 ${
                      currentTab === item.id
                        ? 'bg-amazon-700 text-white shadow-inner'
                        : item.highlight
                        ? 'bg-fire-600 text-white hover:bg-fire-500 shadow-md'
                        : 'text-stone-300 hover:text-white hover:bg-amazon-900/60'
                    }`}
                  >
                    <i className={`fa-solid ${item.icon} text-xs`}></i>
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>

              {/* Theme switch */}
              <div className="ml-auto lg:ml-3 mr-2 lg:mr-0">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className={`theme-switch ${darkMode ? 'is-dark' : ''}`}
                  aria-label={darkMode ? 'Ativar tema claro' : 'Ativar tema escuro'}
                  aria-pressed={darkMode}
                  title={darkMode ? 'Tema escuro' : 'Tema claro'}
                >
                  <span className="theme-sky" aria-hidden="true">
                    <span className="theme-stars">✦ · ✧</span>
                    <span className="theme-cloud cloud-one">☁</span>
                    <span className="theme-cloud cloud-two">☁</span>
                    <span className="theme-orb">
                      <span className="theme-sun">☀</span>
                      <span className="theme-moon">☾</span>
                    </span>
                  </span>
                </button>
              </div>

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-stone-300 hover:text-white hover:bg-amazon-900 focus:outline-none"
              >
                <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-2xl`}></i>
              </button>
            </div>

            {/* Mobile Nav Dropdown */}
            {mobileMenuOpen && (
              <div className="lg:hidden bg-amazon-950 border-b border-amazon-800 px-4 pt-2 pb-6 space-y-2">
                {[
                  { id: 'home', label: 'Início', icon: 'fa-house' },
                  { id: 'amazonia', label: 'Amazônia', icon: 'fa-tree' },
                  { id: 'queimadas', label: 'Queimadas', icon: 'fa-fire' },
                  { id: 'preservacao', label: 'Preservação', icon: 'fa-shield-halved' },
                  { id: 'biodiversidade', label: 'Biodiversidade', icon: 'fa-paw' },
                  { id: 'ajudar', label: 'Como Ajudar', icon: 'fa-hand-holding-heart' },
                  { id: 'quiz', label: 'Quiz Interativo', icon: 'fa-gamepad', highlight: true },
                  { id: 'fontes', label: 'Fontes e Referências', icon: 'fa-book' },
                  { id: 'admin', label: 'Painel Admin', icon: 'fa-gear' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentTab(item.id);
                      setQuizMode(null);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center space-x-3 ${
                      currentTab === item.id
                        ? 'bg-amazon-700 text-white'
                        : item.highlight
                        ? 'bg-fire-600 text-white'
                        : 'text-stone-300 hover:bg-amazon-900'
                    }`}
                  >
                    <i className={`fa-solid ${item.icon} text-base w-6`}></i>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </header>

          {/* MAIN CONTENT AREA */}
          <main className="flex-grow">
            {currentTab === 'home' && (
              <HomeSection
                onNavigate={(tab) => { setCurrentTab(tab); setQuizMode(null); }}
                onStartQuiz={(mode) => { setCurrentTab('quiz'); setQuizMode(mode); }}
              />
            )}
            {currentTab === 'amazonia' && <AmazoniaEduSection />}
            {currentTab === 'queimadas' && <QueimadasEduSection />}
            {currentTab === 'preservacao' && <PreservacaoEduSection />}
            {currentTab === 'biodiversidade' && <BiodiversidadeEduSection />}
            {currentTab === 'ajudar' && <ComoAjudarEduSection />}
            {currentTab === 'fontes' && <FontesEduSection />}
            {currentTab === 'admin' && (
              <AdminSection questions={questionsList} setQuestions={setQuestionsList} />
            )}
            {currentTab === 'quiz' && (
              <QuizHub
                questions={questionsList}
                initialMode={quizMode}
                onBackHome={() => setCurrentTab('home')}
              />
            )}
          </main>

          {/* FOOTER */}
          <footer className="bg-amazon-950 text-stone-400 py-12 border-t border-amazon-900 text-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-white font-bold text-base">
                  <span>🌳</span>
                  <span>Combate a Queimadas</span>
                </div>
                <p className="text-stone-400 leading-relaxed">
                  Plataforma educacional para conscientização sobre a biodiversidade da Amazônia e preservação ambiental.
                </p>
              </div>

              <div>
                <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Navegação</h4>
                <ul className="space-y-2">
                  <li><button onClick={() => setCurrentTab('amazonia')} className="hover:text-amazon-400">A Floresta Amazônica</button></li>
                  <li><button onClick={() => setCurrentTab('queimadas')} className="hover:text-amazon-400">Impactos das Queimadas</button></li>
                  <li><button onClick={() => setCurrentTab('preservacao')} className="hover:text-amazon-400">Ações de Preservação</button></li>
                  <li><button onClick={() => setCurrentTab('biodiversidade')} className="hover:text-amazon-400">Fauna e Flora</button></li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Fontes Oficiais</h4>
                <ul className="space-y-2">
                  <li><a href="https://www.gov.br/inpe" target="_blank" rel="noreferrer" className="hover:text-amazon-400">INPE (PRODES / DETER)</a></li>
                  <li><a href="https://www.gov.br/ibama" target="_blank" rel="noreferrer" className="hover:text-amazon-400">IBAMA (Prevfogo)</a></li>
                  <li><a href="https://www.gov.br/icmbio" target="_blank" rel="noreferrer" className="hover:text-amazon-400">ICMBio</a></li>
                  <li><a href="https://ipam.org.br" target="_blank" rel="noreferrer" className="hover:text-amazon-400">IPAM Amazônia</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Gestão</h4>
                <p className="text-stone-400 mb-3">Acesse a área administrativa para gerenciamento do banco de dados de questões.</p>
                <button
                  onClick={() => setCurrentTab('admin')}
                  className="px-4 py-2 bg-amazon-900 hover:bg-amazon-800 text-amazon-300 rounded-xl font-medium text-xs border border-amazon-700/50 flex items-center space-x-2"
                >
                  <i className="fa-solid fa-gear"></i>
                  <span>Painel Administrativo</span>
                </button>
              </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-amazon-900/60 text-center text-stone-500">
              <p>Conhecer para preservar. Proteger a Amazônia é proteger o futuro.</p>
            </div>
          </footer>
        </div>
      );
    }

    // --- HOME SECTION ---
    function HomeSection({ onNavigate, onStartQuiz }) {
      return (
        <div className="space-y-16 py-8">
          {/* HERO BANNER */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-amazon-950 via-amazon-900 to-stone-900 text-white p-8 sm:p-12 lg:p-16 border border-amazon-800 shadow-2xl">
              <div className="absolute -right-20 -bottom-20 opacity-10 text-[280px] select-none pointer-events-none">🌳</div>
              <div className="relative z-10 max-w-3xl space-y-6">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amazon-800/80 border border-amazon-600/40 text-amazon-300 text-xs font-medium">
                  <span className="w-2 h-2 rounded-full bg-fire-500 animate-pulse"></span>
                  <span>Conscientização & Educação Ambiental</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                  Combate a Queimadas e Preservação da Amazônia
                </h1>
                <p className="text-base sm:text-lg text-stone-300 font-normal leading-relaxed">
                  Aprenda sobre a maior floresta tropical do mundo, entenda os graves impactos do fogo e teste seus conhecimentos em um quiz interativo solo ou multiplayer em tempo real.
                </p>
                <div className="pt-2 flex flex-wrap gap-4">
                  <button
                    onClick={() => onNavigate('amazonia')}
                    className="px-6 py-3.5 bg-amazon-600 hover:bg-amazon-500 text-white font-bold text-sm rounded-2xl shadow-lg transition flex items-center space-x-2"
                  >
                    <i className="fa-solid fa-book-open"></i>
                    <span>Conhecer o Conteúdo</span>
                  </button>
                  <button
                    onClick={() => onStartQuiz(null)}
                    className="px-6 py-3.5 bg-fire-600 hover:bg-fire-500 text-white font-bold text-sm rounded-2xl shadow-lg transition flex items-center space-x-2"
                  >
                    <i className="fa-solid fa-gamepad"></i>
                    <span>Jogar Quiz Interativo</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* MANTRA CALLOUT */}
          <section className="max-w-7xl mx-auto px-4 text-center">
            <div className="inline-block py-3 px-8 rounded-2xl bg-amazon-100 text-amazon-900 font-black text-xl sm:text-2xl border border-amazon-300 shadow-sm">
              "Aprenda. Participe. Preserve."
            </div>
          </section>

          {/* TOPIC CARDS GRID */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { id: 'amazonia', icon: '🌳', title: 'Amazônia', subtitle: 'Biodiversidade, rios voadores e regulação do clima global.', color: 'border-amazon-500' },
                { id: 'queimadas', icon: '🔥', title: 'Queimadas', subtitle: 'Origens antrópicas, degradação do solo e poluição do ar.', color: 'border-fire-500' },
                { id: 'biodiversidade', icon: '🐆', title: 'Biodiversidade', subtitle: 'A maior reserva de fauna e flora do planeta Terra.', color: 'border-emerald-500' },
                { id: 'preservacao', icon: '♻️', title: 'Preservação', subtitle: 'Monitoramento por satélite, fiscalização e sustentabilidade.', color: 'border-teal-500' },
              ].map((card) => (
                <div
                  key={card.id}
                  onClick={() => onNavigate(card.id)}
                  className={`bg-white p-6 rounded-3xl border-2 ${card.color} shadow-sm hover:shadow-xl transition cursor-pointer group flex flex-col justify-between space-y-4`}
                >
                  <div>
                    <div className="text-4xl mb-3 group-hover:scale-110 transition duration-300">{card.icon}</div>
                    <h3 className="text-lg font-bold text-stone-900 group-hover:text-amazon-700">{card.title}</h3>
                    <p className="text-xs text-stone-600 mt-2 leading-relaxed">{card.subtitle}</p>
                  </div>
                  <div className="text-xs font-bold text-amazon-700 flex items-center space-x-1 group-hover:translate-x-1 transition">
                    <span>Ler módulo</span>
                    <i className="fa-solid fa-arrow-right"></i>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* QUIZ PROMO BANNER */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 border border-stone-800">
              <div className="space-y-2 text-center md:text-left">
                <span className="text-xs font-bold text-fire-500 uppercase tracking-widest">Modo Desafio</span>
                <h3 className="text-2xl font-bold">Pronto para testar seus conhecimentos?</h3>
                <p className="text-xs text-stone-400">Jogue individualmente para treinar ou crie uma sala multiplayer com código PIN em tempo real.</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => onStartQuiz('solo')}
                  className="px-5 py-3 bg-amazon-600 hover:bg-amazon-500 rounded-xl font-bold text-xs shadow transition"
                >
                  🎯 Jogar Solo
                </button>
                <button
                  onClick={() => onStartQuiz('multiplayer')}
                  className="px-5 py-3 bg-fire-600 hover:bg-fire-500 rounded-xl font-bold text-xs shadow transition"
                >
                  👥 Jogar Multiplayer
                </button>
              </div>
            </div>
          </section>
        </div>
      );
    }

    // --- EDUCATIONAL SECTIONS ---
    function AmazoniaEduSection() {
      return (
        <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
          <div className="border-b border-stone-200 pb-6">
            <span className="text-xs font-bold text-amazon-600 uppercase tracking-wider">Módulo Educativo</span>
            <h1 className="text-3xl font-extrabold text-stone-900 mt-1">A Floresta Amazônica</h1>
            <p className="text-sm text-stone-600 mt-2">Importância ecológica, hídrica e social da maior bacia hidrográfica do mundo.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
              <div className="text-3xl text-amazon-600"><i className="fa-solid fa-cloud-showers-heavy"></i></div>
              <h3 className="font-bold text-stone-900">Rios Voadores e Ciclo da Água</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                As árvores da Amazônia lançam na atmosfera mais de 20 bilhões de toneladas de umidade todos os dias por evapotranspiração. Esse fluxo contínuo alimenta os chamados "Rios Voadores", correntes de ar umedecidas que garantem as chuvas essenciais para a agricultura do Sul e Sudeste do Brasil.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
              <div className="text-3xl text-amazon-600"><i className="fa-solid fa-leaf"></i></div>
              <h3 className="font-bold text-stone-900">Estoque de Carbono Global</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                A vegetação amazônica armazena cerca de 150 a 200 bilhões de toneladas de carbono em suas árvores e solo. A preservação da floresta em pé evita a emissão maciça de $CO_2$ na atmosfera, sendo um pilar indispensável para conter o aquecimento global.
              </p>
            </div>
          </div>

          <div className="bg-amazon-50 p-6 rounded-2xl border border-amazon-200 space-y-4">
            <h3 className="font-bold text-amazon-900 text-base">Povos Tradicionais e Importância Social</h3>
            <p className="text-xs text-amazon-950 leading-relaxed">
              A floresta é habitada por mais de 400 povos indígenas, além de comunidades ribeirinhas e extrativistas. Suas práticas ancestrais de manejo sustentável são reconhecidas pela ciência como as formas mais eficazes de proteção contínua da cobertura vegetal original.
            </p>
          </div>
        </div>
      );
    }

    function QueimadasEduSection() {
      return (
        <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
          <div className="border-b border-stone-200 pb-6">
            <span className="text-xs font-bold text-fire-600 uppercase tracking-wider">Módulo Educativo</span>
            <h1 className="text-3xl font-extrabold text-stone-900 mt-1">Impactos das Queimadas</h1>
            <p className="text-sm text-stone-600 mt-2">Causas antrópicas, destruição da biodiversidade e riscos à saúde humana.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
              <div className="text-3xl text-fire-600"><i className="fa-solid fa-fire-flame-curved"></i></div>
              <h3 className="font-bold text-stone-900">Origem Antrópica do Fogo</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Diferente de biomas como o Cerrado, a Floresta Amazônica não possui dinâmica natural de incêndios por raios na época seca. O fogo é introduzido pelo ser humano para limpeza de pastagens e consolidação de áreas previamente desmatadas ilegalmente.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
              <div className="text-3xl text-fire-600"><i className="fa-solid fa-mask-ventilator"></i></div>
              <h3 className="font-bold text-stone-900">Fumaça e Saúde Pública</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                A fumaça das queimadas libera micropartículas finas ($PM_{2.5}$) na atmosfera. Essas partículas penetram na corrente sanguínea e alvéolos pulmonares, provocando surtos graves de infecções respiratórias em crianças e idosos em toda a região Norte.
              </p>
            </div>
          </div>
        </div>
      );
    }

    function PreservacaoEduSection() {
      return (
        <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
          <div className="border-b border-stone-200 pb-6">
            <span className="text-xs font-bold text-amazon-600 uppercase tracking-wider">Módulo Educativo</span>
            <h1 className="text-3xl font-extrabold text-stone-900 mt-1">Estratégias de Preservação</h1>
            <p className="text-sm text-stone-600 mt-2">Monitoramento por satélites, legislação e unidades de conservação.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-bold text-stone-900 text-base">Monitoramento Orbital do INPE</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              O Brasil utiliza tecnologia orbital avançada desenvolvida pelo INPE. O sistema <strong>PRODES</strong> fornece a taxa anual oficial de desmatamento, enquanto o sistema <strong>DETER</strong> dispara alertas diários em tempo real para orientar as brigadas do IBAMA e ICMBio na apreensão de maquinários e embargo de áreas ilegais.
            </p>
          </div>
        </div>
      );
    }

    function BiodiversidadeEduSection() {
      return (
        <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
          <div className="border-b border-stone-200 pb-6">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Módulo Educativo</span>
            <h1 className="text-3xl font-extrabold text-stone-900 mt-1">Biodiversidade Amazônica</h1>
            <p className="text-sm text-stone-600 mt-2">Patrimônio biológico e potencial farmacológico incalculável.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-2">
              <div className="text-2xl font-black text-amazon-700">40.000+</div>
              <div className="text-xs font-bold text-stone-800">Espécies de Plantas</div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-2">
              <div className="text-2xl font-black text-amazon-700">1.300+</div>
              <div className="text-xs font-bold text-stone-800">Espécies de Aves</div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-2">
              <div className="text-2xl font-black text-amazon-700">3.000+</div>
              <div className="text-xs font-bold text-stone-800">Peixes de Água Doce</div>
            </div>
          </div>
        </div>
      );
    }

    function ComoAjudarEduSection() {
      return (
        <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
          <div className="border-b border-stone-200 pb-6">
            <span className="text-xs font-bold text-amazon-600 uppercase tracking-wider">Guia Prático</span>
            <h1 className="text-3xl font-extrabold text-stone-900 mt-1">Como Você Pode Ajudar</h1>
            <p className="text-sm text-stone-600 mt-2">Ações individuais e coletivas para conter o desmatamento e apoiar a floresta.</p>
          </div>

          <div className="space-y-4">
            {[
              { title: "Consumo Consciente e Certificação", desc: "Verifique a origem de carnes e produtos de madeira consumidos no dia a dia, priorizando selos de manejo florestal sustentável (FSC)." },
              { title: "Denuncie Queimadas e Crimes Ambientais", desc: "Entre em contato diretamente com o Linha Verde do IBAMA (0800 061 8080) ao detectar focos ilícitos ou desmatamento." },
              { title: "Combata a Desinformação", desc: "Compartilhe apenas dados validados cientificamente por órgãos de pesquisa como INPE, IPAM e universidades." },
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-start space-x-4">
                <div className="w-8 h-8 bg-amazon-100 text-amazon-800 rounded-xl font-bold flex items-center justify-center shrink-0 text-sm">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">{item.title}</h4>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    function FontesEduSection() {
      return (
        <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
          <div className="border-b border-stone-200 pb-6">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Transparência Científica</span>
            <h1 className="text-3xl font-extrabold text-stone-900 mt-1">Fontes e Referências</h1>
            <p className="text-sm text-stone-600 mt-2">Bases institucionais utilizadas para a elaboração do conteúdo e questionários do site.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: "INPE", full: "Instituto Nacional de Pesquisas Espaciais", url: "https://www.gov.br/inpe" },
              { name: "IBAMA", full: "Instituto Brasileiro do Meio Ambiente e dos Recursos Naturais Renováveis", url: "https://www.gov.br/ibama" },
              { name: "ICMBio", full: "Instituto Chico Mendes de Conservação da Biodiversidade", url: "https://www.gov.br/icmbio" },
              { name: "IPAM", full: "Instituto de Pesquisa Ambiental da Amazônia", url: "https://ipam.org.br" },
            ].map((src, i) => (
              <a
                key={i}
                href={src.url}
                target="_blank"
                rel="noreferrer"
                className="bg-white p-5 rounded-2xl border border-stone-200 hover:border-amazon-500 shadow-sm transition block"
              >
                <div className="font-bold text-amazon-700 text-sm">{src.name}</div>
                <div className="text-xs text-stone-600 mt-1">{src.full}</div>
              </a>
            ))}
          </div>
        </div>
      );
    }

    // --- ADMIN SECTION ---
    function AdminSection({ questions, setQuestions }) {
      const [newQ, setNewQ] = useState({
        question: '',
        opt0: '', opt1: '', opt2: '', opt3: '',
        correctIndex: 0,
        explanation: '',
        category: 'Amazônia',
        difficulty: 'Fácil'
      });

      const handleAdd = (e) => {
        e.preventDefault();
        if (!newQ.question || !newQ.opt0 || !newQ.opt1 || !newQ.opt2 || !newQ.opt3) return;
        const qObj = {
          id: Date.now(),
          question: newQ.question,
          options: [newQ.opt0, newQ.opt1, newQ.opt2, newQ.opt3],
          correctIndex: Number(newQ.correctIndex),
          explanation: newQ.explanation || 'Sem explicação adicional.',
          category: newQ.category,
          difficulty: newQ.difficulty
        };
        setQuestions([...questions, qObj]);
        setNewQ({
          question: '',
          opt0: '', opt1: '', opt2: '', opt3: '',
          correctIndex: 0,
          explanation: '',
          category: 'Amazônia',
          difficulty: 'Fácil'
        });
        alert('Pergunta adicionada com sucesso ao banco!');
      };

      return (
        <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
          <div className="border-b border-stone-200 pb-6">
            <h1 className="text-2xl font-bold text-stone-900">Painel Administrativo do Quiz</h1>
            <p className="text-xs text-stone-600 mt-1">Gerencie o banco de questões ativo da plataforma.</p>
          </div>

          <form onSubmit={handleAdd} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-stone-900">Adicionar Nova Pergunta</h3>
            <input
              type="text"
              placeholder="Digite o enunciado da pergunta..."
              value={newQ.question}
              onChange={e => setNewQ({...newQ, question: e.target.value})}
              className="w-full p-3 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-amazon-500 outline-none"
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input type="text" placeholder="Opção A" value={newQ.opt0} onChange={e => setNewQ({...newQ, opt0: e.target.value})} className="p-3 border border-stone-300 rounded-xl text-xs" required />
              <input type="text" placeholder="Opção B" value={newQ.opt1} onChange={e => setNewQ({...newQ, opt1: e.target.value})} className="p-3 border border-stone-300 rounded-xl text-xs" required />
              <input type="text" placeholder="Opção C" value={newQ.opt2} onChange={e => setNewQ({...newQ, opt2: e.target.value})} className="p-3 border border-stone-300 rounded-xl text-xs" required />
              <input type="text" placeholder="Opção D" value={newQ.opt3} onChange={e => setNewQ({...newQ, opt3: e.target.value})} className="p-3 border border-stone-300 rounded-xl text-xs" required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase">Resposta Correta</label>
                <select value={newQ.correctIndex} onChange={e => setNewQ({...newQ, correctIndex: e.target.value})} className="w-full p-2.5 border rounded-xl text-xs">
                  <option value={0}>Opção A</option>
                  <option value={1}>Opção B</option>
                  <option value={2}>Opção C</option>
                  <option value={3}>Opção D</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase">Categoria</label>
                <select value={newQ.category} onChange={e => setNewQ({...newQ, category: e.target.value})} className="w-full p-2.5 border rounded-xl text-xs">
                  <option>Amazônia</option>
                  <option>Queimadas</option>
                  <option>Preservação</option>
                  <option>Biodiversidade</option>
                  <option>Clima</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase">Dificuldade</label>
                <select value={newQ.difficulty} onChange={e => setNewQ({...newQ, difficulty: e.target.value})} className="w-full p-2.5 border rounded-xl text-xs">
                  <option>Fácil</option>
                  <option>Médio</option>
                  <option>Difícil</option>
                </select>
              </div>
            </div>

            <textarea
              placeholder="Explicação científica..."
              value={newQ.explanation}
              onChange={e => setNewQ({...newQ, explanation: e.target.value})}
              className="w-full p-3 border border-stone-300 rounded-xl text-xs"
              rows={2}
            ></textarea>

            <button type="submit" className="w-full py-3 bg-amazon-700 hover:bg-amazon-600 text-white font-bold text-xs rounded-xl transition">
              Salvar Pergunta no Banco
            </button>
          </form>

          <div className="space-y-3">
            <h3 className="font-bold text-sm text-stone-900">Perguntas Cadastradas ({questions.length})</h3>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
              {questions.map((q, idx) => (
                <div key={q.id} className="p-4 bg-white border border-stone-200 rounded-2xl flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-amazon-700">#{idx + 1}</span> {q.question}
                    <div className="text-[10px] text-stone-400 mt-0.5">{q.category} • {q.difficulty}</div>
                  </div>
                  <button
                    onClick={() => setQuestions(questions.filter(x => x.id !== q.id))}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // --- QUIZ HUB ENGINE ---
    function QuizHub({ questions, initialMode, onBackHome }) {
      const [mode, setMode] = useState(initialMode); // 'solo', 'multiplayer', or null

      if (!mode) {
        return (
          <div className="max-w-4xl mx-auto px-4 py-16 space-y-8 text-center">
            <div className="space-y-3">
              <span className="text-xs font-bold text-fire-600 uppercase tracking-widest">Central de Desafios</span>
              <h1 className="text-3xl font-black text-stone-900">Escolha o Modo do Quiz</h1>
              <p className="text-xs text-stone-600 max-w-md mx-auto">
                Teste seu aprendizado de forma individual com métricas completas ou dispute em tempo real contra amigos via código PIN.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto text-left">
              <div
                onClick={() => setMode('solo')}
                className="bg-white p-8 rounded-3xl border-2 border-amazon-500 shadow-md hover:shadow-2xl transition cursor-pointer flex flex-col justify-between space-y-6 group"
              >
                <div className="space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-amazon-100 text-amazon-700 flex items-center justify-center text-2xl font-bold group-hover:scale-110 transition">
                    🎯
                  </div>
                  <h3 className="text-xl font-extrabold text-stone-900">Modo Solo</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Responda às perguntas no seu próprio ritmo com cronômetro de 35s por questão e relatório individual de aproveitamento.
                  </p>
                </div>
                <button className="w-full py-3 bg-amazon-700 text-white rounded-xl font-bold text-xs group-hover:bg-amazon-600 transition">
                  Iniciar Jogada Solo
                </button>
              </div>

              <div
                onClick={() => setMode('multiplayer')}
                className="bg-white p-8 rounded-3xl border-2 border-fire-500 shadow-md hover:shadow-2xl transition cursor-pointer flex flex-col justify-between space-y-6 group"
              >
                <div className="space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-fire-100 text-fire-600 flex items-center justify-center text-2xl font-bold group-hover:scale-110 transition">
                    👥
                  </div>
                  <h3 className="text-xl font-extrabold text-stone-900">Modo Multiplayer</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Crie uma sala exclusiva ou entre com o PIN de 6 dígitos. Todos recebem as questões sincronizadas em tempo real.
                  </p>
                </div>
                <button className="w-full py-3 bg-fire-600 text-white rounded-xl font-bold text-xs group-hover:bg-fire-500 transition">
                  Entrar ou Criar Sala
                </button>
              </div>
            </div>
          </div>
        );
      }

      if (mode === 'solo') {
        return <SoloQuizEngine questions={questions} onBack={() => setMode(null)} />;
      }

      return <MultiplayerQuizEngine questions={questions} onBack={() => setMode(null)} />;
    }

    // --- SOLO QUIZ ENGINE ---
    function SoloQuizEngine({ questions, onBack }) {
      const [qCount, setQCount] = useState(7);
      const [difficulty, setDifficulty] = useState('Aleatório');
      const [started, setStarted] = useState(false);
      const [activeQuestions, setActiveQuestions] = useState([]);
      const [currentIndex, setCurrentIndex] = useState(0);

      // Game run state
      const [timer, setTimer] = useState(35);
      const [selectedOption, setSelectedOption] = useState(null);
      const [score, setScore] = useState(0);
      const [answersHistory, setAnswersHistory] = useState([]);
      const [finished, setFinished] = useState(false);

      const timerRef = useRef(null);

      // Prepare quiz set
      const startQuiz = () => {
        let filtered = [...questions];
        if (difficulty !== 'Aleatório') {
          filtered = filtered.filter(q => q.difficulty === difficulty);
        }
        if (filtered.length < 3) filtered = [...questions]; // fallback

        // Shuffle
        filtered = filtered.sort(() => Math.random() - 0.5).slice(0, Math.min(qCount, filtered.length));
        
        // Shuffle alternatives
        const prepared = filtered.map(q => {
          const optsWithIdx = q.options.map((opt, i) => ({ opt, originalIdx: i }));
          const shuffledOpts = optsWithIdx.sort(() => Math.random() - 0.5);
          const newCorrectIdx = shuffledOpts.findIndex(item => item.originalIdx === q.correctIndex);
          return {
            ...q,
            options: shuffledOpts.map(item => item.opt),
            correctIndex: newCorrectIdx
          };
        });

        setActiveQuestions(prepared);
        setCurrentIndex(0);
        setScore(0);
        setAnswersHistory([]);
        setFinished(false);
        setStarted(true);
        setTimer(35);
        setSelectedOption(null);
      };

      // Timer effect
      useEffect(() => {
        if (started && !finished && selectedOption === null) {
          timerRef.current = setInterval(() => {
            setTimer(prev => {
              if (prev <= 1) {
                clearInterval(timerRef.current);
                handleSelectOption(-1); // timeout
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }
        return () => clearInterval(timerRef.current);
      }, [started, finished, currentIndex, selectedOption]);

      const handleSelectOption = (index) => {
        if (selectedOption !== null) return;
        clearInterval(timerRef.current);
        setSelectedOption(index);

        const q = activeQuestions[currentIndex];
        const isCorrect = index === q.correctIndex;
        let pointsEarned = 0;

        if (isCorrect) {
          // Speed bonus: 500 base + up to 500 based on remaining time
          pointsEarned = 500 + Math.round((timer / 35) * 500);
          setScore(prev => prev + pointsEarned);
        }

        setAnswersHistory(prev => [...prev, {
          question: q.question,
          isCorrect,
          pointsEarned,
          timeSpent: 35 - timer
        }]);
      };

      const handleNextQuestion = () => {
        if (currentIndex + 1 < activeQuestions.length) {
          setCurrentIndex(prev => prev + 1);
          setSelectedOption(null);
          setTimer(35);
        } else {
          setFinished(true);
        }
      };

      if (!started) {
        return (
          <div className="max-w-xl mx-auto px-4 py-12 space-y-6">
            <button onClick={onBack} className="text-xs font-bold text-stone-500 hover:text-stone-800 flex items-center space-x-1">
              <i className="fa-solid fa-arrow-left"></i>
              <span>Voltar</span>
            </button>

            <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-md space-y-6">
              <div className="border-b border-stone-100 pb-4">
                <h2 className="text-2xl font-bold text-stone-900">Configurar Partida Solo</h2>
                <p className="text-xs text-stone-600 mt-1">Ajuste os parâmetros antes de iniciar.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-2">Quantidade de Perguntas</label>
                  <div className="grid grid-cols-6 gap-2">
                    {[7, 8, 9, 10, 11, 12].map(n => (
                      <button
                        key={n}
                        onClick={() => setQCount(n)}
                        className={`py-2 rounded-xl text-xs font-bold border ${
                          qCount === n
                            ? 'bg-amazon-700 text-white border-amazon-700'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-2">Dificuldade</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['Aleatório', 'Fácil', 'Médio', 'Difícil'].map(d => (
                      <button
                        key={d}
                        onClick={() => setDifficulty(d)}
                        className={`py-2 rounded-xl text-xs font-bold border ${
                          difficulty === d
                            ? 'bg-amazon-700 text-white border-amazon-700'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={startQuiz}
                className="w-full py-4 bg-amazon-600 hover:bg-amazon-500 text-white font-extrabold text-sm rounded-2xl shadow-lg transition"
              >
                Começar Desafio Solo
              </button>
            </div>
          </div>
        );
      }

      if (finished) {
        const total = activeQuestions.length;
        const correctCount = answersHistory.filter(a => a.isCorrect).length;
        const pct = Math.round((correctCount / total) * 100);
        const avgTime = (answersHistory.reduce((acc, a) => acc + a.timeSpent, 0) / total).toFixed(1);

        let feedbackMsg = "";
        if (pct >= 90) feedbackMsg = "Excelente! Você demonstrou um ótimo conhecimento sobre a Amazônia.";
        else if (pct >= 70) feedbackMsg = "Muito bom! Você conhece bastante sobre a preservação e biodiversidade.";
        else if (pct >= 50) feedbackMsg = "Bom começo! Continue aprendendo sobre a preservação da Amazônia.";
        else feedbackMsg = "Que tal conhecer mais sobre o conteúdo educativo e tentar novamente?";

        return (
          <div className="max-w-2xl mx-auto px-4 py-12 space-y-6 text-center">
            <div className="bg-white p-8 sm:p-12 rounded-3xl border border-stone-200 shadow-xl space-y-6">
              <div className="w-16 h-16 bg-amazon-100 text-amazon-700 rounded-2xl flex items-center justify-center text-3xl mx-auto">
                🏆
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-black text-stone-900">Resultado do Quiz</h2>
                <p className="text-xs text-stone-600">{feedbackMsg}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-stone-100">
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
                  <div className="text-[10px] text-stone-400 uppercase font-bold">Pontuação</div>
                  <div className="text-lg font-black text-amazon-700">{score.toLocaleString()}</div>
                </div>
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
                  <div className="text-[10px] text-stone-400 uppercase font-bold">Acertos</div>
                  <div className="text-lg font-black text-stone-900">{correctCount}/{total}</div>
                </div>
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
                  <div className="text-[10px] text-stone-400 uppercase font-bold">Aproveitamento</div>
                  <div className="text-lg font-black text-stone-900">{pct}%</div>
                </div>
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
                  <div className="text-[10px] text-stone-400 uppercase font-bold">Tempo Médio</div>
                  <div className="text-lg font-black text-stone-900">{avgTime}s</div>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button onClick={startQuiz} className="flex-1 py-3.5 bg-amazon-700 hover:bg-amazon-600 text-white font-bold text-xs rounded-xl transition">
                  Jogar Novamente
                </button>
                <button onClick={onBack} className="flex-1 py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl transition">
                  Sair do Quiz
                </button>
              </div>
            </div>
          </div>
        );
      }

      const currentQ = activeQuestions[currentIndex];

      return (
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
          {/* HEADER STATUS */}
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
            <span className="text-xs font-bold text-stone-500">
              Pergunta <strong className="text-stone-900">{currentIndex + 1}</strong> de {activeQuestions.length}
            </span>
            <div className="flex items-center space-x-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${
                timer <= 5 ? 'bg-red-500 text-white animate-bounce' : 'bg-stone-100 text-stone-800'
              }`}>
                {timer}s
              </div>
            </div>
            <div className="text-xs font-bold text-amazon-700">
              {score} pts
            </div>
          </div>

          {/* QUESTION CARD */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-md space-y-6">
            <div className="inline-block px-3 py-1 rounded-full bg-stone-100 text-[10px] font-bold text-stone-600 uppercase">
              {currentQ.category} • {currentQ.difficulty}
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-stone-900 leading-snug">
              {currentQ.question}
            </h2>

            {/* OPTIONS */}
            <div className="grid grid-cols-1 gap-3">
              {currentQ.options.map((opt, idx) => {
                let btnStyle = "bg-stone-50 text-stone-800 border-stone-200 hover:bg-stone-100";
                if (selectedOption !== null) {
                  if (idx === currentQ.correctIndex) {
                    btnStyle = "bg-emerald-600 text-white border-emerald-600 font-bold";
                  } else if (idx === selectedOption) {
                    btnStyle = "bg-red-600 text-white border-red-600";
                  } else {
                    btnStyle = "bg-stone-50 text-stone-400 border-stone-200 opacity-50";
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={selectedOption !== null}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-4 rounded-2xl text-left text-xs sm:text-sm font-medium border-2 transition flex items-start space-x-3 ${btnStyle}`}
                  >
                    <span className="w-6 h-6 rounded-lg bg-black/10 flex items-center justify-center text-[10px] font-bold shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="leading-relaxed">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* EXPLANATION & NEXT BUTTON */}
            {selectedOption !== null && (
              <div className="pt-4 border-t border-stone-100 space-y-4 animate-fade-in">
                <div className="p-4 rounded-2xl bg-amazon-50 border border-amazon-200 text-xs text-amazon-950 space-y-1">
                  <div className="font-bold flex items-center space-x-1 text-amazon-800">
                    <i className="fa-solid fa-circle-info"></i>
                    <span>Explicação Científica:</span>
                  </div>
                  <p className="leading-relaxed">{currentQ.explanation}</p>
                </div>

                <button
                  onClick={handleNextQuestion}
                  className="w-full py-3.5 bg-amazon-700 hover:bg-amazon-600 text-white font-bold text-xs rounded-xl shadow transition"
                >
                  {currentIndex + 1 === activeQuestions.length ? 'Ver Resultado Final' : 'Próxima Pergunta →'}
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }


export default App;
