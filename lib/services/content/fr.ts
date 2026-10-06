import type { ServiceLocaleContent } from '../index';

// French typography: a non-breaking space ( ) before ? ! : ; so the
// mark never wraps onto a line of its own.
const fr: ServiceLocaleContent = {
  ui: {
    home: 'Accueil',
    services: 'Services',
    service: 'Service',
    howWeWork: 'Voir notre méthode',
    freeNote: 'Découverte et périmètre gratuits',
    included: 'Ce qui est inclus',
    problemsLabel: 'Ça vous parle ?',
    buildLabel: 'Ce que nous construisons',
    stepsLabel: 'Comment ça marche',
    free: {
      title: 'La découverte et le périmètre sont gratuits.',
      body: "Nous rencontrons votre équipe, cartographions le problème et inscrivons le périmètre, les délais et le prix dans une proposition de contrat, sans frais. Tout ce que nous préparons vous est remis une fois le contrat signé.",
    },
    whyLabel: 'Pourquoi Adapto',
    whyTitle: 'Construit avec vous, pas seulement pour vous.',
    faqLabel: 'FAQ',
    faqTitle: 'Vos questions, nos réponses.',
    otherLabel: 'Autres services',
    otherTitle: 'Tout fonctionne mieux ensemble.',
    learnMore: 'En savoir plus',
  },
  services: {
    'custom-software': {
      metaTitle: 'Développement de software sur mesure à Vancouver | Adapto',
      metaDescription:
        "ERP, CRM, outils internes et applications web conçus autour de votre équipe. Découverte gratuite, puis périmètre, délais et prix fixés au contrat.",
      name: 'Développement de software sur mesure',
      title: 'Un software sur mesure',
      titleAccent: 'conçu autour de votre équipe.',
      lead: "ERP, CRM, outils internes et applications web complètes, conçus autour de la façon dont votre entreprise fonctionne déjà, et non l'inverse. Un seul système adapté à vos processus, à vos gens et à votre croissance.",
      problems: {
        title: 'Quand les outils génériques commencent à jouer contre vous.',
        items: [
          'Votre équipe recopie les mêmes données dans trois ou quatre outils chaque jour.',
          'Des processus critiques vivent dans des tableurs que seule une personne comprend.',
          "Vous payez un software pensé pour une entreprise générique et n'en utilisez qu'une fraction.",
          'Chaque contournement ajoute une étape, et chaque nouvelle recrue est plus longue à former.',
          "Impossible de savoir où en est l'entreprise sans poser la question à plusieurs personnes.",
        ],
      },
      build: {
        title: 'Des systèmes façonnés par vos processus.',
        items: [
          {
            title: 'Outils internes',
            description:
              "Des applications pour les tâches que votre équipe répète chaque jour : approbations, horaires, demandes, inventaire.",
          },
          {
            title: 'ERP',
            description:
              'Stocks, achats, ventes et finances au même endroit, modélisés sur le fonctionnement réel de votre opération.',
          },
          {
            title: 'CRM et portails clients',
            description:
              'Suivez prospects, clients et projets à votre façon, et offrez à vos clients un espace sécurisé pour suivre leurs dossiers.',
          },
          {
            title: 'Applications web',
            description:
              'Des produits complets pour vos clients ou partenaires, de la première version à celles qui suivent.',
          },
          {
            title: 'Modernisation de systèmes',
            description:
              "Remplacez le vieux système que personne n'ose toucher, et migrez vos données sans arrêter l'entreprise.",
          },
          {
            title: 'Rôles et permissions',
            description:
              'Chacun voit et fait exactement ce que son rôle exige, avec un historique complet des modifications.',
          },
        ],
      },
      steps: {
        title: 'De votre façon de travailler à un software qui fonctionne.',
        items: [
          {
            title: "Cartographier l'opération",
            description:
              'Nous passons du temps avec les gens qui font le travail et documentons chaque étape, exception et transfert.',
          },
          {
            title: 'Concevoir le système',
            description:
              'Modèle de données, écrans et permissions tirés de cette cartographie. Vous les validez avant que nous construisions.',
          },
          {
            title: 'Construire en sprints',
            description:
              'Du software fonctionnel à chaque sprint, des mises à jour quotidiennes et hebdomadaires, et chaque jalon dans le Tracker.',
          },
          {
            title: 'Lancement et soutien',
            description:
              'Migration des données, formation et documentation, puis une période de garantie et un soutien continu si vous le souhaitez.',
          },
        ],
      },
      faq: [
        {
          q: 'Combien coûte un software sur mesure ?',
          a: "Cela dépend du périmètre, et c'est pourquoi nous le définissons d'abord. La découverte et le périmètre sont gratuits, et le contrat fixe le prix et les délais exacts avant la première ligne de code.",
        },
        {
          q: 'Combien de temps faut-il ?',
          a: "Les petits outils internes se comptent en semaines ; les systèmes plus importants sont livrés par phases sur plusieurs mois. Les délais sont fixés dans votre contrat, et vous voyez du software fonctionnel à chaque sprint.",
        },
        {
          q: 'Peut-il fonctionner avec nos outils actuels ?',
          a: "Oui. Un software sur mesure n'a pas à tout remplacer. Nous pouvons le relier à vos outils de comptabilité, de commerce en ligne ou de paiement, ou les remplacer progressivement.",
        },
        {
          q: 'Peut-on commencer petit ?',
          a: "Oui. Beaucoup de projets commencent par le processus qui fait le plus mal. L'architecture est pensée pour que le système grandisse module par module.",
        },
        {
          q: 'Que se passe-t-il après le lancement ?',
          a: 'Vous recevez la documentation technique et utilisateur, une formation pour votre équipe et une période de garantie. Ensuite, nous pouvons continuer à faire évoluer le système avec vous, ou le confier à votre propre équipe.',
        },
      ],
    },

    websites: {
      metaTitle: 'Création de sites web et landing pages à Vancouver | Adapto',
      metaDescription:
        'Sites web, landing pages, boutiques en ligne et portails clients rapides, bilingues et faciles à mettre à jour, conçus pour être trouvés et convertir.',
      name: 'Création de sites web et landing pages',
      title: 'Des sites web',
      titleAccent: 'qui transforment les visiteurs en conversations.',
      lead: "Sites institutionnels, landing pages, boutiques en ligne et portails clients. Rapides sur n'importe quelle connexion, prêts pour l'anglais et le français, faciles à mettre à jour par votre équipe et conçus pour être trouvés sur Google.",
      problems: {
        title: 'Quand votre site ne fait pas sa part.',
        items: [
          'Il met des secondes à charger sur un téléphone, et les visiteurs partent avant.',
          'Changer une phrase oblige à appeler un développeur.',
          "Il n'apparaît pas quand vos clients cherchent ce que vous faites.",
          "Il ne ressemble plus à l'entreprise que vous êtes devenue.",
          'Les gens le visitent, mais très peu vous contactent.',
        ],
      },
      build: {
        title: 'Des sites conçus pour performer.',
        items: [
          {
            title: 'Sites institutionnels',
            description:
              'Votre entreprise, vos services et votre histoire, racontés clairement et fidèles à votre marque.',
          },
          {
            title: 'Landing pages',
            description:
              'Des pages ciblées pour une campagne, un produit ou un service, construites autour d’une seule action.',
          },
          {
            title: 'Boutiques en ligne',
            description:
              'Catalogue, paiement et commandes, reliés à vos stocks et à votre comptabilité.',
          },
          {
            title: 'Portails clients',
            description:
              'Un espace privé où vos clients suivent leurs commandes, documents ou projets.',
          },
          {
            title: 'Bilingues dès le départ',
            description:
              'Anglais et français dès le début, chaque langue à sa propre adresse et balisée pour les moteurs de recherche.',
          },
          {
            title: 'SEO et performance',
            description:
              'Structure propre, données structurées et chargement rapide : les bases que Google recherche.',
          },
        ],
      },
      steps: {
        title: 'Du brief au lancement.',
        items: [
          {
            title: "Comprendre l'objectif",
            description:
              'À qui s’adresse le site, ce que les visiteurs doivent y trouver et ce que vous voulez qu’ils fassent ensuite.',
          },
          {
            title: 'Structure et design',
            description:
              'Arborescence, contenu et maquettes dans votre identité visuelle. Vous les validez avant le développement.',
          },
          {
            title: 'Construire et optimiser',
            description:
              'Des pages rapides, accessibles et adaptées à tous les écrans, avec un éditeur que votre équipe peut vraiment utiliser.',
          },
          {
            title: 'Lancer et mesurer',
            description:
              'Domaine, analytique et référencement configurés, puis des ajustements selon l’usage réel des visiteurs.',
          },
        ],
      },
      faq: [
        {
          q: 'Pourrons-nous mettre le site à jour nous-mêmes ?',
          a: 'Oui. Quand c’est pertinent, nous installons un éditeur pour que votre équipe modifie textes, images et pages sans toucher au code, et nous formons la personne qui s’en occupera.',
        },
        {
          q: 'Le site peut-il être en anglais et en français ?',
          a: 'Oui. Nous construisons des sites bilingues dès le départ, chaque langue à sa propre adresse et balisée pour que les moteurs de recherche affichent la bonne version.',
        },
        {
          q: 'Notre site apparaîtra-t-il sur Google ?',
          a: 'Nous construisons les bases techniques sur lesquelles s’appuient les moteurs de recherche : vitesse, structure, métadonnées et données structurées. Le classement dépend aussi du contenu et de la concurrence, et nous vous dirons honnêtement à quoi vous attendre.',
        },
        {
          q: 'Refaites-vous des sites existants ?',
          a: 'Oui. Nous gardons ce qui fonctionne, reconstruisons le reste et migrons votre contenu sans perdre les adresses que Google connaît déjà.',
        },
        {
          q: 'Le site peut-il se connecter à nos autres outils ?',
          a: 'Oui : formulaires vers votre CRM ou votre boîte de courriel, boutiques vers vos stocks et votre comptabilité, portails vers vos systèmes internes.',
        },
      ],
    },

    'ai-integration': {
      metaTitle: "Intégration d'IA pour les entreprises à Vancouver | Adapto",
      metaDescription:
        "Mettez l'IA au travail dans votre opération : assistants sur vos données, lecture de documents et de courriels, tri intelligent et copilotes dans vos outils.",
      name: "Intégration d'IA",
      title: "L'intégration d'IA",
      titleAccent: 'au cœur de votre opération.',
      lead: "Des assistants qui répondent à partir de vos propres données, la lecture automatique de documents et de courriels, un tri intelligent et des copilotes dans les outils que votre équipe utilise déjà. Pratique, sécurisé et mesuré sur des résultats réels.",
      problems: {
        title: 'Quand votre équipe passe ses journées sur un travail qu’une machine pourrait lire.',
        items: [
          'Quelqu’un lit chaque courriel entrant seulement pour savoir qui doit s’en occuper.',
          'Les données des factures, formulaires et PDF sont saisies à la main.',
          'Clients et employés posent sans cesse les mêmes questions.',
          'Le savoir dort dans des documents introuvables au moment où on en a besoin.',
          'Vous avez essayé un chatbot, et il a inventé des réponses.',
        ],
      },
      build: {
        title: "L'IA là où elle rapporte.",
        items: [
          {
            title: 'Assistants sur vos données',
            description:
              'Des réponses tirées de vos propres documents, politiques et systèmes, avec des sources que votre équipe peut vérifier.',
          },
          {
            title: 'Traitement de documents',
            description:
              'Factures, contrats et formulaires lus automatiquement, et les données envoyées au bon endroit.',
          },
          {
            title: 'Tri des courriels et demandes',
            description:
              'Messages entrants classés, résumés et acheminés vers la bonne personne ou le bon système.',
          },
          {
            title: 'Copilotes dans vos outils',
            description:
              'Rédiger, résumer et chercher directement dans les softwares que votre équipe utilise déjà.',
          },
          {
            title: "Agents d'IA",
            description:
              'Des tâches en plusieurs étapes exécutées dans vos systèmes, avec une personne qui approuve ce qui compte.',
          },
          {
            title: 'Sécurité et confidentialité',
            description:
              "Des règles claires sur ce que l'IA peut voir, où les données sont traitées et ce qui est journalisé.",
          },
        ],
      },
      steps: {
        title: "De l'idée à des résultats mesurables.",
        items: [
          {
            title: 'Trouver le bon cas',
            description:
              "Nous cherchons les tâches où l'IA fait gagner un temps réel, et nous vous le disons quand une solution plus simple suffit.",
          },
          {
            title: 'Prototyper sur vos données',
            description:
              'Une petite version fonctionnelle avec vos vrais documents, pour juger la qualité avant de vous engager.',
          },
          {
            title: 'Intégrer et sécuriser',
            description:
              'Reliée à vos systèmes, avec contrôles d’accès, journalisation et une personne dans la boucle au besoin.',
          },
          {
            title: 'Mesurer et améliorer',
            description:
              'Nous suivons la précision et le temps gagné, et continuons d’ajuster une fois l’outil en usage.',
          },
        ],
      },
      faq: [
        {
          q: 'Nos données sont-elles en sécurité ?',
          a: "Nous définissons d'avance les données auxquelles l'IA a accès, où elles sont traitées et combien de temps quoi que ce soit est conservé, et nous utilisons des réglages de fournisseurs qui n'entraînent pas leurs modèles avec vos données. Les étapes sensibles peuvent toujours exiger l'approbation d'une personne.",
        },
        {
          q: "L'IA va-t-elle inventer des réponses ?",
          a: "Les assistants sont conçus pour répondre à partir de vos propres sources et indiquer d'où vient chaque réponse. Quand l'information n'y est pas, ils le disent au lieu de deviner, et nous le vérifions avant le lancement.",
        },
        {
          q: 'Faut-il beaucoup de données pour commencer ?',
          a: 'Non. La plupart des projets utilisent les documents et systèmes que vous avez déjà, et le prototype montre rapidement si cela suffit.',
        },
        {
          q: "Quels modèles d'IA utilisez-vous ?",
          a: "Nous choisissons le modèle selon la tâche, en fonction de la qualité, du coût et des exigences de confidentialité, et concevons l'intégration pour pouvoir changer de modèle plus tard sans tout reconstruire.",
        },
        {
          q: 'Comment savoir si cela en vaut la peine ?',
          a: "Avant de construire, nous convenons de ce qu'est un succès, comme les heures gagnées ou le temps de réponse, et nous le mesurons après le lancement.",
        },
      ],
    },

    automation: {
      metaTitle: 'Automatisation des processus à Vancouver | Adapto',
      metaDescription:
        'Rapports, approbations et saisie de données remplacés par des automatisations qui tournent seules. Nous cartographions le travail répétitif et l’automatisons.',
      name: 'Automatisation des processus',
      title: "L'automatisation",
      titleAccent: 'qui tourne pendant que vous dormez.',
      lead: "Nous cartographions le travail répétitif de votre équipe (rapports, approbations, saisie de données, relances) et le remplaçons par des automatisations silencieuses qui tournent seules, pour que vos gens se concentrent sur le travail qui a besoin d'eux.",
      problems: {
        title: "Quand votre équipe est occupée, mais pas sur l'essentiel.",
        items: [
          'Les rapports hebdomadaires sont refaits à la main à partir des mêmes sources.',
          'Les approbations attendent des jours dans une boîte de réception.',
          "Les données sont ressaisies d'un système à l'autre, avec des erreurs en chemin.",
          "Les relances dépendent de la mémoire de quelqu'un.",
          "Grandir signifie embaucher juste pour suivre l'administratif.",
        ],
      },
      build: {
        title: 'Ce que nous automatisons.',
        items: [
          {
            title: 'Rapports',
            description:
              'Générés et envoyés à heure fixe à partir de données en direct, sans que personne ne recopie de chiffres.',
          },
          {
            title: 'Approbations',
            description:
              'Demandes acheminées vers la bonne personne, avec rappels, échéances et historique complet.',
          },
          {
            title: 'Saisie et synchronisation',
            description:
              "L'information circule seule entre vos systèmes, vérifiée en chemin.",
          },
          {
            title: 'Notifications et relances',
            description:
              'Clients et employés reçoivent le bon message au bon moment, automatiquement.',
          },
          {
            title: 'Génération de documents',
            description:
              'Soumissions, contrats et factures remplis à partir de vos données, prêts à envoyer.',
          },
          {
            title: 'Surveillance et alertes',
            description:
              'Vous apprenez le problème quand il survient, pas quand un client se plaint.',
          },
        ],
      },
      steps: {
        title: "Du manuel à l'automatique.",
        items: [
          {
            title: 'Cartographier la routine',
            description:
              "Nous suivons le travail tel qu'il se fait aujourd'hui et mesurons où passent les heures.",
          },
          {
            title: 'Prioriser',
            description:
              "Nous commençons par les automatisations qui font gagner le plus de temps pour le moins d'effort.",
          },
          {
            title: 'Construire et tester',
            description:
              "Chaque flux tourne en parallèle du processus manuel jusqu'à ce que vous ayez confiance dans les résultats.",
          },
          {
            title: 'Surveiller',
            description:
              'Journaux et alertes sur chaque automatisation, pour que rien ne tombe en panne en silence.',
          },
        ],
      },
      faq: [
        {
          q: 'Quelles tâches peut-on automatiser ?',
          a: "Tout ce qui est répétitif et suit des règles claires : rapports, approbations, transfert de données entre systèmes, rappels, génération de documents. Quand une tâche demande du jugement, nous pouvons quand même automatiser les étapes autour.",
        },
        {
          q: 'Faut-il changer nos outils actuels ?',
          a: "Généralement non. Nous relions les outils que vous utilisez déjà, et si l'un d'eux ne peut pas l'être, nous vous expliquons les options.",
        },
        {
          q: 'Que se passe-t-il quand une automatisation échoue ?',
          a: "Chaque flux est journalisé et surveillé. Si quelque chose casse, la bonne personne est alertée avec les détails nécessaires pour corriger, et aucune donnée n'est perdue.",
        },
        {
          q: 'Quand verrons-nous des résultats ?',
          a: 'Nous commençons par les automatisations qui font gagner le plus de temps, donc les premiers gains arrivent tôt dans le projet. Le plan et les délais sont dans votre contrat.',
        },
        {
          q: "L'automatisation est-elle réservée aux grandes entreprises ?",
          a: "Non. Les petites équipes y gagnent souvent le plus, parce que chaque heure d'administratif retombe sur les mêmes quelques personnes.",
        },
      ],
    },

    dashboards: {
      metaTitle: 'Tableaux de bord et reporting à Vancouver | Adapto',
      metaDescription:
        "Tableaux de bord en temps réel pour vos ventes, stocks, opérations et équipes, construits à partir de vos systèmes. Fini l'intuition et les vieux tableurs.",
      name: 'Tableaux de bord et reporting',
      title: 'Des tableaux de bord',
      titleAccent: 'pour décider, pas pour deviner.',
      lead: "Des vues en temps réel de ce qui compte pour votre entreprise (ventes, stocks, opérations, équipes), construites à partir des systèmes que vous utilisez déjà. Vos décisions ne reposent plus sur l'intuition ni sur des tableurs vieux d'un mois.",
      problems: {
        title: "Quand vous pilotez l'entreprise à moitié à l'aveugle.",
        items: [
          "Obtenir un simple chiffre oblige quelqu'un à monter un tableur.",
          'Chaque service présente une version différente du même chiffre.',
          'Vous découvrez un problème des semaines après son début.',
          'Vos données vivent dans cinq systèmes qui ne se parlent pas.',
          'Les réunions servent à débattre des chiffres plutôt qu’à décider.',
        ],
      },
      build: {
        title: 'De la visibilité, pensée pour vos décisions.',
        items: [
          {
            title: 'Tableaux de direction',
            description:
              "La poignée de chiffres qui disent comment va l'entreprise, sur un seul écran.",
          },
          {
            title: 'Ventes et pipeline',
            description:
              'Revenus, conversion et prévisions, par équipe, produit ou région.',
          },
          {
            title: 'Stocks et opérations',
            description:
              'Inventaire, commandes et délais de livraison, mis à jour au fil des changements.',
          },
          {
            title: 'Équipes et capacité',
            description:
              "Charge de travail, capacité et objectifs, pour planifier avant que ça devienne urgent.",
          },
          {
            title: 'Rapports planifiés',
            description:
              'Les mêmes données envoyées par courriel à heure fixe, pour ceux qui préfèrent.',
          },
          {
            title: 'Alertes',
            description:
              "Des seuils qui vous préviennent dès qu'un chiffre part dans la mauvaise direction.",
          },
        ],
      },
      steps: {
        title: 'De données éparpillées à une vue claire.',
        items: [
          {
            title: 'Définir les questions',
            description:
              'Nous partons des décisions que vous prenez, pas des données qui se trouvent exister.',
          },
          {
            title: 'Relier les sources',
            description:
              'Ventes, finances, stocks et tableurs réunis et nettoyés.',
          },
          {
            title: 'Concevoir les vues',
            description:
              "Des graphiques clairs qui répondent à chaque question d'un coup d'œil, sur ordinateur et sur téléphone.",
          },
          {
            title: 'Adopter et affiner',
            description:
              'Nous formons votre équipe et ajustons les tableaux de bord au fil des nouvelles questions.',
          },
        ],
      },
      faq: [
        {
          q: 'Pouvez-vous utiliser les données de nos systèmes actuels ?',
          a: 'Oui. Nous nous connectons aux bases de données, tableurs et outils que vous utilisez déjà, y compris les plateformes de comptabilité, de commerce en ligne et de CRM, et les gardons synchronisés.',
        },
        {
          q: 'Les tableaux de bord sont-ils en temps réel ?',
          a: "Ils peuvent l'être. Certains chiffres doivent être en direct, d'autres peuvent être mis à jour chaque jour. Nous réglons chacun selon ce qu'exige la décision qu'il éclaire.",
        },
        {
          q: 'Peut-on les consulter sur un téléphone ?',
          a: 'Oui. Chaque tableau de bord est conçu pour fonctionner sur ordinateur et sur mobile.',
        },
        {
          q: 'Qui voit quoi ?',
          a: "L'accès est défini par rôle, pour que chacun voie les chiffres utiles à son travail.",
        },
        {
          q: 'Et si nos données sont désordonnées ?',
          a: "C'est courant. Nettoyer et organiser les données fait partie du projet, et révèle souvent des problèmes qui valent la peine d'être corrigés en soi.",
        },
      ],
    },

    integrations: {
      metaTitle: 'Intégration de systèmes et API à Vancouver | Adapto',
      metaDescription:
        'Reliez vos outils de comptabilité, de commerce en ligne, de logistique et de paiement en une seule opération, grâce à des API et synchronisations fiables.',
      name: 'Intégration de systèmes',
      title: 'Des intégrations',
      titleAccent: 'pour que vos outils travaillent ensemble.',
      lead: "Reliez les outils que votre entreprise utilise déjà (comptabilité, commerce en ligne, logistique, paiements) en une seule opération cohérente, où chaque donnée est saisie une fois et arrive partout où elle est nécessaire.",
      problems: {
        title: 'Quand vos outils ne se parlent pas.',
        items: [
          'Les commandes sont ressaisies de la boutique vers la comptabilité.',
          'Les niveaux de stock changent selon le système consulté.',
          'Les paiements sont rapprochés des factures à la main.',
          'Chaque nouvel outil ajoute un endroit de plus à mettre à jour.',
          "Personne n'est sûr du système qui détient la bonne information.",
        ],
      },
      build: {
        title: 'Les connexions que nous construisons.',
        items: [
          {
            title: 'Comptabilité et finances',
            description:
              'Ventes, factures et paiements qui arrivent automatiquement dans votre comptabilité.',
          },
          {
            title: 'Commerce en ligne et stocks',
            description:
              'Commandes, produits et inventaire synchronisés entre votre boutique et votre administration.',
          },
          {
            title: 'Logistique et expédition',
            description:
              'Étiquettes, suivi et statut de livraison reliés à vos commandes.',
          },
          {
            title: 'Paiements',
            description:
              'Vos fournisseurs de paiement reliés à vos factures et à vos registres.',
          },
          {
            title: 'API sur mesure',
            description:
              'Une API sécurisée et documentée pour votre propre système, afin que partenaires et outils puissent s’y connecter.',
          },
          {
            title: 'Webhooks et synchronisation',
            description:
              "Un changement dans un système atteint les autres en quelques secondes, avec de nouvelles tentatives en cas d'échec.",
          },
        ],
      },
      steps: {
        title: 'De déconnecté à synchronisé.',
        items: [
          {
            title: 'Cartographier les flux',
            description:
              'Quel système possède quelle information, et où elle doit aller.',
          },
          {
            title: 'Concevoir les connexions',
            description:
              'API, webhooks ou synchronisation planifiée, choisis pour chaque flux et ses limites.',
          },
          {
            title: 'Construire avec des garde-fous',
            description:
              'Validation, nouvelles tentatives et journaux, pour qu’une panne ne corrompe jamais vos données.',
          },
          {
            title: 'Surveiller',
            description:
              "Des alertes quand une connexion s'arrête, et un historique clair de tout ce qui a circulé.",
          },
        ],
      },
      faq: [
        {
          q: 'Quels outils pouvez-vous intégrer ?',
          a: "La plupart des outils qui offrent une API ou un export, y compris les plateformes courantes de comptabilité, de commerce en ligne, d'expédition et de paiement. Si un outil n'a pas d'API, nous examinons les solutions avec vous.",
        },
        {
          q: "Et si l'un des services tombe en panne ?",
          a: "Les intégrations sont conçues pour mettre en file d'attente et réessayer. Quand le service revient, les données en attente passent, et vous êtes alerté si quelque chose demande votre attention.",
        },
        {
          q: 'Cela remplace-t-il nos outils actuels ?',
          a: "Non. L'intégration garde les outils que votre équipe aime et les fait travailler ensemble.",
        },
        {
          q: 'Nos données sont-elles protégées en transit ?',
          a: "Les connexions passent par des canaux chiffrés, avec seulement les accès nécessaires à chacune. Les identifiants sont stockés de façon sécurisée, jamais dans des tableurs ou des courriels.",
        },
        {
          q: 'Pouvez-vous créer une API pour notre propre système ?',
          a: 'Oui. Nous pouvons concevoir et documenter une API pour que partenaires, applications ou autres outils se connectent à votre système en toute sécurité.',
        },
      ],
    },
  },
};

export default fr;
