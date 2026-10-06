import type { ServiceLocaleContent } from '../index';

const en: ServiceLocaleContent = {
  ui: {
    home: 'Home',
    services: 'Services',
    service: 'Service',
    howWeWork: 'See how we work',
    freeNote: 'Discovery and scope are free',
    included: "What's included",
    problemsLabel: 'Sounds familiar?',
    buildLabel: 'What we build',
    stepsLabel: 'How it works',
    free: {
      title: 'Discovery and scope are free.',
      body: 'We meet your team, map the problem and write the scope, timeline and price into a contract proposal, at no cost. Everything we prepare is handed over once the contract is signed.',
    },
    whyLabel: 'Why Adapto',
    whyTitle: 'Built with you, not just for you.',
    faqLabel: 'FAQ',
    faqTitle: 'Questions, answered.',
    otherLabel: 'Other services',
    otherTitle: 'Everything works better together.',
    learnMore: 'Learn more',
  },
  services: {
    'custom-software': {
      metaTitle: 'Custom Software Development in Vancouver | Adapto',
      metaDescription:
        'Custom ERPs, CRMs, internal tools and web apps built around how your team works. Free discovery, then a fixed scope, timeline and price. Vancouver, Canada.',
      name: 'Custom software development',
      title: 'Custom software',
      titleAccent: 'built around your team.',
      lead: 'ERPs, CRMs, internal tools and full web applications designed around the way your company already works, not the other way around. One system that fits your process, your people and your growth.',
      problems: {
        title: 'When off-the-shelf tools start working against you.',
        items: [
          'Your team copies the same data between three or four tools every day.',
          'Critical processes live in spreadsheets only one person understands.',
          'You pay for software built for a generic company and use a fraction of it.',
          'Every workaround adds a step, and every new hire takes longer to train.',
          "You can't see how the business is doing without asking around.",
        ],
      },
      build: {
        title: 'Systems shaped by your process.',
        items: [
          {
            title: 'Internal tools',
            description:
              'Back-office apps for the tasks your team repeats every day: approvals, scheduling, requests, inventory.',
          },
          {
            title: 'ERPs',
            description:
              'Inventory, purchasing, sales and finance in one place, modelled on how your operation actually runs.',
          },
          {
            title: 'CRMs & client portals',
            description:
              'Track leads, clients and projects your way, and give clients a secure place to follow their work.',
          },
          {
            title: 'Web applications',
            description:
              'Full products for your customers or partners, from the first version to the ones that follow.',
          },
          {
            title: 'Legacy modernization',
            description:
              'Replace the old system everyone is afraid to touch, and move your data without stopping the business.',
          },
          {
            title: 'Roles & permissions',
            description:
              'Each person sees and does exactly what their role needs, with a full history of every change.',
          },
        ],
      },
      steps: {
        title: 'From your workflow to working software.',
        items: [
          {
            title: 'Map the operation',
            description:
              'We sit with the people who do the work and document every step, exception and handoff.',
          },
          {
            title: 'Design the system',
            description:
              'Data model, screens and permissions drawn from that map. You approve them before we build.',
          },
          {
            title: 'Build in sprints',
            description:
              'Working software every sprint, daily and weekly updates, and every milestone in the Tracker.',
          },
          {
            title: 'Launch & support',
            description:
              'Data migration, training and documentation, then a warranty period and ongoing support if you want it.',
          },
        ],
      },
      faq: [
        {
          q: 'How much does custom software cost?',
          a: 'It depends on the scope, which is why we define it first. Discovery and scope are free, and the contract states the exact price and timeline before any code is written.',
        },
        {
          q: 'How long does it take?',
          a: 'Small internal tools are measured in weeks; larger systems are delivered in phases over months. The timeline is set in your contract, and you see working software every sprint.',
        },
        {
          q: 'Can it work with the tools we already use?',
          a: "Yes. Custom software doesn't have to replace everything. We can connect it to your accounting, e-commerce or payment tools, or replace them gradually.",
        },
        {
          q: 'Can we start small?',
          a: 'Yes. Many projects start with the one process that hurts most. The architecture is planned so the system can grow module by module.',
        },
        {
          q: 'What happens after launch?',
          a: 'You get technical and user documentation, training for your team and a warranty period. After that, we can keep evolving the system with you, or hand it over to your own team.',
        },
      ],
    },

    websites: {
      metaTitle: 'Website & Landing Page Development in Vancouver | Adapto',
      metaDescription:
        'Fast, bilingual-ready websites, landing pages, online stores and client portals your team can update, built to be found and to turn visitors into clients.',
      name: 'Website and landing page development',
      title: 'Websites',
      titleAccent: 'that turn visitors into conversations.',
      lead: 'Institutional websites, landing pages, online stores and client portals. Fast on any connection, ready for English and French, easy for your team to update and built to be found on Google.',
      problems: {
        title: "When your website isn't pulling its weight.",
        items: [
          'It takes seconds to load on a phone, and visitors leave before it does.',
          'Changing a sentence means calling a developer.',
          "It doesn't show up when clients search for what you do.",
          "It no longer looks like the company you've become.",
          'People visit, but very few get in touch.',
        ],
      },
      build: {
        title: 'Sites built to perform.',
        items: [
          {
            title: 'Institutional websites',
            description:
              'Your company, services and story, told clearly and designed to match your brand.',
          },
          {
            title: 'Landing pages',
            description:
              'Focused pages for a campaign, product or service, built around one clear action.',
          },
          {
            title: 'Online stores',
            description:
              'Catalogue, checkout and payments, connected to your stock and your accounting.',
          },
          {
            title: 'Client portals',
            description:
              'A private area where your clients follow orders, documents or projects.',
          },
          {
            title: 'Bilingual by design',
            description:
              'English and French from the start, each at its own address and tagged for search engines.',
          },
          {
            title: 'SEO & performance',
            description:
              'Clean structure, structured data and fast loading: the foundations Google looks for.',
          },
        ],
      },
      steps: {
        title: 'From brief to launch.',
        items: [
          {
            title: 'Understand the goal',
            description:
              'Who the site is for, what they need to find and what you want them to do next.',
          },
          {
            title: 'Structure & design',
            description:
              'Site map, content and layouts in your visual identity. You approve them before development.',
          },
          {
            title: 'Build & optimise',
            description:
              'Fast, accessible, responsive pages, with an editor your team can actually use.',
          },
          {
            title: 'Launch & measure',
            description:
              'Domain, analytics and search setup, then adjustments based on how visitors really use the site.',
          },
        ],
      },
      faq: [
        {
          q: 'Will we be able to update the site ourselves?',
          a: 'Yes. Where it makes sense we set up an editor so your team can change text, images and pages without touching code, and we train whoever will maintain it.',
        },
        {
          q: 'Can the site be in English and French?',
          a: 'Yes. We build bilingual sites from the start, with each language at its own address and tagged so search engines show the right version.',
        },
        {
          q: 'Will our site show up on Google?',
          a: "We build the technical foundations search engines rely on: speed, structure, metadata and structured data. Rankings also depend on content and competition, so we'll tell you honestly what to expect.",
        },
        {
          q: 'Do you redesign existing websites?',
          a: 'Yes. We keep what works, rebuild what doesn’t and move your content over without losing the addresses Google already knows.',
        },
        {
          q: 'Can the site connect to our other tools?',
          a: 'Yes: forms to your CRM or inbox, stores to your stock and accounting, portals to your internal systems.',
        },
      ],
    },

    'ai-integration': {
      metaTitle: 'AI Integration for Businesses in Vancouver | Adapto',
      metaDescription:
        'Put AI to work in your operation: assistants on your own data, document and email processing, smart triage and copilots in the tools your team already uses.',
      name: 'AI integration',
      title: 'AI integration',
      titleAccent: 'that works inside your operation.',
      lead: 'Assistants that answer from your own data, automatic reading of documents and emails, smart triage and copilots inside the tools your team already uses. Practical, secure and measured against real results.',
      problems: {
        title: 'When your team spends the day on work a machine could read.',
        items: [
          'Someone reads every incoming email just to decide who should handle it.',
          'Data from invoices, forms and PDFs is typed in by hand.',
          'Clients and staff ask the same questions over and over.',
          "Knowledge sits in documents nobody can find when they need them.",
          'You tried a chatbot, and it made things up.',
        ],
      },
      build: {
        title: 'AI where it pays off.',
        items: [
          {
            title: 'Assistants on your data',
            description:
              'Answers drawn from your own documents, policies and systems, with sources your team can check.',
          },
          {
            title: 'Document processing',
            description:
              'Invoices, contracts and forms read automatically, with the data sent where it belongs.',
          },
          {
            title: 'Email & request triage',
            description:
              'Incoming messages classified, summarised and routed to the right person or system.',
          },
          {
            title: 'Copilots in your tools',
            description:
              'Drafting, summarising and searching inside the software your team already uses.',
          },
          {
            title: 'AI agents',
            description:
              'Multi-step tasks carried out across your systems, with a person approving what matters.',
          },
          {
            title: 'Security & privacy',
            description:
              'Clear rules on what the AI can see, where it is processed and what gets logged.',
          },
        ],
      },
      steps: {
        title: 'From idea to measurable results.',
        items: [
          {
            title: 'Find the right use case',
            description:
              'We look for the tasks where AI saves real time, and tell you when a simpler solution works better.',
          },
          {
            title: 'Prototype on your data',
            description:
              'A small working version with your real documents, so you see the quality before committing.',
          },
          {
            title: 'Integrate & secure',
            description:
              'Connected to your systems, with access controls, logging and a person in the loop where needed.',
          },
          {
            title: 'Measure & improve',
            description:
              'We track accuracy and time saved, and keep tuning once your team is using it.',
          },
        ],
      },
      faq: [
        {
          q: 'Is our data safe?',
          a: "We define upfront which data the AI can access, where it is processed and how long anything is kept, and we use provider settings that don't use your data to train their models. Sensitive steps can always require a person's approval.",
        },
        {
          q: 'Will the AI make things up?',
          a: "Assistants are built to answer from your own sources and show where each answer came from. When the information isn't there, they say so instead of guessing, and we test this before launch.",
        },
        {
          q: 'Do we need a lot of data to start?',
          a: 'No. Most projects use the documents and systems you already have, and the prototype shows early whether that is enough.',
        },
        {
          q: 'Which AI models do you use?',
          a: 'We pick the model for the job, based on quality, cost and privacy requirements, and design the integration so it can switch models later without a rebuild.',
        },
        {
          q: 'How do we know it is worth it?',
          a: 'Before we build, we agree on what success looks like, such as hours saved or response time, and we measure it after launch.',
        },
      ],
    },

    automation: {
      metaTitle: 'Business Process Automation in Vancouver | Adapto',
      metaDescription:
        "Reports, approvals and data entry replaced by automations that run on their own. We map your team's repetitive work and automate it end to end.",
      name: 'Business process automation',
      title: 'Automation',
      titleAccent: 'that runs while you sleep.',
      lead: "We map your team's repetitive work (reports, approvals, data entry, follow-ups) and replace it with quiet automations that run on their own, so your people can focus on the work that needs them.",
      problems: {
        title: 'When your team is busy, but not on what matters.',
        items: [
          'Weekly reports are rebuilt by hand from the same sources.',
          "Approvals wait in someone's inbox for days.",
          'Data is retyped from one system into another, with errors along the way.',
          'Follow-ups depend on someone remembering to send them.',
          'Growing means hiring just to keep up with admin.',
        ],
      },
      build: {
        title: 'What we automate.',
        items: [
          {
            title: 'Reports',
            description:
              'Generated and delivered on schedule from live data, without anyone copying numbers.',
          },
          {
            title: 'Approvals',
            description:
              'Requests routed to the right person, with reminders, deadlines and a full history.',
          },
          {
            title: 'Data entry & sync',
            description:
              'Information moves between your systems on its own, checked along the way.',
          },
          {
            title: 'Notifications & follow-ups',
            description:
              'Clients and staff get the right message at the right moment, automatically.',
          },
          {
            title: 'Document generation',
            description:
              'Quotes, contracts and invoices filled in from your data, ready to send.',
          },
          {
            title: 'Monitoring & alerts',
            description:
              'You hear about a problem when it happens, not when a client complains.',
          },
        ],
      },
      steps: {
        title: 'From manual to automatic.',
        items: [
          {
            title: 'Map the routine',
            description:
              'We follow the work as it happens today and measure where the hours go.',
          },
          {
            title: 'Prioritise',
            description:
              'We start with the automations that save the most time for the least effort.',
          },
          {
            title: 'Build & test',
            description:
              'Each workflow runs alongside the manual process until you trust the results.',
          },
          {
            title: 'Monitor',
            description:
              'Logs and alerts on every automation, so nothing ever fails silently.',
          },
        ],
      },
      faq: [
        {
          q: 'What kind of tasks can be automated?',
          a: 'Anything repetitive with clear rules: reports, approvals, moving data between systems, reminders, document generation. When a task needs judgement, we can still automate the steps around it.',
        },
        {
          q: 'Do we need to change our current tools?',
          a: "Usually not. We connect the tools you already use, and if one can't be connected, we explain the options.",
        },
        {
          q: 'What happens when an automation fails?',
          a: 'Every workflow is logged and monitored. If something breaks, the right person is alerted with the details needed to fix it, and no data is lost.',
        },
        {
          q: 'When will we see results?',
          a: 'We start with the automations that save the most time, so the first gains come early in the project. The plan and timeline are in your contract.',
        },
        {
          q: 'Is automation only for large companies?',
          a: 'No. Small teams often gain the most, because every hour of admin falls on the same few people.',
        },
      ],
    },

    dashboards: {
      metaTitle: 'Business Dashboards & Reporting in Vancouver | Adapto',
      metaDescription:
        'Real-time dashboards for sales, stock, operations and people, built from your own systems. Stop relying on gut feeling and month-old spreadsheets.',
      name: 'Dashboards and reporting',
      title: 'Dashboards',
      titleAccent: 'for decisions, not guesses.',
      lead: 'Real-time views of what matters to your business (sales, stock, operations, people), built from the systems you already use. Your decisions stop relying on gut feeling and month-old spreadsheets.',
      problems: {
        title: "When you're running the business half blind.",
        items: [
          'Getting one simple number means asking someone to build a spreadsheet.',
          'Each department reports a different version of the same figure.',
          'You find out about a problem weeks after it started.',
          "Your data lives in five systems that don't talk to each other.",
          'Meetings are spent debating numbers instead of making decisions.',
        ],
      },
      build: {
        title: 'Visibility, built for how you decide.',
        items: [
          {
            title: 'Executive dashboards',
            description:
              'The handful of numbers that tell you how the business is doing, on one screen.',
          },
          {
            title: 'Sales & pipeline',
            description:
              'Revenue, conversion and forecasts, by team, product or region.',
          },
          {
            title: 'Stock & operations',
            description:
              'Inventory, orders and delivery times, updated as they change.',
          },
          {
            title: 'People & capacity',
            description:
              'Workload, capacity and goals, so you can plan before it becomes urgent.',
          },
          {
            title: 'Scheduled reports',
            description:
              'The same data delivered by email on a schedule, for those who prefer it.',
          },
          {
            title: 'Alerts',
            description:
              'Thresholds that warn you the moment a number goes the wrong way.',
          },
        ],
      },
      steps: {
        title: 'From scattered data to one clear view.',
        items: [
          {
            title: 'Define the questions',
            description:
              'We start from the decisions you make, not from whatever data happens to exist.',
          },
          {
            title: 'Connect the sources',
            description:
              'Sales, finance, stock and spreadsheets brought together and cleaned up.',
          },
          {
            title: 'Design the views',
            description:
              'Clear charts that answer each question at a glance, on desktop and phone.',
          },
          {
            title: 'Adopt & refine',
            description:
              'We train your team and adjust the dashboards as new questions come up.',
          },
        ],
      },
      faq: [
        {
          q: 'Can you use data from our current systems?',
          a: 'Yes. We connect to the databases, spreadsheets and tools you already use, including accounting, e-commerce and CRM platforms, and keep them in sync.',
        },
        {
          q: 'Do the dashboards update in real time?',
          a: 'They can. Some numbers need to be live, others are fine updated daily. We set each one to what the decision behind it requires.',
        },
        {
          q: 'Can we see them on a phone?',
          a: 'Yes. Every dashboard is designed to work on desktop and mobile.',
        },
        {
          q: 'Who can see what?',
          a: 'Access is set by role, so each person sees the numbers that matter for their work.',
        },
        {
          q: 'What if our data is messy?',
          a: "That's common. Cleaning and organising the data is part of the project, and it often reveals problems worth fixing on their own.",
        },
      ],
    },

    integrations: {
      metaTitle: 'Systems Integration & APIs in Vancouver | Adapto',
      metaDescription:
        'Connect your accounting, e-commerce, logistics and payment tools into one consistent operation, with APIs, webhooks and sync that keep your data in step.',
      name: 'Systems integration',
      title: 'Integrations',
      titleAccent: 'that make your tools work as one.',
      lead: 'Connect the tools your company already uses (accounting, e-commerce, logistics, payments) into one consistent operation, where data is entered once and arrives everywhere it is needed.',
      problems: {
        title: "When your tools don't talk to each other.",
        items: [
          'Orders are retyped from the store into the accounting system.',
          'Stock levels differ depending on which system you check.',
          'Payments are matched to invoices by hand.',
          'Every new tool adds one more place to update.',
          'Nobody is sure which system holds the right information.',
        ],
      },
      build: {
        title: 'Connections we build.',
        items: [
          {
            title: 'Accounting & finance',
            description:
              'Sales, invoices and payments flowing into your accounting automatically.',
          },
          {
            title: 'E-commerce & stock',
            description:
              'Orders, products and inventory in sync across your store and your back office.',
          },
          {
            title: 'Logistics & shipping',
            description:
              'Labels, tracking and delivery status connected to your orders.',
          },
          {
            title: 'Payments',
            description:
              'Payment providers connected to your invoices and your records.',
          },
          {
            title: 'Custom APIs',
            description:
              'A secure, documented API for your own system, so partners and other tools can connect to it.',
          },
          {
            title: 'Webhooks & sync',
            description:
              'Changes in one system reach the others within seconds, with retries when something fails.',
          },
        ],
      },
      steps: {
        title: 'From disconnected to in sync.',
        items: [
          {
            title: 'Map the data flow',
            description:
              'Which system owns which information, and where it needs to go.',
          },
          {
            title: 'Design the connections',
            description:
              'APIs, webhooks or scheduled sync, chosen for each flow and its limits.',
          },
          {
            title: 'Build with safeguards',
            description:
              'Validation, retries and logs, so a failure never corrupts your data.',
          },
          {
            title: 'Monitor',
            description:
              'Alerts when a connection stops, and a clear history of everything that moved.',
          },
        ],
      },
      faq: [
        {
          q: 'Which tools can you integrate?',
          a: "Most tools with an API or an export, including common accounting, e-commerce, shipping and payment platforms. If a tool has no API, we'll look at the alternatives with you.",
        },
        {
          q: 'What if one of the services goes down?',
          a: "Integrations are built to queue and retry. When the service comes back, the pending data goes through, and you're alerted if anything needs attention.",
        },
        {
          q: 'Will this replace our current tools?',
          a: 'No. Integration keeps the tools your team likes and makes them work together.',
        },
        {
          q: 'Is our data secure in transit?',
          a: 'Connections use encrypted channels and only the access each one needs. Credentials are stored securely, never in spreadsheets or emails.',
        },
        {
          q: 'Can you build an API for our own system?',
          a: 'Yes. We can design and document an API so partners, apps or other tools can connect to your system safely.',
        },
      ],
    },
  },
};

export default en;
