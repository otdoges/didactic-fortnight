import { WebContainer } from '@webcontainer/api';

export interface FileSystemTree {
  [key: string]: {
    file?: {
      contents: string;
    };
    directory?: FileSystemTree;
  };
}

export class WebContainerService {
  private static instance: WebContainerService;
  private webcontainer: WebContainer | null = null;
  private isInitialized = false;
  private initializationPromise: Promise<void> | null = null;

  private constructor() {}

  static getInstance(): WebContainerService {
    if (!WebContainerService.instance) {
      WebContainerService.instance = new WebContainerService();
    }
    return WebContainerService.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this.doInitialize();
    return this.initializationPromise;
  }

  private async doInitialize(): Promise<void> {
    try {
      this.webcontainer = await WebContainer.boot();
      this.isInitialized = true;
      console.log('WebContainer initialized successfully');
    } catch (error) {
      console.error('Failed to initialize WebContainer:', error);
      throw error;
    }
  }

  async createProject(files: FileSystemTree): Promise<void> {
    if (!this.webcontainer) {
      throw new Error('WebContainer not initialized');
    }

    await this.webcontainer.mount(files as any);
  }

  async writeFile(path: string, content: string): Promise<void> {
    if (!this.webcontainer) {
      throw new Error('WebContainer not initialized');
    }

    await this.webcontainer.fs.writeFile(path, content);
  }

  async readFile(path: string): Promise<string> {
    if (!this.webcontainer) {
      throw new Error('WebContainer not initialized');
    }

    return await this.webcontainer.fs.readFile(path, 'utf-8');
  }

  async installDependencies(): Promise<void> {
    if (!this.webcontainer) {
      throw new Error('WebContainer not initialized');
    }

    const installProcess = await this.webcontainer.spawn('npm', ['install']);
    return new Promise((resolve, reject) => {
      installProcess.exit.then((code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Install failed with exit code ${code}`));
        }
      });
    });
  }

  async startDevServer(): Promise<string> {
    if (!this.webcontainer) {
      throw new Error('WebContainer not initialized');
    }

    const devProcess = await this.webcontainer.spawn('npm', ['run', 'dev']);
    
    // Wait for server to be ready
    return new Promise((resolve, reject) => {
      devProcess.output.pipeTo(new WritableStream({
        write(data) {
          console.log(data);
          if (data.includes('ready') || data.includes('localhost')) {
            // Extract URL from output
            const urlMatch = data.match(/https?:\/\/[^\s]+/);
            if (urlMatch) {
              resolve(urlMatch[0]);
            }
          }
        }
      }));

      // Fallback timeout
      setTimeout(() => {
        this.webcontainer?.on('server-ready', (port, url) => {
          resolve(url);
        });
      }, 5000);
    });
  }

  async runCommand(command: string, args: string[] = []): Promise<string> {
    if (!this.webcontainer) {
      throw new Error('WebContainer not initialized');
    }

    const process = await this.webcontainer.spawn(command, args);
    let output = '';

    return new Promise((resolve, reject) => {
      process.output.pipeTo(new WritableStream({
        write(data) {
          output += data;
        }
      }));

      process.exit.then((code) => {
        if (code === 0) {
          resolve(output);
        } else {
          reject(new Error(`Command failed with exit code ${code}: ${output}`));
        }
      });
    });
  }

  async createReactProject(projectName: string): Promise<FileSystemTree> {
    const files: FileSystemTree = {
      'package.json': {
        file: {
          contents: JSON.stringify({
            name: projectName,
            version: '1.0.0',
            type: 'module',
            scripts: {
              dev: 'vite',
              build: 'vite build',
              preview: 'vite preview'
            },
            dependencies: {
              react: '^18.2.0',
              'react-dom': '^18.2.0'
            },
            devDependencies: {
              '@types/react': '^18.2.15',
              '@types/react-dom': '^18.2.7',
              '@vitejs/plugin-react': '^4.0.3',
              typescript: '^5.0.2',
              vite: '^4.4.5'
            }
          }, null, 2)
        }
      },
      'index.html': {
        file: {
          contents: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${projectName}</title>
</head>
<body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
</body>
</html>`
        }
      },
      'vite.config.ts': {
        file: {
          contents: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  }
})`
        }
      },
      'tsconfig.json': {
        file: {
          contents: JSON.stringify({
            compilerOptions: {
              target: 'ES2020',
              useDefineForClassFields: true,
              lib: ['ES2020', 'DOM', 'DOM.Iterable'],
              module: 'ESNext',
              skipLibCheck: true,
              moduleResolution: 'bundler',
              allowImportingTsExtensions: true,
              resolveJsonModule: true,
              isolatedModules: true,
              noEmit: true,
              jsx: 'react-jsx',
              strict: true,
              noUnusedLocals: true,
              noUnusedParameters: true,
              noFallthroughCasesInSwitch: true
            },
            include: ['src'],
            references: [{ path: './tsconfig.node.json' }]
          }, null, 2)
        }
      },
      'tsconfig.node.json': {
        file: {
          contents: JSON.stringify({
            compilerOptions: {
              composite: true,
              skipLibCheck: true,
              module: 'ESNext',
              moduleResolution: 'bundler',
              allowSyntheticDefaultImports: true
            },
            include: ['vite.config.ts']
          }, null, 2)
        }
      },
      src: {
        directory: {
          'main.tsx': {
            file: {
              contents: `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`
            }
          },
          'App.tsx': {
            file: {
              contents: `import React from 'react'

function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Welcome to ${projectName}</h1>
      <p>Your React app is running!</p>
    </div>
  )
}

export default App`
            }
          },
          'index.css': {
            file: {
              contents: `body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}`
            }
          }
        }
      }
    };

    return files;
  }

  getWebContainer(): WebContainer | null {
    return this.webcontainer;
  }
}

export const webContainerService = WebContainerService.getInstance();