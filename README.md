1. Run the following to create a vite template:
```
npm create vite@latest mpa3 -- --template react-ts
```

2. If you pick the right options you will get the following output
```
> npx
> create-vite mpa3 react-ts

√ Select a framework: » React
√ Select a variant: » TypeScript

Scaffolding project in C:\dev\mpa3...

Done. Now run:

  cd mpa3
  npm install
  npm run dev

```

3. Switch to the newly created project
```
cd mpa3
```

4. There might be a better way here.  Follow [this YouTube Video](https://youtu.be/sHnG8tIYMB4) 
Also see [Using Vite](https://tailwindcss.com/docs/installation/using-vite) in the tailwind documentation

Install some of the things we need
```
npm install -D tailwindcss @tailwindcss/vite
```

5. Configure the Vite plugin.  Add the `@tailwindcss/vite` plugin to your Vite configuration
```
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),  
  ],
})
``` 

5. Need to set-up shadcn.  The instructions instructions from [this website][https://ui.shadcn.com/docs/installation/vite] seem to be out of date with how tailwindcss works now.  ChatGPT does not think that shadcn/ui supports Tailwind CSS v4.0, but it is possible to manually copy the necessary components.
Let us try instructions from [github](https://github.com/shadcn-ui/ui/issues/6585)

6. Edit `tsconfig.json` in your root to add teh base url and paths properties to the `compilerOptions` section.
```
{
  "files": [],
  "references": [
    {
      "path": "./tsconfig.app.json"
    },
    {
      "path": "./tsconfig.node.json"
    }
  ],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

7. Same for `tsconfig.app.json`
```
{
  "compilerOptions": {
    // ...
    "baseUrl": ".",
    "paths": {
      "@/*": [
        "./src/*"
      ]
    }
    // rest of compilerOptions that come from the Vite template
  }
}
```

8. Install something needed
```
npm install -D @types/node
```

9. Update vite.config.ts to look like this
```
import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
 
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```
10. Install the exeperimental cli
```
npx shadcn@canary init
```

Sadly this fails with the following output:
```
PS C:\dev\mpa3> npx shadcn@canary init    
✔ Preflight checks.
✔ Verifying framework. Found Vite.
✔ Validating Tailwind CSS config. Found v4.
✖ Validating import alias.

No import alias found in your tsconfig.json file.
Visit https://ui.shadcn.com/docs/installation/vite to learn how to set an import alias.
```

---everything from here is suspect---

and pick
Style: Default
Color: Slate
CSS variables: Yes (default)
Pick the default on the last question

I do get the following ominous warning
```
It looks like you are using React 19. 
Some packages may fail to install due to peer dependency issues in npm (see https://ui.shadcn.com/react-19).
```

12. Install some of the ui components
```
npx shadcn@latest add card button
```

13. Add the code from `claude.ai` to a file in `src/components/TransactionTracker.tsx`

14. Modify your `src/app/page.tsx` to use the component
```
import TransactionTracker from '@/components/TransactionTracker'

export default function Home() {
  return (
    <main className="min-h-screen p-4">
      <TransactionTracker />
    </main>
  )
}
```

15. Run the development server with
```
npm run dev
```

16. Should install the following VS Code Extensions:
* ES7+ React/Redux/React-Native snippets
* Tailwind CSS IntelliSense
* ESLint
* Prettier - Code formatter
* PostCSS Language Support (different author csstools rather than Chen Xizhou)