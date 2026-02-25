export type Locale = 'pt-BR' | 'en'

export const translations = {
    'pt-BR': {
        // ─── Common ────────────────────────────────
        common: {
            save: 'Salvar',
            cancel: 'Cancelar',
            delete: 'Excluir',
            edit: 'Editar',
            loading: 'Carregando...',
            saving: 'Salvando...',
            search: 'Buscar',
            back: 'Voltar',
            next: 'Próximo',
            unknown: 'Desconhecido',
            optional: 'Opcional',
            soon: 'Em breve',
            noData: 'Sem dados',
            retry: 'Tentar novamente',
            comingSoon: 'Em breve',
            comingSoonDescription: 'Esta funcionalidade estará disponível em breve.',
        },

        // ─── Auth ──────────────────────────────────
        auth: {
            welcomeBack: 'Bem-vindo de volta',
            signInDescription: 'Faça login para continuar',
            email: 'E-mail',
            emailPlaceholder: 'seu@email.com',
            password: 'Senha',
            passwordPlaceholder: 'Digite sua senha',
            signIn: 'Entrar',
            signingIn: 'Entrando...',
            noAccount: 'Não tem uma conta?',
            signUp: 'Cadastre-se',
            createAccount: 'Criar conta',
            createAccountDescription: 'Comece a prospectar clientes hoje',
            fullName: 'Nome completo',
            fullNamePlaceholder: 'Seu nome completo',
            confirmPassword: 'Confirmar senha',
            confirmPasswordPlaceholder: 'Confirme sua senha',
            creatingAccount: 'Criando conta...',
            hasAccount: 'Já tem uma conta?',
            signInLink: 'Faça login',
            signOut: 'Sair',
        },

        // ─── Navigation / Sidebar ──────────────────
        nav: {
            dashboard: 'Painel',
            prospector: 'Prospector',
            prospects: 'Prospects',
            audits: 'Auditorias',
            analytics: 'Análises',
            settings: 'Configurações',
        },

        // ─── Header ────────────────────────────────
        header: {
            prospectDetail: 'Detalhe do Prospect',
            auditReport: 'Relatório de Auditoria',
        },

        // ─── Dashboard ─────────────────────────────
        dashboard: {
            prospects: 'Prospects',
            audits: 'Auditorias',
            contacted: 'Contatados',
            opened: 'Abertos',
            recentProspects: 'Prospects Recentes',
            recentAudits: 'Auditorias Recentes',
            noProspectsYet: 'Nenhum prospect ainda. Use o Prospector para encontrar leads.',
            noAuditsYet: 'Nenhuma auditoria ainda. Faça uma auditoria no site de um prospect.',
            findLeads: 'Encontrar Leads',
            viewProspects: 'Ver Prospects',
            statusNew: 'Novo',
            statusContacted: 'Contatado',
            statusOpened: 'Aberto',
            statusResponded: 'Respondido',
        },

        // ─── Leads / Prospector ────────────────────
        leads: {
            title: 'Prospector',
            description: 'Busque empresas locais no Google Maps, salve leads e faça auditorias de sites.',
            searchPlaceholder: 'Buscar leads...',
            businessType: 'Tipo de negócio',
            businessTypePlaceholder: 'Ex: restaurante, academia, clínica...',
            location: 'Localização',
            locationPlaceholder: 'Ex: São Paulo, SP',
            searchButton: 'Buscar Leads',
            searching: 'Buscando...',
            noResults: 'Nenhum lead encontrado',
            noResultsDescription: 'Tente outro tipo de negócio ou localização.',
            filterNoMatch: 'Nenhum resultado corresponde aos filtros',
            filterNoMatchDescription: 'Ajuste os filtros para ver mais resultados.',
            searchFailed: 'Busca falhou',
            saveLeadButton: 'Salvar Lead',
            runAuditButton: 'Auditar Site',
            filters: {
                minRating: 'Nota mínima',
                hasWebsite: 'Com website',
                hasEmail: 'Com e-mail',
                hasPhone: 'Com telefone',
                showingResults: 'Mostrando {filtered} de {total} resultados',
            },
        },

        // ─── Prospects Pipeline ────────────────────
        prospects: {
            title: 'Pipeline (Leads)',
            description: 'Seus leads salvos e status de enriquecimento.',
            findNewLeads: 'Encontrar Novos Leads',
            noLeadsYet: 'Nenhum lead ainda',
            noLeadsYetDescription: 'Use o Prospector para buscar no Google Maps e salvar leads aqui.',
            status: {
                pending: 'Pendente',
                enriching: 'Enriquecendo...',
                completed: 'Enriquecido',
                failed: 'Falhou',
            },
        },

        // ─── Prospect Detail ───────────────────────
        prospectDetail: {
            lightAudit: 'Auditoria Rápida',
            deepEnrich: 'Enriquecer Dados',
            enriching: 'Enriquecendo...',
            dataEnriched: 'Dados Enriquecidos',
            enriched: 'Enriquecido',
            enrichmentFailed: 'Enriquecimento Falhou',
            enrichmentFailedDescription: 'Houve um problema ao puxar dados profundos deste lead. Tente novamente.',
            noWebsiteAlert: 'Não é possível enriquecer sem URL de website.',
            // Tabs
            overview: 'Visão Geral',
            network: 'Rede',
            techStack: 'Tech Stack',
            intelligence: 'Inteligência',
            // Contact section
            contactInfo: 'Informações de Contato',
            phone: 'Telefone',
            emailLabel: 'E-mail',
            address: 'Endereço',
            whatsapp: 'WhatsApp',
            instagram: 'Instagram',
            followers: 'seguidores',
            // Business Profile
            businessProfile: 'Perfil do Negócio',
            category: 'Categoria',
            uncategorized: 'Sem categoria',
            performanceBaseline: 'Performance Baseline',
            reviews: 'avaliações',
            // Network tab
            noNetworkData: 'Sem Dados de Rede',
            noNetworkDataDescription: 'Execute o Enriquecimento Profundo para encontrar automaticamente fundadores, executivos e decisores do LinkedIn.',
            noDecisionMakers: 'Não foi possível encontrar decisores claros para esta empresa.',
            unknownRole: 'Cargo desconhecido',
            viewLinkedIn: 'Ver Perfil no LinkedIn',
            // Tech tab
            noTechData: 'Sem Dados de Tecnologia',
            noTechDataDescription: 'Execute o Enriquecimento Profundo para escanear o site e revelar as tecnologias utilizadas.',
            noTechDetected: 'Nenhuma tecnologia específica detectada.',
            // Intelligence tab
            intelligencePending: 'Inteligência de Vendas Pendente',
            intelligencePendingDescription: 'Após o enriquecimento, a IA analisará os dados para encontrar pontos de dor e criar o pitch perfeito.',
            analyzeOpportunity: 'Analisar Oportunidade',
            aiSummary: 'Resumo IA',
            identifiedPainPoints: 'Pontos de Dor Identificados',
            recommendedApproach: 'Abordagem Recomendada',
            pitchTheseServices: 'SERVIÇOS PARA OFERECER:',
            emailScripts: 'SCRIPTS DE E-MAIL:',
            noScriptGenerated: 'Nenhum script gerado.',
        },

        // ─── Audits ────────────────────────────────
        audits: {
            title: 'Auditorias',
            description: 'Auditorias de websites com scores de SEO, velocidade, mobile e acessibilidade.',
            businessName: 'Nome do negócio',
            urlPlaceholder: 'https://exemplo.com',
            runAudit: 'Fazer Auditoria',
            auditing: 'Analisando...',
            noAuditsYet: 'Nenhuma auditoria ainda',
            noAuditsYetDescription: 'Insira uma URL acima ou vá a um prospect e clique em "Fazer Auditoria".',
            urlRequired: 'URL obrigatória',
            urlRequiredDescription: 'Digite a URL do website para auditar.',
            auditFailed: 'Auditoria falhou',
            analyzing: 'Analisando...',
            failed: 'Falhou',
            overall: 'Geral',
        },

        // ─── Audit Detail ──────────────────────────
        auditDetail: {
            notFound: 'Auditoria não encontrada',
            backToAudits: 'Voltar para Auditorias',
            overall: 'Geral',
            performance: 'Performance',
            seo: 'SEO',
            mobile: 'Mobile',
            a11y: 'Acessibilidade',
            bestPractices: 'Boas Práticas',
            scoreBreakdown: 'Detalhamento de Pontuação',
            issuesFound: 'Problemas Encontrados',
            recommendations: 'Recomendações',
            impact: 'impacto',
            auditFailed: 'Auditoria falhou',
            unknownError: 'Erro desconhecido',
        },

        // ─── Settings ──────────────────────────────
        settings: {
            title: 'Configurações do Perfil',
            description: 'Atualize suas informações de perfil. Elas aparecem nos sites gerados.',
            fullName: 'Nome Completo',
            agencyName: 'Nome da Agência',
            socialLinks: 'Links Sociais',
            linkedin: 'LinkedIn',
            twitter: 'Twitter / X',
            website: 'Website',
            saveChanges: 'Salvar Alterações',
            changesSaved: 'Alterações salvas!',
        },

        // ─── Pitches ───────────────────────────────
        pitches: {
            allPitches: 'Todos os Pitches',
            pitchesTotal: '{count} pitches no total',
            pitchTotal: '{count} pitch no total',
            newPitch: 'Novo Pitch',
            noPitchesYet: 'Nenhum pitch ainda',
            noPitchesDescription: 'Crie seu primeiro pitch para começar a fechar clientes.',
            createPitch: 'Criar Pitch',
        },

        // ─── New Pitch ─────────────────────────────
        newPitch: {
            steps: {
                details: 'Detalhes',
                analysis: 'Análise',
                template: 'Template',
                complete: 'Concluído',
            },
            form: {
                title: 'Criar um Novo Pitch',
                description: 'Insira os detalhes do negócio e analisaremos o website deles.',
                businessName: 'Nome do Negócio',
                businessNamePlaceholder: 'Ex: Barbearia Clássica',
                websiteUrl: 'URL do Website',
                websiteUrlPlaceholder: 'Ex: barbeariaclassica.com.br',
                analyzeWebsite: 'Analisar Website',
                errors: {
                    businessNameRequired: 'Nome do negócio é obrigatório',
                    websiteUrlRequired: 'URL do website é obrigatória',
                    invalidUrl: 'Por favor, insira uma URL válida',
                },
            },
            templateSelector: {
                title: 'Escolha um Template',
                description: 'Selecione um estilo de design para o website do pitch. A IA recomendou a melhor opção.',
                aiPick: 'Escolha da IA',
                generateWebsite: 'Gerar Website',
                generating: 'Gerando...',
            },
            scraping: {
                title: 'Analisando Website',
                description: 'Estamos extraindo o conteúdo e analisando o design...',
            },
            complete: {
                title: 'Pitch Criado!',
                description: 'A pré-visualização do seu novo website está pronta. Veja agora e comece a prospecção.',
                viewPitch: 'Ver Pitch',
                goToPitches: 'Ir para Pitches',
            },
        },

        // ─── Pitch Detail ──────────────────────────
        pitchDetail: {
            loading: 'Carregando pitch...',
            notFound: 'Pitch não encontrado',
            notFoundDescription: 'O pitch que você está procurando não existe ou você não tem acesso.',
            noPreview: 'Nenhuma pré-visualização disponível',
            actions: {
                sendEmail: 'Enviar E-mail',
                copyUrl: 'Copiar URL',
                copied: 'Copiado!',
                openPreview: 'Abrir Preview',
                deleteConfirm: 'Tem certeza que deseja excluir este pitch?',
            },
            metadata: {
                title: 'Detalhes',
                website: 'Website',
                template: 'Template',
                created: 'Criado',
                views: 'Visualizações',
                feedback: 'Feedback',
            },
            sendEmailModal: {
                title: 'Enviar E-mail para {name}',
                description: 'Escreva seu e-mail de prospecção. Clique em "Abrir no Gmail" para enviar.',
                to: 'Para',
                subject: 'Assunto',
                message: 'Mensagem',
                openGmail: 'Abrir no Gmail',
                copyEmail: 'Copiar E-mail',
                copied: 'Copiado!',
                markedAsSent: 'Marcado como enviado!',
                updating: 'Atualizando...',
                markAsSent: 'Marcar como Enviado',
            },
            preview: {
                desktop: 'Desktop',
                tablet: 'Tablet',
                mobile: 'Celular',
                previewLabel: 'Pré-visualização — {label}',
            },
            views: {
                title: 'Visualizações',
                titleWithCount: 'Visualizações ({count})',
                noViews: 'Nenhuma visualização ainda',
                noViewsDescription: 'As visualizações aparecerão aqui quando alguém abrir o link do seu pitch.',
            },
        },

        // ─── Public Pitch ──────────────────────────
        publicPitch: {
            loading: 'Carregando pré-visualização...',
            notFound: 'Pitch não encontrado',
            notFoundDescription: 'Este link de pitch pode ser inválido ou foi removido.',
            title: 'Pré-visualização do Pitch',
        },

        // ─── Landing Page ──────────────────────────
        landing: {
            nav: {
                howItWorks: 'Como Funciona',
                features: 'Recursos',
                pricing: 'Preços',
                signIn: 'Entrar',
                getStarted: 'Começar Agora',
            },
            hero: {
                badge: 'Prospecção com Design via IA',
                titleSpan1: 'Transforme Qualquer Site',
                titleSpan2: 'em um Pitch Vencedor',
                subtitle: 'Navegue no site de qualquer negócio, gere um redesign impressionante com IA e envie uma prospecção personalizada — tudo em menos de 60 segundos.',
                startFree: 'Comece Grátis',
                watchDemo: 'Ver Demo',
                stats: {
                    totalPitches: 'Total de Pitches',
                    openRate: 'Taxa de Abertura',
                    responses: 'Respostas',
                },
            },
            howItWorks: {
                badge: 'Como Funciona',
                title: 'Três Passos para Mais Clientes',
                steps: [
                    {
                        title: 'Encontrar Leads',
                        description: 'Descubra negócios locais pela integração com o Google Maps. Filtre por categoria, avaliação e localização para achar seus clientes ideais.',
                    },
                    {
                        title: 'Redesign com IA',
                        description: 'Nossa IA varre o site existente e gera um redesign moderno e atrativo usando templates profissionais — em segundos.',
                    },
                    {
                        title: 'Enviar e Monitorar',
                        description: 'Envie e-mails personalizados com links de preview ao vivo. Monitore aberturas, colete feedbacks e feche mais negócios.',
                    },
                ],
            },
            features: {
                badge: 'Recursos',
                title: 'Tudo Que Você Precisa para Vender Design',
                items: [
                    {
                        title: 'Descoberta de Leads',
                        description: 'Encontre negócios locais através do Google Maps com filtros inteligentes por avaliação, categoria e presença de site.',
                    },
                    {
                        title: 'Scraping de Sites',
                        description: 'Extraia automaticamente o conteúdo, imagens, depoimentos e informações de contato de qualquer site comercial.',
                    },
                    {
                        title: 'Templates com IA',
                        description: 'Escolha templates profissionais. Nossa IA os preenche com o conteúdo extraído para redesigns instantâneos.',
                    },
                    {
                        title: 'Envio de E-mail',
                        description: 'Envie e-mails personalizados com links de preview ao vivo diretamente da plataforma pela integração com Gmail.',
                    },
                    {
                        title: 'Monitoramento de Abertura',
                        description: 'Saiba exatamente quando seus prospectos visualizaram seu pitch. Rastreie aberturas, localizações e tempo na página.',
                    },
                    {
                        title: 'Coleta de Feedback',
                        description: 'Formulários embutidos de feedback para prospectos avaliarem e pedirem alterações — direto no pitch.',
                    },
                ],
            },
            socialProof: {
                badge: 'Depoimentos',
                title: 'Amado por Agências no Mundo Todo',
            },
            pricing: {
                badge: 'Preços',
                title: 'Preços Simples e Transparentes',
                popular: 'Popular',
                monthly: '/mês',
                starter: {
                    name: 'Iniciante',
                    price: 'Grátis',
                    description: 'Perfeito para experimentar o Pitch AI',
                    cta: 'Começar Agora',
                },
                pro: {
                    name: 'Pro',
                    price: 'R$ 149',
                    description: 'Para agências e freelancers em crescimento',
                    cta: 'Começar Teste Pro',
                },
                agency: {
                    name: 'Agência',
                    price: 'R$ 449',
                    description: 'Para times e prospecção em larga escala',
                    cta: 'Falar com Vendas',
                }
            }
        },

        // ─── Language ──────────────────────────────
        language: {
            label: 'Idioma',
            ptBR: 'Português (BR)',
            en: 'English',
        },
    },

    en: {
        // ─── Common ────────────────────────────────
        common: {
            save: 'Save',
            cancel: 'Cancel',
            delete: 'Delete',
            edit: 'Edit',
            loading: 'Loading...',
            saving: 'Saving...',
            search: 'Search',
            back: 'Back',
            next: 'Next',
            unknown: 'Unknown',
            optional: 'Optional',
            soon: 'Soon',
            noData: 'No data',
            retry: 'Try again',
            comingSoon: 'Coming Soon',
            comingSoonDescription: 'This feature is coming soon.',
        },

        // ─── Auth ──────────────────────────────────
        auth: {
            welcomeBack: 'Welcome back',
            signInDescription: 'Sign in to your account to continue',
            email: 'Email',
            emailPlaceholder: 'you@example.com',
            password: 'Password',
            passwordPlaceholder: 'Enter your password',
            signIn: 'Sign in',
            signingIn: 'Signing in...',
            noAccount: "Don't have an account?",
            signUp: 'Sign up',
            createAccount: 'Create account',
            createAccountDescription: 'Start prospecting clients today',
            fullName: 'Full Name',
            fullNamePlaceholder: 'Your full name',
            confirmPassword: 'Confirm Password',
            confirmPasswordPlaceholder: 'Confirm your password',
            creatingAccount: 'Creating account...',
            hasAccount: 'Already have an account?',
            signInLink: 'Sign in',
            signOut: 'Sign out',
        },

        // ─── Navigation / Sidebar ──────────────────
        nav: {
            dashboard: 'Dashboard',
            prospector: 'Prospector',
            prospects: 'Prospects',
            audits: 'Audits',
            analytics: 'Analytics',
            settings: 'Settings',
        },

        // ─── Header ────────────────────────────────
        header: {
            prospectDetail: 'Prospect Detail',
            auditReport: 'Audit Report',
        },

        // ─── Dashboard ─────────────────────────────
        dashboard: {
            prospects: 'Prospects',
            audits: 'Audits',
            contacted: 'Contacted',
            opened: 'Opened',
            recentProspects: 'Recent Prospects',
            recentAudits: 'Recent Audits',
            noProspectsYet: 'No prospects yet. Use the Prospector to find leads.',
            noAuditsYet: 'No audits yet. Run an audit on a prospect\'s website.',
            findLeads: 'Find Leads',
            viewProspects: 'View Prospects',
            statusNew: 'New',
            statusContacted: 'Contacted',
            statusOpened: 'Opened',
            statusResponded: 'Responded',
        },

        // ─── Leads / Prospector ────────────────────
        leads: {
            title: 'Prospector',
            description: 'Search for local businesses on Google Maps, save leads, and run website audits.',
            searchPlaceholder: 'Search leads...',
            businessType: 'Business type',
            businessTypePlaceholder: 'e.g. restaurant, gym, clinic...',
            location: 'Location',
            locationPlaceholder: 'e.g. New York, NY',
            searchButton: 'Search Leads',
            searching: 'Searching...',
            noResults: 'No leads found',
            noResultsDescription: 'Try a different business type or location.',
            filterNoMatch: 'No results match filters',
            filterNoMatchDescription: 'Try adjusting your filters to see more results.',
            searchFailed: 'Search failed',
            saveLeadButton: 'Save Lead',
            runAuditButton: 'Run Audit',
            filters: {
                minRating: 'Min. rating',
                hasWebsite: 'Has website',
                hasEmail: 'Has email',
                hasPhone: 'Has phone',
                showingResults: 'Showing {filtered} of {total} results',
            },
        },

        // ─── Prospects Pipeline ────────────────────
        prospects: {
            title: 'Pipeline (Leads)',
            description: 'Your saved leads and their enrichment status.',
            findNewLeads: 'Find New Leads',
            noLeadsYet: 'No leads yet',
            noLeadsYetDescription: 'Use the Prospector to search Google Maps and save leads here.',
            status: {
                pending: 'Pending Enrichment',
                enriching: 'Enriching Data...',
                completed: 'Enriched',
                failed: 'Enrichment Failed',
            },
        },

        // ─── Prospect Detail ───────────────────────
        prospectDetail: {
            lightAudit: 'Light Audit',
            deepEnrich: 'Deep Enrich',
            enriching: 'Enriching...',
            dataEnriched: 'Data Enriched',
            enriched: 'Enriched',
            enrichmentFailed: 'Enrichment Failed',
            enrichmentFailedDescription: 'There was an issue pulling deep data for this lead. You can try running it again.',
            noWebsiteAlert: 'Cannot enrich without a website URL.',
            // Tabs
            overview: 'Overview',
            network: 'Network',
            techStack: 'Tech Stack',
            intelligence: 'Intelligence',
            // Contact section
            contactInfo: 'Contact Information',
            phone: 'Phone',
            emailLabel: 'Email',
            address: 'Address',
            whatsapp: 'WhatsApp',
            instagram: 'Instagram',
            followers: 'followers',
            // Business Profile
            businessProfile: 'Business Profile',
            category: 'Category',
            uncategorized: 'Uncategorized',
            performanceBaseline: 'Performance Baseline',
            reviews: 'reviews',
            // Network tab
            noNetworkData: 'No Network Data',
            noNetworkDataDescription: 'Run Deep Enrichment to automatically find founders, executives, and decision makers from LinkedIn.',
            noDecisionMakers: 'Could not find any clear decision makers for this company.',
            unknownRole: 'Unknown Role',
            viewLinkedIn: 'View LinkedIn Profile',
            // Tech tab
            noTechData: 'No Tech Stack Data',
            noTechDataDescription: 'Run Deep Enrichment to scan their website and reveal the technologies they are using.',
            noTechDetected: 'No specific technologies detected.',
            // Intelligence tab
            intelligencePending: 'Sales Intelligence Pending',
            intelligencePendingDescription: 'Once enrichment is complete, AI will analyze the data to find pain points and draft the perfect pitch.',
            analyzeOpportunity: 'Analyze Opportunity',
            aiSummary: 'AI Summary',
            identifiedPainPoints: 'Identified Pain Points',
            recommendedApproach: 'Recommended Approach',
            pitchTheseServices: 'PITCH THESE SERVICES:',
            emailScripts: 'EMAIL SCRIPTS:',
            noScriptGenerated: 'No script generated.',
        },

        // ─── Audits ────────────────────────────────
        audits: {
            title: 'Audits',
            description: 'Website audits with SEO, speed, mobile, and accessibility scores.',
            businessName: 'Business name',
            urlPlaceholder: 'https://example.com',
            runAudit: 'Run Audit',
            auditing: 'Auditing...',
            noAuditsYet: 'No audits yet',
            noAuditsYetDescription: "Enter a URL above or go to a prospect and click 'Run Audit'.",
            urlRequired: 'URL required',
            urlRequiredDescription: 'Enter a website URL to audit.',
            auditFailed: 'Audit failed',
            analyzing: 'Analyzing...',
            failed: 'Failed',
            overall: 'Overall',
        },

        // ─── Audit Detail ──────────────────────────
        auditDetail: {
            notFound: 'Audit not found',
            backToAudits: 'Back to Audits',
            overall: 'Overall',
            performance: 'Performance',
            seo: 'SEO',
            mobile: 'Mobile',
            a11y: 'A11y',
            bestPractices: 'Best Practices',
            scoreBreakdown: 'Score Breakdown',
            issuesFound: 'Issues Found',
            recommendations: 'Recommendations',
            impact: 'impact',
            auditFailed: 'Audit failed',
            unknownError: 'Unknown error',
        },

        // ─── Settings ──────────────────────────────
        settings: {
            title: 'Profile Settings',
            description: 'Update your profile information. This appears on generated websites.',
            fullName: 'Full Name',
            agencyName: 'Agency Name',
            socialLinks: 'Social Links',
            linkedin: 'LinkedIn',
            twitter: 'Twitter / X',
            website: 'Website',
            saveChanges: 'Save Changes',
            changesSaved: 'Changes saved!',
        },

        // ─── Pitches ───────────────────────────────
        pitches: {
            allPitches: 'All Pitches',
            pitchesTotal: '{count} pitches total',
            pitchTotal: '{count} pitch total',
            newPitch: 'New Pitch',
            noPitchesYet: 'No pitches yet',
            noPitchesDescription: 'Create your first pitch to start landing clients.',
            createPitch: 'Create Pitch',
        },

        // ─── New Pitch ─────────────────────────────
        newPitch: {
            steps: {
                details: 'Details',
                analysis: 'Analysis',
                template: 'Template',
                complete: 'Complete',
            },
            form: {
                title: 'Create a New Pitch',
                description: "Enter the business details and we'll analyze their website.",
                businessName: 'Business Name',
                businessNamePlaceholder: 'e.g., Classic Cuts Barbershop',
                websiteUrl: 'Website URL',
                websiteUrlPlaceholder: 'e.g., classiccutsbarbershop.com',
                analyzeWebsite: 'Analyze Website',
                errors: {
                    businessNameRequired: 'Business name is required',
                    websiteUrlRequired: 'Website URL is required',
                    invalidUrl: 'Please enter a valid URL',
                },
            },
            templateSelector: {
                title: 'Choose a Template',
                description: 'Select a design style for the pitch website. AI has recommended the best match.',
                aiPick: 'AI Pick',
                generateWebsite: 'Generate Website',
                generating: 'Generating...',
            },
            scraping: {
                title: 'Analyzing Website',
                description: "We're extracting content and analyzing the design...",
            },
            complete: {
                title: 'Pitch Created!',
                description: 'Your redesigned website preview is ready. View it now and start reaching out.',
                viewPitch: 'View Pitch',
                goToPitches: 'Go to Pitches',
            },
        },

        // ─── Pitch Detail ──────────────────────────
        pitchDetail: {
            loading: 'Loading pitch...',
            notFound: 'Pitch not found',
            notFoundDescription: "The pitch you're looking for doesn't exist or you don't have access.",
            noPreview: 'No preview available',
            actions: {
                sendEmail: 'Send Email',
                copyUrl: 'Copy URL',
                copied: 'Copied!',
                openPreview: 'Open Preview',
                deleteConfirm: 'Are you sure you want to delete this pitch?',
            },
            metadata: {
                title: 'Details',
                website: 'Website',
                template: 'Template',
                created: 'Created',
                views: 'Views',
                feedback: 'Feedback',
            },
            sendEmailModal: {
                title: 'Send Email to {name}',
                description: 'Compose your outreach email. Click "Open in Gmail" to send it.',
                to: 'To',
                subject: 'Subject',
                message: 'Message',
                openGmail: 'Open in Gmail',
                copyEmail: 'Copy Email',
                copied: 'Copied!',
                markedAsSent: 'Marked as sent!',
                updating: 'Updating...',
                markAsSent: 'Mark as Sent',
            },
            preview: {
                desktop: 'Desktop',
                tablet: 'Tablet',
                mobile: 'Mobile',
                previewLabel: 'Preview — {label}',
            },
            views: {
                title: 'Views',
                titleWithCount: 'Views ({count})',
                noViews: 'No views yet',
                noViewsDescription: 'Views will appear here when someone opens your pitch link.',
            },
        },

        // ─── Public Pitch ──────────────────────────
        publicPitch: {
            loading: 'Loading preview...',
            notFound: 'Pitch Not Found',
            notFoundDescription: 'This pitch link may be invalid or has been removed.',
            title: 'Pitch Preview',
        },

        // ─── Landing Page ──────────────────────────
        landing: {
            nav: {
                howItWorks: 'How It Works',
                features: 'Features',
                pricing: 'Pricing',
                signIn: 'Sign in',
                getStarted: 'Get Started',
            },
            hero: {
                badge: 'AI-Powered Design Outreach',
                titleSpan1: 'Turn Any Website',
                titleSpan2: 'Into a Winning Pitch',
                subtitle: 'Scrape any business website, generate a stunning redesign with AI, and send personalized outreach — all in under 60 seconds.',
                startFree: 'Start Free',
                watchDemo: 'Watch Demo',
                stats: {
                    totalPitches: 'Total Pitches',
                    openRate: 'Open Rate',
                    responses: 'Responses',
                },
            },
            howItWorks: {
                badge: 'How It Works',
                title: 'Three Steps to More Clients',
                steps: [
                    {
                        title: 'Find Leads',
                        description: 'Discover local businesses through Google Maps integration. Filter by category, rating, and location to find your ideal prospects.',
                    },
                    {
                        title: 'AI Redesigns',
                        description: 'Our AI scrapes their existing website and generates a stunning, modern redesign using professional templates — in seconds.',
                    },
                    {
                        title: 'Send & Track',
                        description: 'Send personalized outreach emails with live preview links. Track opens, collect feedback, and close more deals.',
                    },
                ],
            },
            features: {
                badge: 'Features',
                title: 'Everything You Need to Sell Web Design',
                items: [
                    {
                        title: 'Lead Discovery',
                        description: 'Find local businesses through Google Maps with smart filters for rating, category, and website availability.',
                    },
                    {
                        title: 'Website Scraping',
                        description: 'Automatically extract content, images, testimonials, and contact info from any business website.',
                    },
                    {
                        title: 'AI Templates',
                        description: 'Choose from professional templates. Our AI populates them with scraped content for instant redesigns.',
                    },
                    {
                        title: 'Email Outreach',
                        description: 'Send personalized emails with live preview links directly from the platform via Gmail integration.',
                    },
                    {
                        title: 'Open Tracking',
                        description: 'Know exactly when prospects view your pitch. Track opens, locations, and time spent on page.',
                    },
                    {
                        title: 'Feedback Collection',
                        description: 'Built-in feedback forms let prospects rate designs and request changes — right from the pitch.',
                    },
                ],
            },
            socialProof: {
                badge: 'Testimonials',
                title: 'Loved by Agencies Worldwide',
            },
            pricing: {
                badge: 'Pricing',
                title: 'Simple, Transparent Pricing',
                popular: 'Popular',
                monthly: '/month',
                starter: {
                    name: 'Starter',
                    price: 'Free',
                    description: 'Perfect for trying out Pitch AI',
                    cta: 'Get Started',
                },
                pro: {
                    name: 'Pro',
                    price: '$49',
                    description: 'For growing agencies and freelancers',
                    cta: 'Start Pro Trial',
                },
                agency: {
                    name: 'Agency',
                    price: '$149',
                    description: 'For teams and large-scale outreach',
                    cta: 'Contact Sales',
                }
            }
        },

        // ─── Language ──────────────────────────────
        language: {
            label: 'Language',
            ptBR: 'Português (BR)',
            en: 'English',
        },
    },
}

export type TranslationKeys = typeof translations['pt-BR']
