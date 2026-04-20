# Stèle

Stèle is a minimal, macOS-inspired cryptography and encoding application built with Next.js and TypeScript. All cryptographic operations run securely and entirely within the browser, ensuring no data collection or server-side processing is required.

## Features

The application provides a comprehensive suite of cryptographic techniques and encodings, categorized into Classical, Encoding, and Custom algorithms.

### Supported Methods

- **Classical Ciphers**: Caesar, Vigenère, ROT-13, Atbash, XOR, A1Z26, and Reverse.
- **Encoding Formats**: Base64, Hexadecimal, Binary, Morse Code, and URL Encode.
- **Custom Algorithms**: Stelegraphy (A proprietary symmetric block cipher combining a Substitution-Permutation Network and random Initialization Vector CBC mode).

### User Interface and Experience

- **Client-Side Processing**: Zero server dependency for cryptographic operations.
- **macOS-Inspired Aesthetic**: Features a monochrome graphite dark mode, glassmorphism effects, smooth micro-animations, and a custom traffic-light window control bar.
- **Responsive Layout**: Adapts seamlessly to both desktop and mobile environments.

## Architecture and Stack

- **Framework**: Next.js App Router
- **Language**: TypeScript
- **Styling**: Custom CSS utilizing modern variables, responsive design patterns, and systemic design tokens
- **Testing**: Vitest for unit testing cryptographic logic

## Project Structure

```text
src/
├── app/
│   ├── globals.css     # Global design system, CSS variables, and layout styles
│   ├── layout.tsx      # Root layout, metadata configuration, and font injection
│   └── page.tsx        # Main application entry point
├── components/
│   ├── CryptoApp.tsx   # Core stateful client component boundary
│   ├── Titlebar.tsx    # macOS-style application window controls
│   ├── Sidebar.tsx     # Algorithm selection and categorical navigation
│   ├── ModeToggle.tsx  # Interactive encryption and decryption toggle
│   ├── ParamsBar.tsx   # Configurable parameters (keys, cryptographic shifts)
│   └── IOGrid.tsx      # Input and output multi-pane operational layout
├── lib/
│   ├── ciphers.ts      # Algorithm registry and metadata definitions
│   ├── crypto.ts       # Core cryptographic computation logic
│   └── process.ts      # Action dispatching layer
└── contexts/
    └── CipherContext.tsx # Global state management via React Context
```

## Local Development

Ensure you have a recent version of Node.js installed before continuing.

1. Clone the repository and navigate to the project directory.
2. Install the necessary dependencies:

```bash
npm install
```

3. Launch the local development server:

```bash
npm run dev
```

4. Open your web browser and navigate to `http://localhost:3000`.

### Additional Commands

- `npm run build`: Compile the application into an optimized production bundle.
- `npm run start`: Launch the production web server.
- `npm run lint`: Execute ESLint to analyze code formatting and styling.
- `npm run test`: Run the Vitest unit test suite.

## Deployment

The application is fully optimized for Vercel deployment. 

To deploy directly via the command line interface, install the Vercel CLI and execute:

```bash
npx vercel
```

Alternatively, you can link the repository to your Vercel dashboard to automate continuous integration and continuous deployment pipelines upon branch updates.
