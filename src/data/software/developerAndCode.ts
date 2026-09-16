import { SoftwareInfo } from '../../types';

export const DEVELOPER_AND_CODE_SOFTWARE: SoftwareInfo[] = [
  {
    id: 'vscode',
    name: 'Visual Studio Code',
    developer: 'Microsoft Corporation',
    category: 'Developer Tools',
    description: 'Free code editor with support for syntax highlighting, debugging, Git control, and extensions.',
    longDescription: 'Visual Studio Code is a lightweight but powerful source code editor built by Microsoft. It comes with built-in support for JavaScript, TypeScript, Node.js, and a rich ecosystem of extensions for languages like Python, C++, Java, PHP, and Go.',
    supportedOS: ['windows', 'mac', 'linux'],
    priceType: 'Free',
    priceText: 'Free Open Source',
    websiteUrl: 'https://code.visualstudio.com',
    downloadUrl: 'https://code.visualstudio.com/Download',
    supportedExtensions: ['JSON', 'CSV', 'XML', 'YAML', 'JS', 'TS', 'PY', 'HTML', 'CSS', 'SQL', 'MD', 'SVG', 'ENV', 'SH', 'CPP', 'JAVA', 'GO', 'RS'],
    rating: 4.9,
    reviewCount: 110000,
    features: [
      'IntelliSense code completion and semantic highlighting',
      'Integrated terminal and Git source control commands',
      'Debugger for Node.js, Python, C++, and Web Browsers',
      'Extensive marketplace with over 50,000 extensions',
      'Remote SSH and Dev Containers development'
    ],
    alternatives: [
      { name: 'Sublime Text', slug: 'sublime-text', description: 'Fast sophisticated text editor for code.' },
      { name: 'JetBrains WebStorm', slug: 'webstorm', description: 'Powerful IDE for JavaScript and web development.' },
      { name: 'Neovim', slug: 'neovim', description: 'Vim-fork focused on extensibility and usability.' }
    ],
    tutorials: [
      { title: 'Opening and Viewing Code Files in VS Code', description: 'Configure syntax highlighting, auto-formatting, and linter extensions in VS Code.', readTime: '4 min' }
    ]
  },
  {
    id: 'intellij-idea',
    name: 'JetBrains IntelliJ IDEA',
    developer: 'JetBrains s.r.o.',
    category: 'Developer Tools',
    description: 'Leading Integrated Development Environment (IDE) for Java, Kotlin, and polyglot software development.',
    longDescription: 'IntelliJ IDEA is an integrated development environment written in Java for developing computer software. Designed to maximize developer productivity with smart code completion and deep static code analysis.',
    supportedOS: ['windows', 'mac', 'linux'],
    priceType: 'Freemium',
    priceText: 'Free Community Edition / $169 / year Ultimate',
    websiteUrl: 'https://jetbrains.com/idea/',
    downloadUrl: 'https://jetbrains.com/idea/download/',
    supportedExtensions: ['JAVA', 'KT', 'KTS', 'GROOVY', 'CLASS', 'JAR', 'GRADLE', 'XML', 'PROPERTIES', 'JSON'],
    rating: 4.9,
    reviewCount: 45000,
    features: [
      'Deep context-aware code completion and static analysis',
      'Integrated Git version control, database viewer, and terminal',
      'Automated refactoring tools across large codebases'
    ],
    alternatives: [
      { name: 'Eclipse IDE', slug: 'eclipse', description: 'Open source Java development environment.' },
      { name: 'VS Code', slug: 'vscode', description: 'Lightweight code editor.' }
    ]
  },
  {
    id: 'android-studio',
    name: 'Android Studio',
    developer: 'Google LLC / JetBrains',
    category: 'Developer Tools',
    description: 'Official Integrated Development Environment (IDE) for Android application development.',
    longDescription: 'Android Studio is the official IDE for Google’s Android operating system, built on JetBrains’ IntelliJ IDEA software and designed specifically for Android development.',
    supportedOS: ['windows', 'mac', 'linux'],
    priceType: 'Free',
    priceText: 'Free Official SDK',
    websiteUrl: 'https://developer.android.com/studio',
    downloadUrl: 'https://developer.android.com/studio',
    supportedExtensions: ['APK', 'AAB', 'JAVA', 'KT', 'XML', 'GRADLE', 'DEX', 'SO', 'PRO'],
    rating: 4.8,
    reviewCount: 38000,
    features: [
      'Visual Jetpack Compose and XML layout editor preview',
      'Fast virtual Android device emulator with sensor controls',
      'APK/AAB analyzer for inspecting bytecode and assets'
    ],
    alternatives: [
      { name: 'VS Code', slug: 'vscode', description: 'Cross-platform code editor.' }
    ]
  },
  {
    id: 'xcode',
    name: 'Apple Xcode',
    developer: 'Apple Inc.',
    category: 'Developer Tools',
    description: 'Official Integrated Development Environment (IDE) for macOS, iOS, iPadOS, watchOS, and visionOS apps.',
    longDescription: 'Xcode includes everything developers need to create great apps for Mac, iPhone, iPad, Apple Watch, and Apple TV. Swift compiler, SwiftUI live previews, and Instruments performance profiling.',
    supportedOS: ['mac'],
    priceType: 'Free',
    priceText: 'Free Official Apple Developer Tool',
    websiteUrl: 'https://developer.apple.com/xcode/',
    downloadUrl: 'https://apps.apple.com/app/xcode/id497799835',
    supportedExtensions: ['XCODEPROJ', 'XCWORKSPACE', 'SWIFT', 'M', 'MM', 'STORYBOARD', 'XCCONFIG', 'IPA'],
    rating: 4.6,
    reviewCount: 32000,
    features: [
      'SwiftUI live canvas interactive code previews',
      'Instruments CPU and Metal graphics memory profiler',
      'iOS and macOS device simulator testing suite'
    ],
    alternatives: [
      { name: 'AppCode', slug: 'appcode', description: 'JetBrains iOS IDE.' }
    ]
  },
  {
    id: 'sublime-text',
    name: 'Sublime Text',
    developer: 'Sublime HQ Pty Ltd',
    category: 'Developer Tools',
    description: 'Sophisticated text editor for code, markup and prose with blazing fast performance.',
    longDescription: 'Sublime Text is a sophisticated text editor for code, markup and prose. Slick user interface, extraordinary features and amazing performance with custom C++ GPU acceleration.',
    supportedOS: ['windows', 'mac', 'linux'],
    priceType: 'Paid',
    priceText: '$99 one-time license',
    websiteUrl: 'https://sublimetext.com',
    downloadUrl: 'https://sublimetext.com/download',
    supportedExtensions: ['TXT', 'JS', 'TS', 'PY', 'HTML', 'CSS', 'JSON', 'YAML', 'XML', 'MD', 'C', 'CPP'],
    rating: 4.8,
    reviewCount: 41000,
    features: [
      'GPU hardware accelerated rendering for smooth text scrolling',
      'Multiple cursor selection editing syntax navigation',
      'Package Control marketplace for community plugins'
    ],
    alternatives: [
      { name: 'VS Code', slug: 'vscode', description: 'Free code editor.' },
      { name: 'Notepad++', slug: 'notepad-plus-plus', description: 'Free Windows text editor.' }
    ]
  },
  {
    id: 'notepad-plus-plus',
    name: 'Notepad++',
    developer: 'Don Ho',
    category: 'Developer Tools',
    description: 'Free open source text and source code editor for Microsoft Windows.',
    longDescription: 'Notepad++ is a free source code editor and Notepad replacement that supports several languages. Based on Scintilla, written in C++ and uses pure Win32 API for ultra-fast performance.',
    supportedOS: ['windows'],
    priceType: 'Free',
    priceText: 'Free Open Source',
    websiteUrl: 'https://notepad-plus-plus.org',
    downloadUrl: 'https://notepad-plus-plus.org/downloads/',
    supportedExtensions: ['TXT', 'LOG', 'XML', 'JSON', 'INI', 'CFG', 'BAT', 'SH', 'JS', 'PY', 'HTML', 'CSS'],
    rating: 4.8,
    reviewCount: 72000,
    features: [
      'Starts in under 20 milliseconds with zero RAM overhead',
      'Syntax highlighting and folding for over 80 programming languages',
      'Regex search and replace across thousands of files simultaneously'
    ],
    alternatives: [
      { name: 'Sublime Text', slug: 'sublime-text', description: 'Cross-platform code editor.' }
    ]
  },
  {
    id: 'pycharm',
    name: 'JetBrains PyCharm',
    developer: 'JetBrains s.r.o.',
    category: 'Developer Tools',
    description: 'Python IDE for professional developers with Django, Data Science, and Web development support.',
    longDescription: 'PyCharm provides smart code completion, code inspections, on-the-fly error highlighting and automated refactorings for Python, web development, and data science notebooks.',
    supportedOS: ['windows', 'mac', 'linux'],
    priceType: 'Freemium',
    priceText: 'Free Community / $99 / year Professional',
    websiteUrl: 'https://jetbrains.com/pycharm/',
    downloadUrl: 'https://jetbrains.com/pycharm/download/',
    supportedExtensions: ['PY', 'PYW', 'IPYNB', 'REQUIREMENTS.TXT', 'TOML', 'YAML', 'JSON', 'SQL'],
    rating: 4.9,
    reviewCount: 39000,
    features: [
      'Intelligent Python code inspection and debugger',
      'Jupyter Notebook interactive cell runner integration',
      'Django, Flask, and FastAPI web framework support'
    ],
    alternatives: [
      { name: 'VS Code', slug: 'vscode', description: 'Code editor with Python extension.' }
    ]
  },
  {
    id: 'postman',
    name: 'Postman API Platform',
    developer: 'Postman Inc.',
    category: 'Developer Tools',
    description: 'API platform for building, testing, documenting, and consuming HTTP & REST APIs.',
    longDescription: 'Postman simplifies each step of the API lifecycle and streamlines collaboration so you can create better APIs faster. Construct HTTP requests, inspect JSON responses, and automate test suites.',
    supportedOS: ['windows', 'mac', 'linux'],
    priceType: 'Freemium',
    priceText: 'Free Plan / $12 / user / month',
    websiteUrl: 'https://postman.com',
    downloadUrl: 'https://postman.com/downloads/',
    supportedExtensions: ['JSON', 'POSTMAN_COLLECTION', 'GRAPHQL', 'OPENAPI', 'YAML'],
    rating: 4.8,
    reviewCount: 52000,
    features: [
      'HTTP, REST, GraphQL, and WebSocket API client request runner',
      'Automated test script suite assertion generation',
      'OpenAPI and Postman Collection documentation export'
    ],
    alternatives: [
      { name: 'Insomnia', slug: 'insomnia', description: 'Open source API testing tool.' }
    ]
  },
  {
    id: 'docker-desktop',
    name: 'Docker Desktop',
    developer: 'Docker Inc.',
    category: 'Developer Tools',
    description: 'Containerization platform for building, sharing, and running containerized applications.',
    longDescription: 'Docker Desktop is an easy-to-install application for your Mac, Linux or Windows environment that enables you to build and share containerized applications and microservices.',
    supportedOS: ['windows', 'mac', 'linux'],
    priceType: 'Freemium',
    priceText: 'Free Personal / $5 / month Pro',
    websiteUrl: 'https://docker.com/products/docker-desktop/',
    downloadUrl: 'https://docker.com/products/docker-desktop/',
    supportedExtensions: ['DOCKERFILE', 'YAML', 'YML', 'TAR', 'CONTAINER'],
    rating: 4.7,
    reviewCount: 48000,
    features: [
      'Includes Docker Engine, CLI client, Docker Compose, and Kubernetes',
      'GUI dashboard for container logs, volume inspection, and memory stats',
      'Virtualization layer integration (WSL2 / Apple Hypervisor Framework)'
    ],
    alternatives: [
      { name: 'Podman Desktop', slug: 'podman-desktop', description: 'Open source container management GUI.' }
    ]
  },
  {
    id: 'dbeaver',
    name: 'DBeaver Database Tool',
    developer: 'DBeaver Corp',
    category: 'Developer Tools',
    description: 'Free universal multi-platform database administration tool for SQL and NoSQL databases.',
    longDescription: 'DBeaver is a free, multi-platform database tool for developers, database administrators and analysts. Supports PostgreSQL, MySQL, SQLite, Oracle, SQL Server, MongoDB, and Redis.',
    supportedOS: ['windows', 'mac', 'linux'],
    priceType: 'Free',
    priceText: 'Free Open Source Community',
    websiteUrl: 'https://dbeaver.io',
    downloadUrl: 'https://dbeaver.io/download/',
    supportedExtensions: ['SQL', 'DB', 'SQLITE', 'CSV', 'JSON', 'XML'],
    rating: 4.8,
    reviewCount: 31000,
    features: [
      'Connects to all popular SQL and NoSQL databases via JDBC',
      'Visual ER diagram schema generator and data grid editor',
      'Export database records to CSV, JSON, XLSX, and SQL dump scripts'
    ],
    alternatives: [
      { name: 'TablePlus', slug: 'tableplus', description: 'Modern native database GUI.' }
    ]
  }
];
