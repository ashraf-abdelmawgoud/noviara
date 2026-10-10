/**
 * NOVIARA - Centralized Internationalization (i18n) Engine
 * Arabic (RTL) & English (LTR) Switcher with persistent localStorage.
 * Automatically updates text, placeholders, attributes, and dispatches change events.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'noviara_language';

  // --- Centralized Translation Dictionary ---
  const translations = {
    ar: {
      // Accessibility & Brand
      skip_link: 'تخطي إلى المحتوى الرئيسي',
      brand_title: 'Noviara الصفحة الرئيسية',
      brand_name: 'Noviara',

      // Navigation
      nav_home: 'الرئيسية',
      nav_systems: 'الأنظمة',
      nav_consultation: 'حجز استشارة',
      nav_cta_mobile: 'احجز استشارتك الآن',
      nav_aria: 'التنقل الأساسي',
      mobile_toggle_aria: 'فتح القائمة الرئيسية',

      // Language Switcher
      lang_ar: 'عربي',
      lang_en: 'EN',
      lang_switch_aria: 'تغيير اللغة إلى الإنجليزية',

      // Home Hero Section
      hero_title_1: 'نحوّل أعمالك إلى',
      hero_title_2: 'أنظمة ذكية تعمل بكفاءة',
      hero_desc: 'نساعد الشركات والعيادات على أتمتة العمليات، بناء الأنظمة المخصصة، ودمج الذكاء الاصطناعي في أعمالهم لتحقيق سرعة أعلى وكفاءة أكبر.',
      hero_cta_primary: 'ابدأ مشروعك',
      hero_cta_secondary: 'استكشف الأنظمة',
      hero_metric_1_lbl: 'دقة تدفقات العمل المؤتمتة',
      hero_metric_2_lbl: 'مضاعفة سرعة إنجاز العمليات',
      hero_metric_3_lbl: 'عمل مستمر دون انقطاع',

      // Services Section
      services_tag: 'القدرات والحلول',
      services_title_1: 'ماذا يمكننا أن',
      services_title_2: 'نبني لك؟',
      services_subtitle: 'مجموعة واسعة من الحلول التقنية المتقدمة المصممة لتسريع وتيرة عمل الشركات الاحترافية والعيادات.',
      service1_title: 'أتمتة الأعمال بالذكاء الاصطناعي',
      service1_desc: 'تحويل الإجراءات المتكررة والمعقدة إلى مسارات آلية ذكية تتخذ قرارات دقيقة استناداً إلى بيانات عملك في الوقت الفعلي.',
      service2_title: 'أنظمة أعمال مخصصة',
      service2_desc: 'تطوير منصات برمجية وأنظمة إدارة داخلية مصممة من الصفر لتناسب متطلباتك الدقيقة وطبيعة قطاعك دون تنازلات.',
      service3_title: 'خدمة العملاء الذكية (AI Support)',
      service3_desc: 'وكلاء ذكاء اصطناعي مدربون على قاعدة معرفة شركتك يجيبون على العملاء على مدار الساعة بدقة ويفهمون اللهجات المحلية.',
      service4_title: 'أتمتة إدارة علاقات العملاء (CRM)',
      service4_desc: 'ربط مسارات المبيعات والمتابعات تلقائياً، وتصنيف العملاء المحتملين وتوجيههم للموظف المختص دون فقدان أي فرصة.',
      service5_title: 'أتمتة الحجوزات والمواعيد',
      service5_desc: 'أنظمة حجز ذكية متزامنة تمنع التضارب، وتتولى التذكير الذاتي للعيادات والمراكز الاستشارية لخفض معدل الغياب.',
      service6_title: 'وكلاء الذكاء الاصطناعي والربط (APIs)',
      service6_desc: 'بناء وكلاء أذكياء (AI Agents) ينفذون مهام متعددة الخطوات تلقائياً ويربطون بين مختلف البرمجيات وتطبيقات السحاب.',

      // How It Works / Timeline
      timeline_tag: 'منهجية العمل',
      timeline_title_1: 'كيف',
      timeline_title_2: 'نعمل؟',
      timeline_subtitle: 'خطوات هندسية واضحة ومنظمة تضمن تسليم أنظمة متينة تحقق عائداً ملموساً من اليوم الأول.',
      step1_title: 'نفهم أعمالك',
      step1_desc: 'نحلل العمليات والتحديات الحالية ونقاط الاختناق اليدوية داخل شركتك بدقة وعمق.',
      step2_title: 'نصمم الحل',
      step2_desc: 'نضع تصورًا هندسيًا للنظام ومسارات الأتمتة والذكاء الاصطناعي الأنسب لاحتياجاتك.',
      step3_title: 'نبني ونربط',
      step3_desc: 'نطور النظام ونربطه بالأدوات وقواعد البيانات والخدمات السحابية التي تستخدمها بالفعل.',
      step4_title: 'نطلق ونحسن',
      step4_desc: 'نختبر الحل عملياً، وندرّب فريقك، ونراقب الأداء المستمر لضمان أعلى كفاءة ممكنة.',

      // Target Sectors
      sectors_tag: 'القطاعات المستهدفة',
      sectors_title_1: 'حلولنا تناسب',
      sectors_title_2: 'مختلف القطاعات',
      sectors_subtitle: 'نوفر أنظمة مصممة لتحديات كل قطاع على حدة لتحقيق أقصى فاعلية تشغيلية.',
      sector1_title: 'العيادات والمراكز الطبية',
      sector1_desc: 'أتمتة المواعيد والسجلات والفوترة',
      sector2_title: 'الشركات والمؤسسات',
      sector2_desc: 'أنظمة داخلية وإدارة العمليات',
      sector3_title: 'المتاجر الإلكترونية',
      sector3_desc: 'تتبع الطلبات، المخزون، والدعم الذكي',
      sector4_title: 'شركات الخدمات المهنية',
      sector4_desc: 'تأهيل العملاء وإدارة المشاريع',
      sector5_title: 'الشركات الناشئة',
      sector5_desc: 'بناء البنية التحتية البرمجية السريعة',
      sector6_title: 'مكاتب الاستشارات',
      sector6_desc: 'أتمتة جدولة المواعيد والعقود',
      sector7_title: 'العقارات وإدارة الأملاك',
      sector7_desc: 'متابعة الصفقات، الإيجارات، وتأهيل المشترين',
      sector8_title: 'التعليم والتدريب',
      sector8_desc: 'تسجيل الطلاب والشهادات والتواصل الآلي',

      // Custom Tailored Banner
      banner_title: 'نبني الحل وفق طبيعة عملك',
      banner_desc: 'لا نعتمد على برمجيات مكررة لا تفيد عملك. نستمع إليك ونبني بالضبط ما تحتاجه منظومتك لتتفوق.',
      banner_btn: 'تحدث مع خبرائنا',

      // Final CTA Section
      cta_title_1: 'جاهز لتحويل أعمالك إلى',
      cta_title_2: 'منظومة أكثر ذكاءً؟',
      cta_desc: 'دعنا نكتشف معًا أين يمكن للذكاء الاصطناعي والأتمتة أن يصنعا فرقًا حقيقيًا في كفاءة وربحية عملك.',
      cta_btn: 'احجز استشارتك الآن',

      // Systems Page
      systems_tag: 'معرض الأنظمة والمشاريع',
      systems_title_1: 'الأنظمة',
      systems_title_2: 'الذكية',
      systems_subtitle: 'حلول رقمية مصممة لتجعل أعمالك أكثر ذكاءً وكفاءة. تصفح نماذج الأنظمة الميدانية التي طورناها لعملائنا.',
      filter_all: 'جميع الأنظمة (6)',
      filter_crm: 'AI + CRM',
      filter_healthcare: 'الرعاية والعيادات',
      filter_automation: 'أتمتة المواعيد',
      filter_support: 'دعم العملاء الذكي',
      filter_business: 'العمليات الداخلية',
      filter_data: 'البيانات والتحليلات',
      systems_banner_title: 'هل تحتاج إلى نظام مخصص بالكامل لشركتك؟',
      systems_banner_desc: 'الأنظمة المعروضة أعلاه هي مجرد أمثلة على قدراتنا الهندسية. يمكننا تصميم وتطوير نظام مخصص بالكامل يحاكي إجراءاتك الخاصة.',
      systems_banner_btn: 'طلب دراسة وتصميم نظام',
      view_system_btn: 'عرض النظام',

      // Modal Details
      modal_close_aria: 'إغلاق تفاصيل النظام',
      modal_problem_title: 'التحدي والمشكلة (Problem)',
      modal_solution_title: 'الحل الذكي من Noviara (Solution)',
      modal_features_title: 'أهم الخصائص والمميزات (Key Features)',
      modal_tech_title: 'التقنيات المستخدمة (Technologies)',
      modal_roi_title: '⚡ الأثر التشغيلي والعائد (Business ROI)',
      modal_cta_heading: 'هل تريد نظامًا مشابهًا لشركتك؟',
      modal_cta_sub: 'يمكننا تخصيص هذا النظام وربطه مباشرة مع برمجياتك الحالية خلال أسابيع معدودة.',
      modal_cta_btn: 'احجز استشارة لهذا النظام',

      // Consultation Page
      consult_tag: 'استشارة تقنية مباشرة',
      consult_title_1: 'احجز',
      consult_title_2: 'استشارتك',
      consult_subtitle: 'أخبرنا عن مشروعك وسنتواصل معك لمناقشة أفضل حل مناسب لعملك وبناء خطة عمل واضحة.',
      form_name_label: 'الاسم الكامل',
      form_name_placeholder: 'مثال: عبدالله محمد',
      form_name_error: 'يرجى إدخال اسمك الكامل بشكل صحيح (3 أحرف على الأقل).',
      form_email_label: 'البريد الإلكتروني',
      form_email_placeholder: 'name@company.com',
      form_email_error: 'يرجى إدخال بريد إلكتروني صحيح (مثال: name@company.com).',
      form_phone_label: 'رقم الهاتف',
      form_phone_placeholder: '+966 5X XXX XXXX',
      form_phone_error: 'يرجى إدخال رقم هاتف صحيح مع مفتاح الدولة أو كود الاتصال.',
      form_company_label: 'اسم الشركة / العيادة',
      form_company_placeholder: 'مثال: شركة الأفق للرعاية',
      form_business_type_label: 'نوع النشاط',
      opt_select_industry: 'اختر مجال النشاط...',
      opt_clinic: 'عيادات ومراكز طبية',
      opt_company: 'شركة تجارية أو مهنية',
      opt_startup: 'شركة ناشئة (Startup)',
      opt_ecommerce: 'متجر إلكتروني',
      opt_consulting: 'مكتب استشارات',
      opt_realestate: 'عقارات وإدارة أملاك',
      opt_other: 'قطاع آخر',
      form_solution_type_label: 'نوع الحل المطلوب',
      opt_select_solution: 'اختر الحل المرجو مناقشته...',
      opt_ai_automation: 'أتمتة العمليات بالذكاء الاصطناعي (AI Automation)',
      opt_crm: 'نظام إدارة العملاء الذكي (AI + CRM)',
      opt_clinic_system: 'نظام إدارة العيادات والمراكز الطبية',
      opt_scheduling: 'نظام أتمتة المواعيد والجدولة',
      opt_support_agent: 'وكيل خدمة العملاء الذكي (AI Support)',
      opt_internal_system: 'نظام إدارة داخلي مخصص (Internal ERP)',
      opt_analytics: 'نظام تحليلات وتقارير تنبؤية',
      opt_custom_solution: 'استشارة عامة لتحديد الحل الأنسب',
      form_details_label: 'تفاصيل المشروع والتحديات الحالية',
      form_details_placeholder: 'أخبرنا باختصار عن التحديات التي تواجهها في أعمالك الحالية أو النظام الذي ترغب في بنائه...',
      form_details_error: 'يرجى كتابة تفاصيل مشروعك (على الأقل 10 أحرف).',
      form_terms_text: 'أوافق على استخدام بياناتي للتواصل معي بخصوص طلب الاستشارة.',
      form_terms_error: 'يرجى الموافقة على شروط التواصل للمتابعة.',
      form_submit_btn: 'إرسال طلب الاستشارة',
      form_submitting_btn: 'جاري معالجة الطلب...',
      success_title: 'تم استلام طلبك بنجاح',
      success_desc: 'شكرًا لتواصلك مع Noviara. تم استلام تفاصيل مشروعك، وسيقوم أحد مهندسينا بدراستها والتواصل معك قريبًا لمناقشة أفضل خطة حلول تناسب عملك.',
      success_ref_label: 'رقم التذكرة المرجعي:',
      success_reset_btn: 'إرسال طلب استشارة آخر',
      success_whatsapp_btn: 'متابعة فورية عبر واتساب',
      side_perk1_title: 'جلسة تحليل أولية مركزة',
      side_perk1_desc: 'نستمع إلى احتياجاتك ونحدد نقاط الاختناق اليدوية القابلة للأتمتة الفورية.',
      side_perk2_title: 'تصور معماري مخصص',
      side_perk2_desc: 'نقدم لك مقترحاً تقنياً واضحاً يوضح البنية الهندسية وتكلفة وعائد الاستثمار (ROI).',
      side_perk3_title: 'سرية بيانات والتزام تام',
      side_perk3_desc: 'بيانات عملك وأفكارك محمية باتفاقيات سرية مهنية غير قابلة للمساومة.',
      side_direct_contact_title: 'تفضل التواصل المباشر عبر البريد؟',
      side_direct_contact_sub: 'يمكنك مراسلتنا في أي وقت على',
      systems_impact_note: 'مؤسسة خيرية أو غير ربحية؟ جميع الأنظمة والاستشارات مجانية بالكامل 100%.',

      // Footer
      footer_desc: 'حلول ذكية للأعمال تعتمد على الأتمتة والذكاء الاصطناعي. نساعد الشركات على بناء أنظمة داخلية قوية ومسارات عمل مؤتمتة تقود النمو.',
      footer_col_pages: 'الصفحات',
      footer_col_systems: 'الأنظمة الذكية',
      footer_crm: 'إدارة العملاء AI CRM',
      footer_clinic: 'أنظمة العيادات الطبية',
      footer_scheduling: 'أتمتة المواعيد والجدولة',
      footer_support: 'وكيل الدعم الفني الذكي',
      footer_erp: 'إدارة العمليات الداخلية',
      footer_col_contact: 'التواصل والموقع',
      footer_rights: '© 2026 Noviara. جميع الحقوق محفوظة.',
      footer_copy: '© 2026 Noviara. جميع الحقوق محفوظة.',
      footer_designed: 'مصمم ومطور بأعلى معايير الويب الحديثة لنظم الأعمال الذكية.',
      footer_standards: 'مصمم ومطور بأعلى معايير الويب الحديثة لنظم الأعمال الذكية.'
    },

    en: {
      // Accessibility & Brand
      skip_link: 'Skip to main content',
      brand_title: 'Noviara Home Page',
      brand_name: 'Noviara',

      // Navigation
      nav_home: 'Home',
      nav_systems: 'Systems',
      nav_consultation: 'Book Consultation',
      nav_cta_mobile: 'Book Your Consultation Now',
      nav_aria: 'Primary Navigation',
      mobile_toggle_aria: 'Open main navigation menu',

      // Language Switcher
      lang_ar: 'عربي',
      lang_en: 'EN',
      lang_switch_aria: 'Switch language to Arabic',

      // Home Hero Section
      hero_title_1: 'We Transform Your Business into',
      hero_title_2: 'Intelligent Systems That Work Efficiently',
      hero_desc: 'We help enterprises and clinics automate operations, engineer custom business systems, and integrate AI into their daily workflow for exponential speed and efficiency.',
      hero_cta_primary: 'Start Your Project',
      hero_cta_secondary: 'Explore Systems',
      hero_metric_1_lbl: 'Automated Workflow Precision',
      hero_metric_2_lbl: 'Process Execution Acceleration',
      hero_metric_3_lbl: 'Uninterrupted Operation',

      // Services Section
      services_tag: 'Capabilities & Solutions',
      services_title_1: 'What Can We',
      services_title_2: 'Build For You?',
      services_subtitle: 'A comprehensive suite of modern engineering solutions built to accelerate high-performing enterprises and professional clinics.',
      service1_title: 'AI Business Automation',
      service1_desc: 'Transforming complex, recurring operations into smart automated workflows that make precision decisions based on your real-time company data.',
      service2_title: 'Custom Enterprise Systems',
      service2_desc: 'Engineering dedicated management platforms and internal operations portals from the ground up, built specifically for your sector requirements.',
      service3_title: 'AI Customer Support Agents',
      service3_desc: 'Autonomous AI agents trained on your proprietary knowledge base, answering customer inquiries 24/7 with deep context and dialect fluency.',
      service4_title: 'CRM Pipeline Automation',
      service4_desc: 'Connecting sales funnels and automated follow-ups, qualifying inbound leads, and routing them to the right reps without losing high-value deals.',
      service5_title: 'Appointment & Booking Automation',
      service5_desc: 'Intelligent multi-calendar booking engines that prevent double-booking and automate pre-appointment reminders to slash no-show rates.',
      service6_title: 'AI Agents & Unified APIs',
      service6_desc: 'Building autonomous multi-step AI agents that execute complex operations across your software stack, webhooks, and cloud databases.',

      // How It Works / Timeline
      timeline_tag: 'Our Methodology',
      timeline_title_1: 'How We',
      timeline_title_2: 'Work',
      timeline_subtitle: 'A disciplined engineering process ensuring the delivery of robust systems that create tangible business value from day one.',
      step1_title: 'We Understand Your Business',
      step1_desc: 'We deeply analyze your current operations, manual touchpoints, and structural bottlenecks to uncover high-impact opportunities.',
      step2_title: 'We Architect The Solution',
      step2_desc: 'We design the complete technical blueprint, data flows, and AI automation models tailored precisely to your targets.',
      step3_title: 'We Build & Integrate',
      step3_desc: 'We develop the system and seamlessly connect it with the software, databases, and cloud services your team already relies on.',
      step4_title: 'We Deploy & Optimize',
      step4_desc: 'We rigorously stress-test the solution, onboard your staff, and monitor live performance to guarantee peak operational reliability.',

      // Target Sectors
      sectors_tag: 'Target Industries',
      sectors_title_1: 'Solutions Engineered For',
      sectors_title_2: 'Diverse Sectors',
      sectors_subtitle: 'We build purpose-driven systems tailored to the operational realities and regulatory standards of each sector.',
      sector1_title: 'Clinics & Medical Centers',
      sector1_desc: 'Automated booking, digital health records & billing',
      sector2_title: 'Companies & Enterprises',
      sector2_desc: 'Internal management platforms & operations flows',
      sector3_title: 'E-Commerce Brands',
      sector3_desc: 'Order tracking, automated fulfillment & smart support',
      sector4_title: 'Professional Service Firms',
      sector4_desc: 'Automated client onboarding & pipeline tracking',
      sector5_title: 'High-Growth Startups',
      sector5_desc: 'Rapid scalable software backends & internal tools',
      sector6_title: 'Consulting & Legal Offices',
      sector6_desc: 'Smart client scheduling, contracts & calendar sync',
      sector7_title: 'Real Estate & Properties',
      sector7_desc: 'Deal pipelines, lease management & buyer qualification',
      sector8_title: 'Education & Academies',
      sector8_desc: 'Student enrollment, certificates & automated messaging',

      // Custom Tailored Banner
      banner_title: 'We Engineer Around Your Business',
      banner_desc: "We never force generic, one-size-fits-all software. We listen, analyze, and build exactly what your organization requires to outpace competition.",
      banner_btn: 'Consult With Our Engineers',

      // Final CTA Section
      cta_title_1: 'Ready to Transform Your Business into',
      cta_title_2: 'An Intelligent Ecosystem?',
      cta_desc: "Let's explore together where artificial intelligence and automation can create immediate, measurable gains in your operational efficiency.",
      cta_btn: 'Book Your Consultation Now',

      // Systems Page
      systems_tag: 'Systems & Architecture Showcase',
      systems_title_1: 'Intelligent',
      systems_title_2: 'Systems',
      systems_subtitle: 'Digital solutions designed to make your operations smarter and more efficient. Explore production systems engineered for our clients.',
      filter_all: 'All Systems (6)',
      filter_crm: 'AI + CRM',
      filter_healthcare: 'Healthcare & Clinics',
      filter_automation: 'Scheduling Automation',
      filter_support: 'AI Customer Support',
      filter_business: 'Business Operations',
      filter_data: 'Data & Analytics',
      systems_banner_title: 'Do You Need A Fully Custom System For Your Company?',
      systems_banner_desc: 'The systems above represent our production capabilities. We can engineer and deploy a completely bespoke architecture tailored to your unique requirements.',
      systems_banner_btn: 'Request Custom System Architecture',
      view_system_btn: 'View System',

      // Modal Details
      modal_close_aria: 'Close system details',
      modal_problem_title: 'The Challenge & Problem',
      modal_solution_title: 'Noviara Intelligent Solution',
      modal_features_title: 'Key Features & Capabilities',
      modal_tech_title: 'Technologies & Architecture',
      modal_roi_title: '⚡ Operational ROI & Business Impact',
      modal_cta_heading: 'Want A Similar System For Your Business?',
      modal_cta_sub: 'We can adapt and deploy this system for your company and connect it directly with your existing software within weeks.',
      modal_cta_btn: 'Book Consultation For This System',

      // Consultation Page
      consult_tag: 'Direct Technical Consultation',
      consult_title_1: 'Book Your',
      consult_title_2: 'Consultation',
      consult_subtitle: 'Tell us about your project, and our engineers will connect with you to review your requirements and outline a tailored automation roadmap.',
      form_name_label: 'Full Name',
      form_name_placeholder: 'e.g. Alex Johnson',
      form_name_error: 'Please enter your full name correctly (at least 3 characters).',
      form_email_label: 'Business Email',
      form_email_placeholder: 'name@company.com',
      form_email_error: 'Please enter a valid business email (e.g. name@company.com).',
      form_phone_label: 'Phone Number',
      form_phone_placeholder: '+1 (555) 000-0000',
      form_phone_error: 'Please enter a valid phone number including country/area code.',
      form_company_label: 'Company / Clinic Name',
      form_company_placeholder: 'e.g. Apex Health Enterprises',
      form_business_type_label: 'Industry / Sector',
      opt_select_industry: 'Select industry sector...',
      opt_clinic: 'Clinics & Healthcare Centers',
      opt_company: 'Commercial or Professional Enterprise',
      opt_startup: 'Technology Startup',
      opt_ecommerce: 'E-Commerce & Retail',
      opt_consulting: 'Consulting & Advisory Firm',
      opt_realestate: 'Real Estate & Properties',
      opt_other: 'Other Sector',
      form_solution_type_label: 'Requested Solution',
      opt_select_solution: 'Select solution type to discuss...',
      opt_ai_automation: 'AI Business Process Automation',
      opt_crm: 'Intelligent Customer Management (AI + CRM)',
      opt_clinic_system: 'Smart Clinic Management System',
      opt_scheduling: 'Appointment & Scheduling Automation',
      opt_support_agent: 'AI Customer Support Agent',
      opt_internal_system: 'Custom Internal Operations ERP',
      opt_analytics: 'Predictive Data & Analytics System',
      opt_custom_solution: 'General Consultation to Evaluate Needs',
      form_details_label: 'Project Details & Current Challenges',
      form_details_placeholder: 'Briefly describe your current operational challenges or the system you would like to build...',
      form_details_error: 'Please provide project details (at least 10 characters).',
      form_terms_text: 'I agree to the use of my contact information to communicate regarding this consultation request.',
      form_terms_error: 'Please agree to the communication terms to proceed.',
      form_submit_btn: 'Submit Consultation Request',
      form_submitting_btn: 'Processing Request...',
      success_title: 'Your Request Has Been Received Successfully',
      success_desc: 'Thank you for contacting Noviara. Your project details have been received, and one of our engineers will evaluate your request and contact you shortly.',
      success_ref_label: 'Reference Ticket Code:',
      success_reset_btn: 'Submit Another Request',
      success_whatsapp_btn: 'Immediate WhatsApp Follow-up',
      side_perk1_title: 'Focused Technical Analysis',
      side_perk1_desc: 'We analyze your workflows to identify high-leverage bottlenecks ready for immediate automation.',
      side_perk2_title: 'Custom Architecture Blueprint',
      side_perk2_desc: 'We present a transparent engineering proposal outlining system design, timeline, and projected ROI.',
      side_perk3_title: 'Strict Data Confidentiality',
      side_perk3_desc: 'Your operational data, source files, and workflows are protected by strict professional non-disclosure terms.',
      side_direct_contact_title: 'Prefer Direct Email Communication?',
      side_direct_contact_sub: 'You can reach our engineering team anytime at',
      systems_impact_note: 'Charity or Non-Profit organization? All systems and consultations are 100% free pro-bono.',

      // Footer
      footer_desc: 'Intelligent business solutions powered by automation and artificial intelligence. We help companies engineer robust internal platforms and automated pipelines that drive scalable growth.',
      footer_col_pages: 'Navigation',
      footer_col_systems: 'Smart Systems',
      footer_crm: 'AI CRM Customer Management',
      footer_clinic: 'Smart Clinic Systems',
      footer_scheduling: 'Appointment Automation',
      footer_support: 'AI Support Agent',
      footer_erp: 'Operations Management ERP',
      footer_col_contact: 'Contact & Domain',
      footer_rights: '© 2026 Noviara. All rights reserved.',
      footer_copy: '© 2026 Noviara. All rights reserved.',
      footer_designed: 'Engineered to modern web standards for intelligent business systems.',
      footer_standards: 'Engineered to modern web standards for intelligent business systems.'
    }
  };

  // --- Translation Engine Methods ---
  function getLanguage() {
    // Priority 1: URL Query parameter (?lang=en or ?lang=ar)
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const urlLang = urlParams.get('lang');
      if (urlLang === 'en' || urlLang === 'ar') {
        return urlLang;
      }
    } catch (e) {}

    // Priority 2: localStorage
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('language');
      if (saved === 'en' || saved === 'ar') return saved;
    } catch (e) {}

    // Priority 3: sessionStorage
    try {
      const sessionSaved = sessionStorage.getItem(STORAGE_KEY);
      if (sessionSaved === 'en' || sessionSaved === 'ar') return sessionSaved;
    } catch (e) {}

    // Priority 4: Cookie
    try {
      const match = document.cookie.match(/(?:^|;\s*)noviara_language=([^;]+)/);
      if (match && (match[1] === 'en' || match[1] === 'ar')) {
        return match[1];
      }
    } catch (e) {}

    // Priority 5: Document element lang
    if (document.documentElement.lang === 'en' || document.documentElement.lang === 'ar') {
      return document.documentElement.lang;
    }

    return 'ar';
  }

  function updateInternalLinks(lang) {
    try {
      const targetLang = (lang === 'en') ? 'en' : 'ar';
      const links = document.querySelectorAll('a[href]');
      links.forEach((link) => {
        const rawHref = link.getAttribute('href');
        if (!rawHref) return;

        // Skip external, protocol, anchor-only, or javascript links
        if (
          rawHref.startsWith('http://') ||
          rawHref.startsWith('https://') ||
          rawHref.startsWith('mailto:') ||
          rawHref.startsWith('tel:') ||
          rawHref.startsWith('#') ||
          rawHref.startsWith('javascript:')
        ) {
          return;
        }

        // Only target internal page navigation
        const isInternalPage = rawHref.includes('.html') || rawHref.endsWith('/') || rawHref === '.';
        if (!isInternalPage) return;

        const [urlPart, hashPart] = rawHref.split('#');
        const [basePath, searchPart] = urlPart.split('?');
        const params = new URLSearchParams(searchPart || '');

        // Explicitly set language query parameter for both Arabic and English
        params.set('lang', targetLang);

        const queryStr = '?' + params.toString();
        const hashStr = hashPart !== undefined ? '#' + hashPart : '';
        link.setAttribute('href', basePath + queryStr + hashStr);
      });
    } catch (e) {
      console.warn('[i18n] Link update failed:', e);
    }
  }

  function setLanguage(lang) {
    if (lang !== 'ar' && lang !== 'en') lang = 'ar';

    // 1. Persist across all browser storage layers
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    try { localStorage.setItem('language', lang); } catch (e) {}
    try { sessionStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    try { document.cookie = `noviara_language=${lang}; path=/; max-age=31536000; SameSite=Lax`; } catch (e) {}

    // 2. Synchronize URL query parameter without page reload
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('lang', lang);
      window.history.replaceState(null, '', url.toString());
    } catch (e) {}

    // 3. Broadcast to other open tabs/windows
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        const bc = new BroadcastChannel('noviara_i18n_sync');
        bc.postMessage({ lang });
        bc.close();
      }
    } catch (e) {}

    const dict = translations[lang] || translations.ar;

    // 4. Update HTML tag attributes
    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === 'en' ? 'ltr' : 'rtl');

    // 5. Update text content for [data-i18n]
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) {
        el.textContent = dict[key];
      }
    });

    // 6. Update HTML content for [data-i18n-html]
    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const key = el.getAttribute('data-i18n-html');
      if (dict[key] !== undefined) {
        el.innerHTML = dict[key];
      }
    });

    // 7. Update placeholders for [data-i18n-placeholder]
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key] !== undefined) {
        el.setAttribute('placeholder', dict[key]);
      }
    });

    // 8. Update aria-labels for [data-i18n-aria]
    document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      const key = el.getAttribute('data-i18n-aria');
      if (dict[key] !== undefined) {
        el.setAttribute('aria-label', dict[key]);
      }
    });

    // 9. Update language switcher button states
    updateSwitcherButtons(lang);

    // 10. Update internal links so clicking between pages preserves selected language
    updateInternalLinks(lang);

    // 11. Dynamic Page Title and Meta Description (Solution #7)
    try {
      const pagePath = window.location.pathname.split('/').pop().toLowerCase();
      let pageKey = 'home';
      if (pagePath.includes('systems')) pageKey = 'systems';
      else if (pagePath.includes('consultation')) pageKey = 'consultation';

      const metaTranslations = {
        ar: {
          home: {
            title: 'Noviara | حلول الأتمتة والذكاء الاصطناعي للأعمال',
            desc: 'Noviara تقدم حلول الأتمتة الذكية، بناء الأنظمة المخصصة، ودمج الذكاء الاصطناعي لمساعدة الشركات والعيادات على تطوير أعمالها.'
          },
          systems: {
            title: 'الأنظمة الذكية | Noviara',
            desc: 'استكشف أنظمة Noviara الذكية: حلول رقمية مؤتمتة لإدارة العملاء، العيادات، العمليات، وخدمة العملاء بالذكاء الاصطناعي.'
          },
          consultation: {
            title: 'احجز استشارتك | Noviara',
            desc: 'احجز استشارة تقنية مخصصة مع فريق Noviara لمناقشة أتمتة أعمالك وبناء أنظمة ذكية تعتمد على الذكاء الاصطناعي.'
          }
        },
        en: {
          home: {
            title: 'Noviara | AI & Intelligent Automation for Business',
            desc: 'Noviara delivers intelligent automation, custom software systems, and AI integration to accelerate enterprises and professional clinics.'
          },
          systems: {
            title: 'Smart Systems | Noviara',
            desc: "Explore Noviara's intelligent production systems: CRM automation, healthcare platforms, smart scheduling, and 24/7 AI support agents."
          },
          consultation: {
            title: 'Book Your Consultation | Noviara',
            desc: 'Schedule a dedicated technical consultation with Noviara engineers to review your workflows and design a custom AI automation roadmap.'
          }
        }
      };

      const currentMeta = metaTranslations[lang] && metaTranslations[lang][pageKey];
      if (currentMeta) {
        document.title = currentMeta.title;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', currentMeta.desc);
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute('content', currentMeta.title);
        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) ogDesc.setAttribute('content', currentMeta.desc);
      }
    } catch (e) {
      console.warn('[i18n] Meta update error:', e);
    }

    // 12. Dispatch global event for modular components (systems.js, form.js)
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang, dict } }));
  }

  function toggleLanguage() {
    const current = getLanguage();
    setLanguage(current === 'ar' ? 'en' : 'ar');
  }

  function updateSwitcherButtons(lang) {
    document.querySelectorAll('.lang-switcher').forEach((switcher) => {
      const arBtn = switcher.querySelector('.lang-btn-ar');
      const enBtn = switcher.querySelector('.lang-btn-en');
      if (arBtn && enBtn) {
        if (lang === 'ar') {
          arBtn.classList.add('active');
          enBtn.classList.remove('active');
          switcher.setAttribute('aria-label', translations.ar.lang_switch_aria);
        } else {
          enBtn.classList.add('active');
          arBtn.classList.remove('active');
          switcher.setAttribute('aria-label', translations.en.lang_switch_aria);
        }
      }
    });
  }

  function initSwitcherListeners() {
    document.querySelectorAll('.lang-switcher').forEach((switcher) => {
      const arBtn = switcher.querySelector('.lang-btn-ar');
      const enBtn = switcher.querySelector('.lang-btn-en');

      if (arBtn) {
        arBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          setLanguage('ar');
        });
      }

      if (enBtn) {
        enBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          setLanguage('en');
        });
      }

      switcher.addEventListener('click', (e) => {
        if (e.target !== arBtn && e.target !== enBtn) {
          toggleLanguage();
        }
      });
    });
  }

  // Intercept all internal link clicks dynamically to ensure target url always carries ?lang=...
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const rawHref = link.getAttribute('href');
    if (!rawHref) return;

    if (
      rawHref.startsWith('http://') ||
      rawHref.startsWith('https://') ||
      rawHref.startsWith('mailto:') ||
      rawHref.startsWith('tel:') ||
      rawHref.startsWith('#') ||
      rawHref.startsWith('javascript:')
    ) return;

    const isInternalPage = rawHref.includes('.html') || rawHref.endsWith('/') || rawHref === '.';
    if (!isInternalPage) return;

    const activeLang = document.documentElement.lang === 'en' ? 'en' : 'ar';
    const [urlPart, hashPart] = rawHref.split('#');
    const [basePath, searchPart] = urlPart.split('?');
    const params = new URLSearchParams(searchPart || '');
    params.set('lang', activeLang);
    const queryStr = '?' + params.toString();
    const hashStr = hashPart !== undefined ? '#' + hashPart : '';
    link.setAttribute('href', basePath + queryStr + hashStr);
  }, { capture: true });

  // Cross-tab real-time listener via BroadcastChannel
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel('noviara_i18n_sync');
      channel.onmessage = (event) => {
        if (event.data && (event.data.lang === 'ar' || event.data.lang === 'en')) {
          if (event.data.lang !== document.documentElement.lang) {
            setLanguage(event.data.lang);
          }
        }
      };
    }
  } catch (e) {}

  // Cross-tab fallback via storage event
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY || e.key === 'language') {
      if (e.newValue === 'ar' || e.newValue === 'en') {
        if (e.newValue !== document.documentElement.lang) {
          setLanguage(e.newValue);
        }
      }
    }
  });

  // Re-synchronize when tab gains focus or visibility
  function syncOnTabActive() {
    const targetLang = getLanguage();
    if (targetLang && targetLang !== document.documentElement.lang) {
      setLanguage(targetLang);
    }
  }
  window.addEventListener('visibilitychange', () => {
    if (!document.hidden) syncOnTabActive();
  });
  window.addEventListener('focus', syncOnTabActive);

  // --- Initial Setup: Instant Execution without waiting for DOMContentLoaded ---
  const initialLang = getLanguage();
  setLanguage(initialLang);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initSwitcherListeners();
      updateInternalLinks(getLanguage());
    });
  } else {
    initSwitcherListeners();
  }

  // Expose API
  window.NoviaraI18n = {
    getLanguage,
    setLanguage,
    toggleLanguage,
    translations,
    updateInternalLinks,
    t: (key, fallback = '') => {
      const lang = getLanguage();
      return (translations[lang] && translations[lang][key]) || fallback;
    }
  };
})();
