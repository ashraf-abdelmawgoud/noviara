/**
 * NOVIARA - Systems Catalog & Interactive Details Modal
 * Dynamic system cards rendering, category filtering, detailed inspection modal,
 * and seamless Arabic / English localization.
 */

(function () {
  'use strict';

  function getCurrentLang() {
    if (window.NoviaraI18n && typeof window.NoviaraI18n.getLanguage === 'function') {
      return window.NoviaraI18n.getLanguage();
    }
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    if (urlLang === 'en' || urlLang === 'ar') return urlLang;
    return (localStorage.getItem('noviara_language') || localStorage.getItem('language') || document.documentElement.lang || 'ar');
  }

  // --- Bilingual Systems Data Definition ---
  const systemsData = [
    {
      id: 'crm',
      filterKey: 'crm',
      visualTheme: 'crm',
      title: {
        ar: 'نظام إدارة العملاء بالذكاء الاصطناعي',
        en: 'AI Customer Relationship System (AI + CRM)'
      },
      category: 'AI + CRM',
      tag: {
        ar: 'AI + CRM',
        en: 'AI + CRM'
      },
      badge: {
        ar: 'إصدار مؤسسي V3.2',
        en: 'Enterprise V3.2'
      },
      duration: {
        ar: 'ربط مباشر 24/7',
        en: '24/7 Live Sync'
      },
      shortDesc: {
        ar: 'نظام ذكي لإدارة العملاء ومتابعة المبيعات وأتمتة مسارات التواصل وتوقع الصفقات المربحة.',
        en: 'Intelligent CRM platform to track sales pipelines, automate communications, and forecast high-value deals.'
      },
      problem: {
        ar: 'تشتت بيانات العملاء بين محادثات WhatsApp والبريد، التأخر في الرد على الاستفسارات، وفقدان فرص بيعية مؤكدة بسبب بطء المتابعة اليدوية وعدم وجود رؤية موحدة لأداء المبيعات.',
        en: 'Fragmented customer conversations across WhatsApp and email, slow response times, and lost revenue opportunities caused by manual follow-ups and lack of unified pipeline tracking.'
      },
      solution: {
        ar: 'محرك ذكاء اصطناعي متكامل يقوم بتحليل نية العميل فورياً، وتصنيف الفرص البيعية (Lead Scoring) تلقائياً، وتوزيع المهام على الفريق، وإرسال تنبيهات ذكية لأفضل توقيت للمتابعة والإغلاق.',
        en: 'An end-to-end AI engine that analyzes buyer intent in real time, automatically scores inbound leads, dispatches tasks to sales reps, and triggers smart reminders for the optimal closing window.'
      },
      features: {
        ar: [
          'تحليل نية ومشاعر العميل اللحظية في المحادثات',
          'توزيع المهام تلقائياً على فريق المبيعات الأنسب',
          'ربط آلي مباشر مع WhatsApp Cloud API والبريد الإلكتروني',
          'سجل تفاعلي موحد لكل عميل مع ملخص ذكي',
          'تنبيهات استباقية بالعملاء الأكثر احتمالاً لإتمام الشراء',
          'لوحة تحكم تفاعلية مع تقارير أداء ومبيعات لحظية'
        ],
        en: [
          'Real-time conversation intent and sentiment analysis',
          'Automated lead dispatching to the best-suited sales reps',
          'Direct automated integration with WhatsApp Cloud API & Email',
          'Unified interactive customer dossier with AI summaries',
          'Predictive alerts for high-propensity conversion deals',
          'Interactive real-time sales performance and revenue dashboards'
        ]
      },
      technologies: ['Python', 'LLM Agentic Reasoning', 'Vector Embeddings', 'PostgreSQL', 'FastAPI', 'WhatsApp API'],
      roi: {
        ar: 'زيادة معدل إغلاق الصفقات بنسبة 35%، وخفض زمن الاستجابة الأول للعملاء إلى أقل من دقيقتين مع تقليل الجهد اليدوي بنسبة 60%.',
        en: '35% increase in deal win rate, customer first-response time cut to under 2 minutes, and manual administrative effort reduced by 60%.'
      }
    },
    {
      id: 'clinic',
      filterKey: 'healthcare',
      visualTheme: 'clinic',
      title: {
        ar: 'نظام إدارة العيادات الذكي',
        en: 'Smart Clinic Management System'
      },
      category: 'Healthcare',
      tag: {
        ar: 'Healthcare Automation',
        en: 'Healthcare Automation'
      },
      badge: {
        ar: 'متوافق طبياً',
        en: 'Medical Grade'
      },
      duration: {
        ar: 'أتمتة عيادات',
        en: 'Clinic Engine'
      },
      shortDesc: {
        ar: 'حل متكامل لإدارة المواعيد، سجلات المرضى الرقمية، والعمليات اليومية داخل العيادات والمراكز الطبية.',
        en: 'All-in-one clinical operations platform for smart scheduling, digital patient health records, and daily workflow.'
      },
      problem: {
        ar: 'ازدحام صالات الانتظار، نسبة إلغاء وتخلف عن المواعيد (No-shows) تتجاوز 30%، وضياع وقت طاقم التمريض والاستقبال في المكالمات والتأكيدات اليدوية وسجلات الأوراق.',
        en: 'Overcrowded waiting rooms, appointment no-show rates exceeding 30%, and excessive staff hours consumed by manual phone confirmations and paperwork.'
      },
      solution: {
        ar: 'منظومة عيادات ذكية تؤتمت رحلة المريض بالكامل من لحظة حجز الموعد عبر الإنترنت، وإرسال رسائل تذكير ذكية تفاعلية، حتى تسجيل الدخول الذاتي والأرشفة الطبية الآمنة.',
        en: 'An automated clinical operations ecosystem handling the patient journey from online booking and interactive WhatsApp reminders to self-check-in and encrypted electronic records.'
      },
      features: {
        ar: [
          'جدولة مواعيد ذاتية ذكية تمنع تضارب الأطباء والعيادات',
          'تذكير ذكي عبر WhatsApp مع إمكانية التأكيد أو إعادة الجدولة بضغطة زر',
          'سجل طبي إلكتروني مشفر مع تصنيف فوري لتاريخ المريض',
          'إدارة غرف الكشف وتتبع أوقات انتظار المرضى في الوقت الفعلي',
          'فوترة رقمية فورية متوافقة مع متطلبات الفاتورة الإلكترونية',
          'تتبع المخزون الطبي وإرسال تنبيهات إعادة الطلب التلقائية'
        ],
        en: [
          'Smart self-scheduling preventing doctor and room booking conflicts',
          'Automated interactive WhatsApp reminders with 1-click confirmation or reschedule',
          'HIPAA-compliant encrypted electronic medical records (EMR)',
          'Real-time exam room tracking and patient queue analytics',
          'Automated compliant e-invoicing and insurance validation',
          'Medical supply inventory tracking with automated reorder triggers'
        ]
      },
      technologies: ['HIPAA Compliant Protocol', 'Event Scheduling Engine', 'Encrypted Cloud', 'FastAPI', 'Automated SMS & WhatsApp'],
      roi: {
        ar: 'خفض نسبة التخلف عن المواعيد بنسبة 45%، وتوفير أكثر من 20 ساعة عمل أسبوعياً لطاقم الاستقبال مع تحسين رضا المرضى بنسبة 92%.',
        en: '45% reduction in appointment no-shows, over 20 staff hours saved weekly at reception, and 92% patient satisfaction rating.'
      }
    },
    {
      id: 'scheduling',
      filterKey: 'automation',
      visualTheme: 'scheduling',
      title: {
        ar: 'نظام أتمتة المواعيد والخدمات',
        en: 'Appointment & Scheduling Automation System'
      },
      category: 'Automation',
      tag: {
        ar: 'Automation',
        en: 'Automation'
      },
      badge: {
        ar: 'تزامن لحظي',
        en: 'Realtime Sync'
      },
      duration: {
        ar: 'محرك جدولة',
        en: 'Scheduling Engine'
      },
      shortDesc: {
        ar: 'محرك جدولة ذكي متزامن بالكامل مع تقويمات الفريق يمنع تضارب المواعيد ويعمل على مدار الساعة دون تدخل بشري.',
        en: 'Smart scheduling engine synchronized with team calendars to eliminate booking conflicts 24/7 without human intervention.'
      },
      problem: {
        ar: 'هدر ساعات طويلة أسبوعياً في التنسيق والمراسلات لتحديد موعد مناسب بين أطراف متعددة، وتكرار أخطاء الحجز المزدوج وضياع وقت الاستشاريين والخبراء.',
        en: 'Wasting dozens of weekly hours coordinating client availability across time zones, double-booking errors, and lost billable expert time.'
      },
      solution: {
        ar: 'نظام أتمتة متطور يفحص توافر الموظفين والتقويمات تلقائياً، ويعرض واجهة حجز احترافية متعددة اللغات متزامنة مع بوابات الدفع الإلكتروني والتقاويم الرقمية.',
        en: 'An advanced scheduling pipeline that cross-checks staff availability automatically, offering a multilingual booking interface with integrated payment gates and calendar sync.'
      },
      features: {
        ar: [
          'مزامنة لحظية ثنائية الاتجاه مع Google Calendar و Microsoft Outlook',
          'توزيع المواعيد بنظام Round-Robin بين أعضاء الفريق',
          'بوابات دفع مسبق للمواعيد والخدمات الاستشارية',
          'روابط اجتماعات افتراضية تُولد تلقائياً (Google Meet / Zoom)',
          'قواعد ذكية للمناطق الزمنية والحد الفاصل بين الجلسات',
          'إشعارات مسبقة متعددة القنوات (WhatsApp، البريد، الرسائل النصية)'
        ],
        en: [
          'Two-way real-time calendar synchronization (Google Calendar & Microsoft Outlook)',
          'Automated round-robin appointment distribution among team members',
          'Integrated payment gateway for paid consultations and deposits',
          'Automated virtual meeting room generation (Google Meet / Zoom)',
          'Smart timezone conversion and buffer times between sessions',
          'Omnichannel reminders across WhatsApp, email, and SMS'
        ]
      },
      technologies: ['Calendar Sync APIs', 'Stripe / HyperPay Webhooks', 'Node Microservices', 'Redis Queues', 'Timezone Engine'],
      roi: {
        ar: 'القضاء تماماً على تضارب المواعيد (0% Conflicts)، وارتفاع نسبة الحجوزات المؤكدة بنسبة 50% خصوصاً خارج ساعات العمل الرسمية.',
        en: '100% elimination of scheduling conflicts (0% double-booking) and a 50% surge in confirmed appointments booked outside business hours.'
      }
    },
    {
      id: 'support',
      filterKey: 'support',
      visualTheme: 'support',
      title: {
        ar: 'نظام خدمة العملاء والدعم الذكي',
        en: 'AI Customer Support & Assistance System'
      },
      category: 'AI Customer Support',
      tag: {
        ar: 'AI Support Agents',
        en: 'AI Support Agents'
      },
      badge: {
        ar: 'فهم اللهجات العربية',
        en: 'Dialect-Aware'
      },
      duration: {
        ar: 'دعم 24/7',
        en: '24/7 Support'
      },
      shortDesc: {
        ar: 'وكيل ذكاء اصطناعي مدرب على قاعدة معرفة شركتك يجيب على استفسارات العملاء بدقة ويحل المشكلات المعقدة.',
        en: 'Autonomous AI agent trained on your enterprise knowledge base, answering customer inquiries 24/7 and resolving complex issues.'
      },
      problem: {
        ar: 'تراكم تذاكر الدعم الفني، تكرار نفس الأسئلة البسيطة آلاف المرات، وتكلفة تشغيل فرق دعم بشرية ضخمة على مدار الساعة دون الحفاظ على جودة موحدة.',
        en: 'Overwhelmed support queues, thousands of repetitive questions, and expensive 24/7 support shift costs without guaranteed consistency.'
      },
      solution: {
        ar: 'وكيل دعم ذكي فائق الدقة (AI Support Agent) مدرب على سياسات وكتالوجات وأنظمة شركتك، يفهم اللهجات العربية والمصطلحات التقنية، ويقوم بحل المشاكل وربط الأنظمة فورياً.',
        en: 'A high-precision AI Support Agent grounded on your enterprise manuals and databases, understanding natural dialects and technical jargon to resolve requests instantly.'
      },
      features: {
        ar: [
          'استيعاب عميق للغة العربية الفصحى واللهجات المحلية الدارجة',
          'استرجاع دقيق للمعلومات عبر RAG دون أي هلاوس ذكاء اصطناعي',
          'تنفيذ إجراءات حقيقية (استعلام عن حالة الطلب، إعادة التعيين، إلغاء الحجز)',
          'تحويل الحالات الصعبة للموظف البشري مع ملخص ذكي للمحادثة',
          'تكامل كامل مع موقع الويب، تطبيقات الجوال، و WhatsApp',
          'تحليل جودة الخدمة وتقديم مقترحات تحسين مستمرة للمنتجات'
        ],
        en: [
          'Deep comprehension of Modern Standard Arabic, local dialects, and English',
          'Grounded RAG architecture with zero hallucinations',
          'Autonomous action execution (order tracking, account resets, reservation updates)',
          'Intelligent human handoff with pre-summarized chat context',
          'Full omnichannel integration (Website widget, Mobile Apps, WhatsApp API)',
          'Real-time sentiment telemetry and product improvement analytics'
        ]
      },
      technologies: ['Advanced RAG Pipeline', 'Semantic Search', 'Vector Database', 'Realtime WebSockets', 'Omnichannel Connectors'],
      roi: {
        ar: 'حل أكثر من 80% من الاستفسارات فورياً دون تدخل بشري، وخفض تكاليف خدمة العملاء بنسبة 60% مع معدل رضا تجاوز 4.8/5.',
        en: 'Instant autonomous resolution for over 80% of support tickets, 60% reduction in customer care expenses, and a 4.8/5 CSAT rating.'
      }
    },
    {
      id: 'erp',
      filterKey: 'business',
      visualTheme: 'erp',
      title: {
        ar: 'نظام إدارة العمليات الداخلية',
        en: 'Internal Operations & Workflow ERP System'
      },
      category: 'Business Automation',
      tag: {
        ar: 'Business Operations',
        en: 'Business Operations'
      },
      badge: {
        ar: 'ربط سحابي متكامل',
        en: 'Cloud Integrated'
      },
      duration: {
        ar: 'محرك مسارات العمل',
        en: 'Workflow Engine'
      },
      shortDesc: {
        ar: 'منظومة داخلية مرنة تربط الأقسام، المستندات، والموافقات المالية في مسار عمل مؤتمت يقضي على الفوضى الورقية.',
        en: 'Unified internal operations platform bridging departments, documentation, and financial approvals into an automated paperless workflow.'
      },
      problem: {
        ar: 'الاعتماد على ملفات Excel متناثرة، تكرار إدخال البيانات يدوياً بين البرامج، بطء دورات الموافقات الإدارية، وصعوبة تتبع سير العمليات بين الأقسام.',
        en: 'Reliance on disconnected spreadsheets, duplicate manual data entry across software, prolonged approval bottlenecks, and lack of cross-department accountability.'
      },
      solution: {
        ar: 'نظام داخلي موحد مصمم خصيصاً لهيكلية شركتك، يؤتمت تدفق البيانات بين المالية، المشتريات، الموارد البشرية، وإدارة المشاريع بسلاسة وأمان.',
        en: 'A unified operations platform crafted around your company hierarchy, automating data pipelines between finance, procurement, HR, and operations securely.'
      },
      features: {
        ar: [
          'مسارات موافقات إلكترونية ذكية متعددة المستويات وقابلة للتخصيص',
          'مطابقة فواتير المشتريات وأوامر الشراء المؤتمتة بواسطة الـ AI',
          'تتبع مؤشرات أداء المهام والمشاريع لحظة بلحظة',
          'نظام صلاحيات أمني دقيق قائم على الأدوار (RBAC)',
          'توليد وتصدير العقود والتقارير التنفيذية تلقائياً بصيغة PDF',
          'تكامل سلس مع Slack و Microsoft Teams لإشعارات العمل'
        ],
        en: [
          'Configurable multi-tier electronic approval workflows',
          'AI-powered document extraction and purchase order invoice matching',
          'Real-time task milestones and project KPI telemetry',
          'Granular Role-Based Access Control (RBAC) security model',
          'Automated contract and financial executive report generation (PDF/Excel)',
          'Seamless webhook integration with Slack and Microsoft Teams alerts'
        ]
      },
      technologies: ['Enterprise Architecture', 'OCR & Document AI', 'Role-Based Access (RBAC)', 'PostgreSQL', 'Secure REST APIs'],
      roi: {
        ar: 'تسريع دورة الموافقات بنسبة 70%، والقضاء على أخطاء إدخال البيانات بنسبة 95% وتوفير رؤية فورية للإدارة العليا حول حالة العمليات.',
        en: '70% acceleration in administrative approval cycles, 95% reduction in manual data entry errors, and total executive visibility into daily operations.'
      }
    },
    {
      id: 'analytics',
      filterKey: 'data',
      visualTheme: 'analytics',
      title: {
        ar: 'نظام التقارير والتحليلات التنبؤية',
        en: 'Predictive Analytics & Executive Reporting System'
      },
      category: 'Data & AI',
      tag: {
        ar: 'Data & Predictive AI',
        en: 'Data & Predictive AI'
      },
      badge: {
        ar: 'رؤى تنفيذية فورية',
        en: 'Executive Insights'
      },
      duration: {
        ar: 'تحليلات ذكية',
        en: 'Smart Analytics'
      },
      shortDesc: {
        ar: 'لوحة تحكم ذكية تجمع بيانات المؤسسة من مصادر متعددة وتولد رؤى وتنبؤات دقيقة تدعم القرارات الاستراتيجية.',
        en: 'Intelligent dashboard consolidating enterprise data across multiple sources to deliver predictive forecasting and actionable strategic insights.'
      },
      problem: {
        ar: 'اتخاذ القرارات المصيرية بناءً على توقعات تقريبية، صعوبة استخراج التقارير وتجميعها من أنظمة منفصلة، واكتشاف المشاكل المالية أو التشغيلية بعد فوات الأوان.',
        en: 'Leadership making critical decisions based on fragmented estimates, tedious monthly report aggregation across silos, and delayed detection of operational losses.'
      },
      solution: {
        ar: 'منصة ذكاء بيانات تقوم بسحب وتوحيد البيانات من جميع أنظمتك تلقائياً، وتطبق نماذج تنبؤية متقدمة لاكتشاف الفرص وتنبيه القيادة بالمخاطر قبل وقوعها.',
        en: 'An automated data intelligence platform pulling and unifying telemetry from all your operational databases, running predictive models to forecast growth and flag risks proactively.'
      },
      features: {
        ar: [
          'لوحات تحكم تنفيذية تفاعلية ومحدثة في الوقت الفعلي',
          'نماذج تنبؤ بالمبيعات، الإيرادات، وسلوك العملاء في الأشهر القادمة',
          'كشف آلي للشذوذ والأنماط غير الطبيعية في العمليات والمالية',
          'محرك استفسارات بلغة طبيعية: اسأل بياناتك باللغة العربية واحصل على إجابة',
          'جدولة تقارير تنفيذية ترسل تلقائياً للإدارة عبر البريد',
          'مستودع بيانات سحابي مشفر ومعزول بأعلى معايير الأمان'
        ],
        en: [
          'Real-time interactive executive dashboards and KPI feeds',
          'Predictive sales, revenue, and customer churn time-series modeling',
          'Automated anomaly detection in financial cashflows and operational metrics',
          'Natural language query engine: ask your business data in plain text',
          'Automated scheduled executive briefings dispatched via email & messaging',
          'Isolated, end-to-end encrypted cloud data warehouse infrastructure'
        ]
      },
      technologies: ['Predictive Machine Learning', 'Automated ETL Pipelines', 'ClickHouse / BigQuery', 'Vectorized Analytics', 'Data Encryption'],
      roi: {
        ar: 'توفير مئات ساعات العمل الشهرية المستهلكة في إعداد التقارير، وزيادة دقة التخطيط المالي بنسبة 40% مع اكتشاف مبكر لفرص خفض التكاليف.',
        en: 'Hundreds of manual reporting hours saved monthly, 40% improvement in financial forecast precision, and early identification of cost-saving opportunities.'
      }
    }
  ];

  // Helper to extract localized string
  function getLoc(val, lang) {
    if (!val) return '';
    if (typeof val === 'string') return val;
    return val[lang] || val.ar || val.en || '';
  }

  // --- Generate Visual SVG Thumbnails for Systems ---
  function getSystemThumbnailSvg(theme) {
    const svgs = {
      crm: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%">
          <defs>
            <linearGradient id="grad-crm" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#02140a"/>
              <stop offset="100%" stop-color="#052814"/>
            </linearGradient>
            <radialGradient id="glow-crm" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#00ff87" stop-opacity="0.3"/>
              <stop offset="100%" stop-color="#00ff87" stop-opacity="0"/>
            </radialGradient>
          </defs>
          <rect width="640" height="360" fill="url(#grad-crm)"/>
          <circle cx="320" cy="180" r="140" fill="url(#glow-crm)"/>
          <path d="M0 60 H640 M0 120 H640 M0 180 H640 M0 240 H640 M0 300 H640" stroke="rgba(16, 185, 129, 0.08)" stroke-width="1"/>
          <path d="M80 0 V360 M160 0 V360 M240 0 V360 M320 0 V360 M400 0 V360 M480 0 V360 M560 0 V360" stroke="rgba(16, 185, 129, 0.08)" stroke-width="1"/>
          <g transform="translate(80, 70)">
            <rect x="20" y="30" width="120" height="160" rx="8" fill="rgba(8, 20, 14, 0.85)" stroke="rgba(16, 185, 129, 0.3)" stroke-width="1.5"/>
            <rect x="35" y="45" width="90" height="8" rx="4" fill="#00ff87" opacity="0.8"/>
            <rect x="35" y="65" width="90" height="34" rx="6" fill="rgba(16, 185, 129, 0.15)" stroke="rgba(0, 255, 135, 0.3)"/>
            <rect x="35" y="110" width="90" height="34" rx="6" fill="rgba(16, 185, 129, 0.15)" stroke="rgba(0, 255, 135, 0.3)"/>
            <rect x="180" y="20" width="120" height="180" rx="8" fill="rgba(12, 30, 20, 0.95)" stroke="#00ff87" stroke-width="2"/>
            <circle cx="240" cy="70" r="24" fill="rgba(0, 255, 135, 0.2)" stroke="#00ff87" stroke-width="2"/>
            <path d="M232 70 L248 70 M240 62 L240 78" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
            <rect x="195" y="110" width="90" height="30" rx="6" fill="rgba(0, 255, 135, 0.2)" stroke="#00ff87"/>
            <rect x="195" y="150" width="90" height="30" rx="6" fill="rgba(16, 185, 129, 0.2)"/>
            <rect x="340" y="30" width="120" height="160" rx="8" fill="rgba(8, 20, 14, 0.85)" stroke="rgba(16, 185, 129, 0.3)" stroke-width="1.5"/>
            <rect x="355" y="45" width="90" height="8" rx="4" fill="#10b981" opacity="0.8"/>
            <rect x="355" y="65" width="90" height="42" rx="6" fill="rgba(0, 255, 135, 0.25)" stroke="#00ff87"/>
            <path d="M140 120 C 160 120, 160 120, 180 120" stroke="#00ff87" stroke-width="2" stroke-dasharray="4,4"/>
            <path d="M300 120 C 320 120, 320 85, 340 85" stroke="#00ff87" stroke-width="2" stroke-dasharray="4,4"/>
          </g>
        </svg>
      `,
      clinic: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%">
          <defs>
            <linearGradient id="grad-clinic" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#02120e"/>
              <stop offset="100%" stop-color="#042e20"/>
            </linearGradient>
            <radialGradient id="glow-clinic" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#00ff87" stop-opacity="0.3"/>
              <stop offset="100%" stop-color="#00ff87" stop-opacity="0"/>
            </radialGradient>
          </defs>
          <rect width="640" height="360" fill="url(#grad-clinic)"/>
          <circle cx="320" cy="180" r="130" fill="url(#glow-clinic)"/>
          <g transform="translate(120, 80)">
            <rect x="0" y="0" width="400" height="200" rx="14" fill="rgba(8, 22, 16, 0.9)" stroke="rgba(0, 255, 135, 0.35)" stroke-width="1.5"/>
            <g transform="translate(40, 40)">
              <rect x="25" y="10" width="20" height="50" rx="4" fill="#00ff87"/>
              <rect x="10" y="25" width="50" height="20" rx="4" fill="#00ff87"/>
            </g>
            <path d="M120 75 L180 75 L195 40 L210 110 L225 60 L240 85 L255 75 L360 75" fill="none" stroke="#00ff87" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            <rect x="40" y="120" width="90" height="40" rx="6" fill="rgba(0, 255, 135, 0.12)" stroke="rgba(0, 255, 135, 0.3)"/>
            <rect x="155" y="120" width="90" height="40" rx="6" fill="rgba(0, 255, 135, 0.12)" stroke="rgba(0, 255, 135, 0.3)"/>
            <rect x="270" y="120" width="90" height="40" rx="6" fill="rgba(0, 255, 135, 0.25)" stroke="#00ff87"/>
          </g>
        </svg>
      `,
      scheduling: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%">
          <defs>
            <linearGradient id="grad-sched" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#02110c"/>
              <stop offset="100%" stop-color="#042618"/>
            </linearGradient>
            <radialGradient id="glow-sched" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#00ff87" stop-opacity="0.32"/>
              <stop offset="100%" stop-color="#00ff87" stop-opacity="0"/>
            </radialGradient>
          </defs>
          <rect width="640" height="360" fill="url(#grad-sched)"/>
          <circle cx="320" cy="180" r="140" fill="url(#glow-sched)"/>
          <g transform="translate(130, 65)">
            <rect x="0" y="0" width="380" height="230" rx="14" fill="rgba(9, 21, 15, 0.9)" stroke="rgba(16, 185, 129, 0.35)" stroke-width="1.5"/>
            <rect x="25" y="25" width="330" height="32" rx="6" fill="rgba(16, 185, 129, 0.15)"/>
            <circle cx="45" cy="41" r="6" fill="#00ff87"/>
            <circle cx="65" cy="41" r="6" fill="#10b981"/>
            <g transform="translate(25, 75)">
              <rect x="0" y="0" width="95" height="40" rx="6" fill="rgba(0, 255, 135, 0.25)" stroke="#00ff87"/>
              <rect x="115" y="0" width="95" height="40" rx="6" fill="rgba(16, 185, 129, 0.1)"/>
              <rect x="230" y="0" width="95" height="40" rx="6" fill="rgba(0, 255, 135, 0.25)" stroke="#00ff87"/>
              <rect x="0" y="55" width="95" height="40" rx="6" fill="rgba(16, 185, 129, 0.1)"/>
              <rect x="115" y="55" width="95" height="40" rx="6" fill="rgba(0, 255, 135, 0.25)" stroke="#00ff87"/>
              <rect x="230" y="55" width="95" height="40" rx="6" fill="rgba(16, 185, 129, 0.1)"/>
            </g>
            <circle cx="340" cy="190" r="22" fill="#00ff87" opacity="0.9"/>
            <path d="M332 190 L348 190 M340 182 L340 198" stroke="#040806" stroke-width="2.5" stroke-linecap="round"/>
          </g>
        </svg>
      `,
      support: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%">
          <defs>
            <linearGradient id="grad-sup" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#02140b"/>
              <stop offset="100%" stop-color="#062e1a"/>
            </linearGradient>
            <radialGradient id="glow-sup" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#00ff87" stop-opacity="0.3"/>
              <stop offset="100%" stop-color="#00ff87" stop-opacity="0"/>
            </radialGradient>
          </defs>
          <rect width="640" height="360" fill="url(#grad-sup)"/>
          <circle cx="320" cy="180" r="140" fill="url(#glow-sup)"/>
          <g transform="translate(120, 70)">
            <path d="M40 30 H220 C 230 30, 240 40, 240 50 V 90 C 240 100, 230 110, 220 110 H 70 L 40 130 V 40 Z" fill="rgba(16, 185, 129, 0.15)" stroke="rgba(16, 185, 129, 0.4)" stroke-width="1.5"/>
            <rect x="65" y="55" width="140" height="8" rx="4" fill="#94a3b8"/>
            <rect x="65" y="75" width="90" height="8" rx="4" fill="#64748b"/>
            <path d="M360 110 H 180 C 170 110, 160 120, 160 130 V 170 C 160 180, 170 190, 180 190 H 330 L 360 210 V 120 Z" fill="rgba(12, 34, 22, 0.95)" stroke="#00ff87" stroke-width="2"/>
            <rect x="190" y="135" width="140" height="8" rx="4" fill="#00ff87"/>
            <rect x="190" y="155" width="105" height="8" rx="4" fill="#00ff87" opacity="0.7"/>
            <circle cx="140" cy="145" r="16" fill="rgba(0, 255, 135, 0.25)" stroke="#00ff87" stroke-width="2"/>
            <circle cx="140" cy="145" r="4" fill="#ffffff"/>
          </g>
        </svg>
      `,
      erp: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%">
          <defs>
            <linearGradient id="grad-erp" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#02100a"/>
              <stop offset="100%" stop-color="#042617"/>
            </linearGradient>
            <radialGradient id="glow-erp" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#00ff87" stop-opacity="0.3"/>
              <stop offset="100%" stop-color="#00ff87" stop-opacity="0"/>
            </radialGradient>
          </defs>
          <rect width="640" height="360" fill="url(#grad-erp)"/>
          <circle cx="320" cy="180" r="140" fill="url(#glow-erp)"/>
          <g transform="translate(110, 60)">
            <rect x="0" y="0" width="420" height="240" rx="14" fill="rgba(8, 20, 14, 0.9)" stroke="rgba(16, 185, 129, 0.35)" stroke-width="1.5"/>
            <rect x="160" y="30" width="100" height="40" rx="8" fill="rgba(0, 255, 135, 0.25)" stroke="#00ff87" stroke-width="1.5"/>
            <circle cx="210" cy="50" r="6" fill="#00ff87"/>
            <path d="M210 70 V 110 M210 110 H 90 V 140 M210 110 H 330 V 140 M210 110 V 140" stroke="#00ff87" stroke-width="2" fill="none"/>
            <rect x="40" y="140" width="100" height="55" rx="8" fill="rgba(16, 185, 129, 0.15)" stroke="rgba(0, 255, 135, 0.4)"/>
            <rect x="55" y="155" width="70" height="6" rx="3" fill="#00ff87"/>
            <rect x="55" y="170" width="50" height="6" rx="3" fill="#94a3b8"/>
            <rect x="160" y="140" width="100" height="55" rx="8" fill="rgba(0, 255, 135, 0.3)" stroke="#00ff87" stroke-width="1.8"/>
            <rect x="175" y="155" width="70" height="6" rx="3" fill="#ffffff"/>
            <rect x="175" y="170" width="50" height="6" rx="3" fill="#00ff87"/>
            <rect x="280" y="140" width="100" height="55" rx="8" fill="rgba(16, 185, 129, 0.15)" stroke="rgba(0, 255, 135, 0.4)"/>
            <rect x="295" y="155" width="70" height="6" rx="3" fill="#00ff87"/>
            <rect x="295" y="170" width="50" height="6" rx="3" fill="#94a3b8"/>
          </g>
        </svg>
      `,
      analytics: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%">
          <defs>
            <linearGradient id="grad-ana" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#02140c"/>
              <stop offset="100%" stop-color="#05301a"/>
            </linearGradient>
            <radialGradient id="glow-ana" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#00ff87" stop-opacity="0.35"/>
              <stop offset="100%" stop-color="#00ff87" stop-opacity="0"/>
            </radialGradient>
            <linearGradient id="chart-area" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#00ff87" stop-opacity="0.4"/>
              <stop offset="100%" stop-color="#00ff87" stop-opacity="0"/>
            </linearGradient>
          </defs>
          <rect width="640" height="360" fill="url(#grad-ana)"/>
          <circle cx="320" cy="180" r="140" fill="url(#glow-ana)"/>
          <g transform="translate(110, 60)">
            <rect x="0" y="0" width="420" height="240" rx="14" fill="rgba(8, 20, 14, 0.9)" stroke="rgba(16, 185, 129, 0.35)" stroke-width="1.5"/>
            <path d="M40 70 H380 M40 120 H380 M40 170 H380" stroke="rgba(16, 185, 129, 0.12)" stroke-width="1"/>
            <rect x="70" y="120" width="18" height="60" rx="3" fill="rgba(16, 185, 129, 0.25)"/>
            <rect x="130" y="100" width="18" height="80" rx="3" fill="rgba(16, 185, 129, 0.25)"/>
            <rect x="190" y="70" width="18" height="110" rx="3" fill="rgba(16, 185, 129, 0.25)"/>
            <rect x="250" y="90" width="18" height="90" rx="3" fill="rgba(16, 185, 129, 0.25)"/>
            <rect x="310" y="50" width="18" height="130" rx="3" fill="rgba(0, 255, 135, 0.45)"/>
            <path d="M50 150 Q 120 130, 170 90 T 270 95 T 370 45 L 370 180 L 50 180 Z" fill="url(#chart-area)"/>
            <path d="M50 150 Q 120 130, 170 90 T 270 95 T 370 45" fill="none" stroke="#00ff87" stroke-width="3.5" stroke-linecap="round"/>
            <circle cx="370" cy="45" r="5" fill="#ffffff" stroke="#00ff87" stroke-width="2"/>
          </g>
        </svg>
      `
    };

    return svgs[theme] || svgs.crm;
  }

  // Mapping system ID to consultation solution select values
  const SYSTEM_TO_CONSULT_MAP = {
    crm: 'crm',
    clinic: 'clinic-system',
    scheduling: 'scheduling',
    support: 'support-agent',
    erp: 'internal-system',
    analytics: 'analytics'
  };

  // --- Render Systems into Grid ---
  const systemsGrid = document.getElementById('systems-grid');
  const filterButtons = document.querySelectorAll('.filter-btn');
  let currentFilter = 'all';
  let activeModalSystemId = null;

  // --- Dynamic Systems Count in Filter Buttons (Addition #3) ---
  function updateFilterCounts() {
    const lang = getCurrentLang();
    const isEn = lang === 'en';

    filterButtons.forEach(btn => {
      const filterKey = btn.getAttribute('data-filter');
      let count = 0;
      if (filterKey === 'all') {
        count = systemsData.length;
        btn.textContent = isEn ? `All Systems (${count})` : `جميع الأنظمة (${count})`;
      } else {
        count = systemsData.filter(s => s.filterKey === filterKey || s.category.toLowerCase().includes(filterKey.toLowerCase())).length;
        const labels = {
          crm: { ar: 'AI + CRM', en: 'AI + CRM' },
          healthcare: { ar: 'الرعاية والعيادات', en: 'Healthcare & Clinics' },
          automation: { ar: 'أتمتة المواعيد', en: 'Scheduling Automation' },
          support: { ar: 'دعم العملاء الذكي', en: 'AI Customer Support' },
          business: { ar: 'العمليات الداخلية', en: 'Business Operations' },
          data: { ar: 'البيانات والتحليلات', en: 'Data & Analytics' }
        };
        const labelObj = labels[filterKey];
        const baseLabel = labelObj ? (isEn ? labelObj.en : labelObj.ar) : btn.textContent.split('(')[0].trim();
        btn.textContent = `${baseLabel} (${count})`;
      }
    });
  }

  function renderSystems(filter = currentFilter) {
    if (!systemsGrid) return;
    currentFilter = filter;
    systemsGrid.innerHTML = '';
    updateFilterCounts();

    const lang = getCurrentLang();
    const isEn = lang === 'en';

    const filtered = filter === 'all' 
      ? systemsData 
      : systemsData.filter(s => s.filterKey === filter || s.category.toLowerCase().includes(filter.toLowerCase()));

    filtered.forEach((sys, idx) => {
      const card = document.createElement('div');
      card.className = 'system-card reveal reveal-delay-' + ((idx % 3) + 1);
      card.setAttribute('data-id', sys.id);
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');

      const locTitle = getLoc(sys.title, lang);
      const locDesc = getLoc(sys.shortDesc, lang);
      const locTag = getLoc(sys.tag, lang);
      const locBadge = getLoc(sys.badge, lang);
      const locDuration = getLoc(sys.duration, lang);
      const viewBtnText = isEn ? 'View System' : 'عرض النظام';
      const liveStatusText = isEn ? 'Production Ready' : 'جاهز للتشغيل';

      card.setAttribute('aria-label', locTitle);

      card.innerHTML = `
        <div class="system-thumbnail-wrap">
          <div class="system-thumbnail-svg">
            ${getSystemThumbnailSvg(sys.visualTheme)}
          </div>
          <div class="system-thumb-overlay">
            <div class="play-action-pill" title="${viewBtnText}">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </div>
          </div>
          <div class="system-category-badge">${locTag}</div>
          <div class="system-status-badge">
            <span class="live-dot" aria-hidden="true"></span>
            ${locDuration}
          </div>
        </div>
        <div class="system-body">
          <div class="system-card-meta-row">
            <span class="system-live-pill">
              <span class="pulse-dot-sm" aria-hidden="true"></span>
              ${liveStatusText}
            </span>
            <span class="service-badge">${locBadge}</span>
          </div>
          <h3 class="system-title">${locTitle}</h3>
          <p class="system-description">${locDesc}</p>
          <div class="system-footer">
            <span class="system-view-btn">
              <span>${viewBtnText}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </span>
          </div>
        </div>
      `;

      card.addEventListener('click', () => {
        openSystemModal(sys.id, true);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openSystemModal(sys.id, true);
        }
      });

      systemsGrid.appendChild(card);
    });

    requestAnimationFrame(() => {
      const newReveals = systemsGrid.querySelectorAll('.reveal');
      newReveals.forEach(el => el.classList.add('is-visible'));
    });
  }

  // Handle Filtering
  if (filterButtons.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filterVal = btn.getAttribute('data-filter') || 'all';
        renderSystems(filterVal);
      });
    });
  }

  // --- Modal Logic with A11y Focus Trap & History Navigation ---
  const modalBackdrop = document.getElementById('system-details-modal');
  const modalCloseBtn = modalBackdrop ? modalBackdrop.querySelector('.system-modal-close') : null;
  let previousActiveElement = null;

  function openSystemModal(systemId, updateHistory = true) {
    const sys = systemsData.find(s => s.id === systemId);
    if (!sys || !modalBackdrop) return;
    activeModalSystemId = systemId;
    previousActiveElement = document.activeElement;

    const lang = getCurrentLang();
    const locTitle = getLoc(sys.title, lang);
    const locTag = getLoc(sys.tag, lang);
    const locBadge = getLoc(sys.badge, lang);
    const locProblem = getLoc(sys.problem, lang);
    const locSolution = getLoc(sys.solution, lang);
    const locRoi = getLoc(sys.roi, lang);
    const locFeatures = (sys.features && (sys.features[lang] || sys.features.ar || sys.features)) || [];

    // 1. Render Hero Visual
    const heroVisual = modalBackdrop.querySelector('.modal-hero-visual');
    if (heroVisual) {
      heroVisual.innerHTML = getSystemThumbnailSvg(sys.visualTheme);
    }

    // 2. Set Category Badge & System Title
    const titleEl = modalBackdrop.querySelector('.modal-system-title');
    if (titleEl) titleEl.textContent = locTitle;

    const catEl = modalBackdrop.querySelector('.modal-category-tag');
    if (catEl) catEl.textContent = `${locTag} • ${locBadge}`;

    // 3. Problem text
    const problemEl = modalBackdrop.querySelector('.modal-problem-text');
    if (problemEl) problemEl.textContent = locProblem;

    // 4. Solution text
    const solutionEl = modalBackdrop.querySelector('.modal-solution-text');
    if (solutionEl) solutionEl.textContent = locSolution;

    // 5. Features list
    const featuresList = modalBackdrop.querySelector('.modal-features-list');
    if (featuresList) {
      featuresList.innerHTML = locFeatures.map(f => `
        <div class="modal-feature-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>${f}</span>
        </div>
      `).join('');
    }

    // 6. Technologies
    const techGrid = modalBackdrop.querySelector('.tech-badges-grid');
    if (techGrid) {
      techGrid.innerHTML = sys.technologies.map(t => `
        <span class="tech-badge">${t}</span>
      `).join('');
    }

    // 7. ROI
    const roiEl = modalBackdrop.querySelector('.modal-roi-text');
    if (roiEl) roiEl.textContent = locRoi;

    // 8. CTA Link with direct mapping to consultation dropdown value (Solution #2)
    const ctaBtn = modalBackdrop.querySelector('.modal-consult-btn');
    if (ctaBtn) {
      const solutionKey = SYSTEM_TO_CONSULT_MAP[sys.id] || sys.id;
      ctaBtn.href = `consultation.html?solution=${encodeURIComponent(solutionKey)}&lang=${lang}`;
    }

    // Open Modal
    modalBackdrop.classList.add('open');
    modalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus close button
    if (modalCloseBtn) {
      setTimeout(() => modalCloseBtn.focus(), 60);
    }

    // History state management (Solution #4)
    if (updateHistory) {
      const targetHash = `#system-${sys.id}`;
      if (window.location.hash !== targetHash) {
        history.pushState({ modalOpen: true, systemId: sys.id }, '', targetHash);
      }
    }
  }

  function closeSystemModal(updateHistory = true) {
    if (!modalBackdrop) return;
    activeModalSystemId = null;
    modalBackdrop.classList.remove('open');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Return focus to trigger element for A11y
    if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
      previousActiveElement.focus();
    }

    // Clean hash via history (Solution #4)
    if (updateHistory) {
      if (window.location.hash.startsWith('#system-')) {
        history.back();
      } else {
        try {
          const url = new URL(window.location.href);
          url.hash = '';
          history.replaceState(null, '', url.pathname + url.search);
        } catch (e) {
          history.replaceState(null, '', window.location.pathname);
        }
      }
    }
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => closeSystemModal(true));
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeSystemModal(true);
      }
    });
  }

  // Handle browser Back / Forward buttons (Solution #4)
  window.addEventListener('popstate', (e) => {
    const hash = window.location.hash;
    if (modalBackdrop && modalBackdrop.classList.contains('open')) {
      if (!hash.startsWith('#system-')) {
        closeSystemModal(false);
      } else {
        const id = hash.replace('#system-', '');
        if (id !== activeModalSystemId) {
          openSystemModal(id, false);
        }
      }
    } else if (hash.startsWith('#system-')) {
      const id = hash.replace('#system-', '');
      openSystemModal(id, false);
    }
  });

  // A11y Focus Trap & Escape key inside modal (Solution #10)
  const focusableElementsSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  document.addEventListener('keydown', (e) => {
    if (!modalBackdrop || !modalBackdrop.classList.contains('open')) return;

    if (e.key === 'Escape') {
      closeSystemModal(true);
      return;
    }

    if (e.key === 'Tab') {
      const focusables = Array.from(modalBackdrop.querySelectorAll(focusableElementsSelector))
        .filter(el => !el.disabled && el.offsetParent !== null);
      if (focusables.length === 0) return;

      const firstEl = focusables[0];
      const lastEl = focusables[focusables.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          lastEl.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastEl) {
          firstEl.focus();
          e.preventDefault();
        }
      }
    }
  });

  // --- Listen to Global Language Switcher ---
  window.addEventListener('languageChanged', (e) => {
    renderSystems(currentFilter);
    if (modalBackdrop && modalBackdrop.classList.contains('open') && activeModalSystemId) {
      openSystemModal(activeModalSystemId, false);
    }
  });

  // --- Check Initial Query / Hash Deep Linking ---
  function checkUrlForSystem() {
    const hash = window.location.hash;
    const urlParams = new URLSearchParams(window.location.search);
    const systemParam = urlParams.get('system');

    if (systemParam) {
      openSystemModal(systemParam, false);
    } else if (hash.startsWith('#system-')) {
      const id = hash.replace('#system-', '');
      openSystemModal(id, false);
    }
  }

  // Listen to hashchange so footer links inside systems.html open modal (Solution #3)
  window.addEventListener('hashchange', checkUrlForSystem);

  // Initial Boot
  if (systemsGrid) {
    renderSystems('all');
    checkUrlForSystem();
  }

  // Expose helper globally
  window.NoviaraSystems = {
    openModal: openSystemModal,
    closeModal: closeSystemModal,
    data: systemsData
  };

})();

